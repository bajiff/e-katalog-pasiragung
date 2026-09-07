import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Store } from 'lucide-react';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Store className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-xl text-text">E-Katalog UMKM</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-semibold">
            <Link to="/" className="text-text hover:text-primary transition-colors">Beranda</Link>
            <Link to="/login" className="px-4 py-2 bg-primary text-on-primary rounded-sm hover:opacity-90 transition-opacity">Login Admin</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-surface py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} E-Katalog UMKM Desa Pasiragung. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
