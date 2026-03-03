import React from 'react';
import { benefits } from '../data';

export const Benefits: React.FC = () => {
  return (
    <section id="come-funziona-info" className="py-16 bg-white px-4 border-b border-gray-100">
      <div className="max-w-full lg:px-20 mx-auto">
        <p className="text-xs font-bold text-brand-green uppercase tracking-widest mb-3 border-l-2 border-action-green pl-3">I VANTAGGI</p>
        <h2 className="text-3xl md:text-5xl font-bold text-brand-green mb-4 leading-tight">
          Presenta Te Stesso Come il Candidato Ideale
        </h2>
        <p className="text-lg md:text-xl text-medium-gray mb-10 max-w-4xl">
          Non sei solo un numero in una lista. Con Affittochiaro crei il curriculum perfetto dell'inquilino.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {benefits.map((benefit, idx) => (
            <div key={idx} className={`bg-white rounded-xl p-6 border flex items-start gap-4 hover:border-gray-300 transition-colors ${benefit.highlight ? 'border-action-green/40 bg-soft-green/10' : 'border-gray-200'}`}>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl shrink-0">
                {benefit.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-brand-green mb-2">{benefit.title}</h3>
                <p className="text-medium-gray text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: benefit.description }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
