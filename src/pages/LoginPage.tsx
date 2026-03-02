/**
 * LoginPage
 * Pagina di login (modalità demo)
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, AlertCircle, Shield, User, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store';
import { loginSchema, LoginFormData } from '../utils/validators';
import { ROUTES } from '../utils/constants';
import { Button, Input, Card } from '../components/ui';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, quickLogin, isLoading, error, clearError, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  // Handler per quick login (solo in dev)
  const handleQuickLogin = async (role: 'admin' | 'tenant' | 'agency') => {
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
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Redirect se già autenticato
  useEffect(() => {
    if (isAuthenticated && user) {
      const route = user.role === 'tenant'
        ? ROUTES.TENANT_DASHBOARD
        : user.role === 'agency'
          ? ROUTES.AGENCY_DASHBOARD
          : ROUTES.ADMIN_DASHBOARD;
      navigate(route);
    }
  }, [isAuthenticated, user, navigate]);

  // Clear error on mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Benvenuto!');
      // Il redirect avviene tramite useEffect
    } catch (err: any) {
      // Errore gestito dallo store
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 mt-20 mb-16">
        <div className="w-full max-w-sm">
          {/* Header Text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bentornato!</h1>
            <p className="text-gray-500">Accedi al tuo account Affittochiaro</p>
          </div>

          <Card className="animate-slide-up">
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Social Logins */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm"
                onClick={() => toast.success("Login con Google in arrivo!")}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Accedi con Google
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm"
                onClick={() => toast.success("Login con Facebook in arrivo!")}
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                Accedi con Facebook
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">oppure con la tua email</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="la-tua@email.com"
                leftIcon={<Mail size={18} />}
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  leftIcon={<Lock size={18} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:text-text-primary"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                  error={errors.password?.message}
                  {...register('password')}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-primary-500 focus:ring-primary-500"
                    {...register('rememberMe')}
                  />
                  <span className="text-sm text-text-secondary">Ricordami</span>
                </label>
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                >
                  Password dimenticata?
                </Link>
              </div>

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Accedi
              </Button>
            </form>

            {/* Register link */}
            <div className="mt-6 text-center">
              <p className="text-text-secondary">
                Non hai un account?{' '}
                <Link
                  to={ROUTES.REGISTER}
                  className="text-primary-500 hover:text-primary-600 font-medium"
                >
                  Registrati
                </Link>
              </p>
            </div>

            {/* Quick Login (modalità demo) */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500 mb-4">
                Accesso rapido (modalità demo)
              </p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  disabled={isLoading}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition-all group disabled:opacity-50"
                >
                  <Shield className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-gray-600">Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('tenant')}
                  disabled={isLoading}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all group disabled:opacity-50"
                >
                  <User className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-gray-600">Inquilino</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('agency')}
                  disabled={isLoading}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all group disabled:opacity-50"
                >
                  <Building2 className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-gray-600">Agenzia</span>
                </button>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
