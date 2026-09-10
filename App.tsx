import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { catalogErrorCopy } from './features/product/catalog.repository';
import { ProductService } from './features/product/product.service';
import { CatalogState, FlowerProduct } from './features/product/product.type';
import { ViewState } from './types/common';
import { ChatBox } from './features/chat/components/ChatBox';

const Home = React.lazy(() => import('./pages/home.page'));
const ShopPage = React.lazy(() => import('./pages/shop.page'));
const ProductDetail = React.lazy(() => import('./pages/product-detail.page').then((module) => ({ default: module.ProductDetail })));
const Login = React.lazy(() => import('./pages/login.page').then((module) => ({ default: module.Login })));
const MemberPage = React.lazy(() => import('./pages/member.page').then((module) => ({ default: module.MemberPage })));

const PageLoader = () => (
  <div role="status" aria-label="Preparing this page" className="flex min-h-[70dvh] items-center justify-center bg-[var(--color-canvas)] px-6 text-center font-serif italic text-[var(--color-text-muted)]">
    <span className="animate-pulse">Lamie is preparing flowers...</span>
  </div>
);

const initialCatalogState: CatalogState = { status: 'loading', products: [], metadata: null };

function App() {
  const [view, setView] = useState<ViewState>('home');
  const [catalog, setCatalog] = useState<CatalogState>(initialCatalogState);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState(() => Boolean(localStorage.getItem('lamie_token')));
  const requestSequence = useRef(0);

  const loadCatalog = useCallback(async () => {
    const requestId = ++requestSequence.current;
    setCatalog(initialCatalogState);
    try {
      const snapshot = await ProductService.getCatalog();
      if (requestId !== requestSequence.current) return;
      setCatalog(snapshot.products.length === 0
        ? { status: 'empty', products: [], metadata: snapshot.metadata }
        : { status: 'ready', products: snapshot.products, metadata: snapshot.metadata });
    } catch (error) {
      if (requestId !== requestSequence.current) return;
      setCatalog({ status: 'error', products: [], metadata: null, error: catalogErrorCopy(error) });
    }
  }, []);

  useEffect(() => {
    void loadCatalog();
    return () => {
      requestSequence.current += 1;
    };
  }, [loadCatalog]);

  const navigate = (nextView: ViewState, product?: FlowerProduct) => {
    if (product) setSelectedProductId(product.id);
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('lamie_token');
    setIsAuth(false);
    setView('home');
  };

  const handleLoginSuccess = () => {
    setIsAuth(true);
    setView('member');
  };

  return (
    <MainLayout currentView={view} setView={navigate} isLoggedIn={isAuth}>
      <Suspense fallback={<PageLoader />}>
        {view === 'home' ? <Home catalog={catalog} onRetry={loadCatalog} onNavigate={navigate} /> : null}
        {view === 'shop' ? <ShopPage catalog={catalog} onRetry={loadCatalog} onProductClick={(product) => navigate('product', product)} /> : null}
        {view === 'product' ? (
          <ProductDetail
            catalog={catalog}
            productId={selectedProductId}
            onBack={() => navigate('shop')}
            onRetry={loadCatalog}
            onProductClick={(product) => navigate('product', product)}
          />
        ) : null}
        {view === 'member' ? (isAuth
          ? <MemberPage onLogout={handleLogout} />
          : <Login onLoginSuccess={handleLoginSuccess} onCancel={() => setView('home')} />) : null}
        {view === 'login' ? <Login onLoginSuccess={handleLoginSuccess} onCancel={() => setView('home')} /> : null}
      </Suspense>
      {view !== 'login' ? <ChatBox /> : null}
    </MainLayout>
  );
}

export default App;
