import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Shield, User, Building2, ArrowLeft, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store';
import { loginSchema, LoginFormData } from '../utils/validators';
import { ROUTES } from '../utils/constants';
import { Button, Input } from '../components/ui';
import { Header as LandingHeader, Footer } from '../../components';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, quickLogin, isLoading, error, clearError, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const handleQuickLogin = async (role: 'admin' | 'tenant' | 'agency' | 'landlord') => {
    try {
      await quickLogin(role);
      toast.success(`Accesso come ${role} riuscito!`);
    } catch (err: any) {
      toast.error(err.message || 'Errore durante il login');
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      const route = user.role === 'tenant'
        ? ROUTES.TENANT_DASHBOARD
        : user.role === 'agency'
          ? ROUTES.AGENCY_DASHBOARD
          : user.role === 'landlord'
            ? ROUTES.LANDLORD_MORE
            : ROUTES.ADMIN_DASHBOARD;
      navigate(route);
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => { clearError(); }, [clearError]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Benvenuto!');
    } catch (err: any) {
      // Errore gestito dallo store
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans lg:pt-20">

      {/* Freccia back — solo mobile */}
      <Link
        to="/"
        className="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
        aria-label="Torna al sito"
      >
        <ArrowLeft size={20} className="text-gray-700" />
      </Link>

      {/* Header sito — solo desktop */}
      <div className="hidden lg:block">
        <LandingHeader />
      </div>

      {/* Form centrato */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[440px]">

          {/* Logo — solo mobile (desktop ha header) */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-700 to-primary-500 flex items-center justify-center">
              <span className="text-white font-black text-sm">A</span>
            </div>
            <span className="font-bold text-lg text-gray-900">Affittochiaro</span>
          </Link>

          {/* Titolo */}
          <div className="mb-7">
            <h1 className="font-bold text-gray-900 mb-1">Bentornato!</h1>
            <p className="text-gray-500 text-sm">Accedi al tuo account Affittochiaro</p>
          </div>

          {/* Errore */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Social login */}
          <div className="space-y-3 mb-5">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm text-sm"
              onClick={() => toast.success("Login con Google in arrivo!")}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Accedi con Google
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm text-sm"
              onClick={() => toast.success("Login con Facebook in arrivo!")}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              Accedi con Facebook
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

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="la-tua@email.com"
              leftIcon={<Mail size={17} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              leftIcon={<Lock size={17} />}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-text-primary">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-primary-500 focus:ring-primary-500"
                  {...register('rememberMe')}
                />
                <span className="text-sm text-text-secondary">Ricordami</span>
              </label>
              <Link to={ROUTES.FORGOT_PASSWORD} className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                Password dimenticata?
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Accedi
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-text-secondary text-sm">
              Non hai un account?{' '}
              <Link to={ROUTES.REGISTER} className="text-primary-500 hover:text-primary-600 font-medium">
                Registrati
              </Link>
            </p>
          </div>

          {/* Quick Login demo */}
          <div className="mt-7 pt-5 border-t border-gray-100">
            <p className="text-xs text-center text-gray-400 mb-3">Accesso rapido (modalità demo)</p>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                disabled={isLoading}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all group disabled:opacity-50"
              >
                <Shield className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-gray-500">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('tenant')}
                disabled={isLoading}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all group disabled:opacity-50"
              >
                <User className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-gray-500">Inquilino</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('agency')}
                disabled={isLoading}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group disabled:opacity-50"
              >
                <Building2 className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-gray-500">Agenzia</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('landlord')}
                disabled={isLoading}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 border-dashed border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all group disabled:opacity-50"
              >
                <Home className="w-5 h-5 text-teal-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-gray-500">Proprietario</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer sito — solo desktop */}
      <div className="hidden lg:block">
        <Footer />
      </div>

    </div>
  );
}
