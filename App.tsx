import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useBrowserRouter } from './app/router';
import { ContactDialog, type ContactContext } from './components/storefront/ContactDialog';
import { SiteFooter } from './components/storefront/SiteFooter';
import { SiteHeader } from './components/storefront/SiteHeader';
import { getCatalogProducts } from './features/catalog/catalog.data';

const HomePage = React.lazy(() => import('./pages/storefront/HomePage'));
const CatalogPage = React.lazy(() => import('./pages/storefront/CatalogPage'));
const ProductDetailPage = React.lazy(() => import('./pages/storefront/ProductDetailPage'));
const NotFoundPage = React.lazy(() => import('./pages/storefront/NotFoundPage'));

const PageLoader = () => (
  <main id="main-content" className="page-loader" aria-busy="true" aria-live="polite">
    <span />
    <p>Lamie đang chuẩn bị trang…</p>
  </main>
);

function App() {
  const { location, navigate } = useBrowserRouter();
  const includeDemo = import.meta.env.DEV;
  const products = useMemo(() => getCatalogProducts(includeDemo), [includeDemo]);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactContext, setContactContext] = useState<ContactContext>();

  const openContact = (context?: ContactContext) => {
    setContactContext(context);
    setContactOpen(true);
  };

  const productSlug = location.route.name === 'product' ? location.route.slug : undefined;
  const product = productSlug ? products.find((item) => item.slug === productSlug) : undefined;

  useEffect(() => {
    document.documentElement.lang = 'vi';
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (location.route.name === 'home') {
      document.title = 'Lamie — Tiệm hoa tại Thủ Đức';
      meta?.setAttribute('content', 'Khám phá mẫu hoa Lamie theo dịp, kiểu dáng và sắc hoa; liên hệ Lamie để được xác nhận và tư vấn.');
    } else if (location.route.name === 'catalog') {
      document.title = 'Mẫu hoa Lamie — Tìm kiếm và lọc';
      meta?.setAttribute('content', 'Tìm mẫu hoa Lamie theo dịp, dòng sản phẩm, kiểu dáng, hoa, màu và phong cách.');
    } else if (location.route.name === 'product' && product) {
      document.title = `${product.name} · Lamie`;
      meta?.setAttribute('content', `Xem thông tin mẫu ${product.name} (${product.sku}) và liên hệ Lamie để xác nhận.`);
    } else {
      document.title = 'Không tìm thấy trang · Lamie';
      meta?.setAttribute('content', 'Đường dẫn không có trong website Lamie.');
    }
  }, [location.route, product]);

  useEffect(() => {
    if (!location.hash || location.route.name !== 'home') return;
    const timer = window.setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ block: 'start' }), 80);
    return () => window.clearTimeout(timer);
  }, [location.hash, location.route.name]);

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Bỏ qua điều hướng</a>
      <SiteHeader route={location.route} navigate={(to) => navigate(to)} onContact={() => openContact()} />
      <Suspense fallback={<PageLoader />}>
        {location.route.name === 'home' ? <HomePage products={products} includeDemo={includeDemo} navigate={(to) => navigate(to)} onContact={openContact} /> : null}
        {location.route.name === 'catalog' ? <CatalogPage products={products} includeDemo={includeDemo} search={location.search} navigate={navigate} onContact={openContact} /> : null}
        {location.route.name === 'product' ? <ProductDetailPage product={product} products={products} navigate={(to) => navigate(to)} onContact={openContact} /> : null}
        {location.route.name === 'not-found' ? <NotFoundPage navigate={(to) => navigate(to)} /> : null}
      </Suspense>
      <SiteFooter navigate={(to) => navigate(to)} onContact={() => openContact()} />
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} context={contactContext} />
    </div>
  );
}

export default App;
