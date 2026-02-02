/**
 * ForgotPasswordPage
 * Pagina per reset password
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store';
import { ROUTES } from '../utils/constants';
import { Card, Button, Input } from '../components/ui';

type Step = 'email' | 'code' | 'success';

const emailSchema = z.object({
  email: z.string().email('Email non valida'),
});

const resetSchema = z.object({
  code: z.string().length(6, 'Il codice deve essere di 6 cifre'),
  newPassword: z
    .string()
    .min(8, 'Minimo 8 caratteri')
    .regex(/[A-Z]/, 'Almeno una lettera maiuscola')
    .regex(/[0-9]/, 'Almeno un numero'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Le password non corrispondono',
  path: ['confirmPassword'],
});

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { resetPassword, confirmResetPassword, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const resetForm = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { code: '', newPassword: '', confirmPassword: '' },
  });

  const handleSendCode = async (data: { email: string }) => {
    clearError();
    try {
      await resetPassword(data.email);
      setEmail(data.email);
      setStep('code');
      toast.success('Codice inviato! Controlla la tua email.');
    } catch (err) {
      // Errore gestito dallo store
    }
  };

  const handleResetPassword = async (data: { code: string; newPassword: string }) => {
    clearError();
    try {
      await confirmResetPassword(email, data.code, data.newPassword);
      setStep('success');
      toast.success('Password reimpostata con successo!');
    } catch (err) {
      // Errore gestito dallo store
    }
  };

  // Schermata successo
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-700 via-teal-600 to-primary-500 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reimpostata!</h1>
          <p className="text-gray-500 mb-6">
            Ora puoi accedere con la tua nuova password.
          </p>
          <Button onClick={() => navigate(ROUTES.LOGIN)} className="w-full">
            Vai al Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 via-teal-600 to-primary-500 flex items-center justify-center p-4">
      {/* Back */}
      <Link
        to={ROUTES.LOGIN}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Torna al login</span>
      </Link>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/assets/logoaffittochiaro_pic.webp"
            alt="Affittochiaro"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white">
            {step === 'email' ? 'Recupera Password' : 'Reimposta Password'}
          </h1>
        </div>

        <Card className="animate-slide-up">
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8 text-primary-600" />
            </div>
            {step === 'email' ? (
              <p className="text-gray-600">
                Inserisci la tua email e ti invieremo un codice per reimpostare la password.
              </p>
            ) : (
              <p className="text-gray-600">
                Inserisci il codice ricevuto via email e scegli una nuova password.
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Step: Email */}
          {step === 'email' && (
            <form onSubmit={emailForm.handleSubmit(handleSendCode)} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="la-tua@email.com"
                leftIcon={<Mail size={18} />}
                error={emailForm.formState.errors.email?.message}
                {...emailForm.register('email')}
              />

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Invia Codice
              </Button>
            </form>
          )}

          {/* Step: Code + New Password */}
          {step === 'code' && (
            <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-5">
              <div className="p-3 bg-gray-50 rounded-lg mb-4">
                <p className="text-sm text-gray-500">Email:</p>
                <p className="font-medium">{email}</p>
              </div>

              <Input
                label="Codice di Verifica"
                type="text"
                placeholder="123456"
                maxLength={6}
                error={resetForm.formState.errors.code?.message}
                {...resetForm.register('code')}
              />

              <Input
                label="Nuova Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimo 8 caratteri"
                leftIcon={<Lock size={18} />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                hint="Almeno 8 caratteri, una maiuscola e un numero"
                error={resetForm.formState.errors.newPassword?.message}
                {...resetForm.register('newPassword')}
              />

              <Input
                label="Conferma Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ripeti la password"
                leftIcon={<Lock size={18} />}
                error={resetForm.formState.errors.confirmPassword?.message}
                {...resetForm.register('confirmPassword')}
              />

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Reimposta Password
              </Button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                Usa un'altra email
              </button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
