// ─── Email Templates ──────────────────────────────────────────────────────────
// Tutti i template sono mobile-first, max 600px, CSS inline per compatibilità
// email client (Gmail, Outlook, Apple Mail, etc.)
// Variabili dinamiche usano sintassi {{variableName}}

// ─── Shared Styles (inline per ogni template) ────────────────────────────────

const COLORS = {
  primary: "#1a73e8",
  primaryDark: "#1557b0",
  accent: "#00c9a7",
  background: "#f4f6f8",
  cardBg: "#ffffff",
  text: "#1e293b",
  textLight: "#64748b",
  textMuted: "#94a3b8",
  border: "#e2e8f0",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
};

const baseWrapper = (content: string): string => `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Affittochiaro</title>
  <style>
    @media only screen and (max-width: 600px) {
      .email-wrapper { width: 100% !important; padding: 0 12px !important; }
      .hide-mobile { display: none !important; }
      .full-mobile { width: 100% !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.background};font-family:'Segoe UI',system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${COLORS.background};padding:32px 0;">
    <tr>
      <td align="center" style="padding:0 16px;">
        <div class="email-wrapper" style="max-width:600px;width:100%;margin:0 auto;">

          <!-- HEADER -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(135deg, #1a73e8 0%, #1557b0 100%);border-radius:12px 12px 0 0;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px;text-align:center;">
                <span style="font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.5px;">🏠 Affittochiaro</span>
              </td>
            </tr>
          </table>

          <!-- BODY -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${COLORS.cardBg};border-radius:0 0 12px 12px;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
            <tr>
              <td style="padding:32px;">
                ${content}
              </td>
            </tr>
          </table>

          <!-- FOOTER -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;">
            <tr>
              <td style="text-align:center;padding:0 16px;">
                <p style="font-size:12px;color:${COLORS.textMuted};margin:0 0 4px;line-height:1.5;">
                  Questo messaggio è stato inviato da Affittochiaro.it
                </p>
                <p style="font-size:12px;color:${COLORS.textMuted};margin:0;line-height:1.5;">
                  Via Roma 10, 42100 Reggio Emilia | P.IVA: XXXXXXXXXX
                </p>
              </td>
            </tr>
          </table>

        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ─── CTA Button Component ─────────────────────────────────────────────────────

const ctaButton = (text: string, url: string, variant: "primary" | "accent" = "primary"): string => {
  const bg = variant === "primary" ? COLORS.primary : COLORS.accent;
  const bgHover = variant === "primary" ? COLORS.primaryDark : "#00b894";
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
      <tr>
        <td align="center">
          <a href="${url}" style="display:inline-block;background-color:${bg};color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;letter-spacing:0.2px;line-height:1;">${text}</a>
        </td>
      </tr>
    </table>`;
};

// ─── Info Card Component ──────────────────────────────────────────────────────

const infoCard = (items: Array<{ icon: string; label: string; value: string }>): string => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${COLORS.background};border-radius:10px;margin:20px 0;overflow:hidden;">
    ${items.map((item, i) => `
      <tr>
        <td style="padding:14px 20px;${i < items.length - 1 ? `border-bottom:1px solid ${COLORS.border};` : ""}">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width:32px;vertical-align:middle;font-size:18px;">${item.icon}</td>
              <td style="vertical-align:middle;padding-left:12px;">
                <span style="font-size:12px;color:${COLORS.textMuted};display:block;margin-bottom:2px;">${item.label}</span>
                <span style="font-size:15px;color:${COLORS.text};font-weight:600;">${item.value}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `).join("")}
  </table>`;

// ─── Badge Component ──────────────────────────────────────────────────────────

const badge = (text: string, color: string = COLORS.success): string => `
  <span style="display:inline-block;background-color:${color}15;color:${color};font-size:12px;font-weight:600;padding:4px 10px;border-radius:20px;letter-spacing:0.3px;">${text}</span>`;

// ─── Score Bar Component ──────────────────────────────────────────────────────

const scoreBar = (percentage: number): string => {
  const color = percentage >= 80 ? COLORS.success : percentage >= 60 ? COLORS.warning : COLORS.danger;
  return `
    <div style="margin:16px 0;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="font-size:13px;color:${COLORS.textLight};padding-bottom:6px;">
            Compatibilità Match
          </td>
          <td style="text-align:right;font-size:13px;font-weight:700;color:${color};padding-bottom:6px;">
            ${percentage}%
          </td>
        </tr>
      </table>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="background-color:${COLORS.border};border-radius:4px;height:8px;overflow:hidden;">
            <div style="width:${percentage}%;height:100%;background:linear-gradient(90deg, ${color}, ${color}dd);border-radius:4px;"></div>
          </td>
        </tr>
      </table>
    </div>`;
};

// ─── TEMPLATE: match_found_owner ──────────────────────────────────────────────

const matchFoundOwner = (data: Record<string, string>): { subject: string; html: string } => ({
  subject: `🏠 Nuovo inquilino qualificato per ${data.propertyAddress || "la tua proprietà"}`,
  html: baseWrapper(`
    <!-- Headline -->
    <h2 style="font-size:22px;color:${COLORS.text};margin:0 0 8px;font-weight:700;line-height:1.3;">
      Nuovo inquilino qualificato! 🎯
    </h2>
    <p style="font-size:14px;color:${COLORS.textLight};margin:0 0 20px;line-height:1.6;">
      Ciao <strong>${data.userName || "proprietario"}</strong>, abbiamo trovato un inquilino che corrisponde perfettamente a <strong>${data.propertyAddress || "la tua proprietà"}</strong>.
    </p>

    <!-- Score -->
    ${scoreBar(parseInt(data.matchScore || "85"))}

    <!-- Info Card: Dettagli Inquilino -->
    ${infoCard([
      { icon: "👤", label: "Profilo", value: `${data.tenantName || "Marco R."} · ${data.tenantAge || "28"} anni` },
      { icon: "💰", label: "Budget Mensile", value: `€${data.budget || "800"}` },
      { icon: "📅", label: "Disponibilità", value: data.availability || "Da 01/03/2025" },
      { icon: "📍", label: "Zona Preferita", value: data.preferredZone || "Centro Storico" },
    ])}

    <!-- Badges -->
    <div style="margin:16px 0;">
      ${badge("✓ Identità Verificata")}
      &nbsp;
      ${badge("✓ Documenti Completi", COLORS.primary)}
      &nbsp;
      ${badge("⭐ Profilo Premium", COLORS.warning)}
    </div>

    <!-- CTA -->
    ${ctaButton("Vedi Profilo Completo", `https://affittochiaro.it/match/${data.matchId || "xxx"}`)}

    <!-- Footer note -->
    <p style="font-size:12px;color:${COLORS.textMuted};margin:16px 0 0;text-align:center;line-height:1.5;">
      Questo inquilino ha espresso interesse specifico per la tua proprietà.<br/>
      I dettagli completi sono visibili solo dopo il login.
    </p>
  `),
});

// ─── TEMPLATE: match_found_tenant ────────────────────────────────────────────

const matchFoundTenant = (data: Record<string, string>): { subject: string; html: string } => ({
  subject: `🔑 ${data.matchCount || "3"} nuovi appartamenti per te in ${data.city || "Milano"}`,
  html: baseWrapper(`
    <h2 style="font-size:22px;color:${COLORS.text};margin:0 0 8px;font-weight:700;line-height:1.3;">
      Nuovi appartamenti disponibili! 🔑
    </h2>
    <p style="font-size:14px;color:${COLORS.textLight};margin:0 0 20px;line-height:1.6;">
      Ciao <strong>${data.userName || "Sara"}</strong>, abbiamo trovato <strong>${data.matchCount || "3"} appartamenti</strong> che matchano le tue preferenze in <strong>${data.city || "Milano"}</strong>.
    </p>

    ${infoCard([
      { icon: "📍", label: "Zona", value: data.zone || "Navigli / Porta Genova" },
      { icon: "💰", label: "Range Budget", value: `€${data.budgetMin || "750"} – €${data.budgetMax || "850"}/mese` },
      { icon: "🏠", label: "Appartamenti", value: `${data.matchCount || "3"} disponibili` },
      { icon: "📐", label: "Superfície Media", value: `${data.avgSqm || "55"} m²` },
    ])}

    ${ctaButton("Vedi Tutti gli Appartamenti", `https://affittochiaro.it/matches/${data.searchId || "xxx"}`, "accent")}

    <p style="font-size:12px;color:${COLORS.textMuted};margin:16px 0 0;text-align:center;line-height:1.5;">
      I proprietari di questi appartamenti sono disponibili a contatto diretto.<br/>
      Nessun intermediario, nessuna perdita di tempo.
    </p>
  `),
});

// ─── TEMPLATE: trial_expiring_agency ──────────────────────────────────────────

const trialExpiringAgency = (data: Record<string, string>): { subject: string; html: string } => ({
  subject: `⏰ Il tuo trial scade tra ${data.daysLeft || "2"} giorni – Risparmia €${data.discount || "101"}`,
  html: baseWrapper(`
    <h2 style="font-size:22px;color:${COLORS.text};margin:0 0 8px;font-weight:700;line-height:1.3;">
      Il tuo trial sta per scadere ⏰
    </h2>
    <p style="font-size:14px;color:${COLORS.textLight};margin:0 0 20px;line-height:1.6;">
      Ciao <strong>${data.userName || "Agenzia XYZ"}</strong>, il tuo trial gratuito scade tra <strong>${data.daysLeft || "2"} giorni</strong>.
    </p>

    <!-- Recap Performance -->
    <h3 style="font-size:15px;color:${COLORS.text};margin:0 0 12px;font-weight:600;">📈 Il tuo recap:</h3>
    ${infoCard([
      { icon: "👤", label: "Lead Qualificati Ricevuti", value: data.leadsReceived || "12" },
      { icon: "💼", label: "Contratti Chiusi", value: data.contractsClosed || "2" },
      { icon: "💰", label: "Commissioni Generate", value: `€${data.commissions || "3.200"}` },
      { icon: "📊", label: "ROI sul Trial", value: `+${data.roi || "∞"}%` },
    ])}

    <!-- Pricing CTA -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(135deg, #f0f9ff, #e0f2fe);border-radius:10px;padding:20px;margin:20px 0;">
      <tr>
        <td style="text-align:center;">
          <p style="font-size:13px;color:${COLORS.textLight};margin:0 0 4px;">Prezzo Standard</p>
          <p style="font-size:18px;color:${COLORS.textMuted};margin:0;text-decoration:line-through;">€300/mese</p>
          <p style="font-size:13px;color:${COLORS.success};margin:8px 0 4px;font-weight:600;">🎁 Early Bird Discount</p>
          <p style="font-size:36px;color:${COLORS.primary};margin:0;font-weight:700;">€199<span style="font-size:16px;color:${COLORS.textLight};font-weight:400;">/mese</span></p>
          <p style="font-size:12px;color:${COLORS.textMuted};margin:8px 0 0;">Prezzo bloccato per sempre ✓</p>
        </td>
      </tr>
    </table>

    ${ctaButton("Attiva Abbonamento Ora", `https://affittochiaro.it/billing/upgrade?agency=${data.agencyId || "xxx"}`)}

    <p style="font-size:12px;color:${COLORS.textMuted};margin:16px 0 0;text-align:center;line-height:1.5;">
      Abbonamento mensile, cancellabile in qualsiasi momento.<br/>
      Fattura elettronica inviata automaticamente.
    </p>
  `),
});

// ─── TEMPLATE: document_reminder ──────────────────────────────────────────────

const documentReminder = (data: Record<string, string>): { subject: string; html: string } => ({
  subject: `📄 Completa il profilo – ${data.missingCount || "2"} documenti mancanti`,
  html: baseWrapper(`
    <h2 style="font-size:22px;color:${COLORS.text};margin:0 0 8px;font-weight:700;line-height:1.3;">
      Profilo incompleto 📄
    </h2>
    <p style="font-size:14px;color:${COLORS.textLight};margin:0 0 20px;line-height:1.6;">
      Ciao <strong>${data.userName || "Marco"}</strong>, il tuo profilo manca di alcuni documenti. I profili completi ricevono <strong>+60% di risposte</strong> dai proprietari.
    </p>

    <!-- Documenti Mancanti -->
    <h3 style="font-size:14px;color:${COLORS.text};margin:0 0 10px;font-weight:600;">Documenti da caricare:</h3>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 20px;">
      ${(data.missingDocs || "Carta d'identità,Contratto di lavoro").split(",").map((doc, i) => `
        <tr>
          <td style="padding:10px 0;${i > 0 ? `border-top:1px solid ${COLORS.border};` : ""}">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="width:28px;vertical-align:middle;">
                  <span style="display:inline-block;width:22px;height:22px;background-color:#fee2e2;border-radius:50%;text-align:center;line-height:22px;font-size:12px;">❌</span>
                </td>
                <td style="vertical-align:middle;padding-left:10px;">
                  <span style="font-size:14px;color:${COLORS.text};font-weight:500;">${doc.trim()}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `).join("")}
    </table>

    <!-- Progresso -->
    <div style="margin:16px 0;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="font-size:13px;color:${COLORS.textLight};padding-bottom:6px;">Profilo Completato</td>
          <td style="text-align:right;font-size:13px;font-weight:700;color:${COLORS.warning};padding-bottom:6px;">${data.completionPercent || "60"}%</td>
        </tr>
      </table>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="background-color:${COLORS.border};border-radius:4px;height:8px;overflow:hidden;">
            <div style="width:${data.completionPercent || "60"}%;height:100%;background:linear-gradient(90deg, ${COLORS.warning}, ${COLORS.accent});border-radius:4px;"></div>
          </td>
        </tr>
      </table>
    </div>

    ${ctaButton("Carica Documenti", `https://affittochiaro.it/profile/documents?user=${data.userId || "xxx"}`)}
  `),
});

// ─── TEMPLATE: welcome_onboarding ────────────────────────────────────────────

const welcomeOnboarding = (data: Record<string, string>): { subject: string; html: string } => ({
  subject: `👋 Benvenuto su Affittochiaro, ${data.userName || "nuovo membro"}!`,
  html: baseWrapper(`
    <h2 style="font-size:22px;color:${COLORS.text};margin:0 0 8px;font-weight:700;line-height:1.3;">
      Benvenuto su Affittochiaro! 🎉
    </h2>
    <p style="font-size:14px;color:${COLORS.textLight};margin:0 0 24px;line-height:1.6;">
      Ciao <strong>${data.userName || "nuovo membro"}</strong>, sei ora parte di una comunità di oltre <strong>${data.communitySize || "72.000"}</strong> persone che cercano o affittano casa in modo smarter.
    </p>

    <!-- Steps -->
    <h3 style="font-size:15px;color:${COLORS.text};margin:0 0 14px;font-weight:600;">I tuoi primi passi:</h3>
    ${[
      { step: "1", title: "Completa il profilo", desc: "Carica i documenti e le preferenze", done: false },
      { step: "2", title: "Imposta le notifiche", desc: "Scegli come ricevere i match", done: false },
      { step: "3", title: "Ricevi i primi match!", desc: "I proprietari ti contatteranno direttamente", done: false },
    ].map((item) => `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:12px;">
        <tr>
          <td style="width:36px;vertical-align:top;">
            <div style="width:32px;height:32px;background:linear-gradient(135deg,${COLORS.primary},${COLORS.primaryDark});border-radius:50%;text-align:center;line-height:32px;color:#fff;font-size:14px;font-weight:700;">${item.step}</div>
          </td>
          <td style="vertical-align:top;padding-left:14px;">
            <p style="font-size:14px;color:${COLORS.text};margin:0 0 2px;font-weight:600;">${item.title}</p>
            <p style="font-size:12px;color:${COLORS.textLight};margin:0;">${item.desc}</p>
          </td>
        </tr>
      </table>
    `).join("")}

    ${ctaButton("Inizia Ora →", `https://affittochiaro.it/onboarding?user=${data.userId || "xxx"}`)}

    <p style="font-size:12px;color:${COLORS.textMuted};margin:20px 0 0;text-align:center;line-height:1.5;">
      Hai domande? Contatta il supporto via WhatsApp o email.<br/>
      <a href="https://affittochiaro.it/support" style="color:${COLORS.primary};">Centro Aiuto →</a>
    </p>
  `),
});

// ─── TEMPLATE: contract_signed ────────────────────────────────────────────────

const contractSigned = (data: Record<string, string>): { subject: string; html: string } => ({
  subject: `🎉 Contratto firmato – ${data.propertyAddress || "Via Roma 10"}`,
  html: baseWrapper(`
    <h2 style="font-size:22px;color:${COLORS.text};margin:0 0 8px;font-weight:700;line-height:1.3;">
      Contratto firmato con successo! 🎉
    </h2>
    <p style="font-size:14px;color:${COLORS.textLight};margin:0 0 20px;line-height:1.6;">
      Ciao <strong>${data.userName || "Marco"}</strong>, il contratto per <strong>${data.propertyAddress || "Via Roma 10, Milano"}</strong> è stato firmato con successo.
    </p>

    ${badge("✓ Contratto Attivo", COLORS.success)}

    ${infoCard([
      { icon: "📍", label: "Indirizzo", value: data.propertyAddress || "Via Roma 10, Milano" },
      { icon: "📅", label: "Data Inizio", value: data.startDate || "01/03/2025" },
      { icon: "📅", label: "Data Fine", value: data.endDate || "28/02/2026" },
      { icon: "💰", label: "Canone Mensile", value: `€${data.monthlyRent || "800"}` },
      { icon: "💰", label: "Caparra", value: `€${data.deposit || "1.600"}` },
    ])}

    ${ctaButton("Vedi Contratto", `https://affittochiaro.it/contracts/${data.contractId || "xxx"}`)}

    <p style="font-size:12px;color:${COLORS.textMuted};margin:16px 0 0;text-align:center;line-height:1.5;">
      Una copia del contratto è stata inviata a entrambe le parti.<br/>
      Per qualsiasi problema contatta il supporto.
    </p>
  `),
});

// ─── Registry: mappa tipo notifica → template ─────────────────────────────────

export const emailTemplates: Record<
  string,
  {
    subject: string;
    render: (data: Record<string, string>) => { subject: string; html: string };
  }
> = {
  match_found_owner: {
    subject: "Nuovo inquilino qualificato",
    render: matchFoundOwner,
  },
  match_found_tenant: {
    subject: "Nuovi appartamenti disponibili",
    render: matchFoundTenant,
  },
  trial_expiring_agency: {
    subject: "Trial in scadenza",
    render: trialExpiringAgency,
  },
  document_reminder: {
    subject: "Documenti mancanti",
    render: documentReminder,
  },
  welcome_onboarding: {
    subject: "Benvenuto su Affittochiaro",
    render: welcomeOnboarding,
  },
  contract_signed: {
    subject: "Contratto firmato",
    render: contractSigned,
  },
};
