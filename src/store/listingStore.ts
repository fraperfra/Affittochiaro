import { create } from 'zustand';
import { Listing, ListingFilters, ListingStats, ListingApplication, Pagination } from '../types';

// Minimal listing shape stored in cache for public listings saved from /annunci
export interface CachedListing {
  id: string;
  title: string;
  city: string;
  zone?: string;
  price: number;
  priceDisplay: string;
  rooms: number;
  squareMeters: number;
  bathrooms: number;
  furnished: boolean;
  features: string[];
  description: string;
  agencyName: string;
  floor?: number;
  expenses?: number;
  applicationsCount: number;
  views: number;
  createdAt?: string;
}

const LS_SAVED    = 'affittochiaro_saved_listings';
const LS_CACHE    = 'affittochiaro_saved_cache';

function loadSaved(): string[] {
  try { return JSON.parse(localStorage.getItem(LS_SAVED) || '[]'); } catch { return []; }
}
function loadCache(): Record<string, CachedListing> {
  try { return JSON.parse(localStorage.getItem(LS_CACHE) || '{}'); } catch { return {}; }
}

interface ListingState {
  // Data
  listings: Listing[];
  currentListing: Listing | null;
  stats: ListingStats | null;
  applications: ListingApplication[];
  savedListings: string[];
  savedListingsCache: Record<string, CachedListing>; // public listings data

  // UI State
  filters: ListingFilters;
  pagination: Pagination;
  isLoading: boolean;
  error: string | null;
  viewMode: 'grid' | 'list' | 'map';
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'relevance';

  // Actions
  setListings: (listings: Listing[]) => void;
  setCurrentListing: (listing: Listing | null) => void;
  setStats: (stats: ListingStats) => void;
  setApplications: (applications: ListingApplication[]) => void;
  addApplication: (application: ListingApplication) => void;
  updateApplication: (applicationId: string, updates: Partial<ListingApplication>) => void;
  setFilters: (filters: Partial<ListingFilters>) => void;
  resetFilters: () => void;
  setPagination: (pagination: Partial<Pagination>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setViewMode: (mode: 'grid' | 'list' | 'map') => void;
  setSortBy: (sort: 'newest' | 'price_asc' | 'price_desc' | 'relevance') => void;
  toggleSavedListing: (listingId: string) => void;
  cachePublicListing: (listing: CachedListing) => void;
  updateListing: (listingId: string, updates: Partial<Listing>) => void;
  addListing: (listing: Listing) => void;
  removeListing: (listingId: string) => void;
}

const initialFilters: ListingFilters = {};
const initialPagination: Pagination = { page: 1, limit: 12, total: 0, totalPages: 0 };

export const useListingStore = create<ListingState>((set) => ({
  listings: [],
  currentListing: null,
  stats: null,
  applications: [],
  savedListings: loadSaved(),
  savedListingsCache: loadCache(),
  filters: initialFilters,
  pagination: initialPagination,
  isLoading: false,
  error: null,
  viewMode: 'grid',
  sortBy: 'newest',

  setListings: (listings) => set({ listings }),
  setCurrentListing: (currentListing) => set({ currentListing }),
  setStats: (stats) => set({ stats }),
  setApplications: (applications) => set({ applications }),

  addApplication: (application) =>
    set((state) => ({ applications: [...state.applications, application] })),

  updateApplication: (applicationId, updates) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === applicationId ? { ...app, ...updates } : app
      ),
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 },
    })),

  resetFilters: () => set({ filters: initialFilters, pagination: { ...initialPagination } }),

  setPagination: (pagination) =>
    set((state) => ({ pagination: { ...state.pagination, ...pagination } })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSortBy: (sortBy) => set({ sortBy }),

  toggleSavedListing: (listingId) =>
    set((state) => {
      const isSaved = state.savedListings.includes(listingId);
      const next = isSaved
        ? state.savedListings.filter((id) => id !== listingId)
        : [...state.savedListings, listingId];
      localStorage.setItem(LS_SAVED, JSON.stringify(next));

      // Remove from cache if unsaving
      if (isSaved) {
        const nextCache = { ...state.savedListingsCache };
        delete nextCache[listingId];
        localStorage.setItem(LS_CACHE, JSON.stringify(nextCache));
        return { savedListings: next, savedListingsCache: nextCache };
      }
      return { savedListings: next };
    }),

  cachePublicListing: (listing) =>
    set((state) => {
      const nextCache = { ...state.savedListingsCache, [listing.id]: listing };
      localStorage.setItem(LS_CACHE, JSON.stringify(nextCache));
      return { savedListingsCache: nextCache };
    }),

  updateListing: (listingId, updates) =>
    set((state) => ({
      listings: state.listings.map((l) =>
        l.id === listingId ? { ...l, ...updates } : l
      ),
      currentListing:
        state.currentListing?.id === listingId
          ? { ...state.currentListing, ...updates }
          : state.currentListing,
    })),

  addListing: (listing) =>
    set((state) => ({ listings: [listing, ...state.listings] })),

  removeListing: (listingId) =>
    set((state) => ({
      listings: state.listings.filter((l) => l.id !== listingId),
      currentListing:
        state.currentListing?.id === listingId ? null : state.currentListing,
    })),
}));
