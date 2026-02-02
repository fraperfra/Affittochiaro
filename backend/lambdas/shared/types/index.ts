// ========== ENUMS ==========

export type UserRole = 'tenant' | 'agency' | 'admin';
export type UserStatus = 'pending' | 'active' | 'inactive' | 'suspended';
export type EmploymentType = 'permanent' | 'fixed_term' | 'freelance' | 'internship' | 'student' | 'retired' | 'unemployed';
export type DocumentType = 'identity_card' | 'fiscal_code' | 'payslip' | 'employment_contract' | 'bank_statement' | 'tax_return' | 'guarantee' | 'reference_letter' | 'other';
export type DocumentStatus = 'pending' | 'verified' | 'rejected';
export type AgencyPlan = 'free' | 'base' | 'professional' | 'enterprise';
export type PropertyType = 'apartment' | 'studio' | 'loft' | 'villa' | 'house' | 'room' | 'office' | 'commercial';
export type ListingStatus = 'draft' | 'pending_review' | 'active' | 'paused' | 'rented' | 'expired' | 'rejected';
export type ApplicationStatus = 'pending' | 'viewed' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';
export type CreditTransactionType = 'purchase' | 'usage' | 'bonus' | 'refund' | 'subscription';
export type NotificationType =
  | 'profile_view'
  | 'new_match'
  | 'application_received'
  | 'application_accepted'
  | 'application_rejected'
  | 'document_verified'
  | 'document_rejected'
  | 'credit_low'
  | 'plan_upgrade'
  | 'welcome'
  | 'system';

// ========== ENTITIES ==========

export interface User {
  id: string;
  cognitoSub: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phone?: string;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface TenantProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  dateOfBirth?: Date;
  bio?: string;

  // Employment
  occupation?: string;
  employmentType?: EmploymentType;
  employer?: string;
  annualIncome?: number;
  incomeVisible: boolean;
  employmentStartDate?: Date;

  // Verification
  isVerified: boolean;
  verifiedAt?: Date;
  hasVideo: boolean;
  videoUrl?: string;
  videoDuration?: number;
  videoUploadedAt?: Date;

  // Profile metrics
  profileCompleteness: number;
  rating?: number;
  reviewsCount: number;

  // Current location
  currentCity?: string;
  currentStreet?: string;
  currentProvince?: string;
  currentPostalCode?: string;

  // Status
  availableFrom?: Date;
  profileViews: number;
  applicationsSent: number;
  matchesReceived: number;

  createdAt: Date;
  updatedAt: Date;
  lastActive?: Date;
}

export interface TenantPreferences {
  id: string;
  tenantId: string;
  maxBudget?: number;
  minRooms?: number;
  maxRooms?: number;
  preferredCities: string[];
  hasPets: boolean;
  petType?: string;
  furnished: 'yes' | 'no' | 'indifferent';
  smokingAllowed?: boolean;
  parkingRequired?: boolean;
  availableFrom?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantDocument {
  id: string;
  tenantId: string;
  type: DocumentType;
  name: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  status: DocumentStatus;
  rejectionReason?: string;
  uploadedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
}

export interface AgencyProfile {
  id: string;
  userId: string;
  name: string;
  logoUrl?: string;
  description?: string;

  // Business info
  vatNumber: string;
  phone: string;
  website?: string;

  // Address
  street?: string;
  city: string;
  province?: string;
  postalCode?: string;

  // Subscription
  plan: AgencyPlan;
  credits: number;
  creditsUsedThisMonth: number;
  planStartDate?: Date;
  planExpiresAt?: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;

  // Stats
  listingsCount: number;
  activeListingsCount: number;
  tenantsUnlocked: number;
  matchesCount: number;

  // Verification
  isVerified: boolean;
  verifiedAt?: Date;
  rating?: number;
  reviewsCount: number;

  // Status
  status: string;
  createdAt: Date;
  updatedAt: Date;
  lastActive?: Date;
}

export interface Listing {
  id: string;
  agencyId: string;
  externalId?: string;
  externalSource?: 'immobiliare_it' | 'casa_it' | 'native';

  // Basic info
  title: string;
  description: string;
  propertyType: PropertyType;

  // Location
  street?: string;
  city: string;
  province?: string;
  postalCode?: string;
  zone?: string;
  latitude?: number;
  longitude?: number;

  // Details
  price: number;
  expenses?: number;
  deposit?: number;
  rooms: number;
  bathrooms: number;
  squareMeters: number;
  floor?: number;
  totalFloors?: number;

  // Features
  features: string[];
  furnished: 'yes' | 'no' | 'partial';
  heatingType?: string;
  energyClass?: string;

  // Availability
  availableFrom?: Date;
  minContractDuration?: number;

  // Preferences
  petsAllowed: boolean;
  smokingAllowed: boolean;
  studentsAllowed: boolean;
  couplesAllowed: boolean;

  // Stats
  views: number;
  applicationsCount: number;
  savedCount: number;

  // Status
  status: ListingStatus;
  isHighlighted: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  expiresAt?: Date;
  scrapedAt?: Date;

  // Relations (populated)
  images?: ListingImage[];
  agency?: AgencyProfile;
}

export interface ListingImage {
  id: string;
  listingId: string;
  url: string;
  thumbnailUrl?: string;
  position: number;
  isPrimary: boolean;
  createdAt: Date;
}

export interface Application {
  id: string;
  listingId: string;
  tenantId: string;
  message?: string;
  status: ApplicationStatus;
  matchScore?: number;
  createdAt: Date;
  updatedAt: Date;
  respondedAt?: Date;

  // Relations (populated)
  tenant?: TenantProfile;
  listing?: Listing;
}

export interface CreditTransaction {
  id: string;
  agencyId: string;
  type: CreditTransactionType;
  amount: number;
  balanceAfter: number;
  description?: string;
  relatedTenantId?: string;
  stripePaymentId?: string;
  createdAt: Date;
}

export interface UnlockedTenant {
  id: string;
  agencyId: string;
  tenantId: string;
  creditsCost: number;
  unlockedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata: Record<string, any>;
  isRead: boolean;
  readAt?: Date;
  emailSent: boolean;
  emailSentAt?: Date;
  whatsappSent: boolean;
  whatsappSentAt?: Date;
  pushSent: boolean;
  pushSentAt?: Date;
  createdAt: Date;
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  emailProfileViews: boolean;
  emailNewMatches: boolean;
  emailApplications: boolean;
  emailDocuments: boolean;
  emailMarketing: boolean;
  pushProfileViews: boolean;
  pushNewMatches: boolean;
  pushApplications: boolean;
  pushDocuments: boolean;
  whatsappEnabled: boolean;
  whatsappNumber?: string;
  whatsappApplications: boolean;
  whatsappMatches: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchScore {
  id: string;
  tenantId: string;
  listingId: string;
  budgetScore: number;
  locationScore: number;
  incomeRatioScore: number;
  employmentScore: number;
  lifestyleScore: number;
  totalScore: number;
  weightsVersion: number;
  calculatedAt: Date;
}

// ========== API TYPES ==========

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface TenantFilters extends PaginationParams {
  city?: string;
  isVerified?: boolean;
  hasVideo?: boolean;
  employmentType?: EmploymentType;
  minIncome?: number;
  maxBudget?: number;
  hasPets?: boolean;
  sortBy?: 'profileCompleteness' | 'createdAt' | 'lastActive';
  sortOrder?: 'asc' | 'desc';
}

export interface ListingFilters extends PaginationParams {
  city?: string;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minRooms?: number;
  maxRooms?: number;
  petsAllowed?: boolean;
  furnished?: 'yes' | 'no' | 'partial';
  status?: ListingStatus;
  agencyId?: string;
  sortBy?: 'price' | 'createdAt' | 'views';
  sortOrder?: 'asc' | 'desc';
}

// ========== AUTH CONTEXT ==========

export interface AuthContext {
  userId: string;
  email: string;
  role: UserRole;
  profileId?: string;
}
