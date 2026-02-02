import React, { useState } from 'react';
import { Listings } from '../components';

export const AnnunciPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Tutti');
  const [activeCityName, setActiveCityName] = useState('Roma');

  return (
    <div className="pt-8">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-green mb-4 font-poppins">
          Tutti gli Annunci
        </h1>
        <p className="text-lg text-medium-gray">
          Sfoglia tutti gli annunci disponibili in Italia
        </p>
      </div>
      <Listings
        activeCityName={activeCityName}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
    </div>
  );
};
