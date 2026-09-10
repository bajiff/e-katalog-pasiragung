import React from 'react';
import { Link } from 'react-router-dom';

export const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group bg-background border border-border rounded-md overflow-hidden hover:shadow-lg transition-shadow duration-base flex flex-col h-full">
      <div className="aspect-square w-full bg-surface relative overflow-hidden shrink-0">
        {product.image_path ? (
          <img src={product.image_path} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-base" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">No Image</div>
        )}
      </div>
      <div className="p-4 flex flex-col grow">
        <p className="text-xs text-text-muted mb-1">{product.categories?.name || 'Uncategorized'}</p>
        <h3 className="font-display font-semibold text-lg text-text mb-2 line-clamp-2">{product.name}</h3>
        <div className="mt-auto flex flex-col gap-2">
          <p className="font-body font-bold text-primary text-base">Rp {product.price?.toLocaleString('id-ID')}</p>
          <span className="text-xs font-semibold text-primary underline mt-1">Baca Selengkapnya</span>
        </div>
      </div>
    </Link>
  );
};
