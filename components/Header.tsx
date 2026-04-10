import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../src/store';
import { ArrowLeft, LayoutDashboard, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { to: '/come-funziona', label: 'Come Funziona' },
  { to: '/case-e-stanze-in-affitto', label: 'Annunci' },
  { to: '/cerca-inquilino', label: 'Cerca Inquilino' },
  { to: '/servizi', label: 'Servizi' },
  { to: '/agenzie', label: 'Agenzie' },
  { to: '/guide-affitto', label: 'News' },
];

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex flex-col shadow-sm bg-white"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <header className="bg-white/95 backdrop-blur-md px-4 md:px-8 h-16 md:h-20 flex items-center justify-between border-b border-gray-100">
        <Link to="/" className="flex items-center">
          <img src="/assets/logoaffittochiaro_pic.webp" alt="Affittochiaro" className="h-8 md:h-10 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 xl:gap-8">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-bold hover:text-action-green transition-colors uppercase tracking-widest ${isActive(link.to) ? 'text-action-green' : 'text-brand-green'}`}
            >
              {link.label}
            </Link>
          ))}
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

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-brand-green hover:bg-gray-100 transition-colors"
          aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* ── Mobile Drawer ────────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setMobileOpen(false)}
        style={{ top: 'calc(4rem + env(safe-area-inset-top, 0px))' }}
      />

      {/* Slide panel */}
      <div
        className={`fixed right-0 bottom-0 w-[280px] bg-white z-50 md:hidden transform transition-transform duration-300 ease-out shadow-2xl ${mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        style={{ top: 'calc(4rem + env(safe-area-inset-top, 0px))' }}
      >
        <nav className="flex flex-col h-full">
          {/* Navigation links */}
          <div className="flex-1 overflow-y-auto py-4">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-colors ${isActive(link.to)
                    ? 'text-action-green bg-primary-50 border-r-4 border-action-green'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-brand-green'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA buttons at bottom */}
          <div className="p-4 space-y-3 border-t border-gray-100 bg-gray-50">
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center text-primary-600 bg-primary-50 px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-100 transition-all border border-primary-200"
            >
              REGISTRATI
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-brand-green text-white px-6 py-3 rounded-xl font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-brand-green/10"
            >
              ACCEDI
            </Link>
          </div>
        </nav>
      </div>

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
