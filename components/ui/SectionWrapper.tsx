
import React from 'react';

export const SectionWrapper: React.FC<{ children: React.ReactNode; id?: string; className?: string; noPadding?: boolean }> = ({ children, id, className = "", noPadding = false }) => (
  <section id={id} className={`relative overflow-hidden w-full ${noPadding ? '' : 'py-20 md:py-32'} ${className}`}>
    <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
      {children}
    </div>
  </section>
);
