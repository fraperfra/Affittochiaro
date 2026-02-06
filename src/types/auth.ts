import { UserRole } from './common';
import { EmploymentType } from './tenant';

export interface User {
  id: string;
  cognitoSub?: string;
  email: string;
  role: UserRole;
  status?: 'pending' | 'active' | 'inactive' | 'suspended';
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

export interface TenantUser extends User {
  role: 'tenant';
  profile: TenantProfile;
}

export interface AgencyUser extends User {
  role: 'agency';
  agency: AgencyProfile;
}

export interface AdminUser extends User {
  role: 'admin';
  permissions: AdminPermission[];
}

export interface TenantProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: Date;
  bio?: string;

  // Employment (allineato con backend)
  occupation?: string;
  employmentType?: EmploymentType;
  employer?: string;
  annualIncome?: number;
  incomeVisible?: boolean;
  employmentStartDate?: Date;

  // Location
  city?: string;
  currentStreet?: string;
  currentProvince?: string;
  currentPostalCode?: string;

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
  reviewsCount?: number;

  // Stats
  profileViews?: number;
  applicationsSent?: number;
  matchesReceived?: number;
  availableFrom?: Date;

  // Timestamps
  lastActive?: Date;
}

export interface AgencyProfile {
  name: string;
  logoUrl?: string;
  description?: string;
  vatNumber: string;
  phone: string;
  city: string;
  province?: string;
  postalCode?: string;
  website?: string;
  isVerified: boolean;
  plan: AgencyPlan;
  credits: number;
  creditsUsedThisMonth?: number;
  planStartDate?: Date;
  planExpiresAt?: Date;

  // Stats
  listingsCount?: number;
  activeListingsCount?: number;
  tenantsUnlocked?: number;
  matchesCount?: number;
  rating?: number;
  reviewsCount?: number;
}

export type AgencyPlan = 'free' | 'base' | 'professional' | 'enterprise';

export type AdminPermission =
  | 'manage_tenants'
  | 'manage_agencies'
  | 'manage_listings'
  | 'manage_system'
  | 'view_analytics'
  | 'full_access';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterTenantData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
  occupation?: string;
  city?: string;
  acceptTerms: boolean;
}

export interface RegisterAgencyData {
  email: string;
  password: string;
  confirmPassword: string;
  agencyName: string;
  vatNumber: string;
  phone: string;
  city: string;
  website?: string;
  acceptTerms: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
