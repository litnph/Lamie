import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ProductImage as ProductImageModel } from '../product.type';
import { ProductImage } from './ProductImage';

interface ProductGalleryProps {
  images: ProductImageModel[];
  productName: string;
}

const fallbackImage = (productName: string): ProductImageModel => ({
  id: 'product-fallback',
  url: '',
  alt: productName,
  sortOrder: 0,
});

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const galleryImages = useMemo(
    () => images.length > 0 ? images : [fallbackImage(productName)],
    [images, productName],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, galleryImages.length - 1));
  }, [galleryImages.length]);

  const nextImage = useCallback(() => {
    setActiveIndex((previous) => (previous + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const previousImage = useCallback(() => {
    setActiveIndex((previous) => (previous - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsLightboxOpen(false);
      if (event.key === 'ArrowRight') nextImage();
      if (event.key === 'ArrowLeft') previousImage();
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled])'),
      ) as HTMLElement[];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isLightboxOpen, nextImage, previousImage]);

  const slideStyle = (index: number) => {
    const total = galleryImages.length;
    let difference = (index - activeIndex + total) % total;
    if (difference > total / 2) difference -= total;

    const baseClass = 'absolute left-1/2 top-1/2 transition-[transform,opacity,filter] duration-[var(--duration-slow)] ease-[var(--ease-enter)]';
    if (difference === 0) {
      return {
        className: `${baseClass} z-30 h-[350px] w-[min(68vw,260px)] cursor-zoom-in opacity-100 shadow-[var(--shadow-lg)] md:h-[420px] md:w-[320px]`,
        style: { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)' },
      };
    }
    if (difference === -1 || (activeIndex === 0 && index === total - 1)) {
      return {
        className: `${baseClass} z-20 h-[350px] w-[min(68vw,260px)] cursor-pointer opacity-55 hover:opacity-75 md:h-[420px] md:w-[320px]`,
        style: { transform: 'translate(-85%, -50%) scale(0.85) rotate(-6deg)', filter: 'blur(1px)' },
      };
    }
    if (difference === 1 || (activeIndex === total - 1 && index === 0)) {
      return {
        className: `${baseClass} z-20 h-[350px] w-[min(68vw,260px)] cursor-pointer opacity-55 hover:opacity-75 md:h-[420px] md:w-[320px]`,
        style: { transform: 'translate(-15%, -50%) scale(0.85) rotate(6deg)', filter: 'blur(1px)' },
      };
    }
    return {
      className: `${baseClass} pointer-events-none z-10 h-[350px] w-[min(68vw,260px)] opacity-0 md:h-[420px] md:w-[320px]`,
      style: { transform: 'translate(-50%, -50%) scale(0.5)' },
    };
  };

  return (
    <>
      <div className="relative flex h-[450px] items-center justify-center overflow-hidden md:h-[550px]">
        {galleryImages.map((image, index) => {
          const { className, style } = slideStyle(index);
          const isActive = index === activeIndex;
          return (
            <button
              type="button"
              key={image.id}
              className={`${className} rounded-[var(--radius-xl)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]`}
              style={style}
              onClick={() => isActive ? setIsLightboxOpen(true) : setActiveIndex(index)}
              aria-label={isActive ? `Open image ${index + 1} of ${productName}` : `Show image ${index + 1} of ${productName}`}
              aria-current={isActive ? 'true' : undefined}
              tabIndex={isActive || Math.abs(index - activeIndex) === 1 ? 0 : -1}
            >
              <span className="block h-full w-full overflow-hidden rounded-[var(--radius-xl)] border-4 border-[var(--color-surface)] bg-[var(--color-surface)]">
                <ProductImage image={image} alt={image.alt || `${productName}, view ${index + 1}`} className="h-full w-full object-cover" loading={index === 0 ? 'eager' : 'lazy'} />
              </span>
            </button>
          );
        })}

        {galleryImages.length > 1 ? (
          <div className="absolute bottom-4 z-40 flex gap-2" aria-label={`${productName} image selector`} role="group">
            {galleryImages.map((image, index) => (
              <button
                type="button"
                key={image.id}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show image ${index + 1}`}
                aria-pressed={index === activeIndex}
                className={`flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] transition-transform duration-[var(--duration-fast)] active:translate-y-px`}
              >
                <span aria-hidden="true" className={`block h-2 rounded-[var(--radius-pill)] transition-[width,background-color] duration-[var(--duration-base)] ${index === activeIndex ? 'w-5 bg-[var(--color-action-primary)]' : 'w-2 bg-[var(--lamie-mocha-300)]'}`} />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {isLightboxOpen ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} image viewer`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[color:rgb(52_43_39/0.94)] p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsLightboxOpen(false);
          }}
        >
          <ProductImage image={galleryImages[activeIndex]} alt={galleryImages[activeIndex].alt || productName} className="max-h-[88dvh] max-w-[90vw] rounded-[var(--radius-md)] object-contain shadow-[var(--shadow-lg)]" loading="eager" />
          <button ref={closeButtonRef} type="button" onClick={() => setIsLightboxOpen(false)} aria-label="Close image viewer" className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] bg-[color:rgb(255_254_250/0.12)] text-2xl text-white transition-colors hover:bg-[color:rgb(255_254_250/0.22)] sm:right-6 sm:top-6">×</button>
          {galleryImages.length > 1 ? (
            <>
              <button type="button" onClick={previousImage} aria-label="Previous image" className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-[var(--radius-sm)] bg-[color:rgb(255_254_250/0.12)] text-2xl text-white transition-colors hover:bg-[color:rgb(255_254_250/0.22)] sm:left-6">‹</button>
              <button type="button" onClick={nextImage} aria-label="Next image" className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-[var(--radius-sm)] bg-[color:rgb(255_254_250/0.12)] text-2xl text-white transition-colors hover:bg-[color:rgb(255_254_250/0.22)] sm:right-6">›</button>
            </>
          ) : null}
          <p className="absolute bottom-5 rounded-[var(--radius-sm)] bg-[color:rgb(52_43_39/0.7)] px-3 py-1 text-sm text-white" aria-live="polite">
            {activeIndex + 1} / {galleryImages.length}
          </p>
        </div>
      ) : null}
    </>
  );
};
