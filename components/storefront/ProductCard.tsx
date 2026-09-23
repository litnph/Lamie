import type { CatalogProduct } from '../../features/catalog/catalog.types';
import { formatProductPrice, statusLabel } from '../../utils/storefront-formatters';
import { AppLink } from './AppLink';
import { ArrowIcon } from './Icons';
import { ProductVisual } from './ProductVisual';

interface ProductCardProps {
  product: CatalogProduct;
  navigate: (to: string) => void;
  onQuickView?: (product: CatalogProduct) => void;
  priority?: boolean;
}

export const ProductCard = ({ product, navigate, onQuickView, priority = false }: ProductCardProps) => (
  <article className="product-card">
    <AppLink href={`/mau-hoa/${product.slug}`} navigate={navigate} className="product-card__image-link" aria-label={`Xem chi tiết ${product.name}`}>
      <ProductVisual image={product.images[0]} name={product.name} eager={priority} />
      {product.isDemo ? <span className="demo-flag">Dữ liệu demo</span> : null}
      <span className={`status-badge status-badge--${product.status}`}>{statusLabel(product.status)}</span>
    </AppLink>
    <div className="product-card__body">
      <div>
        <p className="product-card__code">{product.sku}</p>
        <h3><AppLink href={`/mau-hoa/${product.slug}`} navigate={navigate}>{product.name}</AppLink></h3>
      </div>
      <p className="product-card__price">{formatProductPrice(product)}</p>
      <p className="product-card__meta">{product.occasions.slice(0, 2).join(' · ')}</p>
      <div className="product-card__actions">
        <AppLink href={`/mau-hoa/${product.slug}`} navigate={navigate} className="text-link">Xem mẫu <ArrowIcon /></AppLink>
        {onQuickView ? <button type="button" className="quick-view-button" onClick={() => onQuickView(product)}>Xem nhanh</button> : null}
      </div>
    </div>
  </article>
);
