import React from 'react';
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
  return (
    <>
      <Hero counter={counter} activeCityName={activeCityName} />
      <Problems />
      <Benefits />
      <HowItWorks />
      <CityMap activeCityName={activeCityName} onCityChange={onCityChange} />
      <Listings
        activeCityName={activeCityName}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
      />
      <Testimonials />
      <FinalCTA />
      <FAQ />
    </>
  );
};
