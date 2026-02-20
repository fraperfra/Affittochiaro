import { create } from 'zustand';
import { Agency, AgencyFilters, AgencyStats, CreditTransaction, UnlockedTenant, Pagination } from '../types';

export interface SavedTenant {
  tenantId: string;
  savedAt: Date;
  notes?: string;
}

interface AgencyState {
  // Data
  agencies: Agency[];
  currentAgency: Agency | null;
  stats: AgencyStats | null;
  unlockedTenants: UnlockedTenant[];
  savedTenants: SavedTenant[];
  creditTransactions: CreditTransaction[];

  // UI State
  filters: AgencyFilters;
  pagination: Pagination;
  isLoading: boolean;
  error: string | null;

  // Selected agencies (for admin)
  selectedAgencyIds: string[];

  // Actions
  setAgencies: (agencies: Agency[]) => void;
  setCurrentAgency: (agency: Agency | null) => void;
  setStats: (stats: AgencyStats) => void;
  setUnlockedTenants: (tenants: UnlockedTenant[]) => void;
  addUnlockedTenant: (tenant: UnlockedTenant) => void;
  setCreditTransactions: (transactions: CreditTransaction[]) => void;
  addCreditTransaction: (transaction: CreditTransaction) => void;
  setFilters: (filters: Partial<AgencyFilters>) => void;
  resetFilters: () => void;
  setPagination: (pagination: Partial<Pagination>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateCredits: (amount: number) => void;
  updateAgency: (agencyId: string, updates: Partial<Agency>) => void;
  toggleAgencySelection: (agencyId: string) => void;
  clearSelection: () => void;
  updateUnlockedTenantNote: (tenantId: string, note: string) => void;
  addSavedTenant: (tenantId: string) => void;
  removeSavedTenant: (tenantId: string) => void;
  updateSavedTenantNote: (tenantId: string, note: string) => void;
}

const initialFilters: AgencyFilters = {};

const initialPagination: Pagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
};

export const useAgencyStore = create<AgencyState>((set, get) => ({
  agencies: [],
  currentAgency: null,
  stats: null,
  unlockedTenants: [],
  savedTenants: [],
  creditTransactions: [],
  filters: initialFilters,
  pagination: initialPagination,
  isLoading: false,
  error: null,
  selectedAgencyIds: [],

  setAgencies: (agencies) => {
    set({ agencies });
  },

  setCurrentAgency: (currentAgency) => {
    set({ currentAgency });
  },

  setStats: (stats) => {
    set({ stats });
  },

  setUnlockedTenants: (unlockedTenants) => {
    set({ unlockedTenants });
  },

  addUnlockedTenant: (tenant) => {
    set((state) => ({
      unlockedTenants: [...state.unlockedTenants, tenant],
    }));
  },

  setCreditTransactions: (creditTransactions) => {
    set({ creditTransactions });
  },

  addCreditTransaction: (transaction) => {
    set((state) => ({
      creditTransactions: [transaction, ...state.creditTransactions],
    }));
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 },
    }));
  },

  resetFilters: () => {
    set({ filters: initialFilters, pagination: { ...initialPagination } });
  },

  setPagination: (pagination) => {
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    }));
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error });
  },

  updateCredits: (amount) => {
    set((state) => {
      if (!state.currentAgency) return state;
      return {
        currentAgency: {
          ...state.currentAgency,
          credits: state.currentAgency.credits + amount,
        },
      };
    });
  },

  updateAgency: (agencyId, updates) => {
    set((state) => ({
      agencies: state.agencies.map((agency) =>
        agency.id === agencyId ? { ...agency, ...updates } : agency
      ),
      currentAgency:
        state.currentAgency?.id === agencyId
          ? { ...state.currentAgency, ...updates }
          : state.currentAgency,
    }));
  },

  toggleAgencySelection: (agencyId) => {
    set((state) => {
      const isSelected = state.selectedAgencyIds.includes(agencyId);
      return {
        selectedAgencyIds: isSelected
          ? state.selectedAgencyIds.filter((id) => id !== agencyId)
          : [...state.selectedAgencyIds, agencyId],
      };
    });
  },

  clearSelection: () => {
    set({ selectedAgencyIds: [] });
  },

  updateUnlockedTenantNote: (tenantId, note) => {
    set((state) => ({
      unlockedTenants: state.unlockedTenants.map((t) =>
        t.tenantId === tenantId ? { ...t, notes: note } : t
      ),
    }));
  },

  addSavedTenant: (tenantId) => {
    set((state) => {
      if (state.savedTenants.some((t) => t.tenantId === tenantId)) return state;
      return { savedTenants: [...state.savedTenants, { tenantId, savedAt: new Date() }] };
    });
  },

  removeSavedTenant: (tenantId) => {
    set((state) => ({
      savedTenants: state.savedTenants.filter((t) => t.tenantId !== tenantId),
    }));
  },

  updateSavedTenantNote: (tenantId, note) => {
    set((state) => ({
      savedTenants: state.savedTenants.map((t) =>
        t.tenantId === tenantId ? { ...t, notes: note } : t
      ),
    }));
  },
}));
