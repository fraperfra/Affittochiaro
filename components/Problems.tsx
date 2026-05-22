import React from 'react';
import { EyeOff, FileX, Clock, LucideIcon } from 'lucide-react';
import { problems } from '../data';

const ICON_MAP: Record<string, LucideIcon> = { EyeOff, FileX, Clock };

export const Problems: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 px-4 border-b border-gray-100">
      <div className="max-w-full lg:px-20 mx-auto">

        <h2 className="text-2xl md:text-[28px] xl:text-[32px] font-bold text-brand-green mb-4 leading-[1.2]">
          Cercare Casa in Affitto è un Incubo?
        </h2>
        <p className="text-lg md:text-xl text-medium-gray mb-10 leading-[1.5]">
          Trovare un appartamento in affitto oggi è più difficile che mai. Il mercato premia solo chi sa presentarsi nel modo giusto.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {problems.map((item, idx) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 flex items-start gap-4 hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  {Icon && <Icon size={20} className="text-gray-500" />}
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-brand-green mb-2">{item.title}</h3>
                  <p className="text-medium-gray text-base leading-[1.6]">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
