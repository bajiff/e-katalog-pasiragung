import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Store, MapPin, Flame } from 'lucide-react';
import { ProductCard } from '../../components/shared';

export function OwnerProfile() {
  const { id } = useParams();
  const [owner, setOwner] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerAndProducts = async () => {
      setLoading(true);
      const { data: ownerData } = await supabase.from('owners').select('*').eq('id', id).single();
      setOwner(ownerData);

      if (ownerData) {
        const { data: productsData } = await supabase
          .from('products')
          .select('*, categories(name)')
          .eq('owner_id', id)
          .order('created_at', { ascending: false });
        setProducts(productsData || []);
      }

      setLoading(false);
    };

    fetchOwnerAndProducts();
  }, [id]);

  if (loading) return <div className="text-center py-20">Memuat profil...</div>;
  if (!owner) return <div className="text-center py-20 text-red-600">Pemilik usaha tidak ditemukan.</div>;

  return (
    <div className="container mx-auto px-4 py-12 mt-14 max-w-5xl">
      {/* Header Profil */}
      <div className="bg-background border border-border rounded-md p-6 md:p-10 mb-12 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-surface bg-surface overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
          {owner.image ? (
            <img src={owner.image} alt={owner.name} className="w-full h-full object-cover" />
          ) : (
            <Store className="w-16 h-16 text-text-muted" />
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-text mb-4">{owner.name}</h1>
          <div className="space-y-3 font-body text-sm text-text-muted mb-6">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Flame className="w-4 h-4 text-primary" />
              <span>Pasiragung Bestari, Berseri dan Lestari</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>Ds. Pasiragung, Kec. Hantara, Kab. Kuningan</span>
            </div>
          </div>
          {(() => {
            let waNumber = owner.contact_phone || '';
            if (waNumber) {
              waNumber = waNumber.replace(/\D/g, '');
              if (waNumber.startsWith('0')) waNumber = '62' + waNumber.slice(1);
              else if (waNumber.startsWith('8')) waNumber = '62' + waNumber;
            }
            return (
              <a
                href={waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo ${owner.name}! Saya tertarik order menu yang ada di website. Berikut detail pesanan saya:\n\nMenu & Jumlah:\nNama Penerima:\nNomor HP:\nAlamat Kirim:\nTanggal & Jam Pengantaran:\nCatatan Khusus: (Misal: pedas/tidak pakai bawang)\nMau Transfer Via Apa: `)}` : '#'}
                target={waNumber ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-primary text-on-primary font-bold rounded-sm hover:opacity-90 transition-opacity"
                onClick={(e) => {
                  if (!waNumber) {
                    e.preventDefault();
                    alert('Nomor WhatsApp pemilik usaha tidak tersedia.');
                  }
                }}
              >
                Hubungi via WhatsApp
              </a>
            );
          })()}
        </div>
      </div>

      {/* Grid Produk Owner */}
      <h2 className="text-2xl font-display font-bold text-text mb-6 text-center md:text-left">Produk dari {owner.name}</h2>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-surface border border-border rounded-md text-text-muted">
          Belum ada produk yang ditambahkan.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
