
import React, { useState, useEffect, Suspense } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { ProductService } from './features/product/product.service';
import { FlowerProduct } from './features/product/product.type';
import { ViewState } from './types/common';
import { ChatBox } from './features/chat/components/ChatBox';

const Home = React.lazy(() => import('./pages/home.page'));
const ShopPage = React.lazy(() => import('./pages/shop.page'));
const ProductDetail = React.lazy(() => import('./pages/product-detail.page').then(m => ({ default: m.ProductDetail })));
const Login = React.lazy(() => import('./pages/login.page').then(m => ({ default: m.Login })));
const MemberPage = React.lazy(() => import('./pages/member.page').then(m => ({ default: m.MemberPage })));

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream-50 italic font-serif text-mocha-300">
    Lamie is preparing flowers...
  </div>
);

function App() {
  const [view, setView] = useState<ViewState>('home');
  const [products, setProducts] = useState<FlowerProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<FlowerProduct | null>(null);
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('lamie_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ProductService.getAll().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const navigate = (v: string, p?: FlowerProduct) => {
    if (p) setSelectedProduct(p);
    setView(v as ViewState);
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

  if (loading) return <Loader />;

  return (
    <MainLayout currentView={view} setView={v => navigate(v)} isLoggedIn={isAuth}>
      <Suspense fallback={<Loader />}>
        {view === 'home' && <Home products={products} onNavigate={navigate} />}
        {view === 'shop' && <ShopPage products={products} onProductClick={p => navigate('product', p)} />}
        {view === 'product' && selectedProduct && <ProductDetail product={selectedProduct} onBack={() => navigate('shop')} />}
        {view === 'member' && (isAuth ? <MemberPage onLogout={handleLogout} /> : <Login onLoginSuccess={handleLoginSuccess} onCancel={() => setView('home')} />)}
        {view === 'login' && <Login onLoginSuccess={handleLoginSuccess} onCancel={() => setView('home')} />}
      </Suspense>
      {view !== 'login' && <ChatBox />}
    </MainLayout>
  );
}

export default App;
