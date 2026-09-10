import React from 'react';
import { FlowerProduct } from '../product.type';
import { formatVndCurrency } from '@/utils/displayFormatters';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: FlowerProduct;
  onClick: (product: FlowerProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const displayPrice = product.salePrice ?? product.price;

  return (
    <article className="group min-w-0">
      <button
        type="button"
        onClick={() => onClick(product)}
        aria-label={`View ${product.name}`}
        className="block w-full rounded-[var(--radius-md)] text-center transition-colors duration-[var(--duration-fast)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
      >
        <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface)]">
          <ProductImage
            image={product.images[0]}
            alt={product.images[0]?.alt || product.name}
            className="h-full w-full object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-enter)] group-hover:scale-[1.035]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[var(--color-overlay)] opacity-0 transition-opacity duration-[var(--duration-base)] group-hover:opacity-10" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-4 hidden translate-y-3 text-center opacity-0 transition-[transform,opacity] duration-[var(--duration-base)] group-hover:translate-y-0 group-hover:opacity-100 md:block">
            <span className="inline-block rounded-[var(--radius-sm)] bg-[color:rgb(255_254_250/0.94)] px-4 py-2 text-xs font-medium tracking-[var(--tracking-label)] text-[var(--color-text-primary)] shadow-[var(--shadow-xs)]">View details</span>
          </div>
        </div>
        <div>
          <h3 className="line-clamp-2 min-h-[3.25rem] break-words font-serif text-lg leading-snug text-[var(--color-text-primary)] transition-colors duration-[var(--duration-fast)] group-hover:text-[var(--color-text-accent)]">{product.name}</h3>
          <div className="lamie-tabular mt-1 flex flex-wrap items-baseline justify-center gap-2 text-sm">
            <span className="text-[var(--color-text-secondary)]">{formatVndCurrency(displayPrice)}</span>
            {product.salePrice !== null ? <span className="text-xs text-[var(--color-text-muted)] line-through">{formatVndCurrency(product.price)}</span> : null}
          </div>
        </div>
      </button>
    </article>
  );
};
