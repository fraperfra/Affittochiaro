import React, { useRef, useState } from 'react';
import { TESTIMONIALS } from '../constants';

export const Testimonials: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    setActiveIdx(Math.round(scrollLeft / clientWidth));
  };

  return (
    <section id="testimonianze" className="py-16 bg-gray-50 border-b border-gray-100">
      {/* Header — constrained */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold text-brand-green uppercase tracking-widest mb-3 border-l-2 border-action-green pl-3">TESTIMONIANZE</p>
            <h2 className="text-2xl md:text-[28px] xl:text-[32px] font-bold text-brand-green leading-[1.2]">
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
      </div>

      {/* Scroll container — full bleed su mobile, grid su desktop */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto pb-2 gap-4 snap-x snap-mandatory scroll-smooth no-scrollbar
                   px-4
                   lg:grid lg:grid-cols-3 lg:overflow-visible lg:max-w-6xl lg:mx-auto lg:px-4"
      >
        {TESTIMONIALS.map((t, idx) => (
          <div
            key={idx}
            className="min-w-[calc(100vw-2.5rem)] sm:min-w-[340px] lg:min-w-0
                       flex-shrink-0 snap-start
                       bg-white rounded-xl p-5 border border-gray-200
                       flex flex-col justify-between hover:border-gray-300 transition-colors"
          >
            <div>
              <div className="flex items-center gap-0.5 mb-3">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className="w-4 h-4 text-[#00b67a] fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                ))}
              </div>
              <p className="text-brand-green text-base italic leading-[1.6] mb-4">"{t.quote}"</p>
            </div>
            <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
              <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full border border-gray-200 shrink-0" />
              <div>
                <p className="font-bold text-brand-green text-sm">{t.name}</p>
                <p className="text-[10px] uppercase font-semibold text-medium-gray tracking-wider">{t.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicator — solo mobile */}
      <div className="flex items-center justify-center gap-2 mt-5 lg:hidden">
        {TESTIMONIALS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (!scrollRef.current) return;
              const cardWidth = scrollRef.current.clientWidth;
              scrollRef.current.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
              setActiveIdx(idx);
            }}
            className={`rounded-full transition-all duration-300 ${
              activeIdx === idx
                ? 'w-5 h-2 bg-brand-green'
                : 'w-2 h-2 bg-gray-300'
            }`}
            aria-label={`Recensione ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
