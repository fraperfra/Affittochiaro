import React from 'react';

export const ChatButton: React.FC = () => {
  return (
    <button className="fixed bottom-[104px] right-4 z-[100] bg-[#00D094] text-white px-7 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:scale-110 transition-transform md:bottom-[104px] md:right-10" aria-label="Chat">
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
      <span className="font-bold text-base uppercase tracking-tighter">chat</span>
    </button>
  );
};
