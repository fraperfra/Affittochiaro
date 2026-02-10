import React from 'react';
import { Link } from 'react-router-dom';

interface StickyBottomBarProps {
  onMenuToggle: () => void;
  onRegister?: () => void;
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({ onMenuToggle, onRegister }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] bg-white border-t border-gray-100 p-4 flex items-center justify-center gap-4 h-[88px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:hidden">
      <div className="max-w-4xl w-full flex items-center gap-4">
        <button
          onClick={onRegister}
          className="flex-grow h-14 bg-brand-green text-white rounded-2xl font-bold text-base active:scale-95 transition-transform shadow-lg uppercase tracking-tight"
        >
          Iscriviti Gratis
        </button>
        <Link
          to="/login"
          className="h-14 px-6 bg-white text-brand-green border-2 border-brand-green rounded-2xl font-bold text-base flex items-center justify-center active:scale-95 transition-transform"
        >
          Accedi
        </Link>
        <button onClick={onMenuToggle} className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-2xl active:scale-95 transition-transform" aria-label="Menu">
          <svg className="w-10 h-10 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8h16M4 16h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};
