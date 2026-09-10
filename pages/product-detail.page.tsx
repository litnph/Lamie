import React, { useEffect, useMemo, useState } from 'react';
import type { CatalogState, FlowerProduct } from '../features/product/product.type';
import { SectionWrapper } from '../components/ui/SectionWrapper';
import { Button } from '../components/common/Button';
import { LeafIcon } from '../components/common/Icons';
import { CatalogStatePanel, ProductDetailSkeleton } from '../features/product/components/CatalogStates';
import { ProductCard } from '../features/product/components/ProductCard';
import { ProductGallery } from '../features/product/components/ProductGallery';
import { getConfiguredSimilarProducts, getSamePriceRangeProducts } from '../features/product/catalog.related';
import { formatVndCurrency } from '../utils/displayFormatters';

interface ProductDetailProps {
  catalog: CatalogState;
  productId: string | null;
  onBack: () => void;
  onRetry: () => void;
  onProductClick: (product: FlowerProduct) => void;
}

interface ProductRailProps {
  id: string;
  title: string;
  description: string;
  products: FlowerProduct[];
  onProductClick: (product: FlowerProduct) => void;
}

const ProductRail: React.FC<ProductRailProps> = ({ id, title, description, products, onProductClick }) => {
  if (!products.length) return null;
  return (
    <section className="border-t border-[var(--color-border-subtle)] py-16 sm:py-20" aria-labelledby={id}>
      <div className="mb-9 max-w-2xl">
        <h2 id={id} className="font-serif text-3xl leading-[var(--leading-heading)] text-[var(--color-text-primary)] sm:text-4xl">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">{description}</p>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-12 min-[400px]:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
        {products.map((item) => <ProductCard key={item.id} product={item} onClick={onProductClick} />)}
      </div>
    </section>
  );
};

export const ProductDetail: React.FC<ProductDetailProps> = ({
  catalog,
  productId,
  onBack,
  onRetry,
  onProductClick,
}) => {
  const [quantity, setQuantity] = useState(1);
  const product = catalog.products.find((item) => item.id === productId);

  useEffect(() => setQuantity(1), [productId]);

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return getConfiguredSimilarProducts(catalog.products, product);
  }, [catalog.products, product]);

  const samePriceProducts = useMemo(() => {
    if (!product || !catalog.metadata) return [];
    return getSamePriceRangeProducts(
      catalog.products,
      product,
      catalog.metadata.priceDeviationPercent,
    );
  }, [catalog.metadata, catalog.products, product]);

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] pb-20 pt-32">
      <SectionWrapper>
        <button type="button" onClick={onBack} className="mb-10 flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)] sm:mb-12">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12L12 19M5 12L12 5" /></svg>
          Back to shop
        </button>

        {catalog.status === 'loading' ? <ProductDetailSkeleton /> : null}
        {catalog.status === 'error' ? <CatalogStatePanel title={catalog.error.title} message={catalog.error.message} role="alert" onAction={onRetry} actionLabel="Try again" /> : null}
        {catalog.status === 'empty' || (catalog.status === 'ready' && !product) ? <CatalogStatePanel title="This arrangement is no longer available" message="It may have left the current collection. Return to the shop to choose another flower." onAction={onBack} actionLabel="Browse the shop" /> : null}

        {catalog.status === 'ready' && product ? (
          <>
            <div className="grid grid-cols-1 items-center gap-12 pb-20 lg:grid-cols-12 lg:gap-[var(--space-grid)]">
              <div className="lg:col-span-7"><ProductGallery images={product.images} productName={product.name} /></div>
              <div className="flex flex-col justify-center space-y-7 lg:col-span-5">
                <span className="text-xs font-semibold tracking-[var(--tracking-label)] text-[var(--color-text-muted)]">{product.category.name}{product.productLine ? ` · ${product.productLine.name}` : ''}</span>
                <h1 className="font-serif text-5xl leading-[var(--leading-heading)] text-[var(--color-text-primary)] sm:text-6xl">{product.name}</h1>
                <div className="lamie-tabular flex flex-wrap items-baseline gap-3">
                  <p className="font-serif text-3xl text-[var(--color-text-secondary)]">{formatVndCurrency(product.salePrice ?? product.price)}</p>
                  {product.salePrice !== null ? <p className="text-sm text-[var(--color-text-muted)] line-through">{formatVndCurrency(product.price)}</p> : null}
                </div>
                <div className="h-px w-full bg-[var(--color-border-subtle)]" />
                <p className="max-w-[65ch] text-lg leading-relaxed text-[var(--color-text-secondary)]">{product.description.trim() || 'Product details are being prepared. Contact Lamie if you would like help choosing this arrangement.'}</p>
                <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center">
                  <div className="grid min-h-12 grid-cols-[2.75rem_3rem_2.75rem] items-center self-start rounded-[var(--radius-sm)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)]" role="group" aria-label="Quantity">
                    <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} disabled={quantity === 1} aria-label="Decrease quantity" className="flex h-11 items-center justify-center text-xl text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-35">−</button>
                    <output className="lamie-tabular text-center font-serif text-xl" aria-live="polite" aria-label={`Quantity ${quantity}`}>{quantity}</output>
                    <button type="button" onClick={() => setQuantity((current) => current + 1)} aria-label="Increase quantity" className="flex h-11 items-center justify-center text-xl text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]">+</button>
                  </div>
                  <Button type="button" className="w-full flex-grow sm:w-auto">Add to cart</Button>
                </div>
                <div className="flex items-start gap-3 pt-5 text-xs font-medium tracking-[var(--tracking-label)] text-[var(--color-text-muted)]"><LeafIcon className="mt-0.5 h-4 w-4 shrink-0" /><span>Fresh flowers prepared by Lamie · Same-day delivery subject to confirmation</span></div>
              </div>
            </div>

            <ProductRail id="similar-products" title="Chosen to echo this design" description="These arrangements are selected by Lamie's catalog team for a related visual mood or floral composition." products={similarProducts} onProductClick={onProductClick} />
            <ProductRail id="same-price-products" title="More within this budget" description={`Arrangements priced within ${catalog.metadata.priceDeviationPercent}% of this product's current price.`} products={samePriceProducts} onProductClick={onProductClick} />
          </>
        ) : null}
      </SectionWrapper>
    </div>
  );
};
