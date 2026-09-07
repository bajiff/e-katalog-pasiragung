import React from 'react';
import { HeroSection, AboutSection, OwnersSection, ProductsSection, MapSection } from '../../components/home';

export function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <AboutSection />
      <OwnersSection />
      <ProductsSection />
      <MapSection />
    </div>
  );
}
