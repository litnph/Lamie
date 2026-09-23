import { useEffect, useState } from 'react';
import { trackEvent } from '../../app/analytics';
import type { CatalogProduct } from '../../features/catalog/catalog.types';
import { labelFor } from '../../features/catalog/catalog.taxonomy';
import { relatedProducts } from '../../features/catalog/catalog.logic';
import { formatProductPrice, statusLabel } from '../../utils/storefront-formatters';
import { AppLink } from '../../components/storefront/AppLink';
import { Dialog } from '../../components/storefront/Dialog';
import { ArrowIcon, CheckIcon, ShareIcon } from '../../components/storefront/Icons';
import { ProductCard } from '../../components/storefront/ProductCard';
import { ProductVisual } from '../../components/storefront/ProductVisual';

interface ProductDetailPageProps {
  product?: CatalogProduct;
  products: CatalogProduct[];
  navigate: (to: string) => void;
  onContact: (context?: { intent?: string; productName?: string; sku?: string; productUrl?: string }) => void;
}

export default function ProductDetailPage({ product, products, navigate, onContact }: ProductDetailPageProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [shareState, setShareState] = useState('Chia sẻ mẫu');
  const [mobileCtaVisible, setMobileCtaVisible] = useState(false);

  useEffect(() => {
    setActiveImage(0);
    if (product) trackEvent({ event: 'view_detail', label: product.slug });
  }, [product]);

  useEffect(() => {
    if (!product) {
      setMobileCtaVisible(false);
      return;
    }

    const media = window.matchMedia('(max-width: 767px)');
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const heading = document.getElementById('product-title');
        setMobileCtaVisible(Boolean(media.matches && heading && heading.getBoundingClientRect().bottom <= window.innerHeight - 96));
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    media.addEventListener('change', update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      media.removeEventListener('change', update);
    };
  }, [product]);

  if (!product) {
    return (
      <main id="main-content" className="not-found-page container-wide">
        <div>
          <p>Đường dẫn mẫu hoa không còn khả dụng</p>
          <h1>Mẫu này chưa có trong catalog được công bố.</h1>
          <p>Có thể dữ liệu đang được Lamie cập nhật. Bạn có thể quay lại danh sách hoặc nhờ tư vấn một mẫu tương tự.</p>
          <div className="not-found-actions">
            <AppLink href="/mau-hoa" navigate={navigate} className="button button--ink">Về Mẫu hoa Lamie <ArrowIcon /></AppLink>
            <button type="button" className="button button--outline" onClick={() => onContact({ intent: 'Mình cần tìm mẫu tương tự một link không còn khả dụng' })}>Nhờ tư vấn mẫu tương tự</button>
          </div>
        </div>
      </main>
    );
  }

  const suggestions = relatedProducts(products, product);
  const paused = product.status === 'tam-ngung';
  const contactContext = {
    intent: paused ? 'Mình muốn được tư vấn một mẫu tương tự' : 'Mình muốn hỏi về mẫu hoa này',
    productName: product.name,
    sku: product.sku,
    productUrl: window.location.href,
  };

  const share = async () => {
    const data = { title: `${product.name} · Lamie`, text: `Mẫu ${product.name} (${product.sku})`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(window.location.href);
      setShareState(navigator.share ? 'Đã mở chia sẻ' : 'Đã sao chép link');
    } catch {
      setShareState('Không thể chia sẻ — hãy sao chép URL');
    }
  };

  return (
    <main id="main-content" className="detail-page">
      {product.isDemo ? <div className="preview-notice" role="status"><span>Dữ liệu demo</span><p>Mẫu, tên và giá chỉ dùng để kiểm thử giao diện; không phải sản phẩm đang bán.</p></div> : null}
      <div className="detail-breadcrumb container-wide">
        <AppLink href="/mau-hoa" navigate={navigate}>Mẫu hoa</AppLink><span aria-hidden="true">/</span><span>{product.name}</span>
      </div>

      <section className="detail-layout container-wide" aria-labelledby="product-title">
        <div className="detail-gallery">
          <button type="button" className="detail-gallery__main" onClick={() => setLightboxOpen(true)} aria-label={`Mở ảnh lớn của ${product.name}`}>
            <ProductVisual image={product.images[activeImage]} name={product.name} eager />
            <span>Xem ảnh lớn</span>
          </button>
          {product.images.length > 1 ? (
            <div className="detail-thumbnails" aria-label="Chọn ảnh sản phẩm">
              {product.images.map((image, index) => (
                <button type="button" key={image.src} aria-label={`Xem ảnh ${index + 1}`} aria-current={activeImage === index ? 'true' : undefined} onClick={() => setActiveImage(index)}>
                  <img src={image.src} alt="" width="120" height="150" loading="lazy" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="detail-info">
          <p className="detail-taxonomy">{labelFor('lines', product.line)} · {labelFor('forms', product.form)}</p>
          <h1 id="product-title">{product.name}</h1>
          <div className="detail-code-row">
            <span>{product.sku}</span>
            <button type="button" onClick={() => void share()}><ShareIcon /> {shareState}</button>
          </div>
          <p className="detail-price">{formatProductPrice(product)}</p>
          {product.price.mode === 'fixed' && product.price.isTest ? <p className="test-price-note">Giá kiểm thử — bị loại khỏi production</p> : null}
          <span className={`status-badge status-badge--${product.status}`}>{statusLabel(product.status)}</span>

          {product.description ? <p className="detail-description">{product.description}</p> : null}

          <dl className="detail-attributes">
            <div><dt>Dịp</dt><dd>{product.occasions.join(', ')}</dd></div>
            <div><dt>Hoa chủ đạo</dt><dd>{product.flowers.join(', ')}</dd></div>
            <div><dt>Màu sắc</dt><dd>{[...product.colors, ...product.palettes].join(', ')}</dd></div>
            <div><dt>Phong cách</dt><dd>{product.styles.join(', ')}</dd></div>
            {product.sizeLabel ? <div><dt>Kích thước</dt><dd>{product.sizeLabel}{product.dimensions ? ` · ${product.dimensions}` : ''}</dd></div> : null}
          </dl>

          <div className="delivery-note">
            <CheckIcon />
            <div>
              <strong>{product.line === 'hoa-tuoi' ? 'Giao hoa tươi' : 'Giao hoa sáp & lụa'}</strong>
              <p>{product.line === 'hoa-tuoi' ? 'Liên hệ Lamie để kiểm tra khu vực và phí giao.' : 'Giao toàn quốc. Phí và thời gian được Lamie xác nhận khi tư vấn.'}</p>
            </div>
          </div>

          <p className="confirmation-note">Mọi đơn cần Lamie xác nhận. Thời gian chuẩn bị, phí giao và các chi tiết thanh toán không được website tự cam kết.</p>
          <button type="button" className="button button--ink detail-contact-button" onClick={() => onContact(contactContext)}>
            {paused ? 'Nhờ tư vấn mẫu tương tự' : 'Liên hệ đặt mẫu này'} <ArrowIcon />
          </button>
        </div>
      </section>

      {suggestions.length ? (
        <section className="section related-section container-wide" aria-labelledby="related-title">
          <div className="section-heading section-heading--split"><div><h2 id="related-title">Mẫu tương tự</h2><p>Gợi ý dựa trên dòng, kiểu dáng, dịp và phong cách — không dựa trên “giá gần” khi dữ liệu chưa đủ.</p></div></div>
          <div className="product-grid product-grid--preview">
            {suggestions.map((item) => <ProductCard key={item.id} product={item} navigate={navigate} />)}
          </div>
        </section>
      ) : null}

      <div className={`mobile-sticky-cta${mobileCtaVisible ? ' mobile-sticky-cta--visible' : ''}`} aria-hidden={!mobileCtaVisible}>
        <button type="button" className="button button--ink" tabIndex={mobileCtaVisible ? undefined : -1} onClick={() => onContact(contactContext)}>{paused ? 'Tư vấn mẫu tương tự' : 'Liên hệ mẫu này'}</button>
      </div>

      <Dialog open={lightboxOpen} title={`Ảnh ${product.name}`} onClose={() => setLightboxOpen(false)} className="lightbox-dialog">
        <div className="lightbox-image"><img src={product.images[activeImage]?.src ?? '/images/editorial/product-placeholder.webp'} alt={product.images[activeImage]?.alt ?? `Ảnh ${product.name} đang cập nhật`} /></div>
        {product.images.length > 1 ? (
          <div className="lightbox-controls">
            <button type="button" className="button button--outline" onClick={() => setActiveImage((index) => (index - 1 + product.images.length) % product.images.length)}>Ảnh trước</button>
            <span aria-live="polite">{activeImage + 1} / {product.images.length}</span>
            <button type="button" className="button button--outline" onClick={() => setActiveImage((index) => (index + 1) % product.images.length)}>Ảnh sau</button>
          </div>
        ) : null}
      </Dialog>
    </main>
  );
}
