// Application constants

export const APP_NAME = 'Affittochiaro';
export const APP_TAGLINE = 'Il Curriculum dell\'Inquilino';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const API_TIMEOUT = 30000;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ACCEPTED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

// Profile
export const MAX_BIO_LENGTH = 500;
export const MIN_PASSWORD_LENGTH = 8;
export const PROFILE_COMPLETENESS_WEIGHTS = {
  avatar: 10,
  bio: 15,
  occupation: 10,
  employment: 15,
  documents: 30,
  video: 15,
  preferences: 5,
};

// Credits
export const CREDIT_COST_UNLOCK_PROFILE = 1;
export const CREDIT_COST_DOWNLOAD_CV = 0; // Free for paid plans

// Italian Cities
export const ITALIAN_CITIES = [
  'Milano',
  'Roma',
  'Napoli',
  'Torino',
  'Bologna',
  'Firenze',
  'Genova',
  'Venezia',
  'Verona',
  'Padova',
  'Trieste',
  'Brescia',
  'Parma',
  'Modena',
  'Reggio Emilia',
  'Ravenna',
  'Rimini',
  'Ferrara',
  'Piacenza',
  'Bergamo',
  'Monza',
  'Como',
  'Varese',
  'Pavia',
  'Cremona',
  'Mantova',
  'Lecco',
  'Lodi',
  'Bari',
  'Palermo',
  'Catania',
  'Messina',
  'Cagliari',
  'Sassari',
  'Perugia',
  'Ancona',
  'Pescara',
  'Trento',
  'Bolzano',
  'Udine',
  'Aosta',
];

// Occupations
export const OCCUPATIONS = [
  'Impiegato/a',
  'Manager',
  'Libero Professionista',
  'Imprenditore',
  'Commerciante',
  'Artigiano',
  'Operaio/a',
  'Insegnante',
  'Medico',
  'Infermiere/a',
  'Avvocato',
  'Commercialista',
  'Ingegnere',
  'Architetto',
  'Designer',
  'Sviluppatore Software',
  'Marketing Specialist',
  'Consulente',
  'Ricercatore',
  'Studente',
  'Pensionato/a',
  'Altro',
];

// Contract Types (tipologie di contratto di locazione)
export const CONTRACT_TYPES = [
  { value: '4+4', label: '4+4 (Canone libero)' },
  { value: '3+2', label: '3+2 (Canone concordato)' },
  { value: 'transitorio', label: 'Transitorio' },
  { value: 'studenti', label: 'Studenti' },
  { value: 'uso_foresteria', label: 'Uso foresteria' },
  { value: 'comodato', label: 'Comodato d\'uso' },
] as const;

// Routes
export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  CONFIRM_EMAIL: '/confirm-email',

  // Tenant
  TENANT_DASHBOARD: '/tenant',
  TENANT_PROFILE: '/tenant/profile',
  TENANT_CV: '/tenant/cv',
  TENANT_CV_PREVIEW: '/tenant/cv/preview',
  TENANT_LISTINGS: '/tenant/listings',
  TENANT_NOTIFICATIONS: '/tenant/notifications',
  TENANT_AGENCIES: '/tenant/agencies',
  TENANT_DOCUMENTS: '/tenant/documents',
  TENANT_MESSAGES: '/tenant/messages',
  TENANT_SETTINGS: '/tenant/settings',
  TENANT_SERVICES: '/tenant/services',
  TENANT_TEMPLATES: '/tenant/templates',
  TENANT_MORE: '/tenant/more',

  // Agency
  AGENCY_DASHBOARD: '/agency',
  AGENCY_TENANTS: '/agency/tenants',
  AGENCY_LISTINGS: '/agency/listings',
  AGENCY_APPLICATIONS: '/agency/applications',
  AGENCY_PLAN: '/agency/plan',
  AGENCY_MESSAGES: '/agency/messages',
  AGENCY_SETTINGS: '/agency/settings',
  AGENCY_DOCUMENTS: '/agency/documents',
  AGENCY_CALCULATORS: '/agency/calculators',
  AGENCY_UNLOCKED_PROFILES: '/agency/unlocked-profiles',
  AGENCY_MORE: '/agency/more',

  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_TENANTS: '/admin/tenants',
  ADMIN_AGENCIES: '/admin/agencies',
  ADMIN_LISTINGS: '/admin/listings',
  ADMIN_SYSTEM: '/admin/system',
} as const;

// Date formats
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};
