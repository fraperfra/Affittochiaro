import { TenantProfile, TenantPreferences, Listing } from '../../shared/types';

/**
 * Matching Algorithm for Affittochiaro
 *
 * Calculates compatibility scores between tenants and listings
 * using 5 weighted components:
 * - Budget Fit (25%): Does the listing fit the tenant's budget?
 * - Location Match (25%): Is the listing in a preferred city/area?
 * - Income Ratio (20%): Is the rent affordable based on income?
 * - Employment Stability (15%): Does the tenant have stable employment?
 * - Lifestyle Compatibility (15%): Do lifestyle preferences match?
 */

export interface MatchScore {
  tenantId: string;
  listingId: string;
  budgetScore: number;
  locationScore: number;
  incomeRatioScore: number;
  employmentScore: number;
  lifestyleScore: number;
  totalScore: number;
  weightsVersion: number;
}

export interface MatchWeights {
  budget: number;
  location: number;
  incomeRatio: number;
  employment: number;
  lifestyle: number;
}

export const DEFAULT_WEIGHTS: MatchWeights = {
  budget: 0.25,
  location: 0.25,
  incomeRatio: 0.20,
  employment: 0.15,
  lifestyle: 0.15,
};

/**
 * Main function to calculate match score between a tenant and a listing
 */
export function calculateMatchScore(
  tenant: TenantProfile & { preferences?: TenantPreferences },
  listing: Listing,
  weights: MatchWeights = DEFAULT_WEIGHTS
): MatchScore {
  const budgetScore = calculateBudgetScore(
    tenant.preferences?.maxBudget,
    listing.price,
    listing.expenses || 0
  );

  const locationScore = calculateLocationScore(
    tenant.preferences?.preferredCities || [],
    tenant.currentCity,
    listing.city
  );

  const incomeRatioScore = calculateIncomeRatioScore(
    tenant.annualIncome,
    listing.price
  );

  const employmentScore = calculateEmploymentScore(
    tenant.employmentType,
    tenant.employmentStartDate
  );

  const lifestyleScore = calculateLifestyleScore(
    tenant.preferences,
    listing
  );

  // Calculate weighted total
  const totalScore =
    budgetScore * weights.budget +
    locationScore * weights.location +
    incomeRatioScore * weights.incomeRatio +
    employmentScore * weights.employment +
    lifestyleScore * weights.lifestyle;

  return {
    tenantId: tenant.id,
    listingId: listing.id,
    budgetScore: Math.round(budgetScore * 100) / 100,
    locationScore: Math.round(locationScore * 100) / 100,
    incomeRatioScore: Math.round(incomeRatioScore * 100) / 100,
    employmentScore: Math.round(employmentScore * 100) / 100,
    lifestyleScore: Math.round(lifestyleScore * 100) / 100,
    totalScore: Math.round(totalScore * 100) / 100,
    weightsVersion: 1,
  };
}

/**
 * Budget Fit Score (0-100)
 *
 * How well does the listing price fit the tenant's budget?
 */
export function calculateBudgetScore(
  tenantMaxBudget: number | undefined,
  listingPrice: number,
  listingExpenses: number = 0
): number {
  // If no budget specified, neutral score
  if (!tenantMaxBudget) return 50;

  const totalCost = listingPrice + listingExpenses;

  if (tenantMaxBudget >= totalCost) {
    // Within budget - calculate how much margin
    const margin = (tenantMaxBudget - totalCost) / totalCost;

    // Perfect fit (0-10% margin) = 100
    // Good margin (10-30%) = 90
    // Large margin (>30%) = 80 (might be too cheap for tenant's expectations)
    if (margin <= 0.10) return 100;
    if (margin <= 0.30) return 90;
    return 80;
  } else {
    // Over budget - penalize proportionally
    const overBudgetRatio = (totalCost - tenantMaxBudget) / tenantMaxBudget;

    // Slightly over (0-10%) = 70
    // Moderately over (10-20%) = 50
    // Significantly over (20-30%) = 30
    // Way over (>30%) = 0-10
    if (overBudgetRatio <= 0.10) return 70;
    if (overBudgetRatio <= 0.20) return 50;
    if (overBudgetRatio <= 0.30) return 30;
    return Math.max(0, 10 - (overBudgetRatio - 0.30) * 50);
  }
}

/**
 * Location Match Score (0-100)
 *
 * Is the listing in a preferred city/area?
 */
export function calculateLocationScore(
  preferredCities: string[],
  currentCity: string | undefined,
  listingCity: string
): number {
  const normalizedListing = listingCity.toLowerCase().trim();

  // Check if listing city is in preferred cities
  const normalizedPreferred = preferredCities.map(c => c.toLowerCase().trim());

  if (normalizedPreferred.includes(normalizedListing)) {
    return 100; // Exact match with preferred city
  }

  // Check if listing city matches current city
  if (currentCity && currentCity.toLowerCase().trim() === normalizedListing) {
    return 90; // Staying in current city
  }

  // Check for partial matches (e.g., "Milano" matches "Milano Nord")
  for (const preferred of normalizedPreferred) {
    if (normalizedListing.includes(preferred) || preferred.includes(normalizedListing)) {
      return 80; // Partial match
    }
  }

  // Check if same metropolitan area (simplified)
  const metroAreas: Record<string, string[]> = {
    milano: ['monza', 'sesto san giovanni', 'cinisello balsamo', 'rho', 'pero', 'cologno monzese'],
    roma: ['fiumicino', 'guidonia', 'tivoli', 'ciampino', 'pomezia'],
    napoli: ['pozzuoli', 'portici', 'ercolano', 'torre del greco'],
    torino: ['moncalieri', 'collegno', 'rivoli', 'nichelino'],
  };

  for (const [metro, cities] of Object.entries(metroAreas)) {
    const isListingInMetro = normalizedListing.includes(metro) || cities.some(c => normalizedListing.includes(c));
    const isPreferredInMetro = normalizedPreferred.some(p => p.includes(metro) || cities.some(c => p.includes(c)));

    if (isListingInMetro && isPreferredInMetro) {
      return 70; // Same metropolitan area
    }
  }

  // No match
  return 0;
}

/**
 * Income-to-Rent Ratio Score (0-100)
 *
 * Is the rent affordable based on income?
 * Ideal ratio: rent should be ≤30% of monthly income
 */
export function calculateIncomeRatioScore(
  annualIncome: number | undefined,
  monthlyRent: number
): number {
  // If income not specified, neutral score
  if (!annualIncome) return 50;

  const monthlyIncome = annualIncome / 12;
  const ratio = monthlyRent / monthlyIncome;

  // Perfect (rent ≤ 25% of income) = 100
  if (ratio <= 0.25) return 100;

  // Good (25-30%) = 90
  if (ratio <= 0.30) return 90;

  // Acceptable (30-35%) = 75
  if (ratio <= 0.35) return 75;

  // Stretched (35-40%) = 50
  if (ratio <= 0.40) return 50;

  // Risky (40-50%) = 25
  if (ratio <= 0.50) return 25;

  // Unaffordable (>50%) = 0
  return 0;
}

/**
 * Employment Stability Score (0-100)
 *
 * How stable is the tenant's employment situation?
 */
export function calculateEmploymentScore(
  employmentType: string | undefined,
  employmentStartDate: Date | string | undefined
): number {
  const baseScores: Record<string, number> = {
    permanent: 100,     // Tempo indeterminato
    retired: 95,        // Pensionato - very stable income
    freelance: 70,      // Partita IVA - depends on tenure
    fixed_term: 60,     // Tempo determinato
    student: 50,        // Studente - often has support
    internship: 30,     // Stage/Tirocinio
    unemployed: 10,     // Disoccupato
  };

  let score = baseScores[employmentType || ''] || 50;

  // Tenure bonus for permanent and freelance
  if (employmentStartDate && ['permanent', 'freelance'].includes(employmentType || '')) {
    const startDate = typeof employmentStartDate === 'string'
      ? new Date(employmentStartDate)
      : employmentStartDate;

    const yearsEmployed = (Date.now() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);

    if (yearsEmployed >= 5) {
      score = Math.min(100, score + 10);
    } else if (yearsEmployed >= 3) {
      score = Math.min(100, score + 7);
    } else if (yearsEmployed >= 1) {
      score = Math.min(100, score + 3);
    }
  }

  return score;
}

/**
 * Lifestyle Compatibility Score (0-100)
 *
 * Do the tenant's lifestyle preferences match the listing's rules?
 */
export function calculateLifestyleScore(
  preferences: TenantPreferences | undefined,
  listing: Listing
): number {
  let score = 100;
  const penalties: number[] = [];

  // Pet compatibility
  if (preferences?.hasPets && !listing.petsAllowed) {
    penalties.push(50); // Major incompatibility - has pets but not allowed
  }

  // Smoking compatibility (if we track tenant smoking)
  // Currently not tracked, skip

  // Furnished preference
  if (preferences?.furnished && preferences.furnished !== 'indifferent') {
    if (listing.furnished === 'no' && preferences.furnished === 'yes') {
      penalties.push(20); // Wants furnished but unfurnished
    } else if (listing.furnished === 'yes' && preferences.furnished === 'no') {
      penalties.push(10); // Wants unfurnished but furnished (less severe)
    }
  }

  // Room count
  if (preferences?.minRooms && listing.rooms < preferences.minRooms) {
    const roomDeficit = preferences.minRooms - listing.rooms;
    penalties.push(roomDeficit * 15); // 15 points per missing room
  }

  if (preferences?.maxRooms && listing.rooms > preferences.maxRooms) {
    const roomExcess = listing.rooms - preferences.maxRooms;
    penalties.push(roomExcess * 5); // 5 points per extra room (less severe)
  }

  // Parking (if we track this preference)
  if (preferences?.parkingRequired && !listing.features?.includes('parking')) {
    penalties.push(15);
  }

  // Apply penalties
  const totalPenalty = penalties.reduce((sum, p) => sum + p, 0);
  return Math.max(0, score - totalPenalty);
}

/**
 * Batch calculate scores for multiple tenant-listing pairs
 */
export function calculateBatchScores(
  tenants: (TenantProfile & { preferences?: TenantPreferences })[],
  listings: Listing[],
  weights: MatchWeights = DEFAULT_WEIGHTS
): MatchScore[] {
  const scores: MatchScore[] = [];

  for (const tenant of tenants) {
    for (const listing of listings) {
      scores.push(calculateMatchScore(tenant, listing, weights));
    }
  }

  return scores;
}

/**
 * Get top N matches for a tenant
 */
export function getTopMatchesForTenant(
  tenant: TenantProfile & { preferences?: TenantPreferences },
  listings: Listing[],
  topN: number = 10,
  minScore: number = 50
): MatchScore[] {
  const scores = listings.map(listing => calculateMatchScore(tenant, listing));

  return scores
    .filter(s => s.totalScore >= minScore)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, topN);
}

/**
 * Get top N tenant matches for a listing
 */
export function getTopMatchesForListing(
  tenants: (TenantProfile & { preferences?: TenantPreferences })[],
  listing: Listing,
  topN: number = 10,
  minScore: number = 50
): MatchScore[] {
  const scores = tenants.map(tenant => calculateMatchScore(tenant, listing));

  return scores
    .filter(s => s.totalScore >= minScore)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, topN);
}
