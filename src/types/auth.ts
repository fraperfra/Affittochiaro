import { UserRole } from './common';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
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
  avatar?: string;
  dateOfBirth?: Date;
  bio?: string;
  // Employment
  occupation?: string;
  employmentType?: string;
  employer?: string;
  annualIncome?: number;
  incomeVisible?: boolean;
  // Location
  city?: string;
  // Verification
  isVerified: boolean;
  hasVideo: boolean;
  videoUrl?: string;
  profileCompleteness: number;
  // Stats
  profileViews?: number;
  applicationsSent?: number;
  availableFrom?: string;
}

export interface AgencyProfile {
  name: string;
  logo?: string;
  vatNumber: string;
  phone: string;
  city: string;
  website?: string;
  isVerified: boolean;
  plan: AgencyPlan;
  credits: number;
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
