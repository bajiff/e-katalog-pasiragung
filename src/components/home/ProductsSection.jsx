import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { SectionHeading, SearchInput, ProductCard } from '../shared';
import { Pagination } from '../table';

export const ProductsSection = () => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 12; // Menampilkan 12 produk per halaman
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await supabase.from('categories').select('id, name');
      if (data) setCategories(data);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('products').select('*, categories(name), owners(name)', { count: 'exact' });
      
      if (search) query = query.ilike('name', `%${search}%`);
      if (activeCategory !== 'all') query = query.eq('category_id', activeCategory);
      
      query = query.order('created_at', { ascending: false });
      
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (!error) {
        setProducts(data || []);
        setTotalItems(count || 0);
      }
      setLoading(false);
    };

    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [search, activeCategory, page]);

  // Reset page when search or category changes
  useEffect(() => {
    setPage(1);
  }, [search, activeCategory]);

  return (
    <section id="products" className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <SectionHeading 
          title="Katalog Produk" 
          subtitle="Jelajahi berbagai produk terbaik langsung dari tangan pengrajin."
        />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="w-full md:w-auto flex-1 min-w-0">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full md:max-w-xs px-3 py-2 border border-border rounded-sm text-sm font-semibold bg-surface outline-none focus:border-primary transition-colors text-text"
            >
              <option value="all">Semua Kategori</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-72 shrink-0">
            <SearchInput 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Cari nama produk..." 
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-text-muted font-body">Memuat produk...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-text-muted font-body">Tidak ada produk ditemukan.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && totalItems > pageSize && (
          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-md">
              <Pagination page={page} setPage={setPage} totalItems={totalItems} pageSize={pageSize} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
