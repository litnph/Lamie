import React, { useEffect, useMemo, useState } from 'react';
import { ProductImage as ProductImageModel } from '../product.type';

interface ProductImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  image?: ProductImageModel;
  alt?: string;
  fallbackClassName?: string;
}

const fallbackAssetUrl = () => {
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  return `${base}images/product-fallback.svg`;
};

export const ProductImage: React.FC<ProductImageProps> = ({
  image,
  alt,
  className = '',
  fallbackClassName = '',
  loading = 'lazy',
  ...props
}) => {
  const fallbackUrl = useMemo(fallbackAssetUrl, []);
  const requestedUrl = image?.url || fallbackUrl;
  const accessibleAlt = alt ?? image?.alt ?? 'Lamie flower arrangement';
  const [source, setSource] = useState(requestedUrl);
  const [fallbackFailed, setFallbackFailed] = useState(false);

  useEffect(() => {
    setSource(requestedUrl);
    setFallbackFailed(false);
  }, [requestedUrl]);

  if (fallbackFailed) {
    return (
      <div
        role="img"
        aria-label={accessibleAlt}
        className={`flex h-full w-full items-center justify-center bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] ${fallbackClassName}`}
      >
        <svg aria-hidden="true" viewBox="0 0 64 64" className="h-16 w-16" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M32 54V31" />
          <path d="M31.5 31c-8-1-12-6-11-12 6-1 11 3 11 12Z" />
          <path d="M32.5 31c8-1 12-6 11-12-6-1-11 3-11 12Z" />
          <circle cx="32" cy="17" r="8" />
          <path d="M25 54h14" />
        </svg>
      </div>
    );
  }

  return (
    <img
      {...props}
      src={source}
      alt={accessibleAlt}
      loading={loading}
      decoding="async"
      width={600}
      height={800}
      className={className}
      onError={() => {
        if (source !== fallbackUrl) setSource(fallbackUrl);
        else setFallbackFailed(true);
      }}
    />
  );
};
