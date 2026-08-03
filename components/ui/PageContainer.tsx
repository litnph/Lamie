import React from 'react';

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'reading' | 'form' | 'content' | 'wide';
  as?: 'div' | 'section' | 'article';
}

const sizes: Record<NonNullable<PageContainerProps['size']>, string> = {
  reading: 'lamie-page-container lamie-page-container--reading',
  form: 'lamie-page-container lamie-page-container--form',
  content: 'lamie-page-container',
  wide: 'lamie-page-container lamie-page-container--wide',
};

export const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ size = 'content', as: Element = 'div', className = '', ...props }, ref) => (
    <Element ref={ref} className={`${sizes[size]} ${className}`} {...props} />
  ),
);

PageContainer.displayName = 'PageContainer';
