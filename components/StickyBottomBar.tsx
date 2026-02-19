import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

interface StickyBottomBarProps {
  onMenuToggle: () => void;
  onRegister?: () => void;
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({ onRegister }) => {
  return (
    <div
      className="fixed left-0 right-0 z-[200] px-4 md:hidden"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.15)] border border-gray-100 p-3 flex items-center gap-2 max-w-md mx-auto">
        <button
          onClick={onRegister}
          className="flex-1 h-12 bg-brand-green text-white rounded-xl font-bold text-sm active:scale-95 transition-transform shadow-lg uppercase tracking-tight"
        >
          Iscriviti Gratis
        </button>
        <Link
          to="/annunci"
          className="h-12 px-4 bg-action-green/10 text-action-green border border-action-green/30 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap"
        >
          <Search size={15} strokeWidth={2.5} />
          Annunci
        </Link>
        <Link
          to="/login"
          className="h-12 px-4 bg-white text-brand-green border-2 border-brand-green rounded-xl font-bold text-sm flex items-center justify-center active:scale-95 transition-transform"
        >
          Accedi
        </Link>
      </div>
    </div>
  );
};
