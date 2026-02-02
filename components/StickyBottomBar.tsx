import React from 'react';

interface StickyBottomBarProps {
  onMenuToggle: () => void;
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({ onMenuToggle }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] bg-white border-t border-gray-100 p-4 flex items-center justify-center gap-4 h-[88px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      <div className="max-w-4xl w-full flex items-center gap-4">
        <button className="flex-grow h-14 bg-white text-brand-green border border-gray-200 rounded-2xl font-bold text-lg active:scale-95 transition-transform shadow-sm uppercase tracking-tight">
          Iscriviti Gratis
        </button>
        <div className="w-[1px] h-10 bg-gray-100 md:hidden" />
        <button onClick={onMenuToggle} className="w-14 h-14 flex items-center justify-center bg-gray-50 rounded-2xl active:scale-95 transition-transform md:hidden" aria-label="Menu">
          <svg className="w-7 h-7 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8h16M4 16h16"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
