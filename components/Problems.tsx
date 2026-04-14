import React from 'react';
import { problems } from '../data';

export const Problems: React.FC = () => {
  return (
    <section className="py-16 bg-white px-4">
      <div className="max-w-full lg:px-20 mx-auto text-center">
        <h2 className="text-2xl md:text-[28px] xl:text-[32px] font-bold text-brand-green mb-6 leading-[1.2]">
          Cercare Casa in Affitto è un Incubo?
        </h2>
        <p className="text-lg md:text-xl text-medium-gray mb-12 max-w-[65ch] mx-auto leading-[1.5]">
          Sappiamo cosa provi. Il mercato degli affitti oggi è frammentato, lento e spesso frustrante.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 mb-16 text-left">
          {problems.map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 lg:p-8 flex flex-row items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-2xl lg:text-3xl shrink-0 mt-0.5">{item.emoji}</span>
              <p className="text-brand-green font-medium text-base lg:text-lg leading-[1.4]" dangerouslySetInnerHTML={{ __html: item.text }} />
            </div>
          ))}
        </div>

        {/* Stat insight strip */}
        <div className="mt-10 max-w-xl mx-auto">
          <div className="flex items-center gap-4 bg-soft-green border border-action-green/20 rounded-2xl px-5 py-4 text-left">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-action-green/20 flex items-center justify-center text-base select-none">
              ⚡
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 leading-snug">
                Il <span className="text-orange-500 font-bold">73%</span> degli inquilini cerca casa da oltre 2 mesi.
                {' '}Con AffittoChiaro bastano{' '}
                <span className="text-brand-green font-bold">2 settimane</span>.
              </p>
              <div className="mt-2.5 flex items-center gap-3">
                <div className="flex-1 h-1 bg-action-green/20 rounded-full overflow-hidden">
                  <div className="h-full bg-action-green rounded-full" style={{ width: '73%' }} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Statistica di settore
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
