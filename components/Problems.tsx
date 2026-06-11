import React from 'react';
import { problems } from '../data';

const PROBLEM_IMAGES = [
  '/assets/affittini-1.svg',
  '/assets/affittini-2.svg',
  '/assets/affittini-3.svg',
];

export const Problems: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 px-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-[24px] md:text-3xl font-bold text-brand-green mb-4 leading-[1.2]">
          Cercare casa in affitto è un incubo
        </h2>
        <p className="text-lg md:text-xl text-medium-gray mb-10 leading-[1.5]">
          Trovare un appartamento in affitto oggi è più difficile che mai: il mercato premia solo chi sa presentarsi nel modo giusto.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {problems.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors flex flex-col">
              <img
                src={PROBLEM_IMAGES[idx]}
                alt={item.title}
                className="w-full h-[240px] object-contain pt-2 px-4 pb-0 md:p-4"
              />
              <div className="px-4 pt-1 pb-4 md:px-6 md:pb-6 flex flex-col flex-1 text-center">
                <h3 className="text-[24px] font-bold text-brand-green mb-2 leading-tight">{item.title}</h3>
                <p className="text-medium-gray text-[16px] leading-[1.6]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
