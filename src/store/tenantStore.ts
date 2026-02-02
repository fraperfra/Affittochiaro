import { create } from 'zustand';
import { Tenant, TenantFilters, TenantStats, Pagination } from '../types';

interface TenantState {
  // Data
  tenants: Tenant[];
  currentTenant: Tenant | null;
  stats: TenantStats | null;

  // UI State
  filters: TenantFilters;
  pagination: Pagination;
  isLoading: boolean;
  error: string | null;

  // Selected tenants (for bulk actions in admin)
  selectedTenantIds: string[];

  // Actions
  setTenants: (tenants: Tenant[]) => void;
  setCurrentTenant: (tenant: Tenant | null) => void;
  setStats: (stats: TenantStats) => void;
  setFilters: (filters: Partial<TenantFilters>) => void;
  resetFilters: () => void;
  setPagination: (pagination: Partial<Pagination>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleTenantSelection: (tenantId: string) => void;
  selectAllTenants: () => void;
  clearSelection: () => void;
  updateTenant: (tenantId: string, updates: Partial<Tenant>) => void;
}

const initialFilters: TenantFilters = {};

const initialPagination: Pagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
};

export const useTenantStore = create<TenantState>((set, get) => ({
  tenants: [],
  currentTenant: null,
  stats: null,
  filters: initialFilters,
  pagination: initialPagination,
  isLoading: false,
  error: null,
  selectedTenantIds: [],

  setTenants: (tenants) => {
    set({ tenants });
  },

  setCurrentTenant: (currentTenant) => {
    set({ currentTenant });
  },

  setStats: (stats) => {
    set({ stats });
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

  toggleTenantSelection: (tenantId) => {
    set((state) => {
      const isSelected = state.selectedTenantIds.includes(tenantId);
      return {
        selectedTenantIds: isSelected
          ? state.selectedTenantIds.filter((id) => id !== tenantId)
          : [...state.selectedTenantIds, tenantId],
      };
    });
  },

  selectAllTenants: () => {
    const { tenants } = get();
    set({ selectedTenantIds: tenants.map((t) => t.id) });
  },

  clearSelection: () => {
    set({ selectedTenantIds: [] });
  },

  updateTenant: (tenantId, updates) => {
    set((state) => ({
      tenants: state.tenants.map((tenant) =>
        tenant.id === tenantId ? { ...tenant, ...updates } : tenant
      ),
      currentTenant:
        state.currentTenant?.id === tenantId
          ? { ...state.currentTenant, ...updates }
          : state.currentTenant,
    }));
  },
}));
