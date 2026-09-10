import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, FileJson } from 'lucide-react';

export function ExportMenu({ onExport, loading }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportClick = (type) => {
    setIsOpen(false);
    if (onExport) onExport(type);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center justify-center gap-2 px-3 py-2 sm:py-1.5 bg-primary text-on-primary rounded-sm text-xs font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 w-full sm:w-auto"
      >
        <Download className="w-3.5 h-3.5" />
        Export
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-full sm:w-36 bg-background border border-border rounded-sm shadow-lg z-50 overflow-hidden">
          <button
            onClick={() => handleExportClick('pdf')}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left text-text hover:bg-surface transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-red-500" />
            Export PDF
          </button>
          <button
            onClick={() => handleExportClick('excel')}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left text-text hover:bg-surface transition-colors border-t border-border"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" />
            Export Excel
          </button>
          <button
            onClick={() => handleExportClick('csv')}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left text-text hover:bg-surface transition-colors border-t border-border"
          >
            <FileJson className="w-3.5 h-3.5 text-blue-500" />
            Export CSV
          </button>
        </div>
      )}
    </div>
  );
}
