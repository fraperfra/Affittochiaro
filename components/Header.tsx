import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 px-4 md:px-8 h-20 flex items-center justify-between border-b border-gray-100">
      <Link to="/" className="flex items-center">
        <img src="/assets/logoaffittochiaro_pic.webp" alt="Affittochiaro" className="h-10 w-auto" />
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        <Link
          to="/come-funziona"
          className={`text-sm font-bold hover:text-action-green transition-colors uppercase tracking-widest ${
            isActive('/come-funziona') ? 'text-action-green' : 'text-brand-green'
          }`}
        >
          Come Funziona
        </Link>
        <Link
          to="/annunci"
          className={`text-sm font-bold hover:text-action-green transition-colors uppercase tracking-widest ${
            isActive('/annunci') ? 'text-action-green' : 'text-brand-green'
          }`}
        >
          Annunci
        </Link>
        <Link
          to="/faq"
          className={`text-sm font-bold hover:text-action-green transition-colors uppercase tracking-widest ${
            isActive('/faq') ? 'text-action-green' : 'text-brand-green'
          }`}
        >
          FAQ
        </Link>
        <Link
          to="/login"
          className="bg-brand-green text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-brand-green/10"
        >
          ACCEDI
        </Link>
      </nav>
    </header>
  );
};
