/**
 * Auth Store - Zustand store per autenticazione con AWS Cognito
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole, TenantUser, AgencyUser, AdminUser } from '../types';
import {
  signIn,
  signUp,
  signOut,
  confirmSignUp,
  resendConfirmationCode,
  forgotPassword,
  confirmForgotPassword,
  getCurrentUser,
  getCurrentSession,
  isCognitoConfigured,
  SignUpParams,
  AuthUser,
} from '../services/cognito/auth';
import { tenantsApi } from '../services/api/tenants';

interface AuthState {
  user: User | null;
  cognitoUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  pendingConfirmation: { email: string; role: UserRole } | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (params: SignUpParams) => Promise<void>;
  confirmEmail: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  confirmResetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  checkSession: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearPendingConfirmation: () => void;
}

// Helper per creare user object dal profilo
async function fetchUserProfile(cognitoUser: AuthUser): Promise<User> {
  const baseUser = {
    id: cognitoUser.sub,
    email: cognitoUser.email,
    role: cognitoUser.role,
    createdAt: new Date(),
    lastLogin: new Date(),
  };

  try {
    if (cognitoUser.role === 'tenant') {
      const profile = await tenantsApi.getProfile();
      return {
        ...baseUser,
        role: 'tenant',
        profile: {
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          phone: undefined,
          avatar: profile.avatarUrl,
          dateOfBirth: undefined,
          bio: profile.bio,
          occupation: profile.occupation,
          employmentType: profile.employmentType,
          employer: profile.employer,
          annualIncome: profile.annualIncome,
          incomeVisible: profile.incomeVisible ?? true,
          city: profile.currentCity,
          isVerified: profile.isVerified,
          hasVideo: profile.hasVideo,
          videoUrl: profile.videoUrl,
          profileCompleteness: profile.profileCompleteness,
          profileViews: profile.profileViews,
          applicationsSent: profile.applicationsSent,
          availableFrom: profile.availableFrom,
        },
      } as TenantUser;
    } else if (cognitoUser.role === 'agency') {
      // TODO: Fetch agency profile
      return {
        ...baseUser,
        role: 'agency',
        agency: {
          name: 'Agenzia',
          logo: undefined,
          vatNumber: '',
          phone: '',
          city: '',
          website: '',
          isVerified: false,
          plan: 'free',
          credits: 0,
        },
      } as AgencyUser;
    } else {
      return {
        ...baseUser,
        role: 'admin',
        permissions: ['full_access'],
      } as AdminUser;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Ritorna user base se il profilo non è disponibile
    if (cognitoUser.role === 'tenant') {
      return {
        ...baseUser,
        role: 'tenant',
        profile: {
          firstName: '',
          lastName: '',
          phone: undefined,
          avatar: undefined,
          dateOfBirth: undefined,
          occupation: undefined,
          city: undefined,
          isVerified: false,
          hasVideo: false,
          profileCompleteness: 0,
        },
      } as TenantUser;
    } else if (cognitoUser.role === 'agency') {
      return {
        ...baseUser,
        role: 'agency',
        agency: {
          name: '',
          logo: undefined,
          vatNumber: '',
          phone: '',
          city: '',
          website: '',
          isVerified: false,
          plan: 'free',
          credits: 0,
        },
      } as AgencyUser;
    }
    return {
      ...baseUser,
      role: 'admin',
      permissions: ['full_access'],
    } as AdminUser;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      cognitoUser: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      pendingConfirmation: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          if (!isCognitoConfigured()) {
            throw new Error('Cognito non configurato. Contatta l\'amministratore.');
          }

          // Autenticazione con Cognito
          await signIn(email, password);

          // Ottieni info utente dal token
          const cognitoUser = await getCurrentUser();
          if (!cognitoUser) {
            throw new Error('Impossibile recuperare i dati utente');
          }

          // Fetch profilo completo
          const user = await fetchUserProfile(cognitoUser);

          set({
            user,
            cognitoUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Errore durante il login';

          // Gestisci caso utente non confermato
          if (error.code === 'UserNotConfirmedException') {
            set({
              pendingConfirmation: { email, role: 'tenant' },
              isLoading: false,
              error: errorMessage,
            });
          } else {
            set({
              error: errorMessage,
              isLoading: false,
            });
          }
          throw error;
        }
      },

      register: async (params: SignUpParams) => {
        set({ isLoading: true, error: null });

        try {
          if (!isCognitoConfigured()) {
            throw new Error('Cognito non configurato. Contatta l\'amministratore.');
          }

          await signUp(params);

          // Salva email per conferma
          set({
            pendingConfirmation: { email: params.email, role: params.role },
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Errore durante la registrazione',
            isLoading: false,
          });
          throw error;
        }
      },

      confirmEmail: async (email: string, code: string) => {
        set({ isLoading: true, error: null });

        try {
          await confirmSignUp(email, code);

          set({
            pendingConfirmation: null,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Codice non valido',
            isLoading: false,
          });
          throw error;
        }
      },

      resendCode: async (email: string) => {
        set({ isLoading: true, error: null });

        try {
          await resendConfirmationCode(email);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || 'Errore nell\'invio del codice',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        signOut();
        set({
          user: null,
          cognitoUser: null,
          isAuthenticated: false,
          error: null,
          pendingConfirmation: null,
        });
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });

        try {
          await forgotPassword(email);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || 'Errore nell\'invio email di reset',
            isLoading: false,
          });
          throw error;
        }
      },

      confirmResetPassword: async (email: string, code: string, newPassword: string) => {
        set({ isLoading: true, error: null });

        try {
          await confirmForgotPassword(email, code, newPassword);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || 'Errore nel reset password',
            isLoading: false,
          });
          throw error;
        }
      },

      checkSession: async () => {
        try {
          const session = await getCurrentSession();
          if (session) {
            const cognitoUser = await getCurrentUser();
            if (cognitoUser) {
              const user = await fetchUserProfile(cognitoUser);
              set({
                user,
                cognitoUser,
                isAuthenticated: true,
              });
              return;
            }
          }
          // Nessuna sessione valida
          set({
            user: null,
            cognitoUser: null,
            isAuthenticated: false,
          });
        } catch {
          set({
            user: null,
            cognitoUser: null,
            isAuthenticated: false,
          });
        }
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      clearPendingConfirmation: () => {
        set({ pendingConfirmation: null });
      },
    }),
    {
      name: 'affittochiaro-auth',
      partialize: (state) => ({
        user: state.user,
        cognitoUser: state.cognitoUser,
        isAuthenticated: state.isAuthenticated,
        pendingConfirmation: state.pendingConfirmation,
      }),
    }
  )
);
