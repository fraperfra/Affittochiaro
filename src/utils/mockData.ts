import {
  Tenant,
  Agency,
  Listing,
  Notification,
  EmploymentType,
  DocumentType,
  AgencyPlan,
  PropertyType,
  ListingFeature,
  ListingStatus,
  NotificationType,
} from '../types';
import { ITALIAN_CITIES, OCCUPATIONS } from './constants';
import { randomCoordinateNear } from '../data/cityCoordinates';

// Helper functions for generating mock data
const randomId = () => Math.random().toString(36).substring(2, 15);

const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const randomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomBoolean = (probability = 0.5): boolean => Math.random() < probability;

const randomDate = (start: Date, end: Date): Date =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// Italian first names
const FIRST_NAMES = [
  'Marco', 'Luca', 'Giuseppe', 'Francesco', 'Alessandro', 'Andrea', 'Matteo', 'Lorenzo',
  'Davide', 'Simone', 'Federico', 'Riccardo', 'Stefano', 'Gabriele', 'Christian',
  'Maria', 'Anna', 'Giulia', 'Francesca', 'Sara', 'Laura', 'Chiara', 'Valentina',
  'Alessia', 'Martina', 'Giorgia', 'Elisa', 'Silvia', 'Federica', 'Elena',
];

// Italian last names
const LAST_NAMES = [
  'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci',
  'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa',
  'Giordano', 'Rizzo', 'Lombardi', 'Moretti', 'Barbieri', 'Fontana', 'Santoro', 'Mariani',
  'Rinaldi', 'Caruso', 'Ferrara', 'Galli', 'Martini', 'Leone',
];

const EMPLOYMENT_TYPES: EmploymentType[] = [
  'permanent', 'fixed_term', 'freelance', 'internship', 'student', 'retired',
];

const AGENCY_PLANS: AgencyPlan[] = ['free', 'base', 'professional', 'enterprise'];

const PROPERTY_TYPES: PropertyType[] = [
  'apartment', 'studio', 'loft', 'villa', 'house', 'room',
];

const LISTING_FEATURES: ListingFeature[] = [
  'balcony', 'terrace', 'parking', 'elevator', 'air_conditioning',
  'washing_machine', 'dishwasher', 'internet', 'alarm',
];

const AGENCY_NAMES = [
  'Immobiliare', 'Casa', 'Tecnocasa', 'Gabetti', 'Remax', 'Toscano',
  'Engel & Völkers', 'Coldwell Banker', 'Century 21', 'Grimaldi',
];

const AGENCY_SUFFIXES = [
  'Centrale', 'Milano', 'Roma', 'Premium', 'Elite', 'Group',
  'Real Estate', 'Properties', 'Italia', 'International',
];

// Generate mock tenants
export function generateMockTenants(count: number): Tenant[] {
  const tenants: Tenant[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = randomElement(FIRST_NAMES);
    const lastName = randomElement(LAST_NAMES);
    const hasVideo = randomBoolean(0.4);
    const isVerified = randomBoolean(0.6);
    const city = randomElement(ITALIAN_CITIES);
    const occupation = randomElement(OCCUPATIONS);
    const employmentType = randomElement(EMPLOYMENT_TYPES);
    const createdAt = randomDate(new Date('2023-01-01'), new Date());

    const tenant: Tenant = {
      id: `tenant-${i + 1}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
      firstName,
      lastName,
      phone: `+39 ${randomNumber(320, 399)} ${randomNumber(1000000, 9999999)}`,
      avatar: randomBoolean(0.7) ? `https://i.pravatar.cc/150?u=${i}` : undefined,
      dateOfBirth: randomDate(new Date('1970-01-01'), new Date('2002-01-01')),
      age: randomNumber(22, 55),
      bio: randomBoolean(0.6)
        ? `Ciao! Sono ${firstName}, lavoro come ${occupation.toLowerCase()} a ${city}. Cerco un appartamento accogliente dove sentirmi a casa.`
        : undefined,
      occupation,
      employmentType,
      employer: randomBoolean(0.5) ? `${randomElement(['Acme', 'TechCorp', 'GlobalInc', 'StartupXYZ'])} S.r.l.` : undefined,
      annualIncome: employmentType !== 'student' && employmentType !== 'retired'
        ? randomNumber(18000, 80000)
        : undefined,
      incomeVisible: randomBoolean(0.7),
      employmentStartDate: randomBoolean(0.5)
        ? randomDate(new Date('2015-01-01'), new Date())
        : undefined,
      isVerified,
      hasVideo,
      videoUrl: hasVideo ? `https://example.com/video/${i}` : undefined,
      videoDuration: hasVideo ? randomNumber(30, 120) : undefined,
      videoUploadedAt: hasVideo ? randomDate(new Date('2024-01-01'), new Date()) : undefined,
      profileCompleteness: randomNumber(40, 100),
      badges: [
        ...(isVerified ? [{ id: 'verified', type: 'verified' as const, label: 'Verificato', icon: '✓' }] : []),
        ...(hasVideo ? [{ id: 'video', type: 'video' as const, label: 'Video', icon: '🎥' }] : []),
      ],
      rating: randomBoolean(0.3) ? randomNumber(35, 50) / 10 : undefined,
      reviewsCount: randomNumber(0, 5),
      currentCity: city,
      currentAddress: {
        street: `Via ${randomElement(['Roma', 'Milano', 'Torino', 'Napoli', 'Firenze'])} ${randomNumber(1, 200)}`,
        city,
        province: city.substring(0, 2).toUpperCase(),
        postalCode: `${randomNumber(10, 99)}${randomNumber(100, 999)}`,
        country: 'Italia',
      },
      preferences: {
        maxBudget: randomNumber(500, 2000),
        minRooms: randomNumber(1, 2),
        maxRooms: randomNumber(3, 5),
        preferredCities: [city, ...ITALIAN_CITIES.slice(0, randomNumber(1, 3))].slice(0, 3),
        hasPets: randomBoolean(0.2),
        petType: randomBoolean(0.2) ? randomElement(['Cane', 'Gatto']) : undefined,
        furnished: randomElement(['yes', 'no', 'indifferent']),
        smokingAllowed: randomBoolean(0.1),
        parkingRequired: randomBoolean(0.3),
        availableFrom: randomDate(new Date(), new Date('2025-06-01')),
      },
      documents: [
        {
          id: `doc-${i}-1`,
          type: 'identity_card' as DocumentType,
          name: 'Carta_Identita.pdf',
          file: {
            id: `file-${i}-1`,
            name: 'Carta_Identita.pdf',
            type: 'application/pdf',
            size: randomNumber(100000, 500000),
            url: '#',
            uploadedAt: randomDate(new Date('2024-01-01'), new Date()),
          },
          status: randomElement(['pending', 'verified', 'verified', 'verified']),
          uploadedAt: randomDate(new Date('2024-01-01'), new Date()),
        },
      ],
      references: [],
      profileViews: randomNumber(10, 500),
      applicationsSent: randomNumber(0, 20),
      matchesReceived: randomNumber(0, 10),
      createdAt,
      updatedAt: randomDate(createdAt, new Date()),
      lastActive: randomDate(new Date('2024-10-01'), new Date()),
      status: 'active',
      availableFrom: randomDate(new Date(), new Date('2025-06-01')),
    };

    tenants.push(tenant);
  }

  return tenants;
}

// Generate mock agencies
export function generateMockAgencies(count: number): Agency[] {
  const agencies: Agency[] = [];

  for (let i = 0; i < count; i++) {
    const name = `${randomElement(AGENCY_NAMES)} ${randomElement(AGENCY_SUFFIXES)}`;
    const city = randomElement(ITALIAN_CITIES);
    const plan = randomElement(AGENCY_PLANS);
    const isVerified = randomBoolean(0.7);
    const createdAt = randomDate(new Date('2022-01-01'), new Date());

    const creditsPerPlan: Record<AgencyPlan, number> = {
      free: 5,
      base: 25,
      professional: 75,
      enterprise: 200,
    };

    const agency: Agency = {
      id: `agency-${i + 1}`,
      email: `info@${name.toLowerCase().replace(/\s+/g, '')}.it`,
      name,
      logo: randomBoolean(0.6) ? `https://logo.clearbit.com/${name.toLowerCase().replace(/\s+/g, '')}.it` : undefined,
      description: `Agenzia immobiliare con sede a ${city}. Specializzati in affitti residenziali e commerciali.`,
      vatNumber: `IT${randomNumber(10000000000, 99999999999)}`,
      phone: `+39 0${randomNumber(2, 6)} ${randomNumber(1000000, 9999999)}`,
      website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.it`,
      address: {
        street: `Via ${randomElement(['Dante', 'Manzoni', 'Garibaldi', 'Verdi'])} ${randomNumber(1, 100)}`,
        city,
        province: city.substring(0, 2).toUpperCase(),
        postalCode: `${randomNumber(10, 99)}${randomNumber(100, 999)}`,
        country: 'Italia',
      },
      plan,
      credits: randomNumber(0, creditsPerPlan[plan]),
      creditsUsedThisMonth: randomNumber(0, creditsPerPlan[plan]),
      planStartDate: randomDate(new Date('2024-01-01'), new Date()),
      planExpiresAt: randomDate(new Date(), new Date('2025-12-31')),
      listingsCount: randomNumber(5, 100),
      activeListingsCount: randomNumber(2, 50),
      tenantsUnlocked: randomNumber(10, 200),
      matchesCount: randomNumber(5, 100),
      isVerified,
      badges: isVerified
        ? [{ id: 'verified', type: 'verified' as const, label: 'Verificata', icon: '✓' }]
        : [],
      rating: randomBoolean(0.5) ? randomNumber(35, 50) / 10 : undefined,
      reviewsCount: randomNumber(0, 50),
      status: 'active',
      createdAt,
      updatedAt: randomDate(createdAt, new Date()),
      lastActive: randomDate(new Date('2024-10-01'), new Date()),
    };

    agencies.push(agency);
  }

  return agencies;
}

// Generate mock listings
export function generateMockListings(count: number, agencies: Agency[]): Listing[] {
  const listings: Listing[] = [];

  const ZONES = ['Centro', 'Periferia', 'Semicentro', 'Quartiere Residenziale', 'Zona Industriale'];

  for (let i = 0; i < count; i++) {
    const agency = randomElement(agencies);
    const city = randomElement(ITALIAN_CITIES);
    const propertyType = randomElement(PROPERTY_TYPES);
    const rooms = propertyType === 'studio' ? 1 : randomNumber(1, 5);
    const price = randomNumber(400, 2500);
    const createdAt = randomDate(new Date('2024-01-01'), new Date());

    const statusOptions: ListingStatus[] = ['active', 'active', 'active', 'paused', 'rented', 'expired'];

    const listing: Listing = {
      id: `listing-${i + 1}`,
      agencyId: agency.id,
      agencyName: agency.name,
      agencyLogo: agency.logo,
      title: `${propertyType === 'studio' ? 'Monolocale' : `${rooms} locali`} in ${city} - ${randomElement(ZONES)}`,
      description: `Splendido appartamento di ${rooms} locali situato in zona ${randomElement(ZONES).toLowerCase()}. L'immobile si presenta in ottime condizioni e dispone di tutti i comfort moderni. Ideale per ${rooms <= 2 ? 'singoli o coppie' : 'famiglie'}.`,
      propertyType,
      address: {
        street: `Via ${randomElement(['Dante', 'Manzoni', 'Garibaldi', 'Verdi', 'Roma', 'Milano'])} ${randomNumber(1, 200)}`,
        city,
        province: city.substring(0, 2).toUpperCase(),
        postalCode: `${randomNumber(10, 99)}${randomNumber(100, 999)}`,
        country: 'Italia',
      },
      coordinates: randomCoordinateNear(city),
      zone: randomElement(ZONES),
      price,
      expenses: randomBoolean(0.7) ? randomNumber(50, 200) : undefined,
      deposit: price * randomNumber(2, 3),
      rooms,
      bathrooms: randomNumber(1, Math.min(rooms, 3)),
      squareMeters: rooms * randomNumber(20, 35) + randomNumber(10, 30),
      floor: randomNumber(0, 10),
      totalFloors: randomNumber(3, 12),
      features: LISTING_FEATURES.filter(() => randomBoolean(0.4)),
      furnished: randomElement(['yes', 'no', 'partial']),
      heatingType: randomElement(['autonomous', 'centralized', 'floor']),
      energyClass: randomElement(['A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G']),
      images: [],
      virtualTourUrl: randomBoolean(0.1) ? 'https://example.com/tour' : undefined,
      availableFrom: randomDate(new Date(), new Date('2025-06-01')),
      minContractDuration: randomElement([6, 12, 24, 36]),
      petsAllowed: randomBoolean(0.3),
      smokingAllowed: randomBoolean(0.1),
      studentsAllowed: randomBoolean(0.6),
      couplesAllowed: randomBoolean(0.9),
      views: randomNumber(50, 2000),
      applicationsCount: randomNumber(0, 30),
      savedCount: randomNumber(0, 100),
      status: randomElement(statusOptions),
      isHighlighted: randomBoolean(0.1),
      createdAt,
      updatedAt: randomDate(createdAt, new Date()),
      publishedAt: createdAt,
      expiresAt: randomDate(new Date(), new Date('2025-12-31')),
    };

    listings.push(listing);
  }

  return listings;
}

// Generate mock notifications
export function generateMockNotifications(userId: string, count: number): Notification[] {
  const notifications: Notification[] = [];

  const types: NotificationType[] = [
    'profile_view', 'new_match', 'application_received',
    'document_verified', 'new_listing', 'system_message',
  ];

  const messages: Record<NotificationType, string[]> = {
    profile_view: [
      'Immobiliare Centrale ha visualizzato il tuo profilo',
      'Un\'agenzia ha visto il tuo CV',
      'Il tuo profilo ha ricevuto una nuova visualizzazione',
    ],
    new_match: [
      'Hai ricevuto un nuovo match!',
      'Un\'agenzia è interessata al tuo profilo',
      'Nuovo interesse per la tua candidatura',
    ],
    application_received: [
      'La tua candidatura è stata ricevuta',
      'Candidatura inviata con successo',
    ],
    application_accepted: ['La tua candidatura è stata accettata!'],
    application_rejected: ['Candidatura non accettata'],
    document_verified: ['Il tuo documento è stato verificato'],
    document_rejected: ['Documento rifiutato - ricarica'],
    new_listing: ['Nuovo annuncio nella tua zona'],
    listing_expired: ['Un annuncio salvato è scaduto'],
    credit_low: ['Crediti in esaurimento'],
    credit_purchased: ['Crediti acquistati con successo'],
    plan_upgrade: ['Piano aggiornato'],
    plan_expiring: ['Il tuo piano sta per scadere'],
    system_message: ['Benvenuto su Affittochiaro!'],
    welcome: ['Benvenuto! Completa il tuo profilo'],
  };

  for (let i = 0; i < count; i++) {
    const type = randomElement(types);
    const createdAt = randomDate(new Date('2024-10-01'), new Date());

    notifications.push({
      id: `notif-${i + 1}`,
      userId,
      type,
      title: type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      message: randomElement(messages[type] || ['Notifica di sistema']),
      isRead: randomBoolean(0.6),
      createdAt,
      readAt: randomBoolean(0.4) ? randomDate(createdAt, new Date()) : undefined,
    });
  }

  return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// Pre-generated data
export const mockTenants = generateMockTenants(245);
export const mockAgencies = generateMockAgencies(34);
export const mockListings = generateMockListings(15243, mockAgencies);

// Stats
export const mockTenantStats = {
  totalTenants: 245,
  verifiedTenants: mockTenants.filter((t) => t.isVerified).length,
  tenantsWithVideo: mockTenants.filter((t) => t.hasVideo).length,
  newThisMonth: 23,
  averageCompleteness: Math.round(
    mockTenants.reduce((sum, t) => sum + t.profileCompleteness, 0) / mockTenants.length
  ),
  topCities: ITALIAN_CITIES.slice(0, 5).map((city) => ({
    city,
    count: mockTenants.filter((t) => t.currentCity === city).length,
  })),
};

export const mockAgencyStats = {
  totalAgencies: 34,
  verifiedAgencies: mockAgencies.filter((a) => a.isVerified).length,
  activeThisMonth: 28,
  totalRevenue: 45680,
  revenueThisMonth: 8920,
  planDistribution: {
    free: mockAgencies.filter((a) => a.plan === 'free').length,
    base: mockAgencies.filter((a) => a.plan === 'base').length,
    professional: mockAgencies.filter((a) => a.plan === 'professional').length,
    enterprise: mockAgencies.filter((a) => a.plan === 'enterprise').length,
  },
  topAgencies: mockAgencies.slice(0, 5).map((a) => ({ agency: a, score: randomNumber(80, 100) })),
};

export const mockListingStats = {
  totalListings: 15243,
  activeListings: mockListings.filter((l) => l.status === 'active').length,
  rentedThisMonth: 342,
  averagePrice: Math.round(
    mockListings.reduce((sum, l) => sum + l.price, 0) / mockListings.length
  ),
  averageDaysToRent: 18,
  topCities: ITALIAN_CITIES.slice(0, 5).map((city) => ({
    city,
    count: mockListings.filter((l) => l.address.city === city).length,
  })),
  priceDistribution: [
    { range: '< €500', count: mockListings.filter((l) => l.price < 500).length },
    { range: '€500-800', count: mockListings.filter((l) => l.price >= 500 && l.price < 800).length },
    { range: '€800-1200', count: mockListings.filter((l) => l.price >= 800 && l.price < 1200).length },
    { range: '€1200-1500', count: mockListings.filter((l) => l.price >= 1200 && l.price < 1500).length },
    { range: '> €1500', count: mockListings.filter((l) => l.price >= 1500).length },
  ],
};
