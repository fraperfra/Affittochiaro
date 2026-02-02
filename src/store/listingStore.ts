import { create } from 'zustand';
import { Listing, ListingFilters, ListingStats, ListingApplication, Pagination } from '../types';

interface ListingState {
  // Data
  listings: Listing[];
  currentListing: Listing | null;
  stats: ListingStats | null;
  applications: ListingApplication[];
  savedListings: string[]; // listing IDs

  // UI State
  filters: ListingFilters;
  pagination: Pagination;
  isLoading: boolean;
  error: string | null;
  viewMode: 'grid' | 'list';
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
  setViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (sort: 'newest' | 'price_asc' | 'price_desc' | 'relevance') => void;
  toggleSavedListing: (listingId: string) => void;
  updateListing: (listingId: string, updates: Partial<Listing>) => void;
  addListing: (listing: Listing) => void;
  removeListing: (listingId: string) => void;
}

const initialFilters: ListingFilters = {};

const initialPagination: Pagination = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
};

export const useListingStore = create<ListingState>((set) => ({
  listings: [],
  currentListing: null,
  stats: null,
  applications: [],
  savedListings: [],
  filters: initialFilters,
  pagination: initialPagination,
  isLoading: false,
  error: null,
  viewMode: 'grid',
  sortBy: 'newest',

  setListings: (listings) => {
    set({ listings });
  },

  setCurrentListing: (currentListing) => {
    set({ currentListing });
  },

  setStats: (stats) => {
    set({ stats });
  },

  setApplications: (applications) => {
    set({ applications });
  },

  addApplication: (application) => {
    set((state) => ({
      applications: [...state.applications, application],
    }));
  },

  updateApplication: (applicationId, updates) => {
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === applicationId ? { ...app, ...updates } : app
      ),
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

  setViewMode: (viewMode) => {
    set({ viewMode });
  },

  setSortBy: (sortBy) => {
    set({ sortBy });
  },

  toggleSavedListing: (listingId) => {
    set((state) => {
      const isSaved = state.savedListings.includes(listingId);
      return {
        savedListings: isSaved
          ? state.savedListings.filter((id) => id !== listingId)
          : [...state.savedListings, listingId],
      };
    });
  },

  updateListing: (listingId, updates) => {
    set((state) => ({
      listings: state.listings.map((listing) =>
        listing.id === listingId ? { ...listing, ...updates } : listing
      ),
      currentListing:
        state.currentListing?.id === listingId
          ? { ...state.currentListing, ...updates }
          : state.currentListing,
    }));
  },

  addListing: (listing) => {
    set((state) => ({
      listings: [listing, ...state.listings],
    }));
  },

  removeListing: (listingId) => {
    set((state) => ({
      listings: state.listings.filter((l) => l.id !== listingId),
      currentListing:
        state.currentListing?.id === listingId ? null : state.currentListing,
    }));
  },
}));
