import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  surface?: 'outlined' | 'raised' | 'subtle';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const surfaces: Record<NonNullable<CardProps['surface']>, string> = {
  outlined: 'lamie-card',
  raised: 'lamie-card lamie-card--raised',
  subtle: 'lamie-card lamie-card--subtle',
};

const paddings: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8 md:p-10',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ surface = 'outlined', padding = 'md', className = '', ...props }, ref) => (
    <div ref={ref} className={`${surfaces[surface]} ${paddings[padding]} ${className}`} {...props} />
  ),
);

Card.displayName = 'Card';
