import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-action-green mb-4">404</div>
        <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-4 font-poppins">
          Pagina non trovata
        </h1>
        <p className="text-lg text-medium-gray mb-8 max-w-md mx-auto">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand-green text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Torna alla Home
        </Link>
      </div>
    </div>
  );
};
