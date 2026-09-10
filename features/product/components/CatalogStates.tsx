import React from 'react';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/ui/Card';
import { LeafIcon } from '../../../components/common/Icons';

interface CatalogStatePanelProps {
  title: string;
  message: string;
  onAction?: () => void;
  actionLabel?: string;
  role?: 'status' | 'alert';
  compact?: boolean;
}

export const CatalogStatePanel: React.FC<CatalogStatePanelProps> = ({
  title,
  message,
  onAction,
  actionLabel,
  role = 'status',
  compact = false,
}) => (
  <Card
    surface="subtle"
    padding={compact ? 'md' : 'lg'}
    role={role}
    className="text-center"
  >
    <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface)] text-[var(--color-text-accent)]" aria-hidden="true">
      <LeafIcon className="h-6 w-6" />
    </div>
    <h2 className={`${compact ? 'text-2xl' : 'text-3xl'} font-serif text-[var(--color-text-primary)]`}>{title}</h2>
    <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-text-secondary)]">{message}</p>
    {onAction && actionLabel ? (
      <Button type="button" variant="outline" className="mt-6" onClick={onAction}>
        {actionLabel}
      </Button>
    ) : null}
  </Card>
);

export const ProductGridSkeleton: React.FC<{ count?: number; className?: string }> = ({ count = 4, className = '' }) => (
  <div role="status" aria-label="Loading flower catalog" className={className}>
    <span className="sr-only">Loading flower catalog</span>
    {Array.from({ length: count }, (_, index) => (
      <div key={index} aria-hidden="true" className="animate-pulse">
        <div className="aspect-[3/4] rounded-[var(--radius-md)] bg-[var(--color-surface-subtle)]" />
        <div className="mx-auto mt-4 h-5 w-2/3 rounded bg-[var(--color-surface-subtle)]" />
        <div className="mx-auto mt-2 h-4 w-1/3 rounded bg-[var(--color-surface-subtle)]" />
      </div>
    ))}
  </div>
);

export const ProductDetailSkeleton: React.FC = () => (
  <div role="status" aria-label="Loading flower details" className="grid animate-pulse grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-[var(--space-grid)]">
    <span className="sr-only">Loading flower details</span>
    <div aria-hidden="true" className="aspect-[4/5] rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] lg:col-span-7" />
    <div aria-hidden="true" className="space-y-6 lg:col-span-5 lg:pt-16">
      <div className="h-4 w-24 rounded bg-[var(--color-surface-subtle)]" />
      <div className="h-14 w-4/5 rounded bg-[var(--color-surface-subtle)]" />
      <div className="h-8 w-36 rounded bg-[var(--color-surface-subtle)]" />
      <div className="h-28 w-full rounded bg-[var(--color-surface-subtle)]" />
    </div>
  </div>
);
