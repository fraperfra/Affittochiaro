import React from 'react';

export const StatBanner: React.FC = () => {
  return (
    <section className="bg-brand-green px-4 py-10">
      <div className="max-w-full lg:px-20 mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">

          <div className="shrink-0">
            <span className="text-[3.25rem] md:text-[3.75rem] font-bold text-white leading-none tracking-tight">
              73%
            </span>
          </div>

          <div className="hidden md:block w-px self-stretch bg-white/15" />

          <div>
            <p className="text-base md:text-lg font-bold text-white leading-snug">
              di chi cerca casa da oltre 2 mesi, con AffittoChiaro la trova in{' '}
              <span className="text-action-green">2 settimane</span>.
            </p>
            <p className="mt-2 text-sm text-white/55 leading-relaxed">
              Perché si presenta con un profilo completo, credibile e verificato — e i proprietari lo contattano per primi.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
