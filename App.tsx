import React, { useState, useEffect } from 'react';
import { Header, Footer } from './components/ui/Layout';
import { Hero } from './components/sections/Hero';
import { About, WhyChoose, Testimonials } from './components/sections/Content';
import { Collections, SignatureBouquets, Gallery } from './components/sections/Products';
import { Contact } from './components/sections/Contact';
import { Shop } from './components/Shop';
import { ProductDetail } from './components/ProductDetail';
import { Admin } from './components/Admin';
import { Login } from './components/Login';
import { FlowerProduct } from './types';
import { PRODUCTS as INITIAL_PRODUCTS } from './data';

function App() {
  const [currentView, setView] = useState<'home' | 'shop' | 'product' | 'admin'>('home');
  const [selectedProduct, setSelectedProduct] = useState<FlowerProduct | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Initialize state from LocalStorage or Fallback to Data.ts
  const [products, setProducts] = useState<FlowerProduct[]>(() => {
    const saved = localStorage.getItem('lamie_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Check for auth token on mount
  useEffect(() => {
    const token = localStorage.getItem('lamie_auth_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Persist changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('lamie_products', JSON.stringify(products));
  }, [products]);

  const navigateToShop = () => {
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (product: FlowerProduct) => {
    setSelectedProduct(product);
    setView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // Already in admin view conceptually, but ensure render updates
  };

  const handleLogout = () => {
    localStorage.removeItem('lamie_auth_token');
    setIsAuthenticated(false);
    setView('home'); // Go home after logout
  };

  // Helper to render Admin or Login based on auth status
  const renderAdminSection = () => {
    if (isAuthenticated) {
      return (
        <Admin 
          products={products} 
          setProducts={setProducts} 
          onExit={() => setView('home')}
          onLogout={handleLogout}
        />
      );
    }
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess} 
        onCancel={() => setView('home')} 
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {currentView !== 'admin' && <Header currentView={currentView} setView={setView} />}
      
      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            <Hero onShopClick={navigateToShop} />
            <About />
            <Collections 
              products={products}
              onProductClick={handleProductClick} 
              onViewAllClick={navigateToShop} 
            />
            <SignatureBouquets />
            <WhyChoose />
            <Gallery />
            <Testimonials />
            <Contact />
          </>
        )}
        
        {currentView === 'shop' && (
          <Shop 
            products={products}
            onProductClick={handleProductClick} 
          />
        )}

        {currentView === 'product' && selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            allProducts={products}
            onBack={navigateToShop} 
            onRelatedProductClick={handleProductClick}
          />
        )}

        {currentView === 'admin' && renderAdminSection()}
      </main>
      
      {currentView !== 'admin' && <Footer onAdminClick={() => setView('admin')} />}
    </div>
  );
}

export default App;