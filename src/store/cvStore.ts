/**
 * CV Store - Zustand store per il Curriculum dell'Inquilino
 */

import { create } from 'zustand';
import {
  TenantCV,
  CVRentalEntry,
  CVGuarantor,
  CVSettings,
  CVCompleteness,
  CVShareLink,
} from '@/types/cv';
import { TenantReference } from '@/types/tenant';
import { cvService } from '@/services';

interface CVState {
  // Data
  cv: TenantCV | null;
  settings: CVSettings | null;
  shareLink: CVShareLink | null;

  // UI State
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  activeSection: string | null;

  // Actions - CV
  loadCV: (tenantId: string) => Promise<void>;
  refreshCompleteness: (tenantId: string) => Promise<void>;

  // Actions - Rental History
  addRentalEntry: (tenantId: string, entry: Omit<CVRentalEntry, 'id'>) => Promise<void>;
  updateRentalEntry: (tenantId: string, entryId: string, updates: Partial<CVRentalEntry>) => Promise<void>;
  deleteRentalEntry: (tenantId: string, entryId: string) => Promise<void>;

  // Actions - Guarantors
  addGuarantor: (tenantId: string, guarantor: Omit<CVGuarantor, 'id' | 'isVerified'>) => Promise<void>;
  updateGuarantor: (tenantId: string, guarantorId: string, updates: Partial<CVGuarantor>) => Promise<void>;
  deleteGuarantor: (tenantId: string, guarantorId: string) => Promise<void>;

  // Actions - References
  addReference: (tenantId: string, ref: Omit<TenantReference, 'id' | 'isVerified' | 'createdAt'>) => Promise<void>;
  deleteReference: (tenantId: string, refId: string) => Promise<void>;

  // Actions - Settings & Share
  updateSettings: (tenantId: string, settings: Partial<CVSettings>) => Promise<void>;
  generateShareLink: (tenantId: string) => Promise<CVShareLink>;
  revokeShareLink: (tenantId: string) => Promise<void>;

  // UI Actions
  setActiveSection: (section: string | null) => void;
  clearError: () => void;
}

export const useCVStore = create<CVState>((set, get) => ({
  cv: null,
  settings: null,
  shareLink: null,
  isLoading: false,
  isSaving: false,
  error: null,
  activeSection: null,

  // ============================================================
  // CV
  // ============================================================

  loadCV: async (tenantId: string) => {
    set({ isLoading: true, error: null });
    try {
      const [cv, settings] = await Promise.all([
        cvService.getCV(tenantId),
        cvService.getCVSettings(tenantId),
      ]);
      set({ cv, settings, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Errore nel caricamento del CV', isLoading: false });
    }
  },

  refreshCompleteness: async (tenantId: string) => {
    try {
      const cv = await cvService.getCV(tenantId);
      set({ cv });
    } catch (error: any) {
      console.error('[CVStore] Errore refresh completeness:', error);
    }
  },

  // ============================================================
  // Rental History
  // ============================================================

  addRentalEntry: async (tenantId, entry) => {
    set({ isSaving: true, error: null });
    try {
      await cvService.addRentalEntry(tenantId, entry);
      // Ricarica CV per aggiornare completeness
      const cv = await cvService.getCV(tenantId);
      set({ cv, isSaving: false });
    } catch (error: any) {
      set({ error: error.message || 'Errore nel salvataggio', isSaving: false });
      throw error;
    }
  },

  updateRentalEntry: async (tenantId, entryId, updates) => {
    set({ isSaving: true, error: null });
    try {
      await cvService.updateRentalEntry(tenantId, entryId, updates);
      const cv = await cvService.getCV(tenantId);
      set({ cv, isSaving: false });
    } catch (error: any) {
      set({ error: error.message || 'Errore nell\'aggiornamento', isSaving: false });
      throw error;
    }
  },

  deleteRentalEntry: async (tenantId, entryId) => {
    set({ isSaving: true, error: null });
    try {
      await cvService.deleteRentalEntry(tenantId, entryId);
      const cv = await cvService.getCV(tenantId);
      set({ cv, isSaving: false });
    } catch (error: any) {
      set({ error: error.message || 'Errore nella cancellazione', isSaving: false });
      throw error;
    }
  },

  // ============================================================
  // Guarantors
  // ============================================================

  addGuarantor: async (tenantId, guarantor) => {
    set({ isSaving: true, error: null });
    try {
      await cvService.addGuarantor(tenantId, guarantor);
      const cv = await cvService.getCV(tenantId);
      set({ cv, isSaving: false });
    } catch (error: any) {
      set({ error: error.message || 'Errore nel salvataggio', isSaving: false });
      throw error;
    }
  },

  updateGuarantor: async (tenantId, guarantorId, updates) => {
    set({ isSaving: true, error: null });
    try {
      await cvService.updateGuarantor(tenantId, guarantorId, updates);
      const cv = await cvService.getCV(tenantId);
      set({ cv, isSaving: false });
    } catch (error: any) {
      set({ error: error.message || 'Errore nell\'aggiornamento', isSaving: false });
      throw error;
    }
  },

  deleteGuarantor: async (tenantId, guarantorId) => {
    set({ isSaving: true, error: null });
    try {
      await cvService.deleteGuarantor(tenantId, guarantorId);
      const cv = await cvService.getCV(tenantId);
      set({ cv, isSaving: false });
    } catch (error: any) {
      set({ error: error.message || 'Errore nella cancellazione', isSaving: false });
      throw error;
    }
  },

  // ============================================================
  // References
  // ============================================================

  addReference: async (tenantId, ref) => {
    set({ isSaving: true, error: null });
    try {
      await cvService.addReference(tenantId, ref);
      const cv = await cvService.getCV(tenantId);
      set({ cv, isSaving: false });
    } catch (error: any) {
      set({ error: error.message || 'Errore nel salvataggio', isSaving: false });
      throw error;
    }
  },

  deleteReference: async (tenantId, refId) => {
    set({ isSaving: true, error: null });
    try {
      await cvService.deleteReference(tenantId, refId);
      const cv = await cvService.getCV(tenantId);
      set({ cv, isSaving: false });
    } catch (error: any) {
      set({ error: error.message || 'Errore nella cancellazione', isSaving: false });
      throw error;
    }
  },

  // ============================================================
  // Settings & Share
  // ============================================================

  updateSettings: async (tenantId, settings) => {
    set({ isSaving: true, error: null });
    try {
      const updated = await cvService.updateCVSettings(tenantId, settings);
      set({ settings: updated, isSaving: false });
    } catch (error: any) {
      set({ error: error.message || 'Errore nel salvataggio impostazioni', isSaving: false });
      throw error;
    }
  },

  generateShareLink: async (tenantId) => {
    set({ isSaving: true, error: null });
    try {
      const link = await cvService.generateShareLink(tenantId);
      set({ shareLink: link, isSaving: false });
      return link;
    } catch (error: any) {
      set({ error: error.message || 'Errore nella generazione del link', isSaving: false });
      throw error;
    }
  },

  revokeShareLink: async (tenantId) => {
    set({ isSaving: true, error: null });
    try {
      await cvService.revokeShareLink(tenantId);
      set({ shareLink: null, isSaving: false });
    } catch (error: any) {
      set({ error: error.message || 'Errore nella revoca del link', isSaving: false });
      throw error;
    }
  },

  // UI
  setActiveSection: (section) => set({ activeSection: section }),
  clearError: () => set({ error: null }),
}));
