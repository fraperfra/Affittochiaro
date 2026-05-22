import React from 'react';
import { PartnersCarousel } from '../src/components/ui';
import {
  Hero,
  Problems,
  StatBanner,
  Benefits,
  ComeFunziona,
  HowItWorks,
  CityMap,
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
      <PartnersCarousel />
      <Problems />
      <StatBanner />
      <Benefits />
      <ComeFunziona />
      <HowItWorks />
      <CityMap activeCityName={activeCityName} onCityChange={onCityChange} />
      <Testimonials />
      <FinalCTA />
      <FAQ />
    </>
  );
};
