import React, { useState, useRef } from 'react';
import { PartnersCarousel } from '../src/components/ui';
import {
  Hero,
  Problems,
  Benefits,
  HowItWorks,
  CityMap,
  Listings,
  Testimonials,
  FAQ,
  FinalCTA,
  SearchByType,
  SearchByCity,
} from '../components';

interface HomePageProps {
  counter: number;
  activeCityName: string;
  onCityChange: (city: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  counter,
  activeCityName,
  onCityChange,
  activeFilter,
  onFilterChange,
}) => {
  const [prefilledTipologia, setPrefilledTipologia] = useState<string | null>(null);
  const heroSearchRef = useRef<HTMLDivElement>(null);

  const handleTypeSelect = (slug: string) => {
    setPrefilledTipologia(slug);
    // Scroll to the search box in Hero with a brief delay for state update
    setTimeout(() => {
      heroSearchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  return (
    <>
      <Hero
        counter={counter}
        activeCityName={activeCityName}
        prefilledTipologia={prefilledTipologia}
        onTipologiaFilled={() => setPrefilledTipologia(null)}
        searchSectionRef={heroSearchRef}
      />
      <PartnersCarousel />
      <Problems />
      <Benefits />
      <HowItWorks />
      <SearchByType onTypeSelect={handleTypeSelect} />
      <SearchByCity />
      <CityMap activeCityName={activeCityName} onCityChange={onCityChange} />
      <Listings activeCityName={activeCityName} activeFilter={activeFilter} onFilterChange={onFilterChange} />
      <Testimonials />
      <FinalCTA />
      <FAQ />
    </>
  );
};
