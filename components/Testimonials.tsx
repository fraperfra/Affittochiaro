import React from 'react';
import { TESTIMONIALS } from '../constants';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonianze" className="py-16 bg-gray-50 px-4 border-b border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold text-brand-green uppercase tracking-widest mb-3 border-l-2 border-action-green pl-3">TESTIMONIANZE</p>
            <h2 className="text-3xl md:text-5xl font-bold text-brand-green leading-tight">
              Cosa dicono i nostri inquilini
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0 pb-1">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} className="w-4 h-4 text-[#00b67a] fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
              ))}
            </div>
            <p className="text-sm font-bold text-brand-green">4.9/5 <span className="font-normal text-medium-gray">su Trustpilot</span></p>
          </div>
        </div>
        <div className="flex overflow-x-auto pb-6 gap-4 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible no-scrollbar">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="min-w-[300px] md:min-w-0 flex-shrink-0 snap-center bg-white rounded-xl p-6 border border-gray-200 flex flex-col justify-between hover:border-gray-300 transition-colors">
              <p className="text-brand-green text-base italic leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full border border-gray-200" />
                <div>
                  <p className="font-bold text-brand-green text-sm">{t.name}</p>
                  <p className="text-[10px] uppercase font-semibold text-medium-gray tracking-wider">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
