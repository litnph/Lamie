import React, { useState, useMemo } from 'react';
import { SectionWrapper, FadeIn, LeafIcon } from './ui/Base';
import { ProductCard } from './sections/Products';
import { FlowerProduct } from '../types';

interface ShopProps {
  products: FlowerProduct[];
  onProductClick: (product: FlowerProduct) => void;
}

export const Shop: React.FC<ShopProps> = ({ products, onProductClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất Cả');
  const [priceRange, setPriceRange] = useState<string>('Tất Cả');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Updated categories to match data.ts
  const categories = ['Tất Cả', 'Thường Ngày', 'Dịp Đặc Biệt', 'Tiệc Cưới', 'Kỷ Niệm', 'Hoa Khô'];
  
  // Adjusted price logic for VND (approximate conversion for logic)
  // Assuming basic format like '500.000₫' -> parsed as 500000
  const priceRanges = [
    { label: 'Tất Cả', max: Infinity, min: 0 },
    { label: 'Dưới 500k', max: 500000, min: 0 },
    { label: '500k - 1 Triệu', max: 1000000, min: 500000 },
    { label: 'Trên 1 Triệu', max: Infinity, min: 1000000 },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category Filter
      if (selectedCategory !== 'Tất Cả' && product.category !== selectedCategory) return false;
      
      // Price Filter
      // Remove dots and currency symbol to parse
      const priceVal = parseFloat(product.price.replace(/[^\d]/g, ''));
      const range = priceRanges.find(r => r.label === priceRange);
      if (range) {
        if (priceVal < range.min || priceVal >= range.max) return false;
      }
      
      return true;
    });
  }, [products, selectedCategory, priceRange]);

  return (
    <div className="pt-24 min-h-screen bg-cream-50">
      <SectionWrapper noPadding>
        <div className="py-8 md:py-12 text-center px-4">
           <h1 className="font-serif text-4xl md:text-5xl text-mocha-900 mb-2 md:mb-4">Cửa Hàng Hoa</h1>
           <p className="font-body text-sm md:text-base text-mocha-500">Những thiết kế hoa tuyển chọn cho từng khoảnh khắc.</p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden px-6 mb-6 sticky top-20 z-30">
            <button 
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="w-full bg-white border border-mocha-200 shadow-sm text-mocha-900 py-3 px-4 rounded-md flex items-center justify-between font-serif text-lg"
            >
                <span className="flex items-center gap-2">
                    <LeafIcon className="w-5 h-5 text-mocha-500" />
                    Bộ Lọc
                </span>
                <svg 
                    className={`w-5 h-5 transition-transform duration-300 ${mobileFiltersOpen ? 'rotate-180' : ''}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 pb-20 px-6 md:px-0">
          {/* Sidebar / Filter Area */}
          <aside className={`w-full md:w-64 flex-shrink-0 space-y-8 transition-all duration-500 ease-in-out overflow-hidden md:overflow-visible ${mobileFiltersOpen ? 'max-h-[1000px] opacity-100 mb-8' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100 md:mb-0'}`}>
            <div className="bg-white p-6 rounded-lg border border-cream-200 shadow-sm">
              <h3 className="font-serif text-xl text-mocha-900 mb-4 flex items-center gap-2">
                <LeafIcon className="w-4 h-4" /> Danh Mục
              </h3>
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3 font-body text-sm text-mocha-500">
                {categories.map(cat => (
                  <li key={cat}>
                    <button 
                      onClick={() => { setSelectedCategory(cat); setMobileFiltersOpen(false); }}
                      className={`text-left w-full transition-colors hover:text-mocha-800 ${selectedCategory === cat ? 'text-mocha-900 font-bold underline decoration-mocha-300 underline-offset-4' : ''}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border border-cream-200 shadow-sm">
              <h3 className="font-serif text-xl text-mocha-900 mb-4">Khoảng Giá</h3>
              <ul className="space-y-3 font-body text-sm text-mocha-500">
                {priceRanges.map(range => (
                  <li key={range.label} className="flex items-center gap-2 p-2 hover:bg-cream-50 rounded -mx-2">
                    <input 
                      type="radio" 
                      id={range.label} 
                      name="price" 
                      checked={priceRange === range.label}
                      onChange={() => { setPriceRange(range.label); setMobileFiltersOpen(false); }}
                      className="accent-mocha-800 cursor-pointer h-4 w-4"
                    />
                    <label htmlFor={range.label} className="cursor-pointer hover:text-mocha-800 flex-grow">{range.label}</label>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-6 font-body text-xs text-mocha-300 uppercase tracking-widest px-1">
              <span>Hiển thị {filteredProducts.length} kết quả</span>
            </div>
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredProducts.map((p, i) => (
                  <FadeIn key={p.id} delay={i * 50}>
                    <ProductCard product={p} onClick={onProductClick} />
                  </FadeIn>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-mocha-200 rounded-lg bg-white/50">
                <p className="font-serif text-xl text-mocha-500">Chưa tìm thấy hoa phù hợp.</p>
                <button 
                  onClick={() => { setSelectedCategory('Tất Cả'); setPriceRange('Tất Cả'); }}
                  className="mt-4 text-sm font-body text-mocha-800 underline hover:text-mocha-500"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};