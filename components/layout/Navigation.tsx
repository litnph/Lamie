import React from 'react';
import { ViewState } from '../../types/common';

interface PrimaryNavigationProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const items: ReadonlyArray<{ label: string; view: ViewState; activeViews: ViewState[] }> = [
  { label: 'Home', view: 'home', activeViews: ['home'] },
  { label: 'Shop', view: 'shop', activeViews: ['shop', 'product'] },
];

export const PrimaryNavigation: React.FC<PrimaryNavigationProps> = ({
  currentView,
  onNavigate,
  orientation = 'horizontal',
  className = '',
}) => (
  <nav aria-label="Primary navigation" className={`${orientation === 'horizontal' ? 'items-center gap-8' : 'flex-col gap-1'} ${className}`}>
    {items.map((item) => {
      const isActive = item.activeViews.includes(currentView);
      return (
        <button
          key={item.view}
          type="button"
          onClick={() => onNavigate(item.view)}
          aria-current={isActive ? 'page' : undefined}
          className={orientation === 'horizontal'
            ? `relative min-h-11 px-1 text-sm font-medium transition-colors duration-[var(--duration-fast)] after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:bg-[var(--color-action-accent)] after:transition-transform after:duration-[var(--duration-base)] ${isActive ? 'text-[var(--color-text-primary)] after:scale-x-100' : 'text-[var(--color-text-muted)] after:scale-x-0 hover:text-[var(--color-text-primary)] hover:after:scale-x-100'}`
            : `flex min-h-14 w-full items-center justify-between rounded-[var(--radius-sm)] px-4 text-left font-serif text-2xl transition-colors duration-[var(--duration-fast)] ${isActive ? 'bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]'}`
          }
        >
          <span>{item.label}</span>
          {orientation === 'vertical' ? <span aria-hidden="true" className="font-body text-sm text-[var(--color-text-muted)]">{isActive ? 'Current' : 'View'}</span> : null}
        </button>
      );
    })}
  </nav>
);
