import React from 'react';

export const MapEmbed = ({ embedUrl, title = 'Map', className = '' }) => {
  return (
    <div className={`rounded-md overflow-hidden border border-border bg-surface ${className}`}>
      <iframe
        src={embedUrl}
        className="w-full h-full border-0"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
      ></iframe>
    </div>
  );
};
