import React from 'react';

export function SortDropdown({ sort, setSort, sortOptions }) {
  return (
    <select 
      value={sort} 
      onChange={(e) => setSort(e.target.value)}
      className="border border-border rounded-sm px-3 py-1.5 text-xs bg-surface outline-none"
    >
      {sortOptions.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
