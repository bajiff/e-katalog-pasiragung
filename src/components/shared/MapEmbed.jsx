import React from 'react';

export const MapEmbed = ({ embedUrl, title = 'Map', className = '' }) => {
  return (
    <div className={`w-full aspect-square sm:aspect-video min-h-[350px] rounded-md overflow-hidden border border-border bg-surface shadow-sm ${className}`}>
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
