import { useState } from 'react';
import type { ProductImage } from '../../features/catalog/catalog.types';

interface ProductVisualProps {
  image?: ProductImage;
  name: string;
  eager?: boolean;
  className?: string;
}

export const ProductVisual = ({ image, name, eager = false, className = '' }: ProductVisualProps) => {
  const [failed, setFailed] = useState(false);
  const src = !failed && image?.src ? image.src : '/images/editorial/product-placeholder.webp';
  return (
    <div className={`product-visual ${className}`}>
      <img
        src={src}
        alt={failed || !image ? `Ảnh ${name} đang cập nhật` : image.alt}
        width="900"
        height="1125"
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        onError={() => setFailed(true)}
      />
      {failed || !image ? <span>Ảnh đang cập nhật</span> : null}
    </div>
  );
};
