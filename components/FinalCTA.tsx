import React from 'react';
import { Link } from 'react-router-dom';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-brand-green border-t-2 border-action-green/20">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-8 leading-[1.2]">
          Trova la casa dei tuoi sogni con{' '}
          <span className="text-action-green">Affittochiaro</span>
        </h2>
        <Link
          to="/case-e-stanze-in-affitto"
          className="inline-flex items-center justify-center bg-action-green text-white px-8 py-4 min-h-[44px] rounded-lg font-bold text-base hover:brightness-110 transition-all"
        >
          Inizia a cercare
        </Link>
      </div>
    </section>
  );
};
