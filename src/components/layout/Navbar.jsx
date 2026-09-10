import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/logo.svg';

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
  const textColor = isScrolled ? 'text-text' : 'text-black';
  const loginBg = isScrolled ? 'bg-primary text-on-primary' : 'bg-black text-green-500 hover:bg-primary hover:text-on-primary';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-base ${bgColor} h-16 flex items-center`}>
      <div className="container mx-auto px-4 flex items-center justify-center gap-5">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
          <img src={logo} alt="Logo Pasiragung" className="h-10 w-auto" />
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
            className={`px-5 py-2 rounded-sm text-sm font-bold transition-colors hover:opacity-80 ${textColor}`}
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className={`px-5 py-2 rounded-sm text-sm font-bold transition-colors ${loginBg}`}
          >
            Sign up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden p-2 relative w-10 h-10 flex items-center justify-center transition-colors ${textColor}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <Menu className={`w-6 h-6 absolute transition-all duration-fast ${isMobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
          <X className={`w-6 h-6 absolute transition-all duration-fast ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
        </button>

      </div>

      {/* Mobile Drawer */}
      <div
        className={`absolute top-full left-0 w-full bg-background border-b border-border shadow-md py-4 px-4 flex flex-col gap-4 md:hidden transition-all duration-base origin-top ${isMobileMenuOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible pointer-events-none'
          }`}
      >
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
        <div className="flex flex-col gap-2 mt-2">
          <Link
            to="/login"
            className="w-full text-center px-4 py-3 bg-surface text-text border border-border rounded-sm text-sm font-bold hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="w-full text-center px-4 py-3 bg-primary text-on-primary rounded-sm text-sm font-bold hover:bg-black hover:text-primary transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
};
