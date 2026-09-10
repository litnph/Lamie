import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SectionWrapper } from '../components/ui/SectionWrapper';
import {
  catalogActiveFilterCount,
  type CatalogFilters,
  EMPTY_CATALOG_FILTERS,
  filterCatalogProducts,
  getCatalogFilterOptions,
  sanitizeCatalogFilters,
} from '../features/product/catalog.filters';
import { CatalogStatePanel, ProductGridSkeleton } from '../features/product/components/CatalogStates';
import { ProductCard } from '../features/product/components/ProductCard';
import { DesktopProductFilters, MobileProductFilters } from '../features/product/components/ProductFilters';
import type { CatalogState, FlowerProduct } from '../features/product/product.type';

interface ShopPageProps {
  catalog: CatalogState;
  onRetry: () => void;
  onProductClick: (product: FlowerProduct) => void;
}

const freshFilters = (): CatalogFilters => ({
  ...EMPTY_CATALOG_FILTERS,
  flowerTypeIds: [],
  occasionNames: [],
  productLineIds: [],
  colorNames: [],
  collectionNames: [],
  tagNames: [],
});

const ShopPage: React.FC<ShopPageProps> = ({ catalog, onRetry, onProductClick }) => {
  const [filters, setFilters] = useState<CatalogFilters>(freshFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const options = useMemo(() => getCatalogFilterOptions(catalog.products), [catalog.products]);

  useEffect(() => {
    setFilters((current) => {
      const next = sanitizeCatalogFilters(current, options);
      return JSON.stringify(next) === JSON.stringify(current) ? current : next;
    });
  }, [options]);

  const filteredProducts = useMemo(
    () => filterCatalogProducts(catalog.products, filters),
    [catalog.products, filters],
  );
  const activeFilterCount = catalogActiveFilterCount(filters);
  const resetFilters = useCallback(() => setFilters(freshFilters()), []);
  const closeMobileFilters = useCallback(() => setMobileFiltersOpen(false), []);

  const activeChips = useMemo(() => {
    const chips: Array<{ key: string; label: string; clear: () => void }> = [];
    if (filters.query.trim()) chips.push({ key: 'query', label: `Search: ${filters.query.trim()}`, clear: () => setFilters((current) => ({ ...current, query: '' })) });
    const addIds = (prefix: string, selected: string[], available: Array<{ id: string; name: string }>, field: 'flowerTypeIds' | 'productLineIds') => selected.forEach((id) => {
      const label = available.find((item) => item.id === id)?.name;
      if (label) chips.push({ key: `${prefix}-${id}`, label, clear: () => setFilters((current) => ({ ...current, [field]: current[field].filter((item) => item !== id) })) });
    });
    const addLabels = (prefix: string, selected: string[], field: 'occasionNames' | 'colorNames' | 'collectionNames' | 'tagNames') => selected.forEach((label) => chips.push({ key: `${prefix}-${label}`, label, clear: () => setFilters((current) => ({ ...current, [field]: current[field].filter((item) => item !== label) })) }));
    addIds('flower', filters.flowerTypeIds, options.flowerTypes, 'flowerTypeIds');
    addLabels('occasion', filters.occasionNames, 'occasionNames');
    addIds('line', filters.productLineIds, options.productLines, 'productLineIds');
    addLabels('colour', filters.colorNames, 'colorNames');
    addLabels('collection', filters.collectionNames, 'collectionNames');
    addLabels('tag', filters.tagNames, 'tagNames');
    if (filters.minPrice !== null || filters.maxPrice !== null) chips.push({
      key: 'price',
      label: `Price: ${filters.minPrice === null ? 'any' : filters.minPrice.toLocaleString('vi-VN')} to ${filters.maxPrice === null ? 'any' : filters.maxPrice.toLocaleString('vi-VN')}`,
      clear: () => setFilters((current) => ({ ...current, minPrice: null, maxPrice: null })),
    });
    return chips;
  }, [filters, options]);

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] pb-20 pt-32">
      <SectionWrapper>
        <header className="mb-10 max-w-3xl space-y-4 sm:mb-14">
          <span className="block text-xs font-semibold tracking-[var(--tracking-label)] text-[var(--color-text-muted)]">LAMIE CATALOGUE</span>
          <h1 className="font-serif text-5xl leading-[var(--leading-heading)] text-[var(--color-text-primary)] sm:text-6xl">Flowers for thoughtful moments</h1>
          <p className="max-w-xl text-[var(--color-text-secondary)]">Browse Lamie's current arrangements, then refine your selection by flower, occasion, colour, collection or price.</p>
        </header>

        {catalog.status === 'loading' ? <ProductGridSkeleton count={8} className="grid grid-cols-1 gap-x-6 gap-y-12 min-[400px]:grid-cols-2 lg:grid-cols-4 lg:gap-x-8" /> : null}
        {catalog.status === 'error' ? <CatalogStatePanel title={catalog.error.title} message={catalog.error.message} role="alert" onAction={onRetry} actionLabel="Try again" /> : null}
        {catalog.status === 'empty' ? <CatalogStatePanel title="No arrangements are published" message="Lamie is preparing the next storefront collection. Please check back soon." /> : null}
        {catalog.status === 'ready' ? (
          <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-[var(--space-grid)] xl:grid-cols-[17rem_minmax(0,1fr)]">
            <DesktopProductFilters filters={filters} options={options} onChange={setFilters} onReset={resetFilters} />
            <div className="min-w-0">
              <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border-subtle)] pb-4">
                <p className="lamie-tabular text-sm text-[var(--color-text-muted)]" aria-live="polite">{filteredProducts.length} {filteredProducts.length === 1 ? 'arrangement' : 'arrangements'}</p>
                <button type="button" onClick={() => setMobileFiltersOpen(true)} aria-haspopup="dialog" className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] px-4 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-action-primary)] hover:text-[var(--color-text-on-strong)] lg:hidden">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4"><path d="M4 7h16M7 12h10M10 17h4" /></svg>
                  Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
                </button>
              </div>

              {activeFilterCount > 0 ? (
                <div className="mb-8 flex flex-wrap items-center gap-2" aria-label="Active product filters">
                  {activeChips.map((chip) => (
                    <button key={chip.key} type="button" onClick={chip.clear} className="inline-flex min-h-9 max-w-full items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--color-surface-subtle)] px-3 text-xs text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]" aria-label={`Clear ${chip.label}`}>
                      <span className="truncate">{chip.label}</span> <span aria-hidden="true">×</span>
                    </button>
                  ))}
                  <button type="button" onClick={resetFilters} className="min-h-9 px-2 text-xs font-medium text-[var(--color-text-primary)] underline decoration-1 underline-offset-4 hover:text-[var(--color-text-accent)]">Clear all</button>
                </div>
              ) : null}

              {filteredProducts.length === 0 ? (
                <CatalogStatePanel title="No arrangements match these filters" message="Remove one or more filters to see Lamie's current flowers." onAction={resetFilters} actionLabel="Reset filters" />
              ) : (
                <div className="grid grid-cols-1 gap-x-6 gap-y-12 min-[400px]:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
                  {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onClick={onProductClick} />)}
                </div>
              )}
            </div>

            <MobileProductFilters open={mobileFiltersOpen} onClose={closeMobileFilters} filters={filters} options={options} onChange={setFilters} onReset={resetFilters} />
          </div>
        ) : null}
      </SectionWrapper>
    </div>
  );
};

export default ShopPage;
