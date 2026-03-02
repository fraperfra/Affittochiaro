import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../src/store';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col shadow-sm">
      <header className="bg-white/95 backdrop-blur-md px-4 md:px-8 h-20 flex items-center justify-between border-b border-gray-100">
        <Link to="/" className="flex items-center">
          <img src="/assets/logoaffittochiaro_pic.webp" alt="Affittochiaro" className="h-10 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-6 xl:gap-8">
          <Link
            to="/come-funziona"
            className={`text-sm font-bold hover:text-action-green transition-colors uppercase tracking-widest ${isActive('/come-funziona') ? 'text-action-green' : 'text-brand-green'
              }`}
          >
            Come Funziona
          </Link>
          <Link
            to="/annunci"
            className={`text-sm font-bold hover:text-action-green transition-colors uppercase tracking-widest ${isActive('/annunci') ? 'text-action-green' : 'text-brand-green'
              }`}
          >
            Annunci
          </Link>
          <Link
            to="/ricerca-inquilino"
            className={`text-sm font-bold hover:text-action-green transition-colors uppercase tracking-widest ${isActive('/ricerca-inquilino') ? 'text-action-green' : 'text-brand-green'
              }`}
          >
            Cerca Inquilino
          </Link>
          <Link
            to="/servizi"
            className={`text-sm font-bold hover:text-action-green transition-colors uppercase tracking-widest ${isActive('/servizi') ? 'text-action-green' : 'text-brand-green'
              }`}
          >
            Servizi
          </Link>
          <Link
            to="/agenzie"
            className={`text-sm font-bold hover:text-action-green transition-colors uppercase tracking-widest ${isActive('/agenzie') ? 'text-action-green' : 'text-brand-green'
              }`}
          >
            Agenzie
          </Link>
          <Link
            to="/affittonews"
            className={`text-sm font-bold hover:text-action-green transition-colors uppercase tracking-widest ${isActive('/affittonews') ? 'text-action-green' : 'text-brand-green'
              }`}
          >
            News
          </Link>
          <Link
            to="/register"
            className="text-primary-600 bg-primary-50 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-100 transition-all border border-primary-200"
          >
            REGISTRATI
          </Link>
          <Link
            to="/login"
            className="bg-brand-green text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-brand-green/10"
          >
            ACCEDI
          </Link>
        </nav>
      </header>

      {/* ── Banner Torna alla dashboard ──────────────── */}
      {isAuthenticated && user && (
        <div className="bg-primary-50 border-b border-primary-100 px-4 md:px-8 py-3 flex items-center justify-between gap-3 shadow-md relative z-0">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <LayoutDashboard size={16} className="text-primary-600 shrink-0" />
            <span className="hidden sm:inline">Stai navigando come <span className="font-semibold text-gray-900">{(user as any).profile?.firstName || user?.email}</span></span>
          </div>
          <button
            onClick={() => navigate(user.role === 'tenant' ? '/tenant/listings' : user.role === 'agency' ? '/agency' : '/admin')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm shrink-0"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Torna alla dashboard</span>
            <span className="sm:hidden">Dashboard</span>
          </button>
        </div>
      )}
    </div>
  );
};
