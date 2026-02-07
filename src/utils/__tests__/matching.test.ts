import { describe, it, expect } from 'vitest';
import { calculateMatch, rankTenantsByMatch } from '../matching';
import type { Tenant } from '../../types/tenant';
import type { Listing } from '../../types/listing';
import type { Address } from '../../types/common';

const REGGIO_EMILIA_ADDRESS: Address = {
  street: 'Via Roma 15',
  city: 'Reggio Emilia',
  province: 'RE',
  postalCode: '42121',
  country: 'IT',
};

const PARMA_ADDRESS: Address = {
  street: 'Via Mazzini 8',
  city: 'Parma',
  province: 'PR',
  postalCode: '43121',
  country: 'IT',
};

const MODENA_ADDRESS: Address = {
  street: 'Via Emilia 22',
  city: 'Modena',
  province: 'MO',
  postalCode: '41121',
  country: 'IT',
};

const baseDate = new Date('2025-03-01');

function createBaseListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: 'lst-re-001',
    agencyId: 'agy-001',
    agencyName: 'Immobiliare Reggio',
    title: 'Appartamento 3 locali centro Reggio Emilia',
    description: 'Tranquillo, luminoso, vicino stazione.',
    propertyType: 'apartment',
    address: REGGIO_EMILIA_ADDRESS,
    price: 750,
    expenses: 80,
    deposit: 1500,
    rooms: 3,
    bathrooms: 1,
    squareMeters: 75,
    features: ['balcony', 'internet'],
    furnished: 'yes',
    images: [],
    availableFrom: baseDate,
    minContractDuration: 12,
    maxContractDuration: 24,
    petsAllowed: true,
    smokingAllowed: false,
    studentsAllowed: true,
    couplesAllowed: true,
    views: 0,
    applicationsCount: 0,
    savedCount: 0,
    status: 'active',
    isHighlighted: false,
    createdAt: baseDate,
    updatedAt: baseDate,
    ...overrides,
  };
}

function createBaseTenant(overrides: Partial<Tenant> = {}): Tenant {
  const prefs = (overrides.preferences as Partial<Tenant['preferences']>) ?? {};
  return {
    id: 't-001',
    email: 'mario.rossi@email.it',
    firstName: 'Mario',
    lastName: 'Rossi',
    incomeVisible: true,
    isVerified: true,
    hasVideo: true,
    profileCompleteness: 90,
    badges: [{ id: 'b1', type: 'verified', label: 'Verificato', icon: 'check' }],
    reviewsCount: 0,
    preferences: {
      preferredCities: ['Reggio Emilia'],
      hasPets: false,
      maxBudget: 950,
      minRooms: 3,
      maxRooms: 3,
      furnished: 'yes',
      smokingAllowed: false,
      availableFrom: baseDate,
      desiredContractMonths: 12,
      ...prefs,
    },
    documents: [
      {
        id: 'doc1',
        type: 'identity_card',
        name: 'Carta identità',
        file: { id: 'f1', name: 'id.pdf', type: 'application/pdf', size: 1000, url: '/f1', uploadedAt: baseDate },
        status: 'verified',
        uploadedAt: baseDate,
      },
    ],
    references: [{ id: 'r1', rating: 5, isVerified: true, createdAt: baseDate }],
    profileViews: 0,
    applicationsSent: 0,
    matchesReceived: 0,
    createdAt: baseDate,
    updatedAt: baseDate,
    status: 'active',
    annualIncome: 32000,
    employmentType: 'permanent',
    employmentStartDate: new Date('2020-06-01'),
    currentCity: 'Reggio Emilia',
    availableFrom: baseDate,
    ...overrides,
  } as Tenant;
}

describe('matching', () => {
  it('1. match perfetto: score > 85', () => {
    const listing = createBaseListing({
      price: 720,
      expenses: 80,
      rooms: 3,
      address: REGGIO_EMILIA_ADDRESS,
      petsAllowed: true,
      smokingAllowed: false,
      furnished: 'yes',
      availableFrom: baseDate,
    });
    const tenant = createBaseTenant({
      preferences: {
        preferredCities: ['Reggio Emilia'],
        hasPets: false,
        maxBudget: 950,
        minRooms: 3,
        maxRooms: 3,
        furnished: 'yes',
        smokingAllowed: false,
        availableFrom: baseDate,
        desiredContractMonths: 12,
      },
      currentCity: 'Reggio Emilia',
      annualIncome: 32000,
      availableFrom: baseDate,
    });

    const result = calculateMatch(tenant, listing);

    expect(result.score).toBeGreaterThan(85);
    expect(result.label).toBe('Eccellente');
    expect(result.isDealbreaker).toBe(false);
    expect(result.dealbreakers).toHaveLength(0);
    expect(result.breakdown.budget).toBeGreaterThanOrEqual(85);
    expect(result.breakdown.location).toBe(100);
    expect(result.breakdown.preferences).toBe(100);
  });

  it('2. dealbreaker animali: inquilino con animali, annuncio no animali → dealbreaker e preferenze basse', () => {
    const listing = createBaseListing({ petsAllowed: false });
    const tenant = createBaseTenant({
      preferences: {
        preferredCities: ['Reggio Emilia'],
        hasPets: true,
        petType: 'cane',
        maxBudget: 950,
        minRooms: 3,
        maxRooms: 3,
        furnished: 'yes',
        smokingAllowed: false,
      },
    });

    const result = calculateMatch(tenant, listing);

    expect(result.breakdown.preferences).toBeLessThanOrEqual(50);
    expect(result.isDealbreaker).toBe(true);
    expect(result.dealbreakers).toContain('Animali non ammessi');
  });

  it('3. budget fuori range (>40% sopra max): canone molto oltre budget → breakdown budget = 10', () => {
    // Canone 1000, budget max 600 → fuori budget (scoreBudget ritorna 10)
    const listing = createBaseListing({ price: 950, expenses: 50 }); // 1000 totale
    const tenant = createBaseTenant({
      preferences: {
        preferredCities: ['Reggio Emilia'],
        hasPets: false,
        maxBudget: 600,
        minRooms: 3,
        maxRooms: 3,
        furnished: 'yes',
        smokingAllowed: false,
      },
    });

    const result = calculateMatch(tenant, listing);

    expect(result.breakdown.budget).toBe(10);
    expect(result.isDealbreaker).toBe(true);
    expect(result.dealbreakers).toContain('Budget insufficiente rispetto al canone');
  });

  it('4. budget leggermente sopra: canone poco oltre budget → breakdown budget ridotto ma non minimo', () => {
    // Canone 820, budget 800 → leggermente sopra (scoreBudget 60)
    const listing = createBaseListing({ price: 780, expenses: 40 }); // 820
    const tenant = createBaseTenant({
      preferences: {
        preferredCities: ['Reggio Emilia'],
        hasPets: false,
        maxBudget: 800,
        minRooms: 3,
        maxRooms: 3,
        furnished: 'yes',
        smokingAllowed: false,
      },
    });

    const result = calculateMatch(tenant, listing);

    expect(result.breakdown.budget).toBeGreaterThanOrEqual(30);
    expect(result.breakdown.budget).toBeLessThan(85);
    expect(result.score).toBeGreaterThan(0);
  });

  it('5. città diversa: preferenze solo altre città → dealbreaker località', () => {
    const listing = createBaseListing({ address: REGGIO_EMILIA_ADDRESS });
    const tenant = createBaseTenant({
      preferences: {
        preferredCities: ['Parma', 'Modena'],
        hasPets: false,
        maxBudget: 950,
        minRooms: 3,
        maxRooms: 3,
        furnished: 'yes',
        smokingAllowed: false,
      },
      currentCity: 'Parma',
    });

    const result = calculateMatch(tenant, listing);

    expect(result.breakdown.location).toBe(20);
    expect(result.isDealbreaker).toBe(true);
    expect(result.dealbreakers).toContain('Località non nelle preferenze');
  });

  it('6. ranking di 5 inquilini mock rispetto a un annuncio', () => {
    const listing = createBaseListing({
      address: REGGIO_EMILIA_ADDRESS,
      price: 750,
      expenses: 80,
      rooms: 3,
      petsAllowed: true,
      smokingAllowed: false,
      furnished: 'yes',
      availableFrom: baseDate,
    });

    const tenant1 = createBaseTenant({
      id: 't-1',
      firstName: 'Alfa',
      preferences: { preferredCities: ['Reggio Emilia'], hasPets: false, maxBudget: 1000, minRooms: 3, maxRooms: 3, furnished: 'yes', smokingAllowed: false, availableFrom: baseDate },
      currentCity: 'Reggio Emilia',
      annualIncome: 35000,
      profileCompleteness: 95,
      isVerified: true,
      availableFrom: baseDate,
    });
    const tenant2 = createBaseTenant({
      id: 't-2',
      firstName: 'Beta',
      preferences: { preferredCities: ['Reggio Emilia'], hasPets: false, maxBudget: 900, minRooms: 3, maxRooms: 4, furnished: 'indifferent', smokingAllowed: false, availableFrom: baseDate },
      currentCity: 'Reggio Emilia',
      annualIncome: 28000,
      profileCompleteness: 70,
      isVerified: false,
      availableFrom: new Date('2025-04-01'),
    });
    const tenant3 = createBaseTenant({
      id: 't-3',
      firstName: 'Gamma',
      preferences: { preferredCities: ['Parma'], hasPets: false, maxBudget: 850, minRooms: 3, maxRooms: 3, furnished: 'yes', smokingAllowed: false },
      currentCity: 'Parma',
      annualIncome: 30000,
      profileCompleteness: 60,
      availableFrom: baseDate,
    });
    const tenant4 = createBaseTenant({
      id: 't-4',
      firstName: 'Delta',
      preferences: { preferredCities: ['Reggio Emilia'], hasPets: true, maxBudget: 950, minRooms: 3, maxRooms: 3, furnished: 'yes', smokingAllowed: false },
      currentCity: 'Reggio Emilia',
      annualIncome: 32000,
    });
    const listingNoPets = createBaseListing({ ...listing, petsAllowed: false });
    const tenant5 = createBaseTenant({
      id: 't-5',
      firstName: 'Epsilon',
      preferences: { preferredCities: ['Reggio Emilia'], hasPets: false, maxBudget: 700, minRooms: 2, maxRooms: 3, furnished: 'no', smokingAllowed: false, availableFrom: baseDate },
      currentCity: 'Reggio Emilia',
      annualIncome: 22000,
      profileCompleteness: 50,
      employmentType: 'fixed_term',
      availableFrom: baseDate,
    });

    const tenants = [tenant1, tenant2, tenant3, tenant4, tenant5];
    const ranked = rankTenantsByMatch(tenants, listing);

    expect(ranked).toHaveLength(5);
    for (let i = 0; i < ranked.length - 1; i++) {
      expect(ranked[i].matchScore).toBeGreaterThanOrEqual(ranked[i + 1].matchScore);
    }

    const scoreT1 = calculateMatch(tenant1, listing).score;
    const scoreT3 = calculateMatch(tenant3, listing).score;
    expect(scoreT1).toBeGreaterThan(scoreT3);
    const t3Ranked = ranked.find((r) => r.id === 't-3');
    expect(t3Ranked?.isDealbreaker).toBe(true);
    expect(t3Ranked?.dealbreakers).toContain('Località non nelle preferenze');

    const withNoPets = rankTenantsByMatch(tenants, listingNoPets);
    const deltaRanked = withNoPets.find((r) => r.id === 't-4');
    expect(deltaRanked?.isDealbreaker).toBe(true);
    expect(deltaRanked?.dealbreakers).toContain('Animali non ammessi');
  });
});
