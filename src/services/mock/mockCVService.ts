/**
 * Mock CV Service
 * Dati e logica mock per il Curriculum dell'Inquilino
 */

import {
  TenantCV,
  CVRentalEntry,
  CVGuarantor,
  CVSettings,
  CVCompleteness,
  CVShareLink,
  CVPersonalInfo,
  CVEmploymentInfo,
  CVVideoInfo,
  DEFAULT_CV_SETTINGS,
} from '@/types/cv';
import { TenantReference, TenantDocument } from '@/types/tenant';
import { ICVService } from '../cv/ICVService';
import { calculateCVCompleteness, calculateReliabilityScore } from '@/utils/profileCompleteness';

// Simula delay di rete
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================
// MOCK DATA
// ============================================================

const mockRentalHistory: CVRentalEntry[] = [
  {
    id: 'rental_001',
    address: 'Via Torino 42',
    city: 'Milano',
    province: 'MI',
    startDate: new Date('2021-06-01'),
    endDate: new Date('2024-01-31'),
    isCurrent: false,
    monthlyRent: 850,
    landlordName: 'Giuseppe Bianchi',
    landlordContact: 'g.bianchi@email.com',
    reasonForLeaving: 'Trasferimento per lavoro',
    hasReference: true,
    referenceId: 'ref_001',
  },
  {
    id: 'rental_002',
    address: 'Corso Buenos Aires 15',
    city: 'Milano',
    province: 'MI',
    startDate: new Date('2019-09-01'),
    endDate: new Date('2021-05-31'),
    isCurrent: false,
    monthlyRent: 720,
    landlordName: 'Maria Verdi',
    reasonForLeaving: 'Fine contratto',
    hasReference: false,
  },
];

const mockGuarantors: CVGuarantor[] = [
  {
    id: 'guar_001',
    type: 'personal',
    fullName: 'Luigi Rossi',
    relationship: 'Padre',
    phone: '+39 333 9876543',
    email: 'luigi.rossi@email.com',
    occupation: 'Dirigente aziendale',
    annualIncome: 75000,
    documentUploaded: true,
    documentId: 'doc_guar_001',
    isVerified: false,
  },
];

const mockReferences: TenantReference[] = [
  {
    id: 'ref_001',
    landlordName: 'Giuseppe Bianchi',
    landlordEmail: 'g.bianchi@email.com',
    propertyAddress: 'Via Torino 42, Milano',
    rentalPeriod: {
      start: new Date('2021-06-01'),
      end: new Date('2024-01-31'),
    },
    rating: 5,
    comment: 'Inquilino esemplare. Sempre puntuale con i pagamenti, ha mantenuto l\'appartamento in ottime condizioni.',
    isVerified: true,
    createdAt: new Date('2024-02-15'),
  },
];

const mockDocuments: TenantDocument[] = [
  {
    id: 'doc_001',
    type: 'identity_card',
    name: 'Carta d\'identità.pdf',
    file: {
      id: 'file_001',
      name: 'carta_identita.pdf',
      type: 'application/pdf',
      size: 1250000,
      url: '#',
      uploadedAt: new Date('2024-02-01'),
    },
    status: 'verified',
    uploadedAt: new Date('2024-02-01'),
    verifiedAt: new Date('2024-02-03'),
  },
  {
    id: 'doc_002',
    type: 'payslip',
    name: 'Busta paga Gennaio 2024.pdf',
    file: {
      id: 'file_002',
      name: 'busta_paga_gen24.pdf',
      type: 'application/pdf',
      size: 890000,
      url: '#',
      uploadedAt: new Date('2024-02-10'),
    },
    status: 'verified',
    uploadedAt: new Date('2024-02-10'),
    verifiedAt: new Date('2024-02-12'),
  },
  {
    id: 'doc_003',
    type: 'employment_contract',
    name: 'Contratto di lavoro.pdf',
    file: {
      id: 'file_003',
      name: 'contratto.pdf',
      type: 'application/pdf',
      size: 2100000,
      url: '#',
      uploadedAt: new Date('2024-02-15'),
    },
    status: 'pending',
    uploadedAt: new Date('2024-02-15'),
  },
];

let mockSettings: CVSettings = { ...DEFAULT_CV_SETTINGS };

// Storage locale per modifiche
let storedRentalHistory = [...mockRentalHistory];
let storedGuarantors = [...mockGuarantors];
let storedReferences = [...mockReferences];

// ============================================================
// MOCK CV SERVICE
// ============================================================

export const mockCVService: ICVService = {
  async getCV(tenantId: string): Promise<TenantCV> {
    await delay(400);

    // Simula dati profilo da auth store
    const personalInfo: CVPersonalInfo = {
      firstName: 'Mario',
      lastName: 'Rossi',
      email: 'mario.rossi@example.com',
      phone: '+39 333 1234567',
      avatarUrl: undefined,
      dateOfBirth: new Date('1992-05-15'),
      bio: 'Professionista serio e affidabile, cerco appartamento in zona centrale. Lavoro nel settore tech da oltre 5 anni.',
      city: 'Milano',
      province: 'MI',
    };

    const employment: CVEmploymentInfo = {
      occupation: 'Software Developer',
      employmentType: 'permanent',
      employer: 'Tech Company Srl',
      annualIncome: 45000,
      incomeVisible: true,
      employmentStartDate: new Date('2019-03-01'),
      sector: 'Information Technology',
    };

    const mockProfile = {
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      phone: personalInfo.phone,
      avatarUrl: personalInfo.avatarUrl,
      dateOfBirth: personalInfo.dateOfBirth,
      bio: personalInfo.bio,
      city: personalInfo.city,
      currentProvince: personalInfo.province,
      occupation: employment.occupation,
      employmentType: employment.employmentType as any,
      employer: employment.employer,
      annualIncome: employment.annualIncome,
      incomeVisible: employment.incomeVisible,
      employmentStartDate: employment.employmentStartDate,
      isVerified: true,
      hasVideo: false,
      profileCompleteness: 68,
      profileViews: 127,
      applicationsSent: 8,
      matchesReceived: 12,
    };

    const mockPrefs = {
      maxBudget: 1200,
      minRooms: 2,
      maxRooms: 3,
      preferredCities: ['Milano', 'Monza'],
      hasPets: false,
      furnished: 'indifferent' as const,
      availableFrom: new Date('2025-03-01'),
    };

    const completeness = calculateCVCompleteness(
      mockProfile as any,
      mockPrefs as any,
      mockDocuments,
      storedReferences,
      storedRentalHistory,
    );

    const reliabilityScore = calculateReliabilityScore(
      mockProfile as any,
      mockDocuments,
      storedReferences,
      completeness.total,
    );

    return {
      id: `cv_${tenantId}`,
      tenantId,
      lastUpdated: new Date(),
      shareToken: mockSettings.isPublic ? 'share_abc123' : undefined,
      isPublic: mockSettings.isPublic,
      personalInfo,
      employment,
      rentalHistory: storedRentalHistory,
      guarantors: storedGuarantors,
      documents: mockDocuments,
      references: storedReferences,
      preferences: mockPrefs as any,
      videoPresentation: null,
      completeness,
      reliabilityScore,
    };
  },

  async getCVByShareToken(token: string): Promise<TenantCV | null> {
    await delay(300);
    if (token === 'share_abc123') {
      return this.getCV('tenant_001');
    }
    return null;
  },

  // Rental History
  async getRentalHistory(tenantId: string): Promise<CVRentalEntry[]> {
    await delay(300);
    return [...storedRentalHistory];
  },

  async addRentalEntry(tenantId: string, entry: Omit<CVRentalEntry, 'id'>): Promise<CVRentalEntry> {
    await delay(400);
    const newEntry: CVRentalEntry = { ...entry, id: `rental_${Date.now()}` };
    storedRentalHistory.push(newEntry);
    return newEntry;
  },

  async updateRentalEntry(tenantId: string, entryId: string, updates: Partial<CVRentalEntry>): Promise<CVRentalEntry> {
    await delay(300);
    const idx = storedRentalHistory.findIndex(e => e.id === entryId);
    if (idx === -1) throw new Error('Voce non trovata');
    storedRentalHistory[idx] = { ...storedRentalHistory[idx], ...updates };
    return storedRentalHistory[idx];
  },

  async deleteRentalEntry(tenantId: string, entryId: string): Promise<void> {
    await delay(300);
    storedRentalHistory = storedRentalHistory.filter(e => e.id !== entryId);
  },

  // Guarantors
  async getGuarantors(tenantId: string): Promise<CVGuarantor[]> {
    await delay(300);
    return [...storedGuarantors];
  },

  async addGuarantor(tenantId: string, guarantor: Omit<CVGuarantor, 'id' | 'isVerified'>): Promise<CVGuarantor> {
    await delay(400);
    const newGuarantor: CVGuarantor = { ...guarantor, id: `guar_${Date.now()}`, isVerified: false };
    storedGuarantors.push(newGuarantor);
    return newGuarantor;
  },

  async updateGuarantor(tenantId: string, guarantorId: string, updates: Partial<CVGuarantor>): Promise<CVGuarantor> {
    await delay(300);
    const idx = storedGuarantors.findIndex(g => g.id === guarantorId);
    if (idx === -1) throw new Error('Garante non trovato');
    storedGuarantors[idx] = { ...storedGuarantors[idx], ...updates };
    return storedGuarantors[idx];
  },

  async deleteGuarantor(tenantId: string, guarantorId: string): Promise<void> {
    await delay(300);
    storedGuarantors = storedGuarantors.filter(g => g.id !== guarantorId);
  },

  // References
  async getReferences(tenantId: string): Promise<TenantReference[]> {
    await delay(300);
    return [...storedReferences];
  },

  async addReference(tenantId: string, ref: Omit<TenantReference, 'id' | 'isVerified' | 'createdAt'>): Promise<TenantReference> {
    await delay(400);
    const newRef: TenantReference = {
      ...ref,
      id: `ref_${Date.now()}`,
      isVerified: false,
      createdAt: new Date(),
    };
    storedReferences.push(newRef);
    return newRef;
  },

  async deleteReference(tenantId: string, refId: string): Promise<void> {
    await delay(300);
    storedReferences = storedReferences.filter(r => r.id !== refId);
  },

  // Settings
  async getCVSettings(tenantId: string): Promise<CVSettings> {
    await delay(200);
    return { ...mockSettings };
  },

  async updateCVSettings(tenantId: string, settings: Partial<CVSettings>): Promise<CVSettings> {
    await delay(300);
    mockSettings = { ...mockSettings, ...settings };
    return { ...mockSettings };
  },

  // Share
  async generateShareLink(tenantId: string): Promise<CVShareLink> {
    await delay(400);
    const token = `share_${Date.now().toString(36)}`;
    mockSettings.shareToken = token;
    mockSettings.isPublic = true;
    return {
      url: `${window.location.origin}/cv/${token}`,
      token,
      viewCount: 0,
      createdAt: new Date(),
    };
  },

  async revokeShareLink(tenantId: string): Promise<void> {
    await delay(300);
    mockSettings.shareToken = null;
    mockSettings.isPublic = false;
  },

  // Completeness
  async calculateCompleteness(tenantId: string): Promise<CVCompleteness> {
    await delay(200);
    const cv = await this.getCV(tenantId);
    return cv.completeness;
  },
};

export default mockCVService;
