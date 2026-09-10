import React from 'react';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { FadeIn } from '../../components/ui/FadeIn';
import { CatalogStatePanel, ProductGridSkeleton } from '../../features/product/components/CatalogStates';
import { ProductCard } from '../../features/product/components/ProductCard';
import { CatalogState, FlowerProduct } from '../../features/product/product.type';

type Lang = 'vi' | 'en';

interface CollectionsProps {
  lang: Lang;
  catalog: CatalogState;
  onRetry: () => void;
  onViewAll: () => void;
  onProductClick: (product: FlowerProduct) => void;
}

export const Collections: React.FC<CollectionsProps> = ({
  lang,
  catalog,
  onRetry,
  onViewAll,
  onProductClick,
}) => (
  <SectionWrapper id="collections">
    <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:mb-16 sm:flex-row sm:items-end">
      <div>
        <span className="mb-2 block text-xs font-semibold tracking-[var(--tracking-label)] text-[var(--color-text-muted)]">{lang === 'vi' ? 'Tuyen chon' : 'Selected'}</span>
        <h2 className="font-serif text-4xl text-[var(--color-text-primary)] sm:text-5xl">{lang === 'vi' ? 'Bo suu tap Lamie' : 'Lamie collections'}</h2>
      </div>
      <button type="button" onClick={onViewAll} className="min-h-11 rounded-[var(--radius-sm)] text-sm font-medium text-[var(--color-text-primary)] underline decoration-1 underline-offset-4 transition-colors hover:text-[var(--color-text-accent)]">
        {lang === 'vi' ? 'Xem tat ca' : 'View all'}
      </button>
    </div>

    {catalog.status === 'loading' ? (
      <ProductGridSkeleton count={4} className="grid grid-cols-1 gap-8 min-[400px]:grid-cols-2 lg:grid-cols-4 lg:gap-10" />
    ) : null}
    {catalog.status === 'error' ? (
      <CatalogStatePanel title={catalog.error.title} message={catalog.error.message} role="alert" compact onAction={onRetry} actionLabel="Try again" />
    ) : null}
    {catalog.status === 'empty' ? (
      <CatalogStatePanel title="Fresh arrangements are on their way" message="Lamie has not published any flowers to the storefront yet." compact />
    ) : null}
    {catalog.status === 'ready' ? (
      <div className="grid grid-cols-1 gap-8 min-[400px]:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        {catalog.products.slice(0, 4).map((product, index) => (
          <FadeIn key={product.id} delay={index * 70}>
            <ProductCard product={product} onClick={onProductClick} />
          </FadeIn>
        ))}
      </div>
    ) : null}
  </SectionWrapper>
);
