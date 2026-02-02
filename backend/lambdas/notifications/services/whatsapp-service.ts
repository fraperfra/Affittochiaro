import { Twilio } from "twilio";

export interface WhatsAppConfig {
  accountSid: string;
  authToken: string;
  whatsappNumber: string;
}

export interface SendMessageOptions {
  to: string;
  body: string;
  mediaUrl?: string;
}

export class WhatsAppService {
  private client: Twilio;
  private whatsappNumber: string;

  constructor(config: WhatsAppConfig) {
    this.client = new Twilio(config.accountSid, config.authToken);
    this.whatsappNumber = config.whatsappNumber;
  }

  /**
   * Invia messaggio WhatsApp via Twilio
   * @returns messageId (SID) del messaggio
   */
  async sendMessage(options: SendMessageOptions): Promise<string> {
    const { to, body, mediaUrl } = options;

    // Formatta numeri per WhatsApp
    const fromNumber = this.formatWhatsAppNumber(this.whatsappNumber);
    const toNumber = this.formatWhatsAppNumber(to);

    try {
      const message = await this.client.messages.create({
        from: fromNumber,
        to: toNumber,
        body,
        ...(mediaUrl && { mediaUrl: [mediaUrl] }),
      });

      console.log(`[WhatsApp] Message sent: ${message.sid} to ${toNumber}`);
      return message.sid;
    } catch (error: any) {
      console.error(`[WhatsApp] Failed to send to ${toNumber}:`, error.message);
      throw new Error(`WhatsApp send failed: ${error.message}`);
    }
  }

  /**
   * Invia template message (per messaggi fuori dalla finestra 24h)
   */
  async sendTemplateMessage(options: {
    to: string;
    templateSid: string;
    variables: Record<string, string>;
  }): Promise<string> {
    const { to, templateSid, variables } = options;
    const toNumber = this.formatWhatsAppNumber(to);

    try {
      const message = await this.client.messages.create({
        from: this.formatWhatsAppNumber(this.whatsappNumber),
        to: toNumber,
        contentSid: templateSid,
        contentVariables: JSON.stringify(variables),
      });

      console.log(`[WhatsApp] Template sent: ${message.sid}`);
      return message.sid;
    } catch (error: any) {
      console.error(`[WhatsApp] Template failed:`, error.message);
      throw new Error(`WhatsApp template failed: ${error.message}`);
    }
  }

  /**
   * Verifica stato messaggio
   */
  async getMessageStatus(messageSid: string): Promise<string> {
    const message = await this.client.messages(messageSid).fetch();
    return message.status;
  }

  /**
   * Formatta numero per WhatsApp API
   */
  private formatWhatsAppNumber(phone: string): string {
    // Rimuovi spazi e caratteri speciali
    const cleaned = phone.replace(/[\s\-\(\)]/g, "");

    // Se inizia già con whatsapp:, ritorna così
    if (cleaned.startsWith("whatsapp:")) return cleaned;

    // Altrimenti aggiungi prefisso
    return `whatsapp:${cleaned}`;
  }
}
