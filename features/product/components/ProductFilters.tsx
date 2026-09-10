import React, { useEffect, useRef } from 'react';
import type { CatalogFilterOptions, CatalogFilters } from '../catalog.filters';
import { formatVndCurrency } from '@/utils/displayFormatters';

interface ProductFiltersProps {
  filters: CatalogFilters;
  options: CatalogFilterOptions;
  onChange: (filters: CatalogFilters) => void;
  onReset: () => void;
}

interface MultiFilterSectionProps {
  legend: string;
  values: Array<{ value: string; label: string }>;
  selected: string[];
  onToggle: (value: string) => void;
  initiallyOpen?: boolean;
}

const MultiFilterSection: React.FC<MultiFilterSectionProps> = ({
  legend,
  values,
  selected,
  onToggle,
  initiallyOpen = false,
}) => values.length ? (
  <details open={initiallyOpen || selected.length > 0} className="group border-t border-[var(--color-border-subtle)] pt-4">
    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-xs font-semibold tracking-[var(--tracking-label)] text-[var(--color-text-muted)] [&::-webkit-details-marker]:hidden">
      <span>{legend}</span>
      <span className="flex items-center gap-2">
        {selected.length ? <span className="lamie-tabular rounded-[var(--radius-pill)] bg-[var(--color-surface-subtle)] px-2 py-0.5 text-[10px] text-[var(--color-text-secondary)]">{selected.length}</span> : null}
        <span aria-hidden="true" className="text-base transition-transform duration-[var(--duration-fast)] group-open:rotate-45">+</span>
      </span>
    </summary>
    <div className="space-y-1 pb-2 pt-2">
      {values.map((item) => (
        <label key={item.value} className="flex min-h-10 cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] px-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]">
          <input
            type="checkbox"
            checked={selected.includes(item.value)}
            onChange={() => onToggle(item.value)}
            className="h-4 w-4 rounded-[var(--radius-xs)] accent-[var(--color-action-primary)]"
          />
          <span className="min-w-0 break-words">{item.label}</span>
        </label>
      ))}
    </div>
  </details>
) : null;

const toggleValue = (values: string[], value: string): string[] =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

const priceValue = (value: string): number | null => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

const FilterFields: React.FC<ProductFiltersProps & { idPrefix: string }> = ({
  filters,
  options,
  onChange,
  onReset,
  idPrefix,
}) => {
  const hasFilters = filters.query.trim().length > 0
    || filters.flowerTypeIds.length > 0
    || filters.occasionNames.length > 0
    || filters.productLineIds.length > 0
    || filters.colorNames.length > 0
    || filters.collectionNames.length > 0
    || filters.tagNames.length > 0
    || filters.minPrice !== null
    || filters.maxPrice !== null;

  return (
    <div className="space-y-4">
      <div className="pb-2">
        <label htmlFor={`${idPrefix}-shop-product-search`} className="mb-2 block text-xs font-semibold tracking-[var(--tracking-label)] text-[var(--color-text-muted)]">Search</label>
        <div className="relative">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
          <input id={`${idPrefix}-shop-product-search`} type="search" autoComplete="off" value={filters.query} onChange={(event) => onChange({ ...filters, query: event.target.value })} className="lamie-control pl-10" placeholder="Name, collection, occasion" />
        </div>
      </div>

      <MultiFilterSection legend="FLOWER TYPE" values={options.flowerTypes.map((item) => ({ value: item.id, label: item.name }))} selected={filters.flowerTypeIds} onToggle={(value) => onChange({ ...filters, flowerTypeIds: toggleValue(filters.flowerTypeIds, value) })} initiallyOpen />
      <MultiFilterSection legend="OCCASION" values={options.occasions.map((value) => ({ value, label: value }))} selected={filters.occasionNames} onToggle={(value) => onChange({ ...filters, occasionNames: toggleValue(filters.occasionNames, value) })} initiallyOpen />
      <MultiFilterSection legend="PRODUCT LINE" values={options.productLines.map((item) => ({ value: item.id, label: item.name }))} selected={filters.productLineIds} onToggle={(value) => onChange({ ...filters, productLineIds: toggleValue(filters.productLineIds, value) })} />
      <MultiFilterSection legend="COLOUR" values={options.colors.map((value) => ({ value, label: value }))} selected={filters.colorNames} onToggle={(value) => onChange({ ...filters, colorNames: toggleValue(filters.colorNames, value) })} />
      <MultiFilterSection legend="COLLECTION" values={options.collections.map((value) => ({ value, label: value }))} selected={filters.collectionNames} onToggle={(value) => onChange({ ...filters, collectionNames: toggleValue(filters.collectionNames, value) })} />
      <MultiFilterSection legend="TAG" values={options.tags.map((value) => ({ value, label: value }))} selected={filters.tagNames} onToggle={(value) => onChange({ ...filters, tagNames: toggleValue(filters.tagNames, value) })} />

      <fieldset className="border-t border-[var(--color-border-subtle)] pt-5">
        <legend className="text-xs font-semibold tracking-[var(--tracking-label)] text-[var(--color-text-muted)]">PRICE RANGE</legend>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <label className="min-w-0">
            <span className="mb-1.5 block text-[11px] text-[var(--color-text-muted)]">From</span>
            <input type="number" min={0} step={50000} inputMode="numeric" value={filters.minPrice ?? ''} onChange={(event) => onChange({ ...filters, minPrice: priceValue(event.target.value) })} className="lamie-control lamie-tabular px-2 text-sm" placeholder={options.priceExtent ? String(options.priceExtent.min) : '0'} />
          </label>
          <label className="min-w-0">
            <span className="mb-1.5 block text-[11px] text-[var(--color-text-muted)]">To</span>
            <input type="number" min={0} step={50000} inputMode="numeric" value={filters.maxPrice ?? ''} onChange={(event) => onChange({ ...filters, maxPrice: priceValue(event.target.value) })} className="lamie-control lamie-tabular px-2 text-sm" placeholder={options.priceExtent ? String(options.priceExtent.max) : '0'} />
          </label>
        </div>
        {options.priceExtent ? <p className="mt-2 text-[11px] leading-5 text-[var(--color-text-muted)]">Catalog: {formatVndCurrency(options.priceExtent.min)} to {formatVndCurrency(options.priceExtent.max)}</p> : null}
      </fieldset>

      <button type="button" onClick={onReset} disabled={!hasFilters} className="min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] px-4 text-sm font-medium text-[var(--color-text-primary)] transition-[color,background-color,opacity] duration-[var(--duration-fast)] hover:bg-[var(--color-action-primary)] hover:text-[var(--color-text-on-strong)] disabled:cursor-not-allowed disabled:opacity-40">Clear all filters</button>
    </div>
  );
};

export const DesktopProductFilters: React.FC<ProductFiltersProps> = (props) => (
  <aside aria-label="Product filters" className="hidden lg:block">
    <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto border-t border-[var(--color-border-subtle)] pr-2 pt-6 [scrollbar-width:thin]">
      <h2 className="mb-6 font-serif text-2xl text-[var(--color-text-primary)]">Filter flowers</h2>
      <FilterFields {...props} idPrefix="desktop" />
    </div>
  </aside>
);

interface MobileProductFiltersProps extends ProductFiltersProps {
  open: boolean;
  onClose: () => void;
}

export const MobileProductFilters: React.FC<MobileProductFiltersProps> = ({ open, onClose, ...props }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), summary, [tabindex]:not([tabindex="-1"])')) as HTMLElement[];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose, open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <button type="button" tabIndex={-1} aria-label="Close product filters" onClick={onClose} className="absolute inset-0 bg-[var(--color-overlay)]" />
      <aside ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="mobile-filter-title" className="absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-[var(--radius-xl)] border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-5 pb-8 pt-5 shadow-[var(--shadow-lg)]">
        <div className="sticky top-0 z-10 mb-4 flex items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)] pb-4">
          <h2 id="mobile-filter-title" className="font-serif text-2xl text-[var(--color-text-primary)]">Filter flowers</h2>
          <button ref={closeButtonRef} type="button" onClick={onClose} className="relative h-11 w-11 rounded-[var(--radius-sm)] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-subtle)]" aria-label="Close product filters"><span aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" /><span aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" /></button>
        </div>
        <FilterFields {...props} idPrefix="mobile" />
        <button type="button" onClick={onClose} className="mt-3 min-h-12 w-full rounded-[var(--radius-sm)] bg-[var(--color-action-primary)] px-4 text-sm font-medium text-[var(--color-text-on-strong)]">View results</button>
      </aside>
    </div>
  );
};
