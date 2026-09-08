import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { SectionHeading } from '../shared';
import hero2Image from '../../assets/hero-2.webp';

export const AboutSection = () => {
  const [stats, setStats] = useState({ owners: 0, products: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: oCount },
        { count: pCount }
      ] = await Promise.all([
        supabase.from('owners').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true })
      ]);
      setStats({ owners: oCount || 0, products: pCount || 0 });
    };
    fetchStats();
  }, []);

  return (
    <section id="about" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
          {/* Text Content */}
          <div className="order-2 md:order-1">
            <SectionHeading
              title="Tentang Katalog Kami"
              subtitle="Mendukung Perekonomian Lokal Desa Pasiragung"
            />
            <div className="prose prose-sm text-text-muted font-body leading-relaxed">
              <p className="mb-4">
                E-Katalog UMKM Desa Pasiragung hadir sebagai jembatan digital antara para pelaku usaha mikro, kecil, dan menengah (UMKM) dengan pasar yang lebih luas. Program ini diprakarsai oleh Pemerintah Desa Pasiragung bersama dengan tim Kuliah Kerja Mahasiswa (KKM).
              </p>
              <p>
                Melalui platform ini, kami berharap dapat memberdayakan masyarakat desa, meningkatkan visibilitas produk lokal, dan memudahkan Anda untuk menemukan kualitas terbaik langsung dari sumbernya.
              </p>
            </div>
          </div>

          {/* Image Content */}
          <div className="order-1 md:order-2 rounded-lg overflow-hidden border border-border shadow-sm">
            <img
              src={hero2Image}
              alt="Aktivitas Desa Pasiragung"
              className="w-full h-auto object-cover aspect-4/3 md:aspect-auto"
            />
          </div>
        </div>

        {/* Stats Card - Second Row */}
        <div className="bg-surface rounded-md border border-border p-8 text-center w-full max-w-3xl mx-auto shadow-sm">
          <h3 className="font-display font-bold text-xl md:text-2xl text-text mb-8">Bersama Membangun Desa</h3>
          <div className="flex justify-around items-center">
            <div>
              <p className="font-display font-bold text-4xl md:text-5xl text-primary">{stats.owners}</p>
              <p className="font-body text-sm text-text-muted mt-2">UMKM Terdaftar</p>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div>
              <p className="font-display font-bold text-4xl md:text-5xl text-primary">{stats.products}</p>
              <p className="font-body text-sm text-text-muted mt-2">Produk Tersedia</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
