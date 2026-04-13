import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, User, Phone, ArrowLeft, AlertCircle, MapPin, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store';
import { ROUTES, ITALIAN_CITIES } from '../utils/constants';
import { Button, Input } from '../components/ui';
import { Header as LandingHeader, Footer } from '../../components';

const tenantSchema = z.object({
  firstName: z.string().min(2, 'Nome troppo corto'),
  lastName: z.string().min(2, 'Cognome troppo corto'),
  city: z.string().min(1, 'Seleziona una citta'),
  email: z.string().email('Email non valida'),
  phone: z.string().min(8, 'Telefono non valido'),
  acceptTerms: z.literal(true),
});

type TenantFormData = z.infer<typeof tenantSchema>;

const generateSystemPassword = () => `TmpA${Date.now()}9`;

export default function RegisterPage() {
  const { register: registerUser, isLoading, error, clearError, pendingConfirmation } = useAuthStore();
  const navigate = useNavigate();
  const [isGeolocating, setIsGeolocating] = useState(false);

  const tenantForm = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    mode: 'onChange',
    defaultValues: {
      acceptTerms: true,
    },
  });

  const handleGeolocateCity = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalizzazione non supportata dal browser');
      return;
    }
    setIsGeolocating(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
      );
      const { latitude, longitude } = position.coords;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=it`
      );
      const data = await res.json();
      const raw: string = data.address?.city || data.address?.town || data.address?.village || '';
      const match = ITALIAN_CITIES.find(
        (c) => c.toLowerCase() === raw.toLowerCase() || raw.toLowerCase().includes(c.toLowerCase())
      );
      if (match) {
        tenantForm.setValue('city', match, { shouldValidate: true });
        toast.success(`Posizione rilevata: ${match}`);
      } else {
        toast.error(raw ? `Città non disponibile: ${raw}` : 'Impossibile determinare la città');
      }
    } catch {
      toast.error('Impossibile accedere alla posizione');
    } finally {
      setIsGeolocating(false);
    }
  };

  useEffect(() => {
    if (pendingConfirmation) {
      navigate(`${ROUTES.CONFIRM_EMAIL}?email=${encodeURIComponent(pendingConfirmation.email)}`);
    }
  }, [pendingConfirmation, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmitTenant = async (data: TenantFormData) => {
    try {
      await registerUser({
        email: data.email,
        password: generateSystemPassword(),
        role: 'tenant',
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        city: data.city,
      });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans lg:pt-20">
      <Link
        to="/"
        className="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
        aria-label="Torna al sito"
      >
        <ArrowLeft size={20} className="text-gray-700" />
      </Link>

      <div className="hidden lg:block">
        <LandingHeader />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[480px]">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-700 to-primary-500 flex items-center justify-center">
              <span className="text-white font-black text-sm">A</span>
            </div>
            <span className="font-bold text-lg text-gray-900">Affittochiaro</span>
          </Link>

          <div className="mb-6">
            <h1 className="font-bold text-gray-900 mb-1">Crea il tuo Account</h1>
            <p className="text-gray-500 text-sm">Compila i dati per completare la registrazione</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Social signup */}
          <div className="space-y-3 mb-5">
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

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400 font-medium">oppure con email</span>
            </div>
          </div>

          <div className="space-y-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Città di ricerca</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={handleGeolocateCity}
                  disabled={isGeolocating}
                  title="Rileva la mia posizione"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors disabled:opacity-50 z-10"
                >
                  {isGeolocating
                    ? <Loader2 size={16} className="animate-spin" />
                    : <MapPin size={16} />}
                </button>
                <select
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  {...tenantForm.register('city')}
                >
                  <option value="">Seleziona...</option>
                  {ITALIAN_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              {tenantForm.formState.errors.city && (
                <p className="mt-1 text-sm text-red-500">{tenantForm.formState.errors.city.message}</p>
              )}
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="la-tua@email.com"
              leftIcon={<Mail size={17} />}
              error={tenantForm.formState.errors.email?.message}
              {...tenantForm.register('email')}
            />

            <Input
              label="Telefono"
              placeholder="+39 333 1234567"
              leftIcon={<Phone size={17} />}
              error={tenantForm.formState.errors.phone?.message}
              {...tenantForm.register('phone')}
            />

            {/* Auto-accept terms/policy as requested */}
            <input type="hidden" {...tenantForm.register('acceptTerms')} value="true" />
          </div>

          <div className="mt-6">
            <Button
              className="w-full"
              onClick={tenantForm.handleSubmit(handleSubmitTenant)}
              isLoading={isLoading}
            >
              Completa Registrazione
            </Button>
          </div>

          <div className="mt-5 text-center">
            <p className="text-text-secondary text-sm">
              Hai gia un account?{' '}
              <Link to={ROUTES.LOGIN} className="text-primary-500 hover:text-primary-600 font-medium">
                Accedi
              </Link>
            </p>
          </div>
        </div>
      </main>

      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
}
