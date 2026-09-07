import React from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';

export const OwnerCard = ({ owner }) => {
  const productCount = owner.products?.[0]?.count || 0;

  return (
    <Link to={`/owner/${owner.id}`} className="group block bg-background border border-border rounded-md p-4 text-center hover:shadow-md transition-shadow">
      <div className="w-16 h-16 mx-auto rounded-full bg-surface border border-border overflow-hidden mb-3 flex items-center justify-center">
        {owner.image_path ? (
          <img src={owner.image_path} alt={owner.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <Store className="w-8 h-8 text-text-muted" />
        )}
      </div>
      <h3 className="font-display font-semibold text-text text-base line-clamp-1">{owner.name}</h3>
      <p className="font-body text-xs text-text-muted mt-1">{productCount} Produk</p>
    </Link>
  );
};
