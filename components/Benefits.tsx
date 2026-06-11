import React from 'react';
import { benefits } from '../data';

const BENEFIT_IMAGES = [
  '/assets/affittini-4.svg',
  '/assets/affittini-5.svg',
  '/assets/affittini-6.svg',
  '/assets/affittini-7.svg',
];

export const Benefits: React.FC = () => {
  return (
    <section id="come-funziona-info" className="py-16 bg-white px-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[24px] md:text-3xl font-bold text-brand-green mb-4 leading-[1.2]">
          Presenta te stesso come il candidato ideale
        </h2>
        <p className="text-lg md:text-xl text-medium-gray mb-10 leading-[1.5]">
          Su Affittochiaro trovare casa diventa semplice: bastano pochi minuti per creare il profilo che fa la differenza.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors flex flex-col">
              <img
                src={BENEFIT_IMAGES[idx]}
                alt={benefit.title}
                className="w-full h-[220px] object-contain pt-2 px-4 pb-0 md:p-4"
              />
              <div className="px-4 pt-1 pb-4 md:px-5 md:pb-5 flex flex-col flex-1 text-center">
                <h3 className="text-[24px] font-bold text-brand-green mb-2 leading-tight">{benefit.title}</h3>
                <p className="text-medium-gray text-[16px] leading-[1.6]" dangerouslySetInnerHTML={{ __html: benefit.description }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
