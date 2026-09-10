import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store, Phone, MapPin } from 'lucide-react';
import logo from '../../assets/logo.svg';

const InstagramIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TikTokIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

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
    <footer className="md:container bg-surface border-t border-border pt-12 pb-6 mt-auto">
      <div className="mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">

          {/* Kolom 1: Info */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-xl text-primary mb-4">
              <img src={logo} alt="Logo Pasiragung" className="h-8 w-auto" />
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
                <a href="https://wa.me/6285314893950" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <span>+62 812-3456-7890 (BUMDes)</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <InstagramIcon className="w-5 h-5 text-primary shrink-0" />
                <a href="https://www.instagram.com/pasiragungmedia20/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <span>@pasiragungmedia20</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <TikTokIcon className="w-5 h-5 text-primary shrink-0 p-0.5" />
                <a href="https://www.tiktok.com/@pasiragungmedia" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <span>@pasiragungmedia</span>
                </a>
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
    </footer >
  );
};
