import React from 'react';
import { HowItWorks, Benefits } from '../components';

export const ComeFunzionaPage: React.FC = () => {
  return (
    <div className="pt-8">
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-green mb-4 font-poppins">
          Come Funziona Affittochiaro
        </h1>
        <p className="text-lg text-medium-gray max-w-2xl mx-auto">
          Scopri come trovare la tua casa ideale in pochi semplici passaggi
        </p>
      </div>
      <Benefits />
      <HowItWorks />
    </div>
  );
};
