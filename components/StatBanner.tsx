import React from 'react';

export const StatBanner: React.FC = () => {
  return (
    <section className="bg-brand-green px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-bold text-primary-200 uppercase tracking-widest mb-4 border-l-2 border-primary-200 pl-3">
          Statistiche Affittochiaro
        </p>
        <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-snug max-w-4xl">
          “Il <span className="text-primary-200">73%</span> di chi cerca casa da oltre 2 mesi, con Affittochiaro la trova in <span className="text-primary-200">poche settimane</span>, perché si presenta con un profilo completo, credibile e verificato.”
        </p>
      </div>
    </section>
  );
};
