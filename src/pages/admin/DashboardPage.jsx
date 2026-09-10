import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Package, Grid, Users, UserCog, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    owners: 0,
    pendingUsers: 0,
    approvedAdmins: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const [
        { count: pCount },
        { count: cCount },
        { count: oCount },
        { count: uCount },
        { count: aCount }
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('owners').select('*', { count: 'exact', head: true }),
        profile?.role === 'super_admin' 
          ? supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'pending')
          : Promise.resolve({ count: 0 }),
        profile?.role === 'super_admin' 
          ? supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'approved')
          : Promise.resolve({ count: 0 })
      ]);

      setStats({
        products: pCount || 0,
        categories: cCount || 0,
        owners: oCount || 0,
        pendingUsers: uCount || 0,
        approvedAdmins: aCount || 0
      });
      setLoading(false);
    };

    fetchStats();
  }, [profile]);

  if (loading) {
    return <div className="p-6 text-sm text-text-muted">Memuat dashboard...</div>;
  }

  const cards = [
    { label: 'Total Produk', value: stats.products, icon: Package, link: '/admin/products', color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Kategori', value: stats.categories, icon: Grid, link: '/admin/categories', color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Total Pemilik Usaha', value: stats.owners, icon: Users, link: '/admin/owners', color: 'text-green-600', bg: 'bg-green-100' },
  ];

  if (profile?.role === 'super_admin') {
    cards.push(
      { 
        label: 'Admin Terdaftar', 
        value: stats.approvedAdmins, 
        icon: UserCheck, 
        link: '/admin/users', 
        color: 'text-indigo-600', 
        bg: 'bg-indigo-100' 
      },
      { 
        label: 'Admin Pending', 
        value: stats.pendingUsers, 
        icon: UserCog, 
        link: '/admin/users', 
        color: 'text-orange-600', 
        bg: 'bg-orange-100' 
      }
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-text">Dashboard</h1>
        <p className="text-sm font-body text-text-muted">Selamat datang kembali, {profile?.name}!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link key={idx} to={card.link} className="bg-background border border-border rounded-md p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.bg} ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-text-muted">{card.label}</p>
                <p className="text-2xl font-display font-bold text-text">{card.value}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
