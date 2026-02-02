/**
 * ConfirmEmailPage
 * Pagina per confermare l'email con codice OTP
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store';
import { ROUTES } from '../utils/constants';
import { Card, Button } from '../components/ui';

export default function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const emailFromParams = searchParams.get('email');

  const { pendingConfirmation, confirmEmail, resendCode, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = emailFromParams || pendingConfirmation?.email || '';

  // Redirect se non c'è email
  useEffect(() => {
    if (!email) {
      navigate(ROUTES.REGISTER);
    }
  }, [email, navigate]);

  // Cooldown timer per resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Focus primo input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    // Solo numeri
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];

    if (value.length > 1) {
      // Paste di tutto il codice
      const pastedCode = value.slice(0, 6).split('');
      pastedCode.forEach((digit, i) => {
        if (i < 6) newCode[i] = digit;
      });
      setCode(newCode);
      inputRefs.current[Math.min(pastedCode.length, 5)]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      toast.error('Inserisci il codice completo');
      return;
    }

    try {
      await confirmEmail(email, fullCode);
      setIsConfirmed(true);
      toast.success('Email confermata! Ora puoi accedere.');

      // Redirect dopo 2 secondi
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (err) {
      // Error già gestito dallo store
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    try {
      await resendCode(email);
      toast.success('Codice inviato nuovamente!');
      setResendCooldown(60); // 60 secondi di cooldown
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error('Errore nell\'invio del codice');
    } finally {
      setIsResending(false);
    }
  };

  // Schermata di conferma avvenuta
  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-700 via-teal-600 to-primary-500 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Confermata!</h1>
          <p className="text-gray-500 mb-6">
            Il tuo account è stato verificato con successo.
          </p>
          <p className="text-sm text-gray-400">
            Reindirizzamento al login...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 via-teal-600 to-primary-500 flex items-center justify-center p-4">
      {/* Back */}
      <Link
        to={ROUTES.REGISTER}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Torna alla registrazione</span>
      </Link>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/assets/logoaffittochiaro_pic.webp"
            alt="Affittochiaro"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white">Conferma la tua Email</h1>
        </div>

        <Card className="animate-slide-up">
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary-600" />
            </div>
            <p className="text-gray-600">
              Abbiamo inviato un codice di verifica a:
            </p>
            <p className="font-semibold text-gray-900 mt-1">{email}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Code Input */}
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 sm:gap-3 mb-6">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`
                    w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold
                    border-2 rounded-xl transition-all duration-200
                    focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                    ${digit ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-gray-50'}
                  `}
                  disabled={isLoading}
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
              disabled={code.some((d) => !d)}
            >
              Conferma Email
            </Button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Non hai ricevuto il codice?</p>
            <button
              onClick={handleResendCode}
              disabled={isResending || resendCooldown > 0}
              className={`
                inline-flex items-center gap-2 text-sm font-medium
                ${resendCooldown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-primary-600 hover:text-primary-700'}
              `}
            >
              {isResending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {resendCooldown > 0 ? `Riinvia tra ${resendCooldown}s` : 'Invia nuovo codice'}
            </button>
          </div>

          {/* Help */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 text-center">
              Controlla anche la cartella spam. Il codice scade dopo 24 ore.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
