import React from 'react';
import { Search } from 'lucide-react';

export const SearchInput = ({ value, onChange, placeholder = 'Cari...', className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
      <input 
        type="text" 
        value={value}
        onChange={onChange}
        placeholder={placeholder} 
        className="w-full pl-10 pr-4 py-2 border border-border rounded-md text-sm font-body outline-none focus:border-primary transition-colors bg-background"
      />
    </div>
  );
};
