import { emailTemplates } from "../templates/email-templates";

// ─── Types ────────────────────────────────────────────────────────────────────

type Channel = "whatsapp" | "email";
type NotificationType =
  | "match_found_owner"
  | "match_found_tenant"
  | "trial_expiring_agency"
  | "document_reminder"
  | "contract_signed"
  | "welcome_onboarding";

// ─── WhatsApp Template Map ────────────────────────────────────────────────────
// Mappa 1:1 con i template della WhatsAppService.
// Definisce quali parametri passare e in quale ordine.

interface WhatsAppTemplateConfig {
  templateName: string;
  /** Funzione che estrae i parametri ordinati dal data object */
  extractParams: (data: Record<string, string | number>) => string[];
}

const whatsappTemplateMap: Record<string, WhatsAppTemplateConfig> = {
  match_found_owner: {
    templateName: "match_found_owner",
    extractParams: (data) => [
      String(data.userName || ""),
      String(data.propertyAddress || ""),
      String(data.matchScore || "85"),
      String(data.budget || "800"),
      String(data.availability || "01/03/2025"),
      String(data.matchId || ""),
    ],
  },
  match_found_tenant: {
    templateName: "match_found_tenant",
    extractParams: (data) => [
      String(data.userName || ""),
      String(data.matchCount || "3"),
      String(data.zone || "Centro"),
      String(`€${data.budgetMin || "750"} – €${data.budgetMax || "850"}`),
      String(data.searchId || ""),
    ],
  },
  trial_expiring_agency: {
    templateName: "trial_expiring_agency",
    extractParams: (data) => [
      String(data.userName || ""),
      String(data.daysLeft || "2"),
      String(data.leadsReceived || "12"),
      String(data.contractsClosed || "2"),
    ],
  },
  document_reminder: {
    templateName: "document_reminder",
    extractParams: (data) => [
      String(data.userName || ""),
      String(data.missingDocs || "Carta d'identità, Contratto di lavoro"),
    ],
  },
  contract_signed: {
    templateName: "contract_signed",
    extractParams: (data) => [
      String(data.userName || ""),
      String(data.propertyAddress || ""),
      String(data.startDate || "01/03/2025"),
      String(data.monthlyRent || "800"),
      String(data.contractId || ""),
    ],
  },
  welcome_onboarding: {
    templateName: "welcome_onboarding",
    extractParams: (data) => [
      String(data.userName || ""),
      String(data.userRole || "inquilino"), // "inquilino" | "proprietario" | "agenzia"
    ],
  },
};

// ─── Template Registry ────────────────────────────────────────────────────────

class TemplateRegistry {
  /**
   * Render universale: dato un channel e un tipo di notifica, restituisce il contenuto.
   *
   * @param channel - "whatsapp" | "email"
   * @param type    - tipo di notifica (es: "match_found_owner")
   * @param data    - oggetto con i dati dinamici
   * @returns       - stringa contenuto (HTML per email, testo per WhatsApp)
   */
  render(channel: Channel, type: string, data: Record<string, string | number>): string {
    if (channel === "whatsapp") {
      return this.renderWhatsApp(type, data);
    }
    return this.renderEmail(type, data);
  }

  /**
   * Render email: restituisce l'HTML completo.
   * Utile anche per preview nel dashboard admin.
   */
  renderEmailFull(
    type: string,
    data: Record<string, string | number>
  ): { subject: string; html: string } | null {
    const template = emailTemplates[type];
    if (!template) {
      console.warn(`[TemplateRegistry] Email template '${type}' not found`);
      return null;
    }

    const stringData = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v)])
    );

    return template.render(stringData);
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  private renderWhatsApp(type: string, data: Record<string, string | number>): string {
    const config = whatsappTemplateMap[type];
    if (!config) {
      console.warn(`[TemplateRegistry] WhatsApp template '${type}' not found`);
      return `[Notifica: ${type}] Contenuto non disponibile.`;
    }

    // Restituisci il nome template + params come JSON stringa
    // Il WhatsAppService usa questa info per formattare il messaggio
    const params = config.extractParams(data);
    return JSON.stringify({
      templateName: config.templateName,
      params,
    });
  }

  private renderEmail(type: string, data: Record<string, string | number>): string {
    const result = this.renderEmailFull(type, data);
    if (!result) {
      return `<p>Notifica: ${type}. Contenuto non disponibile.</p>`;
    }
    return result.html;
  }

  /**
   * Lista tutti i tipi di notifica disponibili con i canali supportati.
   * Utile per il dashboard admin / debug.
   */
  getAvailableTemplates(): Array<{
    type: string;
    channels: Channel[];
    emailSubject?: string;
  }> {
    const allTypes = new Set([
      ...Object.keys(emailTemplates),
      ...Object.keys(whatsappTemplateMap),
    ]);

    return Array.from(allTypes).map((type) => ({
      type,
      channels: [
        ...(whatsappTemplateMap[type] ? (["whatsapp"] as Channel[]) : []),
        ...(emailTemplates[type] ? (["email"] as Channel[]) : []),
      ],
      emailSubject: emailTemplates[type]?.subject,
    }));
  }
}

// ─── Singleton Export ─────────────────────────────────────────────────────────

export const templateRegistry = new TemplateRegistry();
