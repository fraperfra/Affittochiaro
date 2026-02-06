/**
 * Auth Store - Zustand store per autenticazione (modalità demo)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';
import { authService } from '../services';

interface PendingConfirmation {
  email: string;
  userId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  pendingConfirmation: PendingConfirmation | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  quickLogin: (role: 'admin' | 'tenant' | 'agency') => Promise<void>;
  register: (data: {
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
  }) => Promise<void>;
  confirmEmail: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmResetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  logout: () => void;
  checkSession: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export type { AuthState };

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      pendingConfirmation: null,

      // Quick login per testing
      quickLogin: async (role: 'admin' | 'tenant' | 'agency') => {
        set({ isLoading: true, error: null });

        try {
          const user = await authService.quickLogin(role);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          console.log('[AuthStore] Quick login as:', role);
        } catch (error: any) {
          set({
            error: error.message || 'Errore durante il login',
            isLoading: false,
          });
          throw error;
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const user = await authService.login(email, password);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Errore durante il login',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });

        try {
          const user = await authService.register(data);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            pendingConfirmation: { email: data.email, userId: user.id },
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
          await authService.confirmEmail(email, code);
          set({ isLoading: false, pendingConfirmation: null });
        } catch (error: any) {
          set({ error: error.message || 'Codice non valido', isLoading: false });
          throw error;
        }
      },

      resendCode: async (email: string) => {
        try {
          await authService.resendCode(email);
        } catch (error: any) {
          set({ error: error.message || 'Errore invio codice' });
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await authService.resetPassword(email);
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Errore reset password', isLoading: false });
          throw error;
        }
      },

      confirmResetPassword: async (email: string, code: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          await authService.confirmResetPassword(email, code, newPassword);
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Errore conferma reset', isLoading: false });
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkSession: async () => {
        try {
          const user = await authService.getCurrentSession();
          if (user) {
            set({
              user,
              isAuthenticated: true,
            });
            return;
          }
          set({
            user: null,
            isAuthenticated: false,
          });
        } catch {
          set({
            user: null,
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
    }),
    {
      name: 'affittochiaro-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
