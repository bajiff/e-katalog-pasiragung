import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Store } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ProductCard } from '../../components/shared';

export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*, categories(name), owners(*)')
        .eq('id', id)
        .single();

      setProduct(data);

      if (data?.category_id) {
        const { data: rel } = await supabase
          .from('products')
          .select('*, categories(name)')
          .eq('category_id', data.category_id)
          .neq('id', id)
          .limit(4);
        setRelated(rel || []);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-20">Memuat detail produk...</div>;
  if (!product) return <div className="text-center py-20 text-red-600">Produk tidak ditemukan.</div>;

  let waNumber = product.owners?.contact_phone || '';
  if (waNumber) {
    waNumber = waNumber.replace(/\D/g, '');
    if (waNumber.startsWith('0')) waNumber = '62' + waNumber.slice(1);
    else if (waNumber.startsWith('8')) waNumber = '62' + waNumber;
  }

  const waText = `Halo ${product.owners?.name || 'Bapak/Ibu'}! Saya tertarik order menu yang ada di website. Berikut detail pesanan saya:\n\nMenu & Jumlah: ${product.name}\nNama Penerima:\nNomor HP:\nAlamat Kirim:\nTanggal & Jam Pengantaran:\nCatatan Khusus: (Misal: pedas/tidak pakai bawang)\nMau Transfer Via Apa: `;
  const waLink = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`
    : '#';

  return (
    <div className="container mx-auto mt-14 px-4 py-8 max-w-6xl">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-text mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
        {/* Gambar Produk */}
        <div className="bg-surface rounded-md border border-border overflow-hidden aspect-square">
          {product.image_path ? (
            <img src={product.image_path} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">Tidak ada gambar</div>
          )}
        </div>

        {/* Detail Produk */}
        <div className="flex flex-col">
          <div className="mb-6">
            <p className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">{product.categories?.name || 'Tanpa Kategori'}</p>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-text leading-tight mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-text">Rp {product.price?.toLocaleString('id-ID')}</p>
          </div>

          <div className="prose prose-sm text-text-muted mb-8 font-body leading-relaxed border-t border-b border-border py-6">
            <h3 className="text-sm font-bold text-text mb-2 uppercase">Deskripsi Produk</h3>
            <p className="whitespace-pre-wrap">{product.description || 'Tidak ada deskripsi.'}</p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-text-muted mb-1">Stok Tersedia: <span className="font-bold text-text">{product.stock}</span></p>
          </div>

          {/* Informasi Tambahan */}
          <div className="grid grid-cols-2 gap-4 mb-8 bg-surface p-4 rounded-md border border-border">

            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-text-muted mb-1">Kategori</p>
              <p className="text-sm font-bold text-text">{product.categories?.name || 'Tanpa Kategori'}</p>
            </div>

            {product.capacity && product.unit && (
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs text-text-muted mb-1">Ukuran / Berat</p>
                <p className="text-sm font-bold text-text">{product.capacity} {product.unit}</p>
              </div>
            )}

            <div className="col-span-2">
              <p className="text-xs text-text-muted mb-1">Varian Rasa</p>
              {product.flavor_variants && product.flavor_variants.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.flavor_variants.map((v, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-primary/10 text-primary font-semibold rounded-sm border border-primary/20">{v}</span>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-bold text-text">-</p>
              )}
            </div>

            <div className="col-span-2">
              <p className="text-xs text-text-muted mb-1">Komposisi</p>
              {product.compositions && product.compositions.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.compositions.map((v, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-primary/10 text-primary font-semibold rounded-sm border border-primary/20">{v}</span>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-bold text-text">-</p>
              )}
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-text-muted mb-1">NIB</p>
              <p className="text-sm font-bold text-text">{product.nib ? product.nib : '-'}</p>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-text-muted mb-1">Sertifikat Halal</p>
              <p className="text-sm font-bold text-text">{product.halal_certificate ? `ID${product.halal_certificate}` : '-'}</p>
            </div>
          </div>

          {/* Owner Info & CTA */}
          <div className="bg-surface p-4 rounded-md border border-border flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
            <Link to={`/owner/${product.owner_id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 rounded-full bg-background border border-border overflow-hidden flex items-center justify-center">
                {product.owners?.image ? (
                  <img src={product.owners.image} alt={product.owners.name} className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-6 h-6 text-text-muted" />
                )}
              </div>
              <div>
                <p className="text-xs text-text-muted">Dijual oleh</p>
                <p className="text-sm font-bold text-text">{product.owners?.name}</p>
              </div>
            </Link>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-accent text-background font-bold rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Hubungi Penjual
            </a>
          </div>
        </div>
      </div>

      {/* Produk Terkait */}
      {related.length > 0 && (
        <section className="border-t border-border pt-12">
          <h2 className="text-2xl font-display font-bold text-text mb-6">Produk Serupa</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
