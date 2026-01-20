
import React, { useState } from 'react';
import { FlowerProduct } from '../features/product/product.type';
import { SectionWrapper } from '../components/ui/SectionWrapper';
import { Button } from '../components/common/Button';
import { LeafIcon } from '../components/common/Icons';
import { ProductGallery } from '../features/product/components/ProductGallery';

export const ProductDetail: React.FC<{ product: FlowerProduct, onBack: () => void }> = ({ product, onBack }) => {
  const [qty, setQty] = useState(1);
  const images = Array.from(new Set([product.image, ...(product.additionalImages || [])]));

  return (
    <div className="pt-32 min-h-screen bg-cream-50 pb-20">
      <SectionWrapper>
        <button onClick={onBack} className="text-mocha-400 hover:text-mocha-800 transition-colors mb-12 flex items-center gap-2 font-body text-sm">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12L12 19M5 12L12 5"/></svg>
           Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Use the specific feature component for complex image logic */}
          <ProductGallery images={images} />

          <div className="flex flex-col justify-center space-y-8">
             <span className="text-xs uppercase tracking-widest text-mocha-300 font-bold">{product.category}</span>
             <h1 className="font-serif text-5xl text-mocha-900 leading-tight">{product.name}</h1>
             <p className="text-3xl text-mocha-400 italic font-body">{product.price}</p>
             <div className="h-[1px] w-full bg-cream-200"></div>
             <p className="font-body text-mocha-600 text-lg leading-relaxed">{product.description}</p>
             
             <div className="flex gap-6 items-center pt-8">
                <div className="flex items-center border border-cream-200 rounded-full px-6 py-3 bg-white">
                   <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 text-xl text-mocha-300">-</button>
                   <span className="w-8 text-center font-serif text-xl">{qty}</span>
                   <button onClick={() => setQty(qty + 1)} className="w-8 text-xl text-mocha-300">+</button>
                </div>
                <Button className="flex-grow shadow-md">Add to Cart</Button>
             </div>
             
             <div className="pt-8 flex gap-4 text-xs uppercase tracking-widest text-mocha-300 font-bold items-center">
                <LeafIcon className="w-4 h-4" /> 100% Organic Fresh Flowers &bull; Same Day Delivery
             </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};
