import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { emailTemplates } from "../templates/email-templates";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmailServiceConfig {
  region: string;
  senderEmail: string;
  senderName: string;
}

interface SendEmailParams {
  to: string;
  templateType: string;
  htmlBody: string;
  subject?: string;
}

// ─── Email Service ────────────────────────────────────────────────────────────

export class EmailService {
  private sesClient: SESv2Client;
  private senderEmail: string;
  private senderName: string;

  constructor(config: EmailServiceConfig) {
    this.sesClient = new SESv2Client({ region: config.region });
    this.senderEmail = config.senderEmail;
    this.senderName = config.senderName;
  }

  /**
   * Invia email transazionale via AWS SES
   */
  async sendEmail(params: SendEmailParams): Promise<string> {
    const template = emailTemplates[params.templateType];

    // Usa il subject dinamico dal template se disponibile
    let subject = params.subject || "Affittochiaro";
    if (template?.subject) {
      subject = template.subject;
    }

    // Inject tracking pixel + unsubscribe link nel template
    const finalHtml = this.injectTracking(params.htmlBody, params.to);

    try {
      const command = new SendEmailCommand({
        FromEmailAddress: `${this.senderName} <${this.senderEmail}>`,
        Destination: {
          ToAddresses: [params.to],
        },
        Content: {
          Simple: {
            Subject: {
              Data: subject,
              Charset: "UTF-8",
            },
            Body: {
              Html: {
                Data: finalHtml,
                Charset: "UTF-8",
              },
              Text: {
                Data: this.stripHtml(finalHtml),
                Charset: "UTF-8",
              },
            },
          },
        },
        ListManagementOptions: undefined,
      });

      const result = await this.sesClient.send(command);
      const messageId = result.MessageId || "unknown";

      console.log(`[Email] Sent to ${params.to} | MessageId: ${messageId} | Type: ${params.templateType}`);

      return messageId;
    } catch (error) {
      console.error(`[Email] Failed to send to ${params.to}:`, error);
      throw new Error(`Email send failed: ${String(error)}`);
    }
  }

  /**
   * Invia email batch (es: digest giornaliero)
   */
  async sendBatch(
    recipients: Array<{ to: string; templateType: string; htmlBody: string; subject?: string }>
  ): Promise<Array<{ to: string; messageId?: string; error?: string }>> {
    const RATE_LIMIT_MS = 20; // 50 email/sec
    const results: Array<{ to: string; messageId?: string; error?: string }> = [];

    for (const recipient of recipients) {
      try {
        const messageId = await this.sendEmail(recipient);
        results.push({ to: recipient.to, messageId });
      } catch (error) {
        results.push({ to: recipient.to, error: String(error) });
      }

      await this.delay(RATE_LIMIT_MS);
    }

    return results;
  }

  // ─── Tracking & Compliance ──────────────────────────────────────────────────

  /**
   * Inietta:
   * 1. Tracking pixel (1x1 per apertura)
   * 2. Unsubscribe link (obbligatorio CAN-SPAM + GDPR)
   */
  private injectTracking(html: string, recipientEmail: string): string {
    const encodedEmail = Buffer.from(recipientEmail).toString("base64");
    const trackingPixelUrl = `https://api.affittochiaro.it/track/open?e=${encodedEmail}&t=${Date.now()}`;
    const unsubscribeUrl = `https://affittochiaro.it/unsubscribe?e=${encodedEmail}`;

    const trackingPixel = `<img src="${trackingPixelUrl}" width="1" height="1" style="display:block;width:1px;height:1px;" alt="" />`;

    const unsubscribeFooter = `
      <div style="text-align:center;padding:24px 0 8px;font-size:12px;color:#999;">
        Non vuoi più ricevere questi messaggi?
        <a href="${unsubscribeUrl}" style="color:#666;text-decoration:underline;">Unsubscribe</a>
      </div>
    `;

    let finalHtml = html;

    // Aggiungi prima di </body>
    if (finalHtml.includes("</body>")) {
      finalHtml = finalHtml.replace("</body>", `${unsubscribeFooter}${trackingPixel}</body>`);
    } else {
      finalHtml = finalHtml + unsubscribeFooter + trackingPixel;
    }

    return finalHtml;
  }

  /**
   * Strip HTML → plain text fallback
   */
  private stripHtml(html: string): string {
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
