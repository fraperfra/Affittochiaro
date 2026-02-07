import { Address, Badge, DocumentStatus, FileUpload, Status } from './common';

export interface Tenant {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: Date;
  age?: number;
  bio?: string;
  nationality?: string;   // Codice ISO es: "IT", "RO", "MA"
  numPeople?: number;     // Persone totali che si trasferiscono
  hasChildren?: boolean;
  numChildren?: number;

  // Employment
  occupation?: string;
  employmentType?: EmploymentType;
  employer?: string;
  annualIncome?: number;
  incomeVisible: boolean;
  employmentStartDate?: Date;

  // Verification
  isVerified: boolean;
  hasVideo: boolean;
  videoUrl?: string;
  videoDuration?: number;
  videoUploadedAt?: Date;

  // Profile
  profileCompleteness: number;
  badges: Badge[];
  rating?: number;
  reviewsCount: number;

  // Location & Preferences
  currentCity?: string;
  currentAddress?: Address;
  preferences: TenantPreferences;

  // Documents
  documents: TenantDocument[];

  // References
  references: TenantReference[];

  // Stats
  profileViews: number;
  applicationsSent: number;
  matchesReceived: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActive?: Date;

  // Status
  status: Status;
  availableFrom?: Date;
}

export type EmploymentType =
  | 'permanent'      // Indeterminato
  | 'fixed_term'     // Determinato
  | 'freelance'      // Autonomo/Libero professionista
  | 'internship'     // Stage
  | 'student'        // Studente
  | 'retired'        // Pensionato
  | 'unemployed';    // Disoccupato

export interface TenantPreferences {
  maxBudget?: number;
  minRooms?: number;
  maxRooms?: number;
  preferredCities: string[];
  hasPets: boolean;
  petType?: string;
  furnished?: 'yes' | 'no' | 'indifferent';
  smokingAllowed?: boolean;
  parkingRequired?: boolean;
  availableFrom?: Date;
  desiredContractMonths?: number; // Durata contratto desiderata in mesi
  minBudget?: number;             // Budget minimo
  acceptsGroundFloor?: boolean;   // Accetta piano terra?
}

export interface TenantDocument {
  id: string;
  type: DocumentType;
  name: string;
  file: FileUpload;
  status: DocumentStatus;
  uploadedAt: Date;
  verifiedAt?: Date;
  rejectionReason?: string;
}

export type DocumentType =
  | 'identity_card'
  | 'fiscal_code'
  | 'payslip'
  | 'employment_contract'
  | 'bank_statement'
  | 'tax_return'
  | 'guarantee'
  | 'reference_letter'
  | 'other';

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  identity_card: 'Carta d\'Identità',
  fiscal_code: 'Codice Fiscale',
  payslip: 'Busta Paga',
  employment_contract: 'Contratto di Lavoro',
  bank_statement: 'Estratto Conto',
  tax_return: 'Dichiarazione dei Redditi',
  guarantee: 'Garanzia/Fideiussione',
  reference_letter: 'Lettera di Referenze',
  other: 'Altro',
};

export interface TenantReference {
  id: string;
  landlordName?: string;
  landlordEmail?: string;
  propertyAddress?: string;
  rentalPeriod?: {
    start: Date;
    end: Date;
  };
  rating: number;
  comment?: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface TenantFilters {
  search?: string;
  city?: string;
  minAge?: number;
  maxAge?: number;
  occupation?: string;
  employmentType?: EmploymentType;
  minIncome?: number;
  maxIncome?: number;
  isVerified?: boolean;
  hasVideo?: boolean;
  hasPets?: boolean;
  availableFrom?: Date;
  maxBudget?: number;
}

export interface TenantStats {
  totalTenants: number;
  verifiedTenants: number;
  tenantsWithVideo: number;
  newThisMonth: number;
  averageCompleteness: number;
  topCities: { city: string; count: number }[];
}
