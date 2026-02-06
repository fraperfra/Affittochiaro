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
    <div className="min-h-screen bg-gradient-to-br from-teal-700 via-teal-600 to-primary-500 flex items-center justify-center p-4">
      {/* Back to Landing */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Torna alla home</span>
      </Link>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/assets/logoaffittochiaro_pic.webp"
            alt="Affittochiaro"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white">Bentornato!</h1>
          <p className="text-white/80 mt-2">Accedi al tuo account</p>
        </div>

        <Card className="animate-slide-up">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

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

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-8">
          © 2024 Affittochiaro. Tutti i diritti riservati.
        </p>
      </div>
    </div>
  );
}
