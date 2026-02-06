import { TenantProfile } from './auth';
import { TenantPreferences, TenantDocument, TenantReference, EmploymentType } from './tenant';

// ============================================================
// CV INQUILINO - Tipi principali
// ============================================================

/**
 * CV completo dell'inquilino (vista aggregata)
 * Questo e' l'oggetto principale che rappresenta il "Curriculum dell'Inquilino"
 */
export interface TenantCV {
  id: string;
  tenantId: string;
  lastUpdated: Date;
  shareToken?: string;
  isPublic: boolean;

  // Sezioni del CV
  personalInfo: CVPersonalInfo;
  employment: CVEmploymentInfo;
  rentalHistory: CVRentalEntry[];
  guarantors: CVGuarantor[];
  documents: TenantDocument[];
  references: TenantReference[];
  preferences: TenantPreferences | null;
  videoPresentation: CVVideoInfo | null;

  // Score e metriche
  completeness: CVCompleteness;
  reliabilityScore: number; // 0-100, calcolato da tutti i fattori
}

// ============================================================
// SEZIONI CV
// ============================================================

export interface CVPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: Date;
  bio?: string;
  city?: string;
  province?: string;
  nationality?: string;
  fiscalCode?: string;
}

export interface CVEmploymentInfo {
  occupation?: string;
  employmentType?: EmploymentType;
  employer?: string;
  annualIncome?: number;
  incomeVisible: boolean;
  employmentStartDate?: Date;
  contractEndDate?: Date;
  sector?: string;
}

export interface CVRentalEntry {
  id: string;
  address: string;
  city: string;
  province?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  monthlyRent: number;
  landlordName?: string;
  landlordContact?: string;
  reasonForLeaving?: string;
  hasReference: boolean;
  referenceId?: string;
}

export interface CVGuarantor {
  id: string;
  type: GuarantorType;
  fullName: string;
  relationship: string;
  phone?: string;
  email?: string;
  occupation?: string;
  annualIncome?: number;
  documentUploaded: boolean;
  documentId?: string;
  isVerified: boolean;
}

export type GuarantorType = 'personal' | 'bank' | 'insurance' | 'employer';

export const GUARANTOR_TYPE_LABELS: Record<GuarantorType, string> = {
  personal: 'Garante personale',
  bank: 'Fideiussione bancaria',
  insurance: 'Fideiussione assicurativa',
  employer: 'Garanzia del datore di lavoro',
};

export interface CVVideoInfo {
  url: string;
  duration: number;
  uploadedAt: Date;
  thumbnailUrl?: string;
}

// ============================================================
// COMPLETEZZA CV
// ============================================================

export interface CVCompleteness {
  total: number; // 0-100
  sections: CVSectionScore[];
}

export interface CVSectionScore {
  id: CVSectionId;
  label: string;
  weight: number;     // Peso sulla completezza totale (somma = 100)
  score: number;       // 0-100 completezza di questa sezione
  weightedScore: number; // score * weight / 100
  missingFields: string[];
}

export type CVSectionId =
  | 'personal_info'
  | 'employment'
  | 'documents'
  | 'video'
  | 'rental_history'
  | 'preferences'
  | 'references';

export const CV_SECTION_LABELS: Record<CVSectionId, string> = {
  personal_info: 'Dati personali',
  employment: 'Situazione lavorativa',
  documents: 'Documenti',
  video: 'Video presentazione',
  rental_history: 'Storia abitativa',
  preferences: 'Preferenze ricerca',
  references: 'Referenze',
};

export const CV_SECTION_WEIGHTS: Record<CVSectionId, number> = {
  personal_info: 15,
  employment: 20,
  documents: 20,
  video: 15,
  rental_history: 10,
  preferences: 10,
  references: 10,
};

// ============================================================
// IMPOSTAZIONI CV
// ============================================================

export interface CVSettings {
  isPublic: boolean;
  shareToken: string | null;
  showIncome: boolean;
  showPhone: boolean;
  showEmail: boolean;
  showDocuments: boolean;
  showReferences: boolean;
  showRentalHistory: boolean;
}

export const DEFAULT_CV_SETTINGS: CVSettings = {
  isPublic: false,
  shareToken: null,
  showIncome: true,
  showPhone: true,
  showEmail: false,
  showDocuments: true,
  showReferences: true,
  showRentalHistory: true,
};

// ============================================================
// EMPLOYMENT TYPE LABELS (per display nel CV)
// ============================================================

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  permanent: 'Tempo indeterminato',
  fixed_term: 'Tempo determinato',
  freelance: 'Libero professionista',
  internship: 'Stage / Tirocinio',
  student: 'Studente',
  retired: 'Pensionato',
  unemployed: 'In cerca di occupazione',
};

// ============================================================
// UTILITY TYPES
// ============================================================

export interface CVGeneratePDFOptions {
  includePhoto: boolean;
  includeVideo: boolean;
  includeDocuments: boolean;
  includeReferences: boolean;
  includeRentalHistory: boolean;
  template: 'standard' | 'compact' | 'detailed';
}

export interface CVShareLink {
  url: string;
  token: string;
  expiresAt?: Date;
  viewCount: number;
  createdAt: Date;
}
