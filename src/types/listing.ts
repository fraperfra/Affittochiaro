import { Address, Coordinates, FileUpload, Status } from './common';

export interface Listing {
  id: string;
  agencyId: string;
  agencyName: string;
  agencyLogo?: string;

  // Basic Info
  title: string;
  description: string;
  propertyType: PropertyType;

  // Location
  address: Address;
  coordinates?: Coordinates;
  zone?: string;

  // Details
  price: number;
  expenses?: number;
  deposit?: number;
  rooms: number;
  bathrooms: number;
  squareMeters: number;
  floor?: number;
  totalFloors?: number;

  // Features
  features: ListingFeature[];
  furnished: 'yes' | 'no' | 'partial';
  heatingType?: HeatingType;
  energyClass?: EnergyClass;

  // Media
  images: FileUpload[];
  virtualTourUrl?: string;

  // Availability
  availableFrom: Date;
  minContractDuration?: number; // months

  // Preferences
  petsAllowed: boolean;
  smokingAllowed: boolean;
  studentsAllowed: boolean;
  couplesAllowed: boolean;
  maxOccupants?: number;           // Massimo persone ammesse
  childrenAllowed?: boolean;      // Default true se non specificato
  maxContractDuration?: number;   // Durata massima contratto in mesi
  minIncomeRatio?: number;         // Rapporto minimo reddito/affitto (default 2.5)
  preferredNationalities?: string[]; // Nazionalità preferite (vuoto = tutte)
  minTenantAge?: number;
  maxTenantAge?: number;

  // Stats
  views: number;
  applicationsCount: number;
  savedCount: number;

  // Status
  status: ListingStatus;
  isHighlighted: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  expiresAt?: Date;
}

export type PropertyType =
  | 'apartment'
  | 'studio'
  | 'loft'
  | 'villa'
  | 'house'
  | 'room'
  | 'office'
  | 'commercial';

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: 'Appartamento',
  studio: 'Monolocale',
  loft: 'Loft',
  villa: 'Villa',
  house: 'Casa indipendente',
  room: 'Stanza singola',
  office: 'Ufficio',
  commercial: 'Locale commerciale',
};

export type ListingStatus =
  | 'draft'
  | 'pending_review'
  | 'active'
  | 'paused'
  | 'rented'
  | 'expired'
  | 'rejected';

export type ListingFeature =
  | 'balcony'
  | 'terrace'
  | 'garden'
  | 'parking'
  | 'garage'
  | 'elevator'
  | 'air_conditioning'
  | 'washing_machine'
  | 'dishwasher'
  | 'tv'
  | 'internet'
  | 'alarm'
  | 'video_intercom'
  | 'cellar'
  | 'attic'
  | 'pool'
  | 'gym'
  | 'concierge'
  | 'wheelchair_accessible';

export const LISTING_FEATURE_LABELS: Record<ListingFeature, string> = {
  balcony: 'Balcone',
  terrace: 'Terrazzo',
  garden: 'Giardino',
  parking: 'Posto auto',
  garage: 'Box/Garage',
  elevator: 'Ascensore',
  air_conditioning: 'Aria condizionata',
  washing_machine: 'Lavatrice',
  dishwasher: 'Lavastoviglie',
  tv: 'TV',
  internet: 'Internet/WiFi',
  alarm: 'Allarme',
  video_intercom: 'Videocitofono',
  cellar: 'Cantina',
  attic: 'Soffitta',
  pool: 'Piscina',
  gym: 'Palestra',
  concierge: 'Portineria',
  wheelchair_accessible: 'Accessibile disabili',
};

export type HeatingType =
  | 'autonomous'
  | 'centralized'
  | 'floor'
  | 'air_conditioning'
  | 'none';

export const HEATING_TYPE_LABELS: Record<HeatingType, string> = {
  autonomous: 'Autonomo',
  centralized: 'Centralizzato',
  floor: 'A pavimento',
  air_conditioning: 'Pompa di calore',
  none: 'Assente',
};

export type EnergyClass = 'A4' | 'A3' | 'A2' | 'A1' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface ListingFilters {
  search?: string;
  city?: string;
  zone?: string;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minRooms?: number;
  maxRooms?: number;
  minSquareMeters?: number;
  maxSquareMeters?: number;
  furnished?: 'yes' | 'no' | 'partial';
  features?: ListingFeature[];
  petsAllowed?: boolean;
  availableFrom?: Date;
  status?: ListingStatus;
  agencyId?: string;
}

export interface ListingApplication {
  id: string;
  listingId: string;
  tenantId: string;
  tenantName: string;
  tenantAvatar?: string;
  tenantIsVerified: boolean;
  tenantHasVideo: boolean;
  message?: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  respondedAt?: Date;
}

export type ApplicationStatus =
  | 'pending'
  | 'viewed'
  | 'shortlisted'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export interface ListingStats {
  totalListings: number;
  activeListings: number;
  rentedThisMonth: number;
  averagePrice: number;
  averageDaysToRent: number;
  topCities: { city: string; count: number }[];
  priceDistribution: { range: string; count: number }[];
}
