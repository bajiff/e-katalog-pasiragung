import React from 'react';
import heroImage from '../../assets/hero-1.webp';

export const HeroSection = () => {
  return (
    <section id="hero" className="py-16 md:py-24 px-4 bg-background border-b border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 md:order-1 text-center md:text-left mt-8 md:mt-0">
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[72px] leading-[1.1] tracking-tight mb-4 text-text">
              Katalog UMKM Desa Pasiragung
            </h1>
            <p className="font-body text-base md:text-lg text-text-muted max-w-lg mx-auto md:mx-0 mb-8 leading-relaxed">
              Menghubungkan produk-produk unggulan dari warga desa langsung ke tangan Anda. Dukung ekonomi lokal dengan berbelanja produk asli Pasiragung.
            </p>
            <a 
              href="#products" 
              className="inline-block px-8 py-3.5 rounded-sm bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Lihat Produk Kami
            </a>
          </div>
          
          {/* Image Content */}
          <div className="order-1 md:order-2 rounded-lg overflow-hidden border border-border shadow-sm">
            <img 
              src={heroImage} 
              alt="Perangkat Desa Pasiragung" 
              className="w-full h-auto object-cover aspect-4/3 md:aspect-auto" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};
