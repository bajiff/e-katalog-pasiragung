import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useTableQuery } from '../../hooks/useTableQuery';
import { Pagination } from '../../components/table';
import { Search } from 'lucide-react';

export function Home() {
  const {
    search, setSearch, page, setPage, pageSize, fetchData
  } = useTableQuery('products', {
    defaultSort: 'newest',
    searchColumn: 'name',
    selectQuery: '*, categories(name)'
  });

  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await supabase.from('categories').select('id, name');
      if (data) setCategories(data);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      // Custom fetch for category filtering since useTableQuery doesn't support generic relational filters easily
      // We'll augment the query here manually just for the public page, or just fetch normally.
      let query = supabase.from('products').select('*, categories(name)', { count: 'exact' });
      if (search) query = query.ilike('name', `%${search}%`);
      if (activeCategory !== 'all') query = query.eq('category_id', activeCategory);
      
      query = query.order('created_at', { ascending: false });
      
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, count } = await query;
      setProducts(data || []);
      setTotalItems(count || 0);
      setLoading(false);
    };
    loadProducts();
  }, [search, activeCategory, page, pageSize]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-primary text-on-primary py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-[84px] font-display leading-[0.87] tracking-tight mb-6">
            Temukan Produk Lokal Berkualitas
          </h1>
          <p className="text-sm md:text-base font-body opacity-90">
            E-Katalog UMKM Desa Pasiragung menghubungkan Anda langsung dengan produsen lokal. 
            Dukung ekonomi desa dengan berbelanja produk asli dari masyarakat kami.
          </p>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari nama produk..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-border rounded-md font-body text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <div className="flex overflow-x-auto w-full md:w-auto gap-2 pb-2 hide-scrollbar">
            <button 
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-md whitespace-nowrap text-sm font-semibold transition-colors ${
                activeCategory === 'all' ? 'bg-text text-background' : 'bg-surface text-text hover:bg-border'
              }`}
            >
              Semua
            </button>
            {categories.map(c => (
              <button 
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-4 py-2 rounded-md whitespace-nowrap text-sm font-semibold transition-colors ${
                  activeCategory === c.id ? 'bg-text text-background' : 'bg-surface text-text hover:bg-border'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-text-muted font-body">Memuat produk...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-text-muted font-body">Tidak ada produk ditemukan.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <Link key={product.id} to={`/product/${product.id}`} className="group bg-background border border-border rounded-md overflow-hidden hover:shadow-lg transition-shadow duration-base">
                <div className="aspect-square w-full bg-surface relative overflow-hidden">
                  {product.image_path ? (
                    <img src={product.image_path} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-base" />
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

        {totalItems > pageSize && (
          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-md">
              <Pagination page={page} setPage={setPage} totalItems={totalItems} pageSize={pageSize} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
