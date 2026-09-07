import React from 'react';
import heroImage from '../../assets/hero-1.webp';

export const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center text-center">
      <img 
        src={heroImage} 
        alt="Perangkat Desa Pasiragung" 
        className="absolute inset-0 w-full h-full object-cover" 
      />
      <div className="absolute inset-0 bg-black/50" /> {/* Darker overlay for text readability */}
      
      <div className="relative z-10 px-4 text-white max-w-4xl mt-16 md:mt-0">
        <h1 className="font-display font-bold text-[40px] sm:text-[56px] md:text-[84px] leading-[0.87] tracking-tight mb-6">
          Katalog UMKM Desa Pasiragung
        </h1>
        <p className="font-body text-base md:text-xl opacity-90 max-w-2xl mx-auto">
          Menghubungkan produk-produk unggulan dari warga desa langsung ke tangan Anda. Dukung ekonomi lokal dengan berbelanja produk asli Pasiragung.
        </p>
        <a 
          href="#products" 
          className="inline-block mt-8 px-8 py-4 rounded-sm bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Lihat Produk Kami
        </a>
      </div>
    </section>
  );
};
