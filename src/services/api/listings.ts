/**
 * Listings API Service
 */

import { get, post, put, del, PaginatedResponse } from './client';

// Types
export interface Listing {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  city: string;
  zone?: string;
  price: number;
  expenses?: number;
  deposit?: number;
  rooms: number;
  bathrooms: number;
  squareMeters: number;
  floor?: number;
  features: string[];
  furnished: 'yes' | 'no' | 'partial';
  energyClass?: string;
  availableFrom?: string;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  studentsAllowed: boolean;
  couplesAllowed: boolean;
  views: number;
  applicationsCount: number;
  isHighlighted: boolean;
  createdAt: string;
  externalSource?: string;
  // Agency info
  agencyId: string;
  agencyName: string;
  agencyLogo?: string;
  agencyVerified: boolean;
  // Images
  primaryImage?: string;
  imagesCount: number;
  images?: ListingImage[];
}

export interface ListingImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  position: number;
  isPrimary: boolean;
}

export interface ListingFilters {
  page?: number;
  limit?: number;
  city?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minRooms?: number;
  maxRooms?: number;
  petsAllowed?: boolean;
  furnished?: 'yes' | 'no' | 'partial';
  agencyId?: string;
  sortBy?: 'price' | 'createdAt' | 'views';
  sortOrder?: 'asc' | 'desc';
}

export interface Application {
  id: string;
  listingId: string;
  tenantId: string;
  message?: string;
  status: 'pending' | 'viewed' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';
  matchScore?: number;
  createdAt: string;
  respondedAt?: string;
  // Populated
  tenant?: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    isVerified: boolean;
    hasVideo: boolean;
    profileCompleteness: number;
  };
  listing?: Listing;
}

export interface CreateListingData {
  title: string;
  description: string;
  propertyType: string;
  city: string;
  zone?: string;
  street?: string;
  postalCode?: string;
  price: number;
  expenses?: number;
  deposit?: number;
  rooms: number;
  bathrooms?: number;
  squareMeters: number;
  floor?: number;
  totalFloors?: number;
  features?: string[];
  furnished?: 'yes' | 'no' | 'partial';
  heatingType?: string;
  energyClass?: string;
  availableFrom?: string;
  minContractDuration?: number;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  studentsAllowed?: boolean;
  couplesAllowed?: boolean;
}

// API functions
export const listingsApi = {
  /**
   * List listings with filters (public)
   */
  async list(filters?: ListingFilters): Promise<PaginatedResponse<Listing>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return get(`/listings?${params.toString()}`);
  },

  /**
   * Get listing by ID
   */
  async getById(listingId: string): Promise<Listing> {
    return get(`/listings/${listingId}`);
  },

  /**
   * Create listing (agency only)
   */
  async create(data: CreateListingData): Promise<Listing> {
    return post('/listings', data);
  },

  /**
   * Update listing (agency only)
   */
  async update(listingId: string, data: Partial<CreateListingData>): Promise<Listing> {
    return put(`/listings/${listingId}`, data);
  },

  /**
   * Delete listing (agency only)
   */
  async delete(listingId: string): Promise<void> {
    return del(`/listings/${listingId}`);
  },

  /**
   * Get agency listings
   */
  async getMyListings(filters?: ListingFilters): Promise<PaginatedResponse<Listing>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return get(`/agencies/me/listings?${params.toString()}`);
  },

  /**
   * Upload listing images
   */
  async uploadImages(listingId: string, files: File[]): Promise<ListingImage[]> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('images', file);
    });
    return post(`/listings/${listingId}/images`, formData);
  },

  /**
   * Delete listing image
   */
  async deleteImage(listingId: string, imageId: string): Promise<void> {
    return del(`/listings/${listingId}/images/${imageId}`);
  },

  /**
   * Apply to listing (tenant only)
   */
  async apply(listingId: string, message?: string): Promise<Application> {
    return post(`/listings/${listingId}/apply`, { message });
  },

  /**
   * Get applications for a listing (agency only)
   */
  async getListingApplications(listingId: string): Promise<Application[]> {
    return get(`/listings/${listingId}/applications`);
  },

  /**
   * Save/unsave listing (tenant only)
   */
  async toggleSave(listingId: string): Promise<{ saved: boolean }> {
    return post(`/listings/${listingId}/save`);
  },

  /**
   * Get saved listings (tenant only)
   */
  async getSavedListings(): Promise<Listing[]> {
    return get('/tenants/me/saved-listings');
  },
};

// Applications API
export const applicationsApi = {
  /**
   * List applications (tenant: their applications, agency: applications to their listings)
   */
  async list(filters?: {
    status?: string;
    listingId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Application>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return get(`/applications?${params.toString()}`);
  },

  /**
   * Get application by ID
   */
  async getById(applicationId: string): Promise<Application> {
    return get(`/applications/${applicationId}`);
  },

  /**
   * Update application status (agency only)
   */
  async updateStatus(
    applicationId: string,
    status: 'viewed' | 'shortlisted' | 'accepted' | 'rejected'
  ): Promise<Application> {
    return put(`/applications/${applicationId}`, { status });
  },

  /**
   * Withdraw application (tenant only)
   */
  async withdraw(applicationId: string): Promise<void> {
    return put(`/applications/${applicationId}`, { status: 'withdrawn' });
  },
};

export default listingsApi;
