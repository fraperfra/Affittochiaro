/**
 * Matching Algorithm - Calcola compatibilita' inquilino-annuncio
 *
 * Breakdown (13 campi):
 *  - budget, location, rooms, preferences, availability, contractDuration,
 *  - incomeRatio, employment, reliability, urgency, age, numPeople, children
 */

import { Tenant, EmploymentType } from '../types/tenant';
import { Listing } from '../types/listing';

export interface MatchResult {
  tenantId: string;
  listingId: string;
  score: number; // 0-100
  breakdown: MatchBreakdown;
  label: MatchLabel;
  color: string;
  isDealbreaker: boolean;
  dealbreakers: string[];
}

export interface MatchBreakdown {
  budget: number;
  location: number;
  rooms: number;
  preferences: number;
  availability: number;
  contractDuration: number;
  incomeRatio: number;
  employment: number;
  reliability: number;
  urgency: number;
  age: number;
  numPeople: number;
  children: number;
}

export type MatchLabel = 'Eccellente' | 'Ottimo' | 'Buono' | 'Sufficiente' | 'Basso';

const WEIGHTS = {
  budget: 14,
  location: 12,
  rooms: 8,
  preferences: 8,
  availability: 6,
  contractDuration: 6,
  incomeRatio: 12,
  employment: 10,
  reliability: 12,
  urgency: 4,
  age: 4,
  numPeople: 4,
  children: 2,
};

// Stabilita' per tipo di contratto
const EMPLOYMENT_STABILITY: Record<EmploymentType, number> = {
  permanent: 100,
  freelance: 70,
  fixed_term: 60,
  retired: 80,
  student: 40,
  internship: 30,
  unemployed: 10,
};

function getMatchLabel(score: number): { label: MatchLabel; color: string } {
  if (score >= 85) return { label: 'Eccellente', color: 'text-green-600' };
  if (score >= 70) return { label: 'Ottimo', color: 'text-teal-600' };
  if (score >= 55) return { label: 'Buono', color: 'text-blue-600' };
  if (score >= 40) return { label: 'Sufficiente', color: 'text-amber-600' };
  return { label: 'Basso', color: 'text-red-500' };
}

/**
 * Calcola il punteggio budget: l'inquilino puo' permettersi l'affitto?
 */
function scoreBudget(tenant: Tenant, listing: Listing): number {
  if (!tenant.preferences.maxBudget) return 50; // neutro se non specificato

  const totalCost = listing.price + (listing.expenses || 0);

  if (tenant.preferences.maxBudget >= totalCost * 1.2) return 100; // molta margine
  if (tenant.preferences.maxBudget >= totalCost) return 85;
  if (tenant.preferences.maxBudget >= totalCost * 0.9) return 60; // leggermente sotto
  if (tenant.preferences.maxBudget >= totalCost * 0.8) return 30;
  return 10; // fuori budget
}

/**
 * Calcola il punteggio posizione: citta' compatibile?
 */
function scoreLocation(tenant: Tenant, listing: Listing): number {
  const listingCity = listing.address?.city?.toLowerCase() || '';

  // Controlla citta' preferite
  if (tenant.preferences.preferredCities?.length > 0) {
    const preferred = tenant.preferences.preferredCities.map(c => c.toLowerCase());
    if (preferred.includes(listingCity)) return 100;

    // Controlla citta' corrente come fallback
    if (tenant.currentCity?.toLowerCase() === listingCity) return 80;
    return 20;
  }

  // Se nessuna preferenza, controlla citta' corrente
  if (tenant.currentCity?.toLowerCase() === listingCity) return 90;
  return 50; // neutro
}

/**
 * Calcola affidabilita' del profilo
 */
function scoreReliability(tenant: Tenant): number {
  let score = 0;

  // Completezza profilo (max 30)
  score += Math.min(30, (tenant.profileCompleteness / 100) * 30);

  // Verificato (20)
  if (tenant.isVerified) score += 20;

  // Video (15)
  if (tenant.hasVideo) score += 15;

  // Documenti verificati (20)
  const verifiedDocs = tenant.documents.filter(d => d.status === 'verified').length;
  score += Math.min(20, verifiedDocs * 5);

  // Referenze (15)
  const verifiedRefs = tenant.references.filter(r => r.isVerified).length;
  score += Math.min(15, verifiedRefs * 7.5);

  return Math.min(100, score);
}

/**
 * Calcola stabilita' lavorativa
 */
function scoreEmployment(tenant: Tenant): number {
  let score = 0;

  // Tipo contratto (max 50)
  const stability = EMPLOYMENT_STABILITY[tenant.employmentType || 'unemployed'] || 10;
  score += stability * 0.5;

  // Reddito (max 30) - rapporto reddito/media
  if (tenant.annualIncome) {
    if (tenant.annualIncome >= 40000) score += 30;
    else if (tenant.annualIncome >= 25000) score += 20;
    else if (tenant.annualIncome >= 15000) score += 10;
  }

  // Anzianita' lavorativa (max 20)
  if (tenant.employmentStartDate) {
    const years = (Date.now() - new Date(tenant.employmentStartDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    if (years >= 5) score += 20;
    else if (years >= 2) score += 15;
    else if (years >= 1) score += 10;
    else score += 5;
  }

  return Math.min(100, score);
}

/**
 * Calcola compatibilita' preferenze (animali, fumatore, arredamento)
 */
function scorePreferences(tenant: Tenant, listing: Listing): number {
  let score = 100;
  let penalties = 0;

  // Animali: penalita' forte se incompatibile
  if (tenant.preferences.hasPets && !listing.petsAllowed) {
    penalties += 50;
  }

  // Fumatore: penalita' se incompatibile
  if (tenant.preferences.smokingAllowed && !listing.smokingAllowed) {
    penalties += 30;
  }

  // Arredamento
  if (tenant.preferences.furnished && tenant.preferences.furnished !== 'indifferent') {
    if (tenant.preferences.furnished === 'yes' && listing.furnished === 'no') penalties += 20;
    if (tenant.preferences.furnished === 'no' && listing.furnished === 'yes') penalties += 10;
  }

  // Locali
  if (tenant.preferences.minRooms && listing.rooms < tenant.preferences.minRooms) {
    penalties += 20;
  }
  if (tenant.preferences.maxRooms && listing.rooms > tenant.preferences.maxRooms) {
    penalties += 10;
  }

  return Math.max(0, score - penalties);
}

/**
 * Calcola compatibilita' date disponibilita'
 */
function scoreAvailability(tenant: Tenant, listing: Listing): number {
  const tenantAvailable = tenant.preferences.availableFrom || tenant.availableFrom;
  const listingAvailable = listing.availableFrom;

  if (!tenantAvailable || !listingAvailable) return 70; // neutro

  const tenantDate = new Date(tenantAvailable).getTime();
  const listingDate = new Date(listingAvailable).getTime();
  const diffDays = Math.abs(tenantDate - listingDate) / (24 * 60 * 60 * 1000);

  if (diffDays <= 7) return 100;
  if (diffDays <= 30) return 80;
  if (diffDays <= 60) return 60;
  if (diffDays <= 90) return 40;
  return 20;
}

/**
 * Calcola compatibilita' numero locali
 */
function scoreRooms(tenant: Tenant, listing: Listing): number {
  const minR = tenant.preferences.minRooms;
  const maxR = tenant.preferences.maxRooms;
  const listingRooms = listing.rooms;
  if (!minR && !maxR) return 70;
  if (minR && listingRooms < minR) return Math.max(0, 50 - (minR - listingRooms) * 15);
  if (maxR && listingRooms > maxR) return Math.max(0, 70 - (listingRooms - maxR) * 10);
  return 100;
}

/**
 * Calcola compatibilita' durata contratto (mesi)
 */
function scoreContractDuration(tenant: Tenant, listing: Listing): number {
  const desiredMonths = tenant.preferences.desiredContractMonths;
  const minMonths = listing.minContractDuration;
  const maxMonths = listing.maxContractDuration;

  if (desiredMonths != null && (minMonths != null || maxMonths != null)) {
    if (minMonths != null && desiredMonths < minMonths) return Math.max(0, 60 - (minMonths - desiredMonths) * 5);
    if (maxMonths != null && desiredMonths > maxMonths) return Math.max(0, 60 - (desiredMonths - maxMonths) * 5);
    return 100;
  }
  if (!minMonths) return 70;
  if (minMonths <= 12) return 85;
  if (minMonths <= 24) return 70;
  return 50;
}

const DEFAULT_MIN_INCOME_RATIO = 2.5;

/**
 * Rapporto reddito/affitto (reddito mensile vs costo mensile)
 */
function scoreIncomeRatio(tenant: Tenant, listing: Listing): number {
  const totalCost = listing.price + (listing.expenses || 0);
  if (!tenant.annualIncome || totalCost <= 0) return 50;
  const minRatio = listing.minIncomeRatio ?? DEFAULT_MIN_INCOME_RATIO;
  const monthlyIncome = tenant.annualIncome / 12;
  const ratio = monthlyIncome / totalCost;
  if (ratio >= minRatio + 0.5) return 100;
  if (ratio >= minRatio) return 90;
  if (ratio >= minRatio - 0.5) return 75;
  if (ratio >= 1.5) return 50;
  if (ratio >= 1) return 25;
  return 10;
}

/**
 * Urgenza / vicinanza date disponibilita'
 */
function scoreUrgency(tenant: Tenant, listing: Listing): number {
  const tenantAvailable = tenant.preferences.availableFrom || tenant.availableFrom;
  const listingAvailable = listing.availableFrom;
  if (!tenantAvailable || !listingAvailable) return 70;
  const diffDays = Math.abs(new Date(tenantAvailable).getTime() - new Date(listingAvailable).getTime()) / (24 * 60 * 60 * 1000);
  if (diffDays <= 7) return 100;
  if (diffDays <= 14) return 85;
  if (diffDays <= 30) return 70;
  if (diffDays <= 60) return 50;
  return 30;
}

/**
 * Compatibilita' eta' (se annuncio ha preferenze non in tipo: neutro)
 */
function scoreAge(_tenant: Tenant, _listing: Listing): number {
  if (_tenant.age != null) return Math.min(100, 50 + Math.abs(35 - (_tenant.age ?? 0)) * 0.5);
  return 70;
}

/**
 * Numero persone: tenant.numPeople vs listing.maxOccupants
 */
function scoreNumPeople(tenant: Tenant, listing: Listing): number {
  const numPeople = tenant.numPeople;
  const maxOccupants = listing.maxOccupants;
  if (numPeople == null || maxOccupants == null) return 70;
  if (numPeople <= maxOccupants) return 100;
  const over = numPeople - maxOccupants;
  return Math.max(0, 50 - over * 25);
}

/**
 * Presenza bambini: tenant.hasChildren/numChildren vs listing.childrenAllowed
 */
function scoreChildren(tenant: Tenant, listing: Listing): number {
  const hasChildren = tenant.hasChildren === true || (tenant.numChildren != null && tenant.numChildren > 0);
  const childrenAllowed = listing.childrenAllowed;
  if (!hasChildren) return 100;
  if (childrenAllowed === undefined) return 100; // default true se non specificato
  return childrenAllowed ? 100 : 0;
}

/**
 * Costruisce l'elenco dei dealbreaker in base ai punteggi del breakdown
 */
function buildDealbreakers(breakdown: MatchBreakdown, tenant: Tenant, listing: Listing): string[] {
  const out: string[] = [];
  if (breakdown.budget <= 20) out.push('Budget insufficiente rispetto al canone');
  if (breakdown.location <= 20) out.push('Località non nelle preferenze');
  if (breakdown.rooms <= 20) out.push('Numero locali non compatibile');
  if (breakdown.preferences <= 30) out.push('Preferenze incompatibili (es. animali, fumo, arredamento)');
  if (breakdown.incomeRatio <= 20) out.push('Rapporto reddito/affitto troppo basso');
  if (tenant.preferences.hasPets && !listing.petsAllowed) out.push('Animali non ammessi');
  if (tenant.preferences.smokingAllowed && !listing.smokingAllowed) out.push('Fumo non ammesso');
  if (tenant.numPeople != null && listing.maxOccupants != null && tenant.numPeople > listing.maxOccupants) {
    out.push('Numero persone superiore al massimo ammesso');
  }
  const hasChildren = tenant.hasChildren === true || (tenant.numChildren != null && tenant.numChildren > 0);
  if (hasChildren && listing.childrenAllowed === false) {
    out.push('Bambini non ammessi');
  }
  return out;
}

/**
 * Calcola il match score tra un inquilino e un annuncio
 */
export function calculateMatch(tenant: Tenant, listing: Listing): MatchResult {
  const breakdown: MatchBreakdown = {
    budget: scoreBudget(tenant, listing),
    location: scoreLocation(tenant, listing),
    rooms: scoreRooms(tenant, listing),
    preferences: scorePreferences(tenant, listing),
    availability: scoreAvailability(tenant, listing),
    contractDuration: scoreContractDuration(tenant, listing),
    incomeRatio: scoreIncomeRatio(tenant, listing),
    employment: scoreEmployment(tenant),
    reliability: scoreReliability(tenant),
    urgency: scoreUrgency(tenant, listing),
    age: scoreAge(tenant, listing),
    numPeople: scoreNumPeople(tenant, listing),
    children: scoreChildren(tenant, listing),
  };

  const totalWeight = 100;
  const score = Math.round(
    (breakdown.budget * WEIGHTS.budget +
      breakdown.location * WEIGHTS.location +
      breakdown.rooms * WEIGHTS.rooms +
      breakdown.preferences * WEIGHTS.preferences +
      breakdown.availability * WEIGHTS.availability +
      breakdown.contractDuration * WEIGHTS.contractDuration +
      breakdown.incomeRatio * WEIGHTS.incomeRatio +
      breakdown.employment * WEIGHTS.employment +
      breakdown.reliability * WEIGHTS.reliability +
      breakdown.urgency * WEIGHTS.urgency +
      breakdown.age * WEIGHTS.age +
      breakdown.numPeople * WEIGHTS.numPeople +
      breakdown.children * WEIGHTS.children) /
      totalWeight
  );

  const dealbreakers = buildDealbreakers(breakdown, tenant, listing);
  const isDealbreaker = dealbreakers.length > 0;
  const { label, color } = getMatchLabel(score);

  return {
    tenantId: tenant.id,
    listingId: listing.id,
    score,
    breakdown,
    label,
    color,
    isDealbreaker,
    dealbreakers,
  };
}

/**
 * Calcola match score semplificato per inquilino (senza annuncio specifico)
 * Usato nella TenantSearchPage per mostrare un punteggio generale
 */
export function calculateTenantScore(tenant: Tenant): number {
  const reliability = scoreReliability(tenant);
  const employment = scoreEmployment(tenant);

  // Media pesata affidabilita' + lavoro
  return Math.round(reliability * 0.6 + employment * 0.4);
}

/**
 * Ordina inquilini per match score rispetto a un annuncio
 */
export function rankTenantsByMatch(
  tenants: Tenant[],
  listing: Listing,
): (Tenant & { matchScore: number; matchLabel: MatchLabel; isDealbreaker: boolean; dealbreakers: string[] })[] {
  return tenants
    .map((tenant) => {
      const match = calculateMatch(tenant, listing);
      return {
        ...tenant,
        matchScore: match.score,
        matchLabel: match.label,
        isDealbreaker: match.isDealbreaker,
        dealbreakers: match.dealbreakers,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}