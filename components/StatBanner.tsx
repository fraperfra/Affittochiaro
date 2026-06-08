import React from 'react';

export const StatBanner: React.FC = () => {
  return (
    <section className="bg-brand-green px-4 py-10">
      <div className="max-w-full lg:px-20 mx-auto">
        <p className="text-xs font-bold text-action-green uppercase tracking-widest mb-4 border-l-2 border-action-green pl-3">
          Statistiche AffittoChiaro
        </p>
        <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-snug max-w-4xl">
          «Il <span className="text-action-green">73%</span> di chi cerca casa da oltre 2 mesi, con AffittoChiaro la trova in <span className="text-action-green">poche settimane</span>, perché si presenta con un profilo completo, credibile e verificato.»
        </p>
      </div>
    </section>
  );
};
