import {
  TenantCV,
  CVRentalEntry,
  CVGuarantor,
  CVSettings,
  CVCompleteness,
  CVShareLink,
} from '@/types';
import { TenantReference } from '@/types';

/**
 * Interfaccia CV Service
 * Implementata da mockCVService (dev) e cvApiService (prod)
 */
export interface ICVService {
  // CV completo
  getCV(tenantId: string): Promise<TenantCV>;
  getCVByShareToken(token: string): Promise<TenantCV | null>;

  // Rental history
  getRentalHistory(tenantId: string): Promise<CVRentalEntry[]>;
  addRentalEntry(tenantId: string, entry: Omit<CVRentalEntry, 'id'>): Promise<CVRentalEntry>;
  updateRentalEntry(tenantId: string, entryId: string, updates: Partial<CVRentalEntry>): Promise<CVRentalEntry>;
  deleteRentalEntry(tenantId: string, entryId: string): Promise<void>;

  // Guarantors
  getGuarantors(tenantId: string): Promise<CVGuarantor[]>;
  addGuarantor(tenantId: string, guarantor: Omit<CVGuarantor, 'id' | 'isVerified'>): Promise<CVGuarantor>;
  updateGuarantor(tenantId: string, guarantorId: string, updates: Partial<CVGuarantor>): Promise<CVGuarantor>;
  deleteGuarantor(tenantId: string, guarantorId: string): Promise<void>;

  // References
  getReferences(tenantId: string): Promise<TenantReference[]>;
  addReference(tenantId: string, ref: Omit<TenantReference, 'id' | 'isVerified' | 'createdAt'>): Promise<TenantReference>;
  deleteReference(tenantId: string, refId: string): Promise<void>;

  // Settings
  getCVSettings(tenantId: string): Promise<CVSettings>;
  updateCVSettings(tenantId: string, settings: Partial<CVSettings>): Promise<CVSettings>;

  // Share
  generateShareLink(tenantId: string): Promise<CVShareLink>;
  revokeShareLink(tenantId: string): Promise<void>;

  // Completeness
  calculateCompleteness(tenantId: string): Promise<CVCompleteness>;
}
