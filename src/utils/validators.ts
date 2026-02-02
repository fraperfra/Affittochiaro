import { z } from 'zod';

// Common validation schemas

export const emailSchema = z
  .string()
  .min(1, 'Email obbligatoria')
  .email('Email non valida');

export const passwordSchema = z
  .string()
  .min(8, 'La password deve avere almeno 8 caratteri')
  .regex(/[A-Z]/, 'La password deve contenere almeno una lettera maiuscola')
  .regex(/[a-z]/, 'La password deve contenere almeno una lettera minuscola')
  .regex(/[0-9]/, 'La password deve contenere almeno un numero');

export const phoneSchema = z
  .string()
  .regex(
    /^(\+39)?\s?[0-9]{2,3}\s?[0-9]{6,7}$/,
    'Numero di telefono non valido'
  )
  .optional()
  .or(z.literal(''));

export const vatNumberSchema = z
  .string()
  .regex(/^IT[0-9]{11}$|^[0-9]{11}$/, 'Partita IVA non valida (formato: IT12345678901)');

export const fiscalCodeSchema = z
  .string()
  .regex(
    /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i,
    'Codice fiscale non valido'
  );

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password obbligatoria'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register tenant schema
export const registerTenantSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Conferma la password'),
    firstName: z.string().min(2, 'Nome obbligatorio (min. 2 caratteri)'),
    lastName: z.string().min(2, 'Cognome obbligatorio (min. 2 caratteri)'),
    phone: phoneSchema,
    dateOfBirth: z.date().optional(),
    occupation: z.string().optional(),
    city: z.string().optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Devi accettare i termini e condizioni',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Le password non corrispondono',
    path: ['confirmPassword'],
  });

export type RegisterTenantFormData = z.infer<typeof registerTenantSchema>;

// Register agency schema
export const registerAgencySchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Conferma la password'),
    agencyName: z.string().min(2, 'Nome agenzia obbligatorio'),
    vatNumber: vatNumberSchema,
    phone: z.string().min(1, 'Telefono obbligatorio'),
    city: z.string().min(1, 'Città obbligatoria'),
    website: z.string().url('URL non valido').optional().or(z.literal('')),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Devi accettare i termini e condizioni',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Le password non corrispondono',
    path: ['confirmPassword'],
  });

export type RegisterAgencyFormData = z.infer<typeof registerAgencySchema>;

// Tenant profile schema
export const tenantProfileSchema = z.object({
  firstName: z.string().min(2, 'Nome obbligatorio'),
  lastName: z.string().min(2, 'Cognome obbligatorio'),
  phone: phoneSchema,
  bio: z.string().max(500, 'Bio troppo lunga (max 500 caratteri)').optional(),
  occupation: z.string().optional(),
  employmentType: z.string().optional(),
  employer: z.string().optional(),
  annualIncome: z.number().positive().optional(),
  incomeVisible: z.boolean().optional(),
  currentCity: z.string().optional(),
});

export type TenantProfileFormData = z.infer<typeof tenantProfileSchema>;

// Tenant preferences schema
export const tenantPreferencesSchema = z.object({
  maxBudget: z.number().positive().optional(),
  minRooms: z.number().int().positive().optional(),
  maxRooms: z.number().int().positive().optional(),
  preferredCities: z.array(z.string()),
  hasPets: z.boolean(),
  petType: z.string().optional(),
  furnished: z.enum(['yes', 'no', 'indifferent']).optional(),
  smokingAllowed: z.boolean().optional(),
  parkingRequired: z.boolean().optional(),
  availableFrom: z.date().optional(),
});

export type TenantPreferencesFormData = z.infer<typeof tenantPreferencesSchema>;

// Listing schema
export const listingSchema = z.object({
  title: z.string().min(10, 'Titolo troppo corto').max(100, 'Titolo troppo lungo'),
  description: z.string().min(50, 'Descrizione troppo corta').max(2000, 'Descrizione troppo lunga'),
  propertyType: z.string().min(1, 'Seleziona tipo immobile'),
  price: z.number().positive('Prezzo obbligatorio'),
  expenses: z.number().nonnegative().optional(),
  deposit: z.number().nonnegative().optional(),
  rooms: z.number().int().positive('Numero locali obbligatorio'),
  bathrooms: z.number().int().positive('Numero bagni obbligatorio'),
  squareMeters: z.number().positive('Superficie obbligatoria'),
  floor: z.number().int().optional(),
  totalFloors: z.number().int().positive().optional(),
  address: z.object({
    street: z.string().min(1, 'Indirizzo obbligatorio'),
    city: z.string().min(1, 'Città obbligatoria'),
    province: z.string().min(1, 'Provincia obbligatoria'),
    postalCode: z.string().min(5, 'CAP obbligatorio'),
  }),
  features: z.array(z.string()),
  furnished: z.enum(['yes', 'no', 'partial']),
  heatingType: z.string().optional(),
  energyClass: z.string().optional(),
  availableFrom: z.date(),
  minContractDuration: z.number().int().positive().optional(),
  petsAllowed: z.boolean(),
  smokingAllowed: z.boolean(),
  studentsAllowed: z.boolean(),
  couplesAllowed: z.boolean(),
});

export type ListingFormData = z.infer<typeof listingSchema>;

// Application schema
export const applicationSchema = z.object({
  message: z.string().max(500, 'Messaggio troppo lungo').optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

// Helper function to validate
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });

  return { success: false, errors };
}
