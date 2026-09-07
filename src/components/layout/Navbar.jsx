import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      // Jika di halaman home, navbar transparan di atas (scroll < 50px)
      // Jika di halaman lain, navbar selalu solid
      if (!isHome) {
        setIsScrolled(true);
        return;
      }
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll(); // Check initial scroll
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  // Handle anchor links scroll if on home page
  const handleAnchorClick = (e, id) => {
    if (isHome) {
      e.preventDefault();
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
        setIsMobileMenuOpen(false);
      }
    } else {
      // If not on home page, let the user navigate to home with hash (need to handle it in Home component or just link to `/#id`)
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Beranda', href: 'hero' },
    { label: 'Tentang', href: 'about' },
    { label: 'Pemilik Usaha', href: 'owners' },
    { label: 'Produk', href: 'products' },
    { label: 'Lokasi', href: 'map' },
  ];

  const bgColor = isScrolled ? 'bg-background shadow-sm border-b border-border' : 'bg-transparent';
  const textColor = isScrolled ? 'text-text' : 'text-white';
  const logoColor = isScrolled ? 'text-primary' : 'text-white';
  const loginBg = isScrolled ? 'bg-primary text-on-primary' : 'bg-white text-primary hover:bg-gray-100';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-base ${bgColor} h-16 md:h-20 flex items-center`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <img src="/src/assets/logo.svg" alt="Logo Pasiragung" className="h-10 w-auto" />
          <span className={`font-display font-bold text-xl md:text-2xl tracking-tight transition-colors ${logoColor}`}>
            Katalog Pasiragung
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={isHome ? `#${link.href}` : `/#${link.href}`}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className={`text-sm font-semibold hover:opacity-80 transition-opacity ${textColor}`}
              >
                {link.label}
              </a>
            ))}
          </div>
          
          <div className="w-px h-6 bg-border mx-2"></div>
          
          <Link 
            to="/login" 
            className={`px-5 py-2 rounded-sm text-sm font-bold transition-colors ${loginBg}`}
          >
            Masuk Admin
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`md:hidden p-2 transition-colors ${textColor}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-background border-b border-border shadow-md py-4 px-4 flex flex-col gap-4 md:hidden">
          {navLinks.map((link) => (
            <a 
              key={link.href}
              href={isHome ? `#${link.href}` : `/#${link.href}`}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className="text-sm font-semibold text-text py-2 border-b border-border hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link 
            to="/login" 
            className="w-full text-center px-4 py-3 mt-2 bg-primary text-on-primary rounded-sm text-sm font-bold hover:opacity-90 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Masuk Admin
          </Link>
        </div>
      )}
    </nav>
  );
};
