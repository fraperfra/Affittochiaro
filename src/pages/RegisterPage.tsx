/**
 * RegisterPage
 * Layout split: form a sinistra, pannello branded a destra
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Globe, Mail, Lock, User, Phone, Check, ArrowRight, ArrowLeft, AlertCircle, Eye, EyeOff, CheckCircle, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store';
import { ROUTES, ITALIAN_CITIES, OCCUPATIONS } from '../utils/constants';
import { Button, Input } from '../components/ui';

type AccountType = 'tenant' | 'agency';
type Step = 1 | 2 | 3 | 4;

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

const rightPanelContent: Record<Step, { title: string; subtitle: string }> = {
  1: {
    title: 'Unisciti ad Affittochiaro',
    subtitle: 'Il profilo inquilino che convince le agenzie. Crea il tuo curriculum digitale in pochi minuti.',
  },
  2: {
    title: 'Le tue credenziali',
    subtitle: 'Crea una password sicura per proteggere il tuo account.',
  },
  3: {
    title: 'Il tuo profilo',
    subtitle: 'Più dati fornisci, più sarai visibile alle agenzie partner.',
  },
  4: {
    title: 'Quasi fatto!',
    subtitle: 'Conferma i tuoi dati per completare la registrazione.',
  },
};

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

  useEffect(() => {
    if (pendingConfirmation) {
      navigate(`${ROUTES.CONFIRM_EMAIL}?email=${encodeURIComponent(pendingConfirmation.email)}`);
    }
  }, [pendingConfirmation, navigate]);

  useEffect(() => { clearError(); }, [step, clearError]);

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
    if (isValid && step < 4) setStep((step + 1) as Step);
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
    } catch (err) { }
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
    } catch (err) { }
  };

  const steps = [
    { num: 1, label: 'Tipo' },
    { num: 2, label: 'Credenziali' },
    { num: 3, label: 'Profilo' },
    { num: 4, label: 'Conferma' },
  ];

  const panelContent = rightPanelContent[step];

  return (
    <div className="min-h-screen flex font-sans">

      {/* ── LEFT PANEL – Form ─────────────────────────────────────────────── */}
      <div className="w-full lg:w-[500px] xl:w-[540px] flex flex-col bg-white overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center px-8 py-10 sm:px-12">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 self-start">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-700 to-primary-500 flex items-center justify-center">
              <span className="text-white font-black text-sm">A</span>
            </div>
            <span className="font-bold text-lg text-gray-900">Affittochiaro</span>
          </Link>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Crea il tuo Account</h1>
            <p className="text-gray-500 text-sm">Unisciti ad Affittochiaro oggi stesso</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {steps.map((s) => (
                <div
                  key={s.num}
                  className={`flex flex-col items-center ${s.num <= step ? 'text-primary-500' : 'text-text-muted'}`}
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${s.num < step ? 'bg-primary-500 text-white' : ''}
                    ${s.num === step ? 'bg-primary-100 text-primary-600 border-2 border-primary-500' : ''}
                    ${s.num > step ? 'bg-background-secondary text-text-muted' : ''}
                  `}>
                    {s.num < step ? <Check size={14} /> : s.num}
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

          {/* Error */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* ── Step 1: Account Type ── */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-center text-gray-700 mb-4">Come vuoi registrarti?</h2>

              <div className="space-y-2.5 mb-4">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm text-sm"
                  onClick={() => toast.success("Registrazione con Google in arrivo!")}
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  Registrati con Google
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm text-sm"
                  onClick={() => toast.success("Registrazione con Facebook in arrivo!")}
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  Registrati con Facebook
                </button>
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-400 font-medium">oppure con email</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAccountTypeSelect('tenant')}
                  className="w-full p-5 text-center rounded-xl border-2 border-border hover:border-primary-500 hover:bg-primary-50 transition-all flex flex-col items-center justify-center gap-2 group"
                >
                  <Home size={28} className="text-primary-500 group-hover:text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-base group-hover:text-primary-600">Inquilino</h3>
                    <p className="text-xs text-text-secondary mt-0.5">Cerco casa</p>
                  </div>
                </button>
                <button
                  onClick={() => handleAccountTypeSelect('agency')}
                  className="w-full p-5 text-center rounded-xl border-2 border-border hover:border-primary-500 hover:bg-primary-50 transition-all flex flex-col items-center justify-center gap-2 group"
                >
                  <Building2 size={28} className="text-primary-500 group-hover:text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-base group-hover:text-primary-600">Agenzia</h3>
                    <p className="text-xs text-text-secondary mt-0.5">Cerco inquilini</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Credentials ── */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-center text-gray-700 mb-4">Crea le tue credenziali</h2>
              <Input
                label="Email"
                type="email"
                placeholder="la-tua@email.com"
                leftIcon={<Mail size={17} />}
                error={accountType === 'tenant'
                  ? tenantForm.formState.errors.email?.message
                  : agencyForm.formState.errors.email?.message}
                {...(accountType === 'tenant' ? tenantForm.register('email') : agencyForm.register('email'))}
              />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimo 8 caratteri"
                leftIcon={<Lock size={17} />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                }
                hint="Almeno 8 caratteri, una maiuscola e un numero"
                error={accountType === 'tenant'
                  ? tenantForm.formState.errors.password?.message
                  : agencyForm.formState.errors.password?.message}
                {...(accountType === 'tenant' ? tenantForm.register('password') : agencyForm.register('password'))}
              />
              <Input
                label="Conferma Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ripeti la password"
                leftIcon={<Lock size={17} />}
                error={accountType === 'tenant'
                  ? tenantForm.formState.errors.confirmPassword?.message
                  : agencyForm.formState.errors.confirmPassword?.message}
                {...(accountType === 'tenant' ? tenantForm.register('confirmPassword') : agencyForm.register('confirmPassword'))}
              />
            </div>
          )}

          {/* ── Step 3: Profile – Tenant ── */}
          {step === 3 && accountType === 'tenant' && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-center text-gray-700 mb-4">I tuoi dati personali</h2>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Nome"
                  placeholder="Mario"
                  leftIcon={<User size={17} />}
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
                leftIcon={<Phone size={17} />}
                {...tenantForm.register('phone')}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupazione (opzionale)</label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  {...tenantForm.register('occupation')}
                >
                  <option value="">Seleziona...</option>
                  {OCCUPATIONS.map((occ) => (
                    <option key={occ} value={occ}>{occ}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Città (opzionale)</label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
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

          {/* ── Step 3: Profile – Agency ── */}
          {step === 3 && accountType === 'agency' && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-center text-gray-700 mb-4">Dati della tua Agenzia</h2>
              <Input
                label="Nome Agenzia"
                placeholder="Immobiliare XYZ"
                leftIcon={<Building2 size={17} />}
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
                leftIcon={<Phone size={17} />}
                error={agencyForm.formState.errors.phone?.message}
                {...agencyForm.register('phone')}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Città</label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
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
                leftIcon={<Globe size={17} />}
                error={agencyForm.formState.errors.website?.message}
                {...agencyForm.register('website')}
              />
            </div>
          )}

          {/* ── Step 4: Confirmation ── */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-center text-gray-700 mb-4">Conferma la registrazione</h2>
              <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-sm">
                    {accountType === 'tenant' ? tenantForm.getValues('email') : agencyForm.getValues('email')}
                  </p>
                </div>
                {accountType === 'tenant' ? (
                  <div>
                    <p className="text-xs text-gray-500">Nome</p>
                    <p className="font-medium text-sm">
                      {tenantForm.getValues('firstName')} {tenantForm.getValues('lastName')}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-gray-500">Agenzia</p>
                    <p className="font-medium text-sm">{agencyForm.getValues('agencyName')}</p>
                  </div>
                )}
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  {...(accountType === 'tenant' ? tenantForm.register('acceptTerms') : agencyForm.register('acceptTerms'))}
                />
                <span className="text-sm text-gray-600">
                  Accetto i{' '}
                  <a href="#" className="text-primary-500 hover:underline">Termini e Condizioni</a>
                  {' '}e la{' '}
                  <a href="#" className="text-primary-500 hover:underline">Privacy Policy</a>
                </span>
              </label>
              {(accountType === 'tenant'
                ? tenantForm.formState.errors.acceptTerms
                : agencyForm.formState.errors.acceptTerms
              ) && (
                <p className="text-sm text-red-500">
                  {accountType === 'tenant'
                    ? tenantForm.formState.errors.acceptTerms?.message
                    : agencyForm.formState.errors.acceptTerms?.message}
                </p>
              )}

              <p className="text-xs text-gray-400 text-center">
                Riceverai un'email con un codice di verifica per confermare il tuo account.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          {step > 1 && (
            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={handleBack}
                leftIcon={<ArrowLeft size={17} />}
                disabled={isLoading}
              >
                Indietro
              </Button>
              {step < 4 ? (
                <Button className="flex-1" onClick={handleNext} rightIcon={<ArrowRight size={17} />}>
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

          <div className="mt-5 text-center">
            <p className="text-text-secondary text-sm">
              Hai già un account?{' '}
              <Link to={ROUTES.LOGIN} className="text-primary-500 hover:text-primary-600 font-medium">
                Accedi
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL – Branded image (dynamic per step) ───────────────── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-primary-500">
        {/* Background photo */}
        <img
          src="/assets/logoaffittochiaro_pic.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-luminosity"
        />

        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary-400/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-600/40 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full">
          {/* Top brand */}
          <div>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase">
              Registrazione
            </span>
          </div>

          {/* Dynamic copy per step */}
          <div key={step} className="animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                {step}
              </div>
              <div className="h-px flex-1 bg-white/20" />
              <span className="text-xs text-white/50">di 4</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-bold leading-tight mb-3">
              {panelContent.title}
            </h2>
            <p className="text-base text-white/70 max-w-sm leading-relaxed">
              {panelContent.subtitle}
            </p>

            {/* Step 1 extra: trust points */}
            {step === 1 && (
              <ul className="mt-8 space-y-3">
                {[
                  'Profilo verificato in 24h',
                  'Matching con 500+ agenzie',
                  'Zero costi per gli inquilini',
                ].map((point) => (
                  <li key={point} className="flex items-center gap-3 text-white/85 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary-300 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Bottom stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
            {[
              { value: '30k+', label: 'Inquilini' },
              { value: '500+', label: 'Agenzie' },
              { value: '98%', label: 'Soddisfazione' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-white/60 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
