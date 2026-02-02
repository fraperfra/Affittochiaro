/**
 * Mock Tenant Service
 * Per testing locale quando il backend non è disponibile
 */

import { TenantDocument, DocumentType, DOCUMENT_TYPE_LABELS } from '@/types/tenant';
import { generateFileId, formatFileSize } from '@/utils/fileValidation';

// Controlla se usare mock (da env o fallback automatico)
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

// Simula delay di rete
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simula progress di upload
type ProgressCallback = (progress: number) => void;

async function simulateUploadProgress(onProgress?: ProgressCallback): Promise<void> {
  const steps = [10, 25, 45, 65, 80, 95, 100];
  for (const progress of steps) {
    await delay(200 + Math.random() * 300);
    onProgress?.(progress);
  }
}

// Storage locale per documenti mock
let mockDocuments: TenantDocument[] = [
  {
    id: 'doc_1',
    type: 'identity_card',
    name: 'Carta_Identità.pdf',
    file: {
      id: 'file_1',
      name: 'Carta_Identità.pdf',
      type: 'application/pdf',
      size: 1258291,
      url: '/mock/documents/identity.pdf',
      uploadedAt: new Date('2024-01-15'),
    },
    status: 'verified',
    uploadedAt: new Date('2024-01-15'),
    verifiedAt: new Date('2024-01-16'),
  },
  {
    id: 'doc_2',
    type: 'fiscal_code',
    name: 'Codice_Fiscale.png',
    file: {
      id: 'file_2',
      name: 'Codice_Fiscale.png',
      type: 'image/png',
      size: 845000,
      url: '/mock/documents/fiscal.png',
      uploadedAt: new Date('2024-01-15'),
    },
    status: 'verified',
    uploadedAt: new Date('2024-01-15'),
    verifiedAt: new Date('2024-01-17'),
  },
  {
    id: 'doc_3',
    type: 'payslip',
    name: 'Busta_Paga_Gennaio.pdf',
    file: {
      id: 'file_3',
      name: 'Busta_Paga_Gennaio.pdf',
      type: 'application/pdf',
      size: 2150000,
      url: '/mock/documents/payslip.pdf',
      uploadedAt: new Date('2024-02-01'),
    },
    status: 'pending',
    uploadedAt: new Date('2024-02-01'),
  },
];

// Storage locale per video mock
let mockVideo: {
  url: string;
  duration: number;
  uploadedAt: Date;
} | null = null;

// Storage locale per avatar mock
let mockAvatar: string | null = null;

// Storage locale per profilo mock
let mockProfile = {
  id: 'tenant_1',
  firstName: 'Mario',
  lastName: 'Rossi',
  email: 'mario.rossi@example.com',
  phone: '+39 333 1234567',
  bio: 'Professionista serio e affidabile, cerco appartamento in zona centrale.',
  occupation: 'Software Developer',
  employmentType: 'permanent' as const,
  employer: 'Tech Company Srl',
  annualIncome: 45000,
  incomeVisible: true,
  currentCity: 'Milano',
  isVerified: true,
  hasVideo: false,
  profileCompleteness: 75,
  maxBudget: 1200,
  preferredCities: ['Milano', 'Roma'],
  hasPets: false,
};

/**
 * Mock API per documenti
 */
export const mockDocumentsApi = {
  async getDocuments(): Promise<TenantDocument[]> {
    await delay(500);
    return [...mockDocuments];
  },

  async uploadDocument(
    type: DocumentType,
    file: File,
    onProgress?: ProgressCallback
  ): Promise<TenantDocument> {
    // Simula upload con progress
    await simulateUploadProgress(onProgress);

    const newDoc: TenantDocument = {
      id: generateFileId(),
      type,
      name: file.name,
      file: {
        id: generateFileId(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedAt: new Date(),
      },
      status: 'pending',
      uploadedAt: new Date(),
    };

    mockDocuments = [...mockDocuments, newDoc];
    return newDoc;
  },

  async deleteDocument(documentId: string): Promise<void> {
    await delay(300);
    mockDocuments = mockDocuments.filter(doc => doc.id !== documentId);
  },
};

/**
 * Mock API per video
 */
export const mockVideoApi = {
  async getVideoUploadUrl(): Promise<{ uploadUrl: string; videoUrl: string }> {
    await delay(300);
    const videoId = generateFileId();
    return {
      uploadUrl: `mock://upload/${videoId}`,
      videoUrl: `mock://video/${videoId}`,
    };
  },

  async uploadVideo(
    file: File | Blob,
    onProgress?: ProgressCallback
  ): Promise<string> {
    await simulateUploadProgress(onProgress);
    return URL.createObjectURL(file);
  },

  async confirmVideoUpload(videoUrl: string, duration: number): Promise<void> {
    await delay(300);
    mockVideo = {
      url: videoUrl,
      duration,
      uploadedAt: new Date(),
    };
    mockProfile.hasVideo = true;
  },

  async deleteVideo(): Promise<void> {
    await delay(300);
    mockVideo = null;
    mockProfile.hasVideo = false;
  },

  getVideo() {
    return mockVideo;
  },
};

/**
 * Mock API per avatar
 */
export const mockAvatarApi = {
  async uploadAvatar(
    file: File | Blob,
    onProgress?: ProgressCallback
  ): Promise<string> {
    await simulateUploadProgress(onProgress);
    mockAvatar = URL.createObjectURL(file);
    return mockAvatar;
  },

  async deleteAvatar(): Promise<void> {
    await delay(300);
    mockAvatar = null;
  },

  getAvatar() {
    return mockAvatar;
  },
};

/**
 * Mock API per profilo
 */
export const mockProfileApi = {
  async getProfile() {
    await delay(300);
    return { ...mockProfile, avatarUrl: mockAvatar, video: mockVideo };
  },

  async updateProfile(data: Record<string, any>) {
    await delay(500);
    mockProfile = { ...mockProfile, ...data };
    return { ...mockProfile, avatarUrl: mockAvatar, video: mockVideo };
  },
};

/**
 * Servizio unificato che sceglie tra mock e reale
 */
export function createTenantService(useMock: boolean = USE_MOCK_API) {
  if (useMock) {
    console.log('[MockService] Using mock tenant service');
    return {
      documents: mockDocumentsApi,
      video: mockVideoApi,
      avatar: mockAvatarApi,
      profile: mockProfileApi,
    };
  }

  // Se non mock, ritorna null e lascia usare i servizi reali
  return null;
}

// Export per test
export const resetMockData = () => {
  mockDocuments = [];
  mockVideo = null;
  mockAvatar = null;
};
