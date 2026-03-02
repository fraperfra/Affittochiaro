import React from 'react';
import { PartnersCarousel } from '../src/components/ui';
import { useCMSSections } from '../src/cms';
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

// Map section IDs to their components
const sectionComponents: Record<string, React.FC<any>> = {
  hero: Hero,
  partners: PartnersCarousel,
  problems: Problems,
  benefits: Benefits,
  howItWorks: HowItWorks,
  cityMap: CityMap,
  listings: Listings,
  testimonials: Testimonials,
  finalCta: FinalCTA,
  faq: FAQ,
};

export const HomePage: React.FC<HomePageProps> = ({
  counter,
  activeCityName,
  onCityChange,
  activeFilter,
  onFilterChange,
}) => {
  const visibleSections = useCMSSections('home');

  // Props that specific sections need
  const sectionProps: Record<string, any> = {
    hero: { counter, activeCityName },
    cityMap: { activeCityName, onCityChange },
    listings: { activeCityName, activeFilter, onFilterChange },
  };

  return (
    <>
      {visibleSections.map((section) => {
        const Component = sectionComponents[section.id];
        if (!Component) return null;
        const props = sectionProps[section.id] || {};
        return <Component key={section.id} {...props} />;
      })}
    </>
  );
};
