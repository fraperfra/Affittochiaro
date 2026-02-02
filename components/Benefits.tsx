import React from 'react';
import { benefits } from '../data';

export const Benefits: React.FC = () => {
  return (
    <section id="come-funziona-info" className="py-16 bg-soft-green/30 px-4">
      <div className="max-w-full lg:px-20 mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-brand-green mb-6 leading-tight font-poppins">
          Presenta Te Stesso Come il <br /> Candidato Ideale
        </h2>
        <p className="text-lg md:text-xl text-medium-gray mb-10 max-w-4xl mx-auto">
          Non sei solo un numero in una lista. Con Affittochiaro crei il <span className="font-bold text-brand-green">curriculum perfetto dell'inquilino</span>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {benefits.map((benefit, idx) => (
            <div key={idx} className={`bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group ${benefit.highlight ? 'ring-2 ring-action-green/20' : ''} flex items-start gap-5`}>
              <div className="w-12 h-12 bg-soft-green rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:bg-action-green group-hover:scale-110 transition-all shadow-inner">
                {benefit.icon}
              </div>
              <div className="pt-1">
                <h3 className="text-xl font-bold text-brand-green mb-3">{benefit.title}</h3>
                <p className="text-medium-gray text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: benefit.description }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
