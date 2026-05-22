import React from 'react';
import { ShieldCheck, Video, Briefcase, PenLine, LucideIcon } from 'lucide-react';
import { benefits } from '../data';

const ICON_MAP: Record<string, LucideIcon> = { ShieldCheck, Video, Briefcase, PenLine };

export const Benefits: React.FC = () => {
  return (
    <section id="come-funziona-info" className="py-16 bg-white px-4 border-b border-gray-100">
      <div className="max-w-full lg:px-20 mx-auto">
        <h2 className="text-2xl md:text-[28px] xl:text-[32px] font-bold text-brand-green mb-4 leading-[1.2]">
          Presenta Te Stesso Come il Candidato Ideale
        </h2>
        <p className="text-lg md:text-xl text-medium-gray mb-10 leading-[1.5]">
          Su AffittoChiaro trovare casa in affitto diventa semplice: la casa trova te. Bastano pochi minuti per costruire il profilo che fa la differenza.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
          {benefits.map((benefit, idx) => {
            const Icon = ICON_MAP[benefit.icon];
            return (
              <div
                key={idx}
                className={`bg-white rounded-xl p-6 border flex items-start gap-4 hover:border-gray-300 transition-colors ${benefit.highlight ? 'border-action-green/40 bg-soft-green/10' : 'border-gray-200'}`}
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  {Icon && <Icon size={20} className="text-gray-500" />}
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-brand-green mb-2">{benefit.title}</h3>
                  <p className="text-medium-gray text-base leading-[1.6]" dangerouslySetInnerHTML={{ __html: benefit.description }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
