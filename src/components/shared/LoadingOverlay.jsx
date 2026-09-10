import React from 'react';

export function LoadingOverlay({ message = "Memuat data...", isFullscreen = true }) {
  const overlayClass = isFullscreen 
    ? "fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
    : "w-full h-full min-h-[300px] flex items-center justify-center bg-transparent";

  return (
    <div className={overlayClass}>
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="relative flex items-center justify-center w-12 h-12">
          <div className="absolute w-full h-full border-4 border-primary/20 rounded-full"></div>
          <div className="absolute w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        {message && (
          <p className="text-sm font-semibold text-text animate-pulse">{message}</p>
        )}
      </div>
    </div>
  );
}
