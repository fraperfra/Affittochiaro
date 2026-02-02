/**
 * RegisterPage
 * Pagina di registrazione multi-step con AWS Cognito
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  Globe,
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '../store';
import { ROUTES, ITALIAN_CITIES, OCCUPATIONS } from '../utils/constants';
import { Button, Input, Card } from '../components/ui';

type AccountType = 'tenant' | 'agency';
type Step = 1 | 2 | 3 | 4;

// Schema validazione Tenant
const tenantSchema = z.object({
  email: z.string().email('Email non valida'),
  password: z
    .string()
    .min(8, 'Minimo 8 caratteri')
    .regex(/[A-Z]/, 'Almeno una lettera maiuscola')
    .regex(/[0-9]/, 'Almeno un numero'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'Nome troppo corto'),
  lastName: z.string().min(2, 'Cognome troppo corto'),
  phone: z.string().optional(),
  occupation: z.string().optional(),
  city: z.string().optional(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Devi accettare i termini' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Le password non corrispondono',
  path: ['confirmPassword'],
});

// Schema validazione Agency
const agencySchema = z.object({
  email: z.string().email('Email non valida'),
  password: z
    .string()
    .min(8, 'Minimo 8 caratteri')
    .regex(/[A-Z]/, 'Almeno una lettera maiuscola')
    .regex(/[0-9]/, 'Almeno un numero'),
  confirmPassword: z.string(),
  agencyName: z.string().min(2, 'Nome agenzia troppo corto'),
  vatNumber: z
    .string()
    .regex(/^IT\d{11}$/, 'Formato: IT + 11 cifre'),
  phone: z.string().min(6, 'Telefono non valido'),
  city: z.string().min(1, 'Seleziona una città'),
  website: z.string().url('URL non valido').optional().or(z.literal('')),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Devi accettare i termini' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Le password non corrispondono',
  path: ['confirmPassword'],
});

type TenantFormData = z.infer<typeof tenantSchema>;
type AgencyFormData = z.infer<typeof agencySchema>;

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [step, setStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);

  const { register: registerUser, isLoading, error, clearError, pendingConfirmation } = useAuthStore();
  const navigate = useNavigate();

  const tenantForm = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    mode: 'onChange',
  });

  const agencyForm = useForm<AgencyFormData>({
    resolver: zodResolver(agencySchema),
    mode: 'onChange',
  });

  // Redirect a conferma email se registrazione avvenuta
  useEffect(() => {
    if (pendingConfirmation) {
      navigate(`${ROUTES.CONFIRM_EMAIL}?email=${encodeURIComponent(pendingConfirmation.email)}`);
    }
  }, [pendingConfirmation, navigate]);

  // Clear error on step change
  useEffect(() => {
    clearError();
  }, [step, clearError]);

  const handleAccountTypeSelect = (type: AccountType) => {
    setAccountType(type);
    setStep(2);
  };

  const handleNext = async () => {
    let isValid = true;

    if (step === 2) {
      if (accountType === 'tenant') {
        isValid = await tenantForm.trigger(['email', 'password', 'confirmPassword']);
      } else {
        isValid = await agencyForm.trigger(['email', 'password', 'confirmPassword']);
      }
    } else if (step === 3) {
      if (accountType === 'tenant') {
        isValid = await tenantForm.trigger(['firstName', 'lastName']);
      } else {
        isValid = await agencyForm.trigger(['agencyName', 'vatNumber', 'phone', 'city']);
      }
    }

    if (isValid && step < 4) {
      setStep((step + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setAccountType(null);
      setStep(1);
    } else if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  const handleSubmitTenant = async (data: TenantFormData) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        role: 'tenant',
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        occupation: data.occupation,
        city: data.city,
      });
      // Redirect gestito da useEffect
    } catch (err) {
      // Errore gestito dallo store
    }
  };

  const handleSubmitAgency = async (data: AgencyFormData) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        role: 'agency',
        firstName: data.agencyName,
        lastName: '',
        phone: data.phone,
        agencyName: data.agencyName,
        vatNumber: data.vatNumber,
        city: data.city,
      });
      // Redirect gestito da useEffect
    } catch (err) {
      // Errore gestito dallo store
    }
  };

  const steps = [
    { num: 1, label: 'Tipo Account' },
    { num: 2, label: 'Credenziali' },
    { num: 3, label: 'Dati Profilo' },
    { num: 4, label: 'Conferma' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 via-teal-600 to-primary-500 flex items-center justify-center p-4">
      {/* Back to Landing */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Torna alla home</span>
      </Link>

      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-6">
          <img
            src="/assets/logoaffittochiaro_pic.webp"
            alt="Affittochiaro"
            className="h-12 mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold text-white">Crea il tuo Account</h1>
        </div>

        <Card className="animate-slide-up">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((s) => (
                <div
                  key={s.num}
                  className={`flex flex-col items-center ${
                    s.num <= step ? 'text-primary-500' : 'text-text-muted'
                  }`}
                >
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${s.num < step ? 'bg-primary-500 text-white' : ''}
                      ${s.num === step ? 'bg-primary-100 text-primary-600 border-2 border-primary-500' : ''}
                      ${s.num > step ? 'bg-background-secondary text-text-muted' : ''}
                    `}
                  >
                    {s.num < step ? <Check size={16} /> : s.num}
                  </div>
                  <span className="text-xs mt-1 hidden sm:block">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="h-1 bg-background-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 transition-all duration-300"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Step 1: Account Type */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-center mb-6">Come vuoi registrarti?</h2>
              <button
                onClick={() => handleAccountTypeSelect('tenant')}
                className="w-full p-6 rounded-xl border-2 border-border hover:border-primary-500 hover:bg-primary-50 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🏠</span>
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary-600">Sono un Inquilino</h3>
                    <p className="text-sm text-text-secondary">Cerco casa in affitto</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => handleAccountTypeSelect('agency')}
                className="w-full p-6 rounded-xl border-2 border-border hover:border-primary-500 hover:bg-primary-50 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🏢</span>
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary-600">Sono un'Agenzia</h3>
                    <p className="text-sm text-text-secondary">Cerco inquilini affidabili</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Step 2: Credentials */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-center mb-6">Crea le tue credenziali</h2>
              <Input
                label="Email"
                type="email"
                placeholder="la-tua@email.com"
                leftIcon={<Mail size={18} />}
                error={accountType === 'tenant'
                  ? tenantForm.formState.errors.email?.message
                  : agencyForm.formState.errors.email?.message
                }
                {...(accountType === 'tenant'
                  ? tenantForm.register('email')
                  : agencyForm.register('email')
                )}
              />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimo 8 caratteri"
                leftIcon={<Lock size={18} />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                hint="Almeno 8 caratteri, una maiuscola e un numero"
                error={accountType === 'tenant'
                  ? tenantForm.formState.errors.password?.message
                  : agencyForm.formState.errors.password?.message
                }
                {...(accountType === 'tenant'
                  ? tenantForm.register('password')
                  : agencyForm.register('password')
                )}
              />
              <Input
                label="Conferma Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ripeti la password"
                leftIcon={<Lock size={18} />}
                error={accountType === 'tenant'
                  ? tenantForm.formState.errors.confirmPassword?.message
                  : agencyForm.formState.errors.confirmPassword?.message
                }
                {...(accountType === 'tenant'
                  ? tenantForm.register('confirmPassword')
                  : agencyForm.register('confirmPassword')
                )}
              />
            </div>
          )}

          {/* Step 3: Profile Data - Tenant */}
          {step === 3 && accountType === 'tenant' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-center mb-6">I tuoi dati personali</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nome"
                  placeholder="Mario"
                  leftIcon={<User size={18} />}
                  error={tenantForm.formState.errors.firstName?.message}
                  {...tenantForm.register('firstName')}
                />
                <Input
                  label="Cognome"
                  placeholder="Rossi"
                  error={tenantForm.formState.errors.lastName?.message}
                  {...tenantForm.register('lastName')}
                />
              </div>
              <Input
                label="Telefono (opzionale)"
                placeholder="+39 333 1234567"
                leftIcon={<Phone size={18} />}
                {...tenantForm.register('phone')}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Occupazione (opzionale)
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  {...tenantForm.register('occupation')}
                >
                  <option value="">Seleziona...</option>
                  {OCCUPATIONS.map((occ) => (
                    <option key={occ} value={occ}>{occ}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Città (opzionale)
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  {...tenantForm.register('city')}
                >
                  <option value="">Seleziona...</option>
                  {ITALIAN_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Profile Data - Agency */}
          {step === 3 && accountType === 'agency' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-center mb-6">Dati della tua Agenzia</h2>
              <Input
                label="Nome Agenzia"
                placeholder="Immobiliare XYZ"
                leftIcon={<Building2 size={18} />}
                error={agencyForm.formState.errors.agencyName?.message}
                {...agencyForm.register('agencyName')}
              />
              <Input
                label="Partita IVA"
                placeholder="IT12345678901"
                error={agencyForm.formState.errors.vatNumber?.message}
                {...agencyForm.register('vatNumber')}
              />
              <Input
                label="Telefono"
                placeholder="+39 02 1234567"
                leftIcon={<Phone size={18} />}
                error={agencyForm.formState.errors.phone?.message}
                {...agencyForm.register('phone')}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Città
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  {...agencyForm.register('city')}
                >
                  <option value="">Seleziona...</option>
                  {ITALIAN_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {agencyForm.formState.errors.city && (
                  <p className="mt-1 text-sm text-red-500">{agencyForm.formState.errors.city.message}</p>
                )}
              </div>
              <Input
                label="Sito Web (opzionale)"
                placeholder="https://www.tuaagenzia.it"
                leftIcon={<Globe size={18} />}
                error={agencyForm.formState.errors.website?.message}
                {...agencyForm.register('website')}
              />
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-center">Conferma la registrazione</h2>

              {/* Riepilogo */}
              <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">
                    {accountType === 'tenant'
                      ? tenantForm.getValues('email')
                      : agencyForm.getValues('email')
                    }
                  </p>
                </div>
                {accountType === 'tenant' ? (
                  <div>
                    <p className="text-sm text-gray-500">Nome</p>
                    <p className="font-medium">
                      {tenantForm.getValues('firstName')} {tenantForm.getValues('lastName')}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500">Agenzia</p>
                    <p className="font-medium">{agencyForm.getValues('agencyName')}</p>
                  </div>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  {...(accountType === 'tenant'
                    ? tenantForm.register('acceptTerms')
                    : agencyForm.register('acceptTerms')
                  )}
                />
                <span className="text-sm text-gray-600">
                  Accetto i{' '}
                  <a href="#" className="text-primary-500 hover:underline">
                    Termini e Condizioni
                  </a>{' '}
                  e la{' '}
                  <a href="#" className="text-primary-500 hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {(accountType === 'tenant'
                ? tenantForm.formState.errors.acceptTerms
                : agencyForm.formState.errors.acceptTerms
              ) && (
                <p className="text-sm text-red-500">
                  {accountType === 'tenant'
                    ? tenantForm.formState.errors.acceptTerms?.message
                    : agencyForm.formState.errors.acceptTerms?.message
                  }
                </p>
              )}

              <p className="text-xs text-gray-500 text-center">
                Riceverai un'email con un codice di verifica per confermare il tuo account.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          {step > 1 && (
            <div className="flex gap-3 mt-8">
              <Button
                variant="secondary"
                onClick={handleBack}
                leftIcon={<ArrowLeft size={18} />}
                disabled={isLoading}
              >
                Indietro
              </Button>
              {step < 4 ? (
                <Button
                  className="flex-1"
                  onClick={handleNext}
                  rightIcon={<ArrowRight size={18} />}
                >
                  Avanti
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  onClick={accountType === 'tenant'
                    ? tenantForm.handleSubmit(handleSubmitTenant)
                    : agencyForm.handleSubmit(handleSubmitAgency)
                  }
                  isLoading={isLoading}
                >
                  Completa Registrazione
                </Button>
              )}
            </div>
          )}

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Hai già un account?{' '}
              <Link to={ROUTES.LOGIN} className="text-primary-500 hover:text-primary-600 font-medium">
                Accedi
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
