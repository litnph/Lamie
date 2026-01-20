
import React from 'react';
import { FlowerProduct } from '../product.type';

interface ProductCardProps {
  product: FlowerProduct;
  onClick?: (product: FlowerProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => (
  <div className="group cursor-pointer" onClick={() => onClick && onClick(product)}>
    <div className="relative overflow-hidden rounded-md bg-white aspect-[3/4] mb-3">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-mocha-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 hidden md:block">
        <span className="inline-block bg-white/95 backdrop-blur-sm px-4 py-2 rounded text-xs font-body tracking-widest text-mocha-800 shadow-sm">VIEW DETAILS</span>
      </div>
    </div>
    <div className="text-center">
      <h3 className="font-serif text-lg text-mocha-900 group-hover:text-mocha-500 transition-colors">{product.name}</h3>
      <p className="font-body text-sm text-mocha-300">{product.price}</p>
    </div>
  </div>
);
