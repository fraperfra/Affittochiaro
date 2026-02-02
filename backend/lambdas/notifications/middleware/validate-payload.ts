// ─── Types ────────────────────────────────────────────────────────────────────

const VALID_NOTIFICATION_TYPES = [
  "match_found_owner",
  "match_found_tenant",
  "trial_expiring_agency",
  "document_reminder",
  "contract_signed",
  "welcome_onboarding",
] as const;

const VALID_CHANNELS = ["whatsapp", "email"] as const;

// ─── Required fields per notification type ────────────────────────────────────
// Ogni tipo richiede campi specifici nel data object.

const REQUIRED_DATA_FIELDS: Record<string, string[]> = {
  match_found_owner: ["propertyAddress", "matchScore", "budget"],
  match_found_tenant: ["city", "matchCount"],
  trial_expiring_agency: ["daysLeft", "leadsReceived"],
  document_reminder: ["missingDocs"],
  contract_signed: ["propertyAddress", "startDate", "monthlyRent", "contractId"],
  welcome_onboarding: [], // Nessun campo obbligatorio oltre userId
};

// ─── Validator ────────────────────────────────────────────────────────────────

export function validatePayload(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return "Payload deve essere un oggetto";
  }

  const p = payload as Record<string, unknown>;

  // ─── userId ────────────────────────────────────────────────────────────────
  if (!p.userId || typeof p.userId !== "string") {
    return "userId è obbligatorio e deve essere una stringa";
  }

  if (p.userId.length < 3 || p.userId.length > 128) {
    return "userId deve avere tra 3 e 128 caratteri";
  }

  // ─── type ───────────────────────────────────────────────────────────────────
  if (!p.type || typeof p.type !== "string") {
    return "type è obbligatorio e deve essere una stringa";
  }

  if (!VALID_NOTIFICATION_TYPES.includes(p.type as any)) {
    return `type non valido. Valori accettati: ${VALID_NOTIFICATION_TYPES.join(", ")}`;
  }

  // ─── channels ───────────────────────────────────────────────────────────────
  if (!p.channels || !Array.isArray(p.channels)) {
    return "channels è obbligatorio e deve essere un array";
  }

  if (p.channels.length === 0) {
    return "channels deve contenere almeno un elemento";
  }

  if (p.channels.length > VALID_CHANNELS.length) {
    return `channels può contenere massimo ${VALID_CHANNELS.length} elementi`;
  }

  for (const channel of p.channels) {
    if (!VALID_CHANNELS.includes(channel as any)) {
      return `channel non valido: "${channel}". Valori accettati: ${VALID_CHANNELS.join(", ")}`;
    }
  }

  // Check duplicati
  const uniqueChannels = new Set(p.channels);
  if (uniqueChannels.size !== p.channels.length) {
    return "channels non deve contenere duplicati";
  }

  // ─── data ───────────────────────────────────────────────────────────────────
  if (!p.data || typeof p.data !== "object" || Array.isArray(p.data)) {
    return "data è obbligatorio e deve essere un oggetto";
  }

  // Valida i campi obbligatori per il tipo di notifica
  const requiredFields = REQUIRED_DATA_FIELDS[p.type as string] || [];
  for (const field of requiredFields) {
    if (!(field in (p.data as Record<string, unknown>))) {
      return `data.${field} è obbligatorio per il tipo "${p.type}"`;
    }
  }

  // Check che i valori in data siano stringhe o numeri (no oggetti nidificati)
  const dataObj = p.data as Record<string, unknown>;
  for (const [key, value] of Object.entries(dataObj)) {
    if (typeof value !== "string" && typeof value !== "number") {
      return `data.${key} deve essere una stringa o un numero, ricevuto: ${typeof value}`;
    }
  }

  // ─── forceChannels (opzionale) ──────────────────────────────────────────────
  if ("forceChannels" in p && typeof p.forceChannels !== "boolean") {
    return "forceChannels deve essere un booleano";
  }

  // ─── Sanitization: check per injection ──────────────────────────────────────
  const sensitivePattern = /[<>"'&;]/g;
  const dataStrings = Object.values(dataObj).filter((v) => typeof v === "string");

  for (const value of dataStrings) {
    if (sensitivePattern.test(value as string)) {
      return "I valori in data non possono contenere caratteri speciali (<, >, \", ', &, ;)";
    }
  }

  return null; // Payload valido ✓
}
