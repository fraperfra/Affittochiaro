/**
 * Mock Authentication Service
 * Per testing locale senza backend AWS
 */

import { User, TenantUser, AgencyUser, AdminUser, UserRole } from '@/types';

// Utenti mock predefiniti
export const MOCK_USERS = {
  admin: {
    id: 'admin_001',
    email: 'admin@affittochiaro.it',
    password: 'admin123',
    role: 'admin' as UserRole,
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
    permissions: ['full_access'],
  } as AdminUser,

  tenant: {
    id: 'tenant_001',
    email: 'mario.rossi@example.com',
    password: 'tenant123',
    role: 'tenant' as UserRole,
    status: 'active',
    emailVerified: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    lastLogin: new Date(),
    profile: {
      firstName: 'Mario',
      lastName: 'Rossi',
      phone: '+39 333 1234567',
      avatarUrl: undefined,
      dateOfBirth: new Date('1992-05-15'),
      bio: 'Professionista serio e affidabile, cerco appartamento in zona centrale. Lavoro nel settore tech da oltre 5 anni e sono alla ricerca di un bilocale luminoso.',
      occupation: 'Software Developer',
      employmentType: 'permanent' as const,
      employer: 'Tech Company Srl',
      annualIncome: 45000,
      incomeVisible: true,
      employmentStartDate: new Date('2019-03-01'),
      city: 'Milano',
      currentProvince: 'MI',
      isVerified: true,
      hasVideo: false,
      profileCompleteness: 68,
      rating: 4.5,
      reviewsCount: 3,
      profileViews: 127,
      applicationsSent: 8,
      matchesReceived: 12,
      availableFrom: new Date('2025-03-01'),
    },
  } as TenantUser,

  agency: {
    id: 'agency_001',
    email: 'info@immobiliare-rossi.it',
    password: 'agency123',
    role: 'agency' as UserRole,
    status: 'active',
    emailVerified: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date(),
    lastLogin: new Date(),
    agency: {
      id: 'agency-profile-001',
      name: 'Immobiliare Rossi',
      logoUrl: undefined,
      description: 'Agenzia immobiliare di Milano specializzata in affitti residenziali.',
      vatNumber: 'IT12345678901',
      phone: '+39 02 1234567',
      city: 'Milano',
      province: 'MI',
      website: 'https://immobiliare-rossi.it',
      isVerified: true,
      plan: 'professional',
      credits: 50,
      creditsUsedThisMonth: 12,
      listingsCount: 23,
      activeListingsCount: 18,
      tenantsUnlocked: 45,
      matchesCount: 89,
      rating: 4.7,
      reviewsCount: 28,
    },
  } as AgencyUser,
};

// Storage per sessione corrente
let currentSession: {
  user: User | null;
  token: string | null;
} = {
  user: null,
  token: null,
};

// Simula delay di rete
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock Authentication API
 */
export const mockAuthApi = {
  /**
   * Login con email e password
   */
  async login(email: string, password: string): Promise<User> {
    await delay(500); // Simula latenza

    // Cerca utente
    const users = Object.values(MOCK_USERS);
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      throw new Error('Utente non trovato');
    }

    // Verifica password (in mock, la password è nel campo nascosto)
    const mockUser = user as any;
    if (mockUser.password && mockUser.password !== password) {
      throw new Error('Password non corretta');
    }

    // Crea sessione
    const token = `mock_token_${Date.now()}`;
    currentSession = { user, token };

    // Salva in localStorage per persistenza
    localStorage.setItem('mock_auth_token', token);
    localStorage.setItem('mock_auth_user', JSON.stringify(user));

    console.log('[MockAuth] Login successful:', user.email, user.role);
    return user;
  },

  /**
   * Login rapido per ruolo (per testing)
   */
  async quickLogin(role: 'admin' | 'tenant' | 'agency'): Promise<User> {
    await delay(300);

    const user = MOCK_USERS[role];
    const token = `mock_token_${Date.now()}`;
    currentSession = { user, token };

    localStorage.setItem('mock_auth_token', token);
    localStorage.setItem('mock_auth_user', JSON.stringify(user));

    console.log('[MockAuth] Quick login:', role);
    return user;
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await delay(200);
    currentSession = { user: null, token: null };
    localStorage.removeItem('mock_auth_token');
    localStorage.removeItem('mock_auth_user');
    console.log('[MockAuth] Logged out');
  },

  /**
   * Recupera sessione corrente
   */
  async getCurrentSession(): Promise<User | null> {
    // Prima controlla memoria
    if (currentSession.user) {
      return currentSession.user;
    }

    // Poi controlla localStorage
    const savedToken = localStorage.getItem('mock_auth_token');
    const savedUser = localStorage.getItem('mock_auth_user');

    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser) as User;
        currentSession = { user, token: savedToken };
        return user;
      } catch {
        // Dati corrotti, pulisci
        localStorage.removeItem('mock_auth_token');
        localStorage.removeItem('mock_auth_user');
      }
    }

    return null;
  },

  /**
   * Registrazione (crea nuovo utente mock)
   */
  async register(data: {
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
  }): Promise<User> {
    await delay(800);

    // Verifica email non già usata
    const existingUser = Object.values(MOCK_USERS).find(
      u => u.email.toLowerCase() === data.email.toLowerCase()
    );

    if (existingUser) {
      throw new Error('Email già registrata');
    }

    // Crea nuovo utente
    let newUser: User;

    if (data.role === 'tenant') {
      newUser = {
        id: `tenant_${Date.now()}`,
        email: data.email,
        role: 'tenant',
        createdAt: new Date(),
        lastLogin: new Date(),
        profile: {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone,
          city: data.city,
          isVerified: false,
          hasVideo: false,
          profileCompleteness: 20,
        },
      } as TenantUser;
    } else {
      newUser = {
        id: `agency_${Date.now()}`,
        email: data.email,
        role: 'agency',
        createdAt: new Date(),
        lastLogin: new Date(),
        agency: {
          name: data.agencyName || '',
          vatNumber: data.vatNumber || '',
          phone: data.phone || '',
          city: data.city || '',
          isVerified: false,
          plan: 'free',
          credits: 5,
        },
      } as AgencyUser;
    }

    console.log('[MockAuth] Registered new user:', newUser.email);
    return newUser;
  },

  /**
   * Aggiorna profilo utente corrente
   */
  async updateProfile(updates: Partial<any>): Promise<User> {
    await delay(400);

    if (!currentSession.user) {
      throw new Error('Non autenticato');
    }

    // Aggiorna profilo in base al ruolo
    if (currentSession.user.role === 'tenant') {
      const tenantUser = currentSession.user as TenantUser;
      tenantUser.profile = { ...tenantUser.profile, ...updates };
    } else if (currentSession.user.role === 'agency') {
      const agencyUser = currentSession.user as AgencyUser;
      agencyUser.agency = { ...agencyUser.agency, ...updates };
    }

    // Salva aggiornamenti
    localStorage.setItem('mock_auth_user', JSON.stringify(currentSession.user));

    return currentSession.user;
  },

  /**
   * Refresh token
   */
  async refreshToken(token: string): Promise<string> {
    await delay(200);
    // In mock, just return a new token if session exists
    if (!currentSession.user) {
      throw new Error('Sessione scaduta');
    }
    const newToken = `mock_token_${Date.now()}`;
    currentSession.token = newToken;
    localStorage.setItem('mock_auth_token', newToken);
    console.log('[MockAuth] Token refreshed');
    return newToken;
  },

  /**
   * Conferma email con codice OTP
   */
  async confirmEmail(email: string, code: string): Promise<void> {
    await delay(500);
    console.log('[MockAuth] Email confirmed:', email, 'code:', code);
  },

  /**
   * Reinvia codice di verifica
   */
  async resendCode(email: string): Promise<void> {
    await delay(500);
    console.log('[MockAuth] Code resent to:', email);
  },

  /**
   * Richiedi reset password
   */
  async resetPassword(email: string): Promise<void> {
    await delay(500);
    const existingUser = Object.values(MOCK_USERS).find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!existingUser) {
      throw new Error('Email non trovata');
    }
    console.log('[MockAuth] Password reset requested for:', email);
  },

  /**
   * Conferma reset password con codice
   */
  async confirmResetPassword(email: string, code: string, newPassword: string): Promise<void> {
    await delay(500);
    console.log('[MockAuth] Password reset confirmed for:', email);
  },

  /**
   * Verifica se è in modalità mock
   */
  isMockMode(): boolean {
    return true;
  },
};

export default mockAuthApi;
