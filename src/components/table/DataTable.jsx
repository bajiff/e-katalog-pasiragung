import React from 'react';
import { LoadingOverlay } from '../shared/LoadingOverlay';

export function DataTable({ columns, data, renderRow, loading }) {
  return (
    <div className="w-full overflow-x-auto border border-border rounded-md bg-background">
      <table className="w-full text-left border-collapse min-w-full">
        <thead>
          <tr className="bg-surface border-b border-border">
            {columns.map((col, idx) => (
              <th key={idx} className="px-2 py-2 text-xs font-body font-semibold text-text truncate max-w-50">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8">
                <LoadingOverlay isFullscreen={false} message="Memuat data..." />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-xs text-text-muted">No data found.</td>
            </tr>
          ) : (
            data.map(renderRow)
          )}
        </tbody>
      </table>
    </div>
  );
}
