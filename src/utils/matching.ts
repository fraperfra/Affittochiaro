/**
 * Matching Algorithm - Calcola compatibilita' inquilino-annuncio
 *
 * Pesi:
 *  - Budget: 25% (puo' permettersi l'affitto?)
 *  - Citta: 20% (citta' preferita match?)
 *  - Affidabilita: 20% (profilo completo, verificato, documenti)
 *  - Lavoro: 15% (stabilita' lavorativa)
 *  - Preferenze: 10% (animali, fumatore, arredamento)
 *  - Disponibilita: 10% (date compatibili)
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
}

export interface MatchBreakdown {
  budget: number;
  location: number;
  reliability: number;
  employment: number;
  preferences: number;
  availability: number;
}

export type MatchLabel = 'Eccellente' | 'Ottimo' | 'Buono' | 'Sufficiente' | 'Basso';

const WEIGHTS = {
  budget: 25,
  location: 20,
  reliability: 20,
  employment: 15,
  preferences: 10,
  availability: 10,
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
 * Calcola il match score tra un inquilino e un annuncio
 */
export function calculateMatch(tenant: Tenant, listing: Listing): MatchResult {
  const breakdown: MatchBreakdown = {
    budget: scoreBudget(tenant, listing),
    location: scoreLocation(tenant, listing),
    reliability: scoreReliability(tenant),
    employment: scoreEmployment(tenant),
    preferences: scorePreferences(tenant, listing),
    availability: scoreAvailability(tenant, listing),
  };

  const score = Math.round(
    (breakdown.budget * WEIGHTS.budget +
      breakdown.location * WEIGHTS.location +
      breakdown.reliability * WEIGHTS.reliability +
      breakdown.employment * WEIGHTS.employment +
      breakdown.preferences * WEIGHTS.preferences +
      breakdown.availability * WEIGHTS.availability) / 100
  );

  const { label, color } = getMatchLabel(score);

  return {
    tenantId: tenant.id,
    listingId: listing.id,
    score,
    breakdown,
    label,
    color,
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
): (Tenant & { matchScore: number; matchLabel: MatchLabel })[] {
  return tenants
    .map((tenant) => {
      const match = calculateMatch(tenant, listing);
      return { ...tenant, matchScore: match.score, matchLabel: match.label };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
