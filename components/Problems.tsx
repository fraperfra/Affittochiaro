import React from 'react';
import { problems } from '../data';

export const Problems: React.FC = () => {
  return (
    <section className="py-16 bg-white px-4">
      <div className="max-w-full lg:px-20 mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-brand-green mb-6 leading-tight">
          Cercare Casa in Affitto è un Incubo?
        </h2>
        <p className="text-lg md:text-xl text-medium-gray mb-12 max-w-4xl mx-auto">
          Sappiamo cosa provi. Il mercato degli affitti oggi è <span className="font-bold text-brand-green">frammentato, lento e spesso frustrante</span>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 mb-16 text-left">
          {problems.map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 lg:p-10 flex flex-col lg:flex-row items-center lg:items-start gap-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-3xl lg:text-5xl shrink-0">{item.emoji}</span>
              <p className="text-brand-green font-medium text-base lg:text-xl leading-tight" dangerouslySetInnerHTML={{ __html: item.text }} />
            </div>
          ))}
        </div>

        <div className="relative mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100 relative z-10">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-orange-400 rounded-t-full"></div>
            <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10 w-16 h-16 md:w-24 md:h-24 bg-orange-500 rounded-full flex items-center justify-center text-white text-4xl md:text-6xl font-bold shadow-xl shadow-orange-500/20">!</div>
            <p className="text-2xl md:text-4xl font-bold text-brand-green leading-[1.2] mb-12 font-poppins">
              "Il <span className="text-black font-extrabold">73% degli inquilini</span> impiega oltre 2 mesi per trovare casa. <span className="text-orange-500">Tu puoi farlo in 2 settimane</span>."
            </p>
            <div className="space-y-4">
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.4)]" style={{ width: '73%' }}></div>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">STATISTICA DEL SETTORE</span>
            </div>
          </div>
          <div className="absolute top-8 left-8 right-8 bottom-0 bg-soft-green rounded-[3rem] -z-10 translate-y-4 blur-sm opacity-50"></div>
        </div>
      </div>
    </section>
  );
};
