import { User } from '@/types';

/**
 * Interfaccia Auth Service
 * Implementata da mockAuthService (dev) e cognitoAuthService (prod)
 */
export interface IAuthService {
  login(email: string, password: string): Promise<User>;
  quickLogin(role: 'admin' | 'tenant' | 'agency'): Promise<User>;
  logout(): Promise<void>;
  getCurrentSession(): Promise<User | null>;
  register(data: RegisterData): Promise<User>;
  updateProfile(updates: Partial<any>): Promise<User>;
  refreshToken(token: string): Promise<string>;
  confirmEmail(email: string, code: string): Promise<void>;
  resendCode(email: string): Promise<void>;
  resetPassword(email: string): Promise<void>;
  confirmResetPassword(email: string, code: string, newPassword: string): Promise<void>;
  isMockMode(): boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  role: 'tenant' | 'agency';
  firstName?: string;
  lastName?: string;
  agencyName?: string;
  vatNumber?: string;
  phone?: string;
  city?: string;
  occupation?: string;
}

export interface PendingConfirmation {
  email: string;
  userId?: string;
}
