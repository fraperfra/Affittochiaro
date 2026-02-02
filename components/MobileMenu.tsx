import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[250] transition-opacity"
        onClick={onClose}
      />
      <div className="fixed bottom-[104px] left-4 right-4 z-[260] bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 animate-slide-up flex flex-col gap-1 overflow-hidden">
        <Link
          to="/come-funziona"
          onClick={onClose}
          className={`text-lg font-bold py-4 border-b border-gray-50 flex justify-between items-center ${
            isActive('/come-funziona') ? 'text-action-green' : 'text-brand-green'
          }`}
        >
          Come Funziona
        </Link>
        <Link
          to="/annunci"
          onClick={onClose}
          className={`text-lg font-bold py-4 border-b border-gray-50 flex justify-between items-center ${
            isActive('/annunci') ? 'text-action-green' : 'text-brand-green'
          }`}
        >
          Annunci
        </Link>
        <Link
          to="/faq"
          onClick={onClose}
          className={`text-lg font-bold py-4 flex justify-between items-center ${
            isActive('/faq') ? 'text-action-green' : 'text-brand-green'
          }`}
        >
          FAQ
        </Link>
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
          <button className="text-action-green font-bold text-lg">Accedi</button>
        </div>
      </div>
    </>
  );
};
