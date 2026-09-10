import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { SectionHeading, SearchInput, OwnerCard } from '../shared';

export const OwnersSection = () => {
  const [search, setSearch] = useState('');
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwners = async () => {
      setLoading(true);
      let query = supabase.from('owners').select('*, products(count)');
      if (search) query = query.ilike('name', `%${search}%`);
      const { data, error } = await query.limit(20);
      if (!error) setOwners(data || []);
      setLoading(false);
    };

    const debounce = setTimeout(fetchOwners, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  return (
    <section id="owners" className="md:container py-20 px-4 bg-surface border-t border-b border-border">
      <div className=" mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <SectionHeading
            title="Pelaku Usaha Kami"
            subtitle="Kenali warga Pasiragung di balik produk-produk unggulan ini."
            className="mb-0"
          />
          <div className="w-full md:w-72">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pemilik usaha..."
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-text-muted font-body">Memuat data...</div>
        ) : owners.length === 0 ? (
          <div className="py-12 text-center text-text-muted font-body">Tidak ada pemilik usaha ditemukan.</div>
        ) : (
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar scroll-smooth">
            {owners.map(owner => (
              <div key={owner.id} className="snap-start shrink-0 w-40 sm:w-50">
                <OwnerCard owner={owner} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
