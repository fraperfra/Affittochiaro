/**
 * Tenant API Service
 */

import { get, post, put, del, PaginatedResponse } from './client';

// Types
export interface TenantProfile {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  bio?: string;
  // Employment
  occupation?: string;
  employmentType?: string;
  employer?: string;
  annualIncome?: number;
  incomeVisible?: boolean;
  // Location
  currentCity?: string;
  // Verification
  isVerified: boolean;
  hasVideo: boolean;
  videoUrl?: string;
  profileCompleteness: number;
  rating?: number;
  reviewsCount: number;
  // Stats
  profileViews?: number;
  applicationsSent?: number;
  availableFrom?: string;
  createdAt: string;
  updatedAt?: string;
  // Preferences
  maxBudget?: number;
  hasPets?: boolean;
  petType?: string;
  preferredCities?: string[];
  // Computed
  isUnlocked?: boolean;
  incomeRange?: string;
}

export interface TenantFilters {
  page?: number;
  limit?: number;
  city?: string;
  isVerified?: boolean;
  hasVideo?: boolean;
  employmentType?: string;
  minIncome?: number;
  maxBudget?: number;
  hasPets?: boolean;
  sortBy?: 'profileCompleteness' | 'createdAt' | 'lastActive';
  sortOrder?: 'asc' | 'desc';
}

export interface TenantDocument {
  id: string;
  type: string;
  name: string;
  fileUrl: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  uploadedAt: string;
}

// API functions
export const tenantsApi = {
  /**
   * List tenants with filters (agency/admin only)
   */
  async list(filters?: TenantFilters): Promise<PaginatedResponse<TenantProfile>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return get(`/tenants?${params.toString()}`);
  },

  /**
   * Get tenant by ID (public profile or unlocked)
   */
  async getById(tenantId: string): Promise<TenantProfile> {
    return get(`/tenants/${tenantId}`);
  },

  /**
   * Get current tenant profile
   */
  async getProfile(): Promise<TenantProfile> {
    return get('/tenants/me');
  },

  /**
   * Update current tenant profile
   */
  async updateProfile(data: Partial<TenantProfile>): Promise<TenantProfile> {
    return put('/tenants/me', data);
  },

  /**
   * Update tenant preferences
   */
  async updatePreferences(preferences: {
    maxBudget?: number;
    minRooms?: number;
    maxRooms?: number;
    preferredCities?: string[];
    hasPets?: boolean;
    petType?: string;
    furnished?: 'yes' | 'no' | 'indifferent';
    parkingRequired?: boolean;
  }): Promise<void> {
    return put('/tenants/me/preferences', preferences);
  },

  /**
   * Upload document
   */
  async uploadDocument(type: string, file: File): Promise<TenantDocument> {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('file', file);

    return post('/tenants/me/documents', formData);
  },

  /**
   * Get documents list
   */
  async getDocuments(): Promise<TenantDocument[]> {
    return get('/tenants/me/documents');
  },

  /**
   * Delete document
   */
  async deleteDocument(documentId: string): Promise<void> {
    return del(`/tenants/me/documents/${documentId}`);
  },

  /**
   * Unlock tenant (agency only, costs credits)
   */
  async unlock(tenantId: string): Promise<{ success: boolean; creditsUsed: number }> {
    return post(`/tenants/${tenantId}/unlock`);
  },

  /**
   * Get presigned URL for video upload
   */
  async getVideoUploadUrl(): Promise<{ uploadUrl: string; videoUrl: string }> {
    return post('/tenants/me/video');
  },

  /**
   * Confirm video upload
   */
  async confirmVideoUpload(videoUrl: string, duration: number): Promise<void> {
    return put('/tenants/me/video', { videoUrl, duration });
  },

  /**
   * Delete video
   */
  async deleteVideo(): Promise<void> {
    return del('/tenants/me/video');
  },
};

export default tenantsApi;
