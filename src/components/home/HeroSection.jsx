import React from 'react';
import heroImage from '../../assets/hero-1.webp';

export const HeroSection = () => {
  return (
    <section id="hero" className="relative w-full bg-gray-900 overflow-hidden flex flex-col justify-center min-h-[100svh] md:min-h-[80vh]">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 flex items-start md:items-center justify-center">
         <div 
           className="w-full h-full bg-no-repeat bg-contain md:bg-cover bg-top md:bg-center opacity-70 md:opacity-50"
           style={{ backgroundImage: `url(${heroImage})` }}
         />
      </div>

      {/* Content Container */}
      <div className="relative z-10 py-16 px-4 flex flex-col items-center justify-end md:justify-center flex-grow text-center pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto mt-[40vh] md:mt-0">
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[72px] leading-[1.1] tracking-tight mb-6 text-white drop-shadow-lg">
            E-Katalog UMKM Desa Pasiragung
          </h1>
          <p className="font-body text-base md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md font-medium">
            Menghubungkan produk-produk unggulan dari warga desa langsung ke tangan Anda. Dukung ekonomi lokal dengan berbelanja produk asli Pasiragung.
          </p>
          <a
            href="#products"
            className="inline-block px-8 py-3.5 rounded-sm bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
          >
            Lihat Produk Kami
          </a>
        </div>
      </div>
    </section>
  );
};
