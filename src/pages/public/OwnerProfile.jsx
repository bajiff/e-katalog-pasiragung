import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Store, MapPin, Phone } from 'lucide-react';

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
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Header Profil */}
      <div className="bg-background border border-border rounded-md p-6 md:p-10 mb-12 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-surface bg-surface overflow-hidden flex-shrink-0 flex items-center justify-center shadow-sm">
          {owner.image_path ? (
            <img src={owner.image_path} alt={owner.name} className="w-full h-full object-cover" />
          ) : (
            <Store className="w-16 h-16 text-text-muted" />
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-text mb-4">{owner.name}</h1>
          <div className="space-y-3 font-body text-sm text-text-muted mb-6">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>{owner.contact_phone || 'Tidak ada nomor telepon'}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{owner.address || 'Tidak ada alamat lengkap'}</span>
            </div>
          </div>
          <a 
            href={`https://wa.me/${owner.contact_phone?.replace(/^0/, '62')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-primary text-on-primary font-bold rounded-sm hover:opacity-90 transition-opacity"
          >
            Hubungi via WhatsApp
          </a>
        </div>
      </div>

      {/* Grid Produk Owner */}
      <h2 className="text-2xl font-display font-bold text-text mb-6 text-center md:text-left">Produk dari {owner.name}</h2>
      
      {products.length === 0 ? (
        <div className="text-center py-12 bg-surface border border-border rounded-md text-text-muted">
          Belum ada produk yang ditambahkan.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Link key={product.id} to={`/product/${product.id}`} className="group bg-background border border-border rounded-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square w-full bg-surface relative overflow-hidden">
                {product.image_path ? (
                  <img src={product.image_path} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">No Image</div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-text-muted mb-1">{product.categories?.name || 'Uncategorized'}</p>
                <h3 className="font-display font-semibold text-lg text-text mb-2 line-clamp-1">{product.name}</h3>
                <p className="font-body font-bold text-primary text-base">Rp {product.price?.toLocaleString('id-ID')}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
