import React, { useRef, useState } from 'react';
import { TESTIMONIALS } from '../constants';

const STATS = [
  { value: '30.000+', label: 'profili inquilini attivi' },
  { value: '4.9/5',   label: 'valutazione media su Trustpilot' },
  { value: '2 sett.', label: 'tempo medio per trovare casa' },
];

const StarIcon = () => (
  <svg className="w-4 h-4 text-[#00b67a] fill-current" viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

export const Testimonials: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    setActiveIdx(Math.round(scrollLeft / clientWidth));
  };

  return (
    <section id="testimonianze" className="py-16 bg-white px-4 border-b border-gray-100">
      <div className="max-w-full lg:px-20 mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-[28px] xl:text-[32px] font-bold text-brand-green mb-4 leading-[1.2]">
            Migliaia di persone hanno trovato casa con AffittoChiaro
          </h2>
          <p className="text-lg text-medium-gray leading-[1.5]">
            Non solo annunci. Una piattaforma che cambia davvero il modo in cui cerchi casa.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-10 mb-10 border-b border-gray-100">
          {STATS.map((s, idx) => (
            <div key={idx}>
              <p className="text-4xl md:text-5xl font-bold text-brand-green leading-none">{s.value}</p>
              <p className="mt-2 text-sm text-medium-gray leading-snug">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials — scroll su mobile, grid su desktop */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto pb-2 gap-4 snap-x snap-mandatory scroll-smooth no-scrollbar
                     lg:grid lg:grid-cols-3 lg:overflow-visible"
        >
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="min-w-[calc(100vw-2.5rem)] sm:min-w-[340px] lg:min-w-0 flex-shrink-0 snap-start
                         bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col hover:border-gray-200 transition-colors"
            >
              <div className="flex gap-0.5 mb-4">
                {[1,2,3,4,5].map(s => <StarIcon key={s} />)}
              </div>
              <p className="text-brand-green text-base leading-[1.7] flex-1 mb-5">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                />
                <div>
                  <p className="text-sm font-bold text-brand-green">{t.name}</p>
                  <p className="text-xs text-medium-gray">{t.location}</p>
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
                scrollRef.current.scrollTo({ left: idx * scrollRef.current.clientWidth, behavior: 'smooth' });
                setActiveIdx(idx);
              }}
              className={`rounded-full transition-all duration-300 ${activeIdx === idx ? 'w-5 h-2 bg-brand-green' : 'w-2 h-2 bg-gray-300'}`}
              aria-label={`Recensione ${idx + 1}`}
            />
          ))}
        </div>

        {/* Trustpilot badge */}
        <div className="mt-10 flex items-center gap-3">
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
