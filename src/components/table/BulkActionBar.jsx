import React from 'react';
import { Trash2 } from 'lucide-react';

export function BulkActionBar({ selectedCount, onDelete }) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/10 border border-primary text-primary px-4 py-2 rounded-sm flex items-center justify-between mb-4">
      <span className="text-xs font-body font-semibold">{selectedCount} item(s) selected</span>
      <button 
        onClick={onDelete}
        className="flex items-center gap-1.5 text-xs bg-primary text-on-primary px-3 py-1.5 rounded-sm hover:opacity-90 transition-opacity"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Delete Selected
      </button>
    </div>
  );
}
