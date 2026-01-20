
import React, { useState, useMemo } from 'react';
import { SectionWrapper } from '../components/ui/SectionWrapper';
import { ProductCard } from '../features/product/components/ProductCard';
import { FlowerProduct } from '../features/product/product.type';

interface ShopPageProps {
  products: FlowerProduct[];
  onProductClick: (product: FlowerProduct) => void;
}

const ShopPage: React.FC<ShopPageProps> = ({ products, onProductClick }) => {
  const [category, setCategory] = useState('All');
  const cats = ['All', 'Daily', 'Special', 'Wedding', 'Anniversary', 'Dried'];

  const filtered = useMemo(() => 
    category === 'All' ? products : products.filter(p => p.category === category)
  , [products, category]);

  return (
    <div className="pt-32 min-h-screen pb-20 bg-cream-50">
      <SectionWrapper>
        <div className="text-center mb-16 space-y-4">
          <h1 className="font-serif text-5xl text-mocha-900">Flower Shop</h1>
          <p className="font-body text-mocha-400">Bringing nature's breath into your living space</p>
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            {cats.map(c => (
              <button 
                key={c} 
                onClick={() => setCategory(c)}
                className={`text-xs uppercase tracking-[0.2em] transition-all pb-1 border-b ${category === c ? 'border-mocha-800 text-mocha-900 font-bold' : 'border-transparent text-mocha-300 hover:text-mocha-500'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {filtered.map(p => <ProductCard key={p.id} product={p} onClick={onProductClick} />)}
        </div>
      </SectionWrapper>
    </div>
  );
};

export default ShopPage;
