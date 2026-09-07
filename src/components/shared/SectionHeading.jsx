import React from 'react';

export const SectionHeading = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-3xl font-display font-bold text-text mb-2">{title}</h2>
      {subtitle && <p className="text-sm font-body text-text-muted">{subtitle}</p>}
    </div>
  );
};
