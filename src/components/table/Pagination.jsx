import React from 'react';

export function Pagination({ page, setPage, totalItems, pageSize }) {
  if (pageSize === 'all' || totalItems <= pageSize) return null;

  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));

  // Render logic for 1 2 3 ... Last
  const renderPages = () => {
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages = [1, 2, 3, 4, '...', totalPages];
      } else if (page >= totalPages - 2) {
        pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, '...', page - 1, page, page + 1, '...', totalPages];
      }
    }

    return pages.map((p, idx) => {
      if (p === '...') return <span key={`dots-${idx}`} className="px-2 text-text-muted">...</span>;
      return (
        <button 
          key={p} 
          onClick={() => setPage(p)}
          className={`w-7 h-7 flex items-center justify-center rounded-sm text-xs font-body transition-colors ${page === p ? 'bg-primary text-on-primary' : 'hover:bg-surface text-text'}`}
        >
          {p}
        </button>
      );
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
      <div className="text-xs text-text-muted">
        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalItems)} of {totalItems} entries
      </div>
      <div className="flex items-center gap-1">
        <button onClick={handlePrev} disabled={page === 1} className="px-3 py-1 text-xs border border-border rounded-sm disabled:opacity-50 hover:bg-surface text-text transition-colors">Previous</button>
        {renderPages()}
        <button onClick={handleNext} disabled={page === totalPages} className="px-3 py-1 text-xs border border-border rounded-sm disabled:opacity-50 hover:bg-surface text-text transition-colors">Next</button>
      </div>
    </div>
  );
}
