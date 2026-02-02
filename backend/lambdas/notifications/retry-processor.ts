import { SQSEvent, SQSRecord, Context } from "aws-lambda";
import { WhatsAppService } from "./services/whatsapp-service";
import { EmailService } from "./services/email-service";
import { NotificationStore } from "./services/notification-store";
import { templateRegistry } from "./services/template-registry";
import { NotificationPayload, Channel, DeliveryResult } from "./dispatcher";

// ─── Services ────────────────────────────────────────────────────────────────

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

const MAX_RETRIES = 3;

// ─── Handler ─────────────────────────────────────────────────────────────────

interface RetryPayload extends NotificationPayload {
  notificationId: string;
  retryCount: number;
}

export const handler = async (event: SQSEvent, context: Context): Promise<void> => {
  console.log(`[retry-processor] Processing ${event.Records.length} messages`);

  for (const record of event.Records) {
    await processRetryMessage(record);
  }
};

async function processRetryMessage(record: SQSRecord): Promise<void> {
  let payload: RetryPayload;

  try {
    payload = JSON.parse(record.body);
  } catch {
    console.error("[retry-processor] Invalid message body:", record.body);
    return; // Non riprocessare messaggi malformati
  }

  const { notificationId, userId, type, channels, data, retryCount } = payload;

  console.log(`[retry-processor] Retry #${retryCount} for notification ${notificationId}`);

  // Check max retries
  if (retryCount >= MAX_RETRIES) {
    console.log(`[retry-processor] Max retries reached for ${notificationId}, marking as failed`);
    await notificationStore.updateNotificationRetry(notificationId, retryCount, "failed");
    return;
  }

  // Fetch user
  const user = await notificationStore.getUserById(userId);
  if (!user) {
    console.error(`[retry-processor] User not found: ${userId}`);
    await notificationStore.updateNotificationRetry(notificationId, retryCount, "failed");
    return;
  }

  // Genera contenuto
  const whatsappContent = templateRegistry.render("whatsapp", type, {
    ...data,
    userName: user.name,
  });

  const emailContent = templateRegistry.render("email", type, {
    ...data,
    userName: user.name,
    userEmail: user.email,
  });

  // Retry solo i canali falliti
  const results: DeliveryResult[] = [];

  for (const channel of channels) {
    let result: DeliveryResult;

    if (channel === "whatsapp") {
      result = await sendWhatsApp(user.phone, whatsappContent);
    } else {
      result = await sendEmail(user.email, type, emailContent);
    }

    results.push(result);
  }

  // Determina nuovo stato
  const allSent = results.every((r) => r.status === "sent");
  const allFailed = results.every((r) => r.status === "failed");

  if (allSent) {
    console.log(`[retry-processor] Success! All channels delivered for ${notificationId}`);
    await notificationStore.updateNotificationRetry(notificationId, retryCount, "sent", results);
    return;
  }

  if (allFailed && retryCount + 1 >= MAX_RETRIES) {
    console.log(`[retry-processor] Final failure for ${notificationId}`);
    await notificationStore.updateNotificationRetry(notificationId, retryCount + 1, "failed", results);
    return;
  }

  // Parziale successo o ancora retry disponibili
  const failedChannels = results.filter((r) => r.status === "failed");

  if (failedChannels.length > 0 && retryCount + 1 < MAX_RETRIES) {
    // Push nuovamente in coda per retry
    await pushToRetryQueue({
      ...payload,
      channels: failedChannels.map((r) => r.channel) as Channel[],
      retryCount: retryCount + 1,
    });
  }

  // Aggiorna stato parziale
  await notificationStore.updateNotificationRetry(
    notificationId,
    retryCount + 1,
    allFailed ? "failed" : "sent",
    results
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function sendWhatsApp(phone: string, content: string): Promise<DeliveryResult> {
  const start = Date.now();
  try {
    const messageId = await whatsappService.sendMessage({ to: phone, body: content });
    return { channel: "whatsapp", status: "sent", messageId, latencyMs: Date.now() - start };
  } catch (error) {
    return { channel: "whatsapp", status: "failed", error: String(error), latencyMs: Date.now() - start };
  }
}

async function sendEmail(to: string, type: string, htmlContent: string): Promise<DeliveryResult> {
  const start = Date.now();
  try {
    const messageId = await emailService.sendEmail({ to, templateType: type, htmlBody: htmlContent });
    return { channel: "email", status: "sent", messageId, latencyMs: Date.now() - start };
  } catch (error) {
    return { channel: "email", status: "failed", error: String(error), latencyMs: Date.now() - start };
  }
}

async function pushToRetryQueue(payload: RetryPayload): Promise<void> {
  const { SQSClient, SendMessageCommand } = await import("@aws-sdk/client-sqs");
  const sqs = new SQSClient({ region: process.env.AWS_REGION || "eu-north-1" });

  // Backoff esponenziale: 5min, 15min, 45min
  const delaySeconds = Math.min(300 * Math.pow(3, payload.retryCount - 1), 900);

  await sqs.send(new SendMessageCommand({
    QueueUrl: process.env.NOTIFICATION_RETRY_QUEUE_URL,
    MessageBody: JSON.stringify(payload),
    DelaySeconds: delaySeconds,
  }));

  console.log(`[retry-processor] Queued retry #${payload.retryCount} with ${delaySeconds}s delay`);
}
