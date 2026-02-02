import React from 'react';

export interface Testimonial {
  name: string;
  location: string;
  quote: string;
  stars: number;
  image: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Advantage {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Step {
  number: number;
  title: string;
  description: string;
  image: string;
}