import React from 'react';
import { TESTIMONIALS } from '../constants';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonianze" className="py-16 bg-white px-4 border-t border-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-block bg-action-green/10 text-action-green px-5 py-2 rounded-full font-bold text-[10px] mb-8 uppercase tracking-[0.2em]">TESTIMONIANZE</div>
        <h2 className="text-3xl md:text-5xl font-bold text-brand-green mb-6 leading-tight font-poppins">Cosa dicono i nostri inquilini</h2>
        <div className="flex flex-col items-center gap-2 mb-10">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="w-6 h-6 text-[#00b67a] fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            ))}
          </div>
          <p className="text-brand-green font-bold">Eccezionale 4.9/5 su <span className="text-[#00b67a]">Trustpilot</span></p>
        </div>
        <div className="flex overflow-x-auto pb-12 gap-6 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible no-scrollbar">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="min-w-[320px] md:min-w-0 flex-shrink-0 snap-center bg-soft-green/50 rounded-[2.5rem] p-8 border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-shadow group">
              <div className="text-left">
                <p className="text-brand-green text-lg italic leading-relaxed mb-8">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                <div className="text-left">
                  <p className="font-bold text-brand-green">{t.name}</p>
                  <p className="text-[10px] uppercase font-bold text-medium-gray tracking-wider">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
