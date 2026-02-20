import { Address, Badge, Status } from './common';
import { AgencyPlan } from './auth';

export interface Agency {
  id: string;
  email: string;
  name: string;
  logo?: string;
  description?: string;

  // Business Info
  vatNumber: string;
  phone: string;
  website?: string;
  address?: Address;

  // Plan & Credits
  plan: AgencyPlan;
  credits: number;
  creditsUsedThisMonth: number;
  planStartDate?: Date;
  planExpiresAt?: Date;

  // Stats
  listingsCount: number;
  activeListingsCount: number;
  tenantsUnlocked: number;
  matchesCount: number;

  // Verification
  isVerified: boolean;
  badges: Badge[];
  rating?: number;
  reviewsCount: number;

  // Status
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  lastActive?: Date;
}

export interface AgencyPlanDetails {
  id: AgencyPlan;
  name: string;
  price: number;
  priceYearly: number;
  creditsPerMonth: number;
  maxListings: number;
  features: string[];
  isPopular?: boolean;
}

export const AGENCY_PLANS: AgencyPlanDetails[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceYearly: 0,
    creditsPerMonth: 5,
    maxListings: 3,
    features: [
      '5 crediti/mese per sbloccare profili',
      'Fino a 3 annunci attivi',
      'Ricerca base inquilini',
      'Supporto email',
    ],
  },
  {
    id: 'base',
    name: 'Base',
    price: 49,
    priceYearly: 470,
    creditsPerMonth: 25,
    maxListings: 15,
    features: [
      '25 crediti/mese per sbloccare profili',
      'Fino a 15 annunci attivi',
      'Ricerca avanzata inquilini',
      'Filtri premium',
      'Download CV in PDF',
      'Supporto prioritario',
    ],
    isPopular: true,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    priceYearly: 950,
    creditsPerMonth: 75,
    maxListings: 50,
    features: [
      '75 crediti/mese per sbloccare profili',
      'Fino a 50 annunci attivi',
      'Ricerca illimitata',
      'Tutti i filtri premium',
      'Download CV illimitati',
      'API access',
      'Account manager dedicato',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    priceYearly: 1910,
    creditsPerMonth: 200,
    maxListings: -1, // unlimited
    features: [
      '200 crediti/mese per sbloccare profili',
      'Annunci illimitati',
      'Tutte le funzionalità Professional',
      'White-label option',
      'Custom integrations',
      'SLA garantito',
      'Formazione dedicata',
    ],
  },
];

export interface UnlockedTenant {
  tenantId: string;
  agencyId: string;
  unlockedAt: Date;
  creditsCost: number;
  contactInfo: {
    email: string;
    phone?: string;
  };
  notes?: string;
}

export interface AgencyFilters {
  search?: string;
  city?: string;
  plan?: AgencyPlan;
  isVerified?: boolean;
  minListings?: number;
  maxListings?: number;
  status?: Status;
}

export interface AgencyStats {
  totalAgencies: number;
  verifiedAgencies: number;
  activeThisMonth: number;
  totalRevenue: number;
  revenueThisMonth: number;
  planDistribution: Record<AgencyPlan, number>;
  topAgencies: { agency: Agency; score: number }[];
}

export interface CreditTransaction {
  id: string;
  agencyId: string;
  type: 'purchase' | 'usage' | 'bonus' | 'refund';
  amount: number;
  description: string;
  relatedTenantId?: string;
  createdAt: Date;
}
