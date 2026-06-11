import React from 'react';
import { TESTIMONIALS } from '../constants';

const STATS = [
  { value: '30.000+', label: 'profili inquilini attivi' },
  { value: '4.9/5',   label: 'valutazione media su Trustpilot' },
  { value: '2 sett.', label: 'tempo medio per trovare casa' },
];

const StarIcon = () => (
  <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonianze" className="py-16 bg-white px-4 border-b border-gray-100">
      <div className="max-w-full lg:px-20 mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-[24px] md:text-3xl font-bold text-brand-green mb-4 leading-[1.2]">
            Migliaia di persone hanno trovato casa con Affittochiaro
          </h2>
          <p className="text-lg text-medium-gray leading-[1.5]">
            Non solo annunci. Una piattaforma che cambia davvero il modo in cui cerchi casa.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 pb-10 mb-10 border-b border-gray-100">
          {STATS.map((s, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-3 md:p-5 flex flex-col items-center text-center">
              <p className="text-xl md:text-4xl font-bold text-brand-green leading-none">{s.value}</p>
              <p className="mt-1.5 text-[10px] md:text-sm text-medium-gray leading-snug">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials — snap scroll mobile, grid desktop */}
        <div className="grid grid-flow-col auto-cols-[100%] md:auto-cols-[1fr] md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 no-scrollbar">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="snap-start bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col hover:border-gray-200 transition-colors"
            >
              <div className="flex gap-0.5 mb-3">
                {[1,2,3,4,5].map(s => <StarIcon key={s} />)}
              </div>
              <p className="text-brand-green text-sm leading-[1.6] flex-1 mb-3">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-2.5 pt-3 border-t border-gray-200">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0"
                />
                <div>
                  <p className="text-xs font-bold text-brand-green">{t.name}</p>
                  <p className="text-[11px] text-medium-gray">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trustpilot badge */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => <StarIcon key={s} />)}
          </div>
          <p className="text-sm font-bold text-brand-green">
            4.9 / 5 <span className="font-normal text-medium-gray">su Trustpilot · 380+ recensioni verificate</span>
          </p>
        </div>

      </div>
    </section>
  );
};
