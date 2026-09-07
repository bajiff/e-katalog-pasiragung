import React from 'react';

export function PageSizeSelect({ pageSize, setPageSize }) {
  return (
    <select
      value={pageSize}
      onChange={(e) => setPageSize(e.target.value === 'all' ? 'all' : Number(e.target.value))}
      className="border border-border rounded-sm px-3 py-1.5 text-xs bg-surface outline-none"
    >
      <option value={10}>10 per page</option>
      <option value={20}>20 per page</option>
      <option value={30}>30 per page</option>
      <option value="all">All</option>
    </select>
  );
}
