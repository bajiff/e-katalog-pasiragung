import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HeroSection, AboutSection, OwnersSection, ProductsSection, MapSection } from '../../components/home';

export function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
      
      // Clear state so it doesn't scroll again on normal refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

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
