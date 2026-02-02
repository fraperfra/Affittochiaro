import { APIGatewayEvent, Context } from "aws-lambda";
import { WhatsAppService } from "./services/whatsapp-service";
import { EmailService } from "./services/email-service";
import { NotificationStore } from "./services/notification-store";
import { templateRegistry } from "./services/template-registry";
import { rateLimiter } from "./middleware/rate-limiter";
import { validatePayload } from "./middleware/validate-payload";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationType =
  | "match_found_owner"
  | "match_found_tenant"
  | "trial_expiring_agency"
  | "document_reminder"
  | "contract_signed"
  | "welcome_onboarding";

export type Channel = "whatsapp" | "email";

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  channels: Channel[];
  data: Record<string, string | number>;
  forceChannels?: boolean;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferences: {
    whatsapp: boolean;
    email: boolean;
    frequency: "realtime" | "daily_digest" | "weekly";
    typesEnabled: Record<string, boolean>;
  };
}

export interface DeliveryResult {
  channel: Channel;
  status: "sent" | "failed";
  messageId?: string;
  error?: string;
  latencyMs: number;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  type: NotificationType;
  channels: Channel[];
  results: DeliveryResult[];
  overallStatus: "sent" | "partial" | "failed";
  createdAt: string;
  retryCount: number;
}

// ─── Services Initialization ─────────────────────────────────────────────────

const whatsappService = new WhatsAppService({
  accountSid: process.env.TWILIO_ACCOUNT_SID!,
  authToken: process.env.TWILIO_AUTH_TOKEN!,
  whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER!,
});

const emailService = new EmailService({
  region: process.env.AWS_REGION || "eu-north-1",
  senderEmail: process.env.SES_SENDER_EMAIL!,
  senderName: process.env.SES_SENDER_NAME || "Affittochiaro",
});

const notificationStore = new NotificationStore({
  host: process.env.DB_HOST!,
  database: process.env.DB_NAME!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
});

// ─── Main Handler ────────────────────────────────────────────────────────────

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<{ statusCode: number; body: string }> => {
  const startTime = Date.now();

  try {
    // 1. Parse & Validate payload
    const payload: NotificationPayload = JSON.parse(event.body || "{}");
    const validationError = validatePayload(payload);
    if (validationError) {
      return { statusCode: 400, body: JSON.stringify({ error: validationError }) };
    }

    // 2. Fetch user dal database
    const user = await notificationStore.getUserById(payload.userId);
    if (!user) {
      return { statusCode: 404, body: JSON.stringify({ error: "User not found" }) };
    }

    // 3. Rate limit check: max 10 notifiche/utente/giorno
    const isRateLimited = await rateLimiter.check(payload.userId);
    if (isRateLimited) {
      return {
        statusCode: 429,
        body: JSON.stringify({ error: "Rate limit exceeded: max 10 notifications/day" }),
      };
    }

    // 4. Filtra channels basandosi sulle preferenze utente
    const activeChannels = resolveChannels(payload, user);
    if (activeChannels.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "No active channels for this user" }),
      };
    }

    // 5. Genera contenuto per ogni channel
    const whatsappContent = templateRegistry.render("whatsapp", payload.type, {
      ...payload.data,
      userName: user.name,
    });

    const emailContent = templateRegistry.render("email", payload.type, {
      ...payload.data,
      userName: user.name,
      userEmail: user.email,
    });

    // 6. Send parallelo su tutti i channel attivi
    const deliveryPromises = activeChannels.map((channel) => {
      if (channel === "whatsapp") {
        return sendWhatsApp(user.phone, whatsappContent);
      }
      return sendEmail(user.email, payload.type, emailContent);
    });

    const results: DeliveryResult[] = await Promise.all(deliveryPromises);

    // 7. Calcola stato complessivo
    const overallStatus = computeOverallStatus(results, activeChannels);

    // 8. Salva record nel database
    const record: NotificationRecord = {
      id: generateId(),
      userId: payload.userId,
      type: payload.type,
      channels: activeChannels,
      results,
      overallStatus,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };

    await notificationStore.saveNotification(record);

    // 9. Se almeno un channel è fallito → push su SQS per retry
    const failedChannels = results.filter((r) => r.status === "failed");
    if (failedChannels.length > 0 && record.retryCount < 3) {
      await pushToRetryQueue(payload, failedChannels, record.id);
    }

    const totalLatency = Date.now() - startTime;

    return {
      statusCode: 200,
      body: JSON.stringify({
        notificationId: record.id,
        overallStatus,
        results,
        latencyMs: totalLatency,
      }),
    };
  } catch (error) {
    console.error("[notification-dispatcher] Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", details: String(error) }),
    };
  }
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveChannels(payload: NotificationPayload, user: UserRecord): Channel[] {
  if (payload.forceChannels) return payload.channels;

  if (!user.preferences.typesEnabled[payload.type]) return [];

  return payload.channels.filter((channel) => {
    if (channel === "whatsapp") return user.preferences.whatsapp;
    if (channel === "email") return user.preferences.email;
    return false;
  });
}

async function sendWhatsApp(phone: string, content: string): Promise<DeliveryResult> {
  const start = Date.now();
  try {
    const messageId = await whatsappService.sendMessage({
      to: phone,
      body: content,
    });
    return { channel: "whatsapp", status: "sent", messageId, latencyMs: Date.now() - start };
  } catch (error) {
    return {
      channel: "whatsapp",
      status: "failed",
      error: String(error),
      latencyMs: Date.now() - start,
    };
  }
}

async function sendEmail(
  to: string,
  type: NotificationType,
  htmlContent: string
): Promise<DeliveryResult> {
  const start = Date.now();
  try {
    const messageId = await emailService.sendEmail({
      to,
      templateType: type,
      htmlBody: htmlContent,
    });
    return { channel: "email", status: "sent", messageId, latencyMs: Date.now() - start };
  } catch (error) {
    return {
      channel: "email",
      status: "failed",
      error: String(error),
      latencyMs: Date.now() - start,
    };
  }
}

function computeOverallStatus(
  results: DeliveryResult[],
  expectedChannels: Channel[]
): "sent" | "partial" | "failed" {
  const sentCount = results.filter((r) => r.status === "sent").length;
  if (sentCount === expectedChannels.length) return "sent";
  if (sentCount === 0) return "failed";
  return "partial";
}

async function pushToRetryQueue(
  payload: NotificationPayload,
  failedResults: DeliveryResult[],
  notificationId: string
): Promise<void> {
  const { SQSClient, SendMessageCommand } = await import("@aws-sdk/client-sqs");

  const sqs = new SQSClient({ region: process.env.AWS_REGION || "eu-north-1" });

  const retryPayload = {
    ...payload,
    channels: failedResults.map((r) => r.channel),
    notificationId,
    retryCount: 1,
  };

  await sqs.send(new SendMessageCommand({
    QueueUrl: process.env.NOTIFICATION_RETRY_QUEUE_URL,
    MessageBody: JSON.stringify(retryPayload),
    DelaySeconds: 300, // 5 minuti
  }));

  console.log("[retry-queue] Pushed failed channels:", JSON.stringify(retryPayload));
}

function generateId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
