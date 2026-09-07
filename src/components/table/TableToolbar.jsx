import React from 'react';
import { Search } from 'lucide-react';
import { SortDropdown } from './SortDropdown';
import { PageSizeSelect } from './PageSizeSelect';

export function TableToolbar({ search, setSearch, sort, setSort, sortOptions, pageSize, setPageSize }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
        <input 
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 border border-border rounded-sm text-xs outline-none focus:border-primary transition-colors bg-background"
        />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <SortDropdown sort={sort} setSort={setSort} sortOptions={sortOptions} />
        <PageSizeSelect pageSize={pageSize} setPageSize={setPageSize} />
      </div>
    </div>
  );
}
