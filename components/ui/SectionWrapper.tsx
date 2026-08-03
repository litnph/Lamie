
import React from 'react';
import { PageContainer } from './PageContainer';

export const SectionWrapper: React.FC<{ children: React.ReactNode; id?: string; className?: string; noPadding?: boolean }> = ({ children, id, className = "", noPadding = false }) => (
  <section id={id} className={`relative w-full overflow-hidden ${noPadding ? '' : 'lamie-section-space'} ${className}`}>
    <PageContainer className="relative z-10">
      {children}
    </PageContainer>
  </section>
);
