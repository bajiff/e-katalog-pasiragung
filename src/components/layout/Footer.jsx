import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const handleAnchorClick = (e, id) => {
    e.preventDefault();
    if (isHome) {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80; // Navbar height roughly
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <footer className="bg-surface border-t border-border pt-12 pb-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          
          {/* Kolom 1: Info */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-xl text-primary mb-4">
              <img src="/src/assets/logo.svg" alt="Logo Pasiragung" className="h-8 w-auto" />
              Katalog Pasiragung
            </Link>
            <p className="text-sm font-body text-text-muted leading-relaxed">
              Platform e-katalog resmi UMKM Desa Pasiragung. 
              Menghubungkan produk-produk berkualitas unggulan dari warga desa langsung ke tangan Anda.
            </p>
          </div>

          {/* Kolom 2: Navigasi */}
          <div>
            <h4 className="font-display font-bold text-text mb-4">Navigasi Cepat</h4>
            <ul className="space-y-2 text-sm font-body text-text-muted">
              <li><a href={isHome ? "#hero" : "/#hero"} onClick={(e) => handleAnchorClick(e, 'hero')} className="hover:text-primary transition-colors cursor-pointer">Beranda</a></li>
              <li><a href={isHome ? "#about" : "/#about"} onClick={(e) => handleAnchorClick(e, 'about')} className="hover:text-primary transition-colors cursor-pointer">Tentang Kami</a></li>
              <li><a href={isHome ? "#owners" : "/#owners"} onClick={(e) => handleAnchorClick(e, 'owners')} className="hover:text-primary transition-colors cursor-pointer">Pemilik Usaha</a></li>
              <li><a href={isHome ? "#products" : "/#products"} onClick={(e) => handleAnchorClick(e, 'products')} className="hover:text-primary transition-colors cursor-pointer">Semua Produk</a></li>
              <li><a href={isHome ? "#map" : "/#map"} onClick={(e) => handleAnchorClick(e, 'map')} className="hover:text-primary transition-colors cursor-pointer">Lokasi Desa</a></li>
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <h4 className="font-display font-bold text-text mb-4">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm font-body text-text-muted">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Kantor Kepala Desa Pasiragung, Kec. Hantara, Kab. Kuningan, Jawa Barat</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+62 812-3456-7890 (BUMDes)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Baris Bawah */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted font-body text-center md:text-left">
            &copy; {new Date().getFullYear()} E-Katalog UMKM Desa Pasiragung. All rights reserved.
          </p>
          <p className="text-xs text-text-muted font-body text-center md:text-right">
            Dikembangkan oleh Tim KKM
          </p>
        </div>
      </div>
    </footer>
  );
};
