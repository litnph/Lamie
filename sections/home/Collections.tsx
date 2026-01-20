
import React from 'react';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { FadeIn } from '../../components/ui/FadeIn';
import { ProductCard } from '../../features/product/components/ProductCard';
import { FlowerProduct } from '../../features/product/product.type';

export const Collections: React.FC<{ products: FlowerProduct[], onProductClick: (p: FlowerProduct) => void }> = ({ products, onProductClick }) => (
  <SectionWrapper id="collections">
    <div className="flex justify-between items-end mb-16">
      <div>
        <span className="text-xs uppercase tracking-widest text-mocha-300 font-bold block mb-2">Selected</span>
        <h2 className="font-serif text-5xl text-mocha-900">Collections</h2>
      </div>
      <button className="text-sm font-bold text-mocha-800 underline uppercase tracking-widest hover:text-mocha-500 transition-colors">View All</button>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
      {products.slice(0, 4).map((p, i) => (
        <FadeIn key={p.id} delay={i * 100}>
          <ProductCard product={p} onClick={onProductClick} />
        </FadeIn>
      ))}
    </div>
  </SectionWrapper>
);
