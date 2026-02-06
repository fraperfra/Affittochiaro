import { TenantProfile } from '@/types/auth';
import { TenantPreferences, TenantDocument, TenantReference } from '@/types/tenant';
import {
  CVCompleteness,
  CVSectionScore,
  CVSectionId,
  CV_SECTION_LABELS,
  CV_SECTION_WEIGHTS,
  CVRentalEntry,
} from '@/types/cv';

/**
 * Calcola la completezza del CV dell'inquilino
 *
 * Pesi sezioni:
 *   personal_info:   15% (nome, cognome, data nascita, telefono, bio, foto)
 *   employment:      20% (occupazione, tipo impiego, datore, reddito)
 *   documents:       20% (almeno 2 documenti caricati)
 *   video:           15% (video presentazione caricato)
 *   rental_history:  10% (almeno 1 affitto precedente)
 *   preferences:     10% (preferenze ricerca compilate)
 *   references:      10% (almeno 1 referenza)
 */
export function calculateCVCompleteness(
  profile: TenantProfile,
  preferences: TenantPreferences | null,
  documents: TenantDocument[],
  references: TenantReference[],
  rentalHistory: CVRentalEntry[],
): CVCompleteness {
  const sections: CVSectionScore[] = [
    calculatePersonalInfoScore(profile),
    calculateEmploymentScore(profile),
    calculateDocumentsScore(documents),
    calculateVideoScore(profile),
    calculateRentalHistoryScore(rentalHistory),
    calculatePreferencesScore(preferences),
    calculateReferencesScore(references),
  ];

  const total = sections.reduce((sum, s) => sum + s.weightedScore, 0);

  return {
    total: Math.round(total),
    sections,
  };
}

function buildSection(
  id: CVSectionId,
  score: number,
  missingFields: string[],
): CVSectionScore {
  const weight = CV_SECTION_WEIGHTS[id];
  const clampedScore = Math.max(0, Math.min(100, score));
  return {
    id,
    label: CV_SECTION_LABELS[id],
    weight,
    score: clampedScore,
    weightedScore: Math.round((clampedScore * weight) / 100),
    missingFields,
  };
}

// ============================================================
// Calcolo per sezione
// ============================================================

function calculatePersonalInfoScore(profile: TenantProfile): CVSectionScore {
  const missing: string[] = [];
  let filled = 0;
  const total = 6;

  if (profile.firstName && profile.lastName) filled++;
  else missing.push('Nome e cognome');

  if (profile.dateOfBirth) filled++;
  else missing.push('Data di nascita');

  if (profile.phone) filled++;
  else missing.push('Numero di telefono');

  if (profile.bio && profile.bio.length >= 20) filled++;
  else missing.push('Descrizione personale (min 20 caratteri)');

  if (profile.avatarUrl) filled++;
  else missing.push('Foto profilo');

  if (profile.city) filled++;
  else missing.push('Città di residenza');

  const score = Math.round((filled / total) * 100);
  return buildSection('personal_info', score, missing);
}

function calculateEmploymentScore(profile: TenantProfile): CVSectionScore {
  const missing: string[] = [];
  let filled = 0;
  const total = 4;

  if (profile.occupation) filled++;
  else missing.push('Professione');

  if (profile.employmentType) filled++;
  else missing.push('Tipo di contratto');

  if (profile.employer) filled++;
  else missing.push('Datore di lavoro / Azienda');

  if (profile.annualIncome && profile.annualIncome > 0) filled++;
  else missing.push('Reddito annuo');

  // Bonus per data inizio impiego (non obbligatorio, ma migliora il score)
  if (profile.employmentStartDate && filled === total) {
    // Gia' al 100%, non serve bonus
  }

  const score = Math.round((filled / total) * 100);
  return buildSection('employment', score, missing);
}

function calculateDocumentsScore(documents: TenantDocument[]): CVSectionScore {
  const missing: string[] = [];
  const verifiedOrPending = documents.filter(
    d => d.status === 'verified' || d.status === 'pending'
  );

  // 2 documenti = 100%, 1 documento = 50%, 0 = 0%
  let score: number;
  if (verifiedOrPending.length >= 3) {
    score = 100;
  } else if (verifiedOrPending.length === 2) {
    score = 80;
  } else if (verifiedOrPending.length === 1) {
    score = 40;
  } else {
    score = 0;
  }

  if (verifiedOrPending.length < 2) {
    missing.push(`Carica almeno ${2 - verifiedOrPending.length} documento/i (carta identità, busta paga, ecc.)`);
  }

  // Verifica tipologie chiave
  const hasIdentity = documents.some(d => d.type === 'identity_card');
  const hasIncome = documents.some(d =>
    ['payslip', 'employment_contract', 'tax_return', 'bank_statement'].includes(d.type)
  );

  if (!hasIdentity && verifiedOrPending.length > 0) {
    missing.push('Documento di identità');
  }
  if (!hasIncome && verifiedOrPending.length > 0) {
    missing.push('Documento di reddito (busta paga, CUD, ecc.)');
  }

  return buildSection('documents', score, missing);
}

function calculateVideoScore(profile: TenantProfile): CVSectionScore {
  const missing: string[] = [];

  if (profile.hasVideo && profile.videoUrl) {
    return buildSection('video', 100, []);
  }

  missing.push('Registra un video di presentazione (1-2 minuti)');
  return buildSection('video', 0, missing);
}

function calculateRentalHistoryScore(rentalHistory: CVRentalEntry[]): CVSectionScore {
  const missing: string[] = [];

  if (rentalHistory.length >= 2) {
    return buildSection('rental_history', 100, []);
  }

  if (rentalHistory.length === 1) {
    return buildSection('rental_history', 60, ['Aggiungi un altro affitto precedente per un profilo più completo']);
  }

  missing.push('Aggiungi la tua storia abitativa (affitti precedenti)');
  return buildSection('rental_history', 0, missing);
}

function calculatePreferencesScore(preferences: TenantPreferences | null): CVSectionScore {
  const missing: string[] = [];

  if (!preferences) {
    missing.push('Compila le tue preferenze di ricerca');
    return buildSection('preferences', 0, missing);
  }

  let filled = 0;
  const total = 4;

  if (preferences.maxBudget && preferences.maxBudget > 0) filled++;
  else missing.push('Budget massimo');

  if (preferences.preferredCities && preferences.preferredCities.length > 0) filled++;
  else missing.push('Città preferite');

  if (preferences.minRooms || preferences.maxRooms) filled++;
  else missing.push('Numero di stanze');

  // Furnished e' sempre valorizzato (default 'indifferent'), conta come compilato
  if (preferences.furnished) filled++;
  else missing.push('Preferenza arredamento');

  const score = Math.round((filled / total) * 100);
  return buildSection('preferences', score, missing);
}

function calculateReferencesScore(references: TenantReference[]): CVSectionScore {
  const missing: string[] = [];

  if (references.length >= 2) {
    return buildSection('references', 100, []);
  }

  if (references.length === 1) {
    return buildSection('references', 60, ['Aggiungi un\'altra referenza per un profilo più forte']);
  }

  missing.push('Richiedi una referenza a un precedente proprietario');
  return buildSection('references', 0, missing);
}

// ============================================================
// Calcolo Reliability Score
// ============================================================

/**
 * Calcola il punteggio di affidabilità dell'inquilino (0-100)
 * Basato su:
 * - Completezza profilo (30%)
 * - Stabilità lavorativa (25%)
 * - Documenti verificati (20%)
 * - Referenze positive (15%)
 * - Video presentazione (10%)
 */
export function calculateReliabilityScore(
  profile: TenantProfile,
  documents: TenantDocument[],
  references: TenantReference[],
  cvCompleteness: number,
): number {
  let score = 0;

  // Completezza profilo (30%)
  score += (cvCompleteness / 100) * 30;

  // Stabilità lavorativa (25%)
  const employmentScores: Record<string, number> = {
    permanent: 100,
    retired: 95,
    freelance: 70,
    fixed_term: 60,
    student: 50,
    internship: 30,
    unemployed: 10,
  };
  const empScore = employmentScores[profile.employmentType || ''] || 40;
  score += (empScore / 100) * 25;

  // Documenti verificati (20%)
  const verifiedDocs = documents.filter(d => d.status === 'verified').length;
  const docScore = Math.min(100, verifiedDocs * 33);
  score += (docScore / 100) * 20;

  // Referenze (15%)
  const verifiedRefs = references.filter(r => r.isVerified).length;
  const refScore = Math.min(100, verifiedRefs * 50);
  score += (refScore / 100) * 15;

  // Video (10%)
  if (profile.hasVideo) {
    score += 10;
  }

  return Math.round(Math.max(0, Math.min(100, score)));
}
