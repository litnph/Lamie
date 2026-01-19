import React, { useState, useEffect, useCallback } from 'react';
import { FlowerProduct } from '../types';
import { SectionWrapper, Button, FadeIn, LeafIcon } from './ui/Base';
import { ProductCard } from './sections/Products';

interface ProductDetailProps {
  product: FlowerProduct;
  allProducts: FlowerProduct[];
  onBack: () => void;
  onRelatedProductClick: (product: FlowerProduct) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, allProducts, onBack, onRelatedProductClick }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'care' | 'delivery'>('care');
  
  // Gallery State
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Prepare unique images
  const images = Array.from(new Set([product.image, ...(product.additionalImages || [])]));

  // Reset state when product changes
  useEffect(() => {
    setActiveIndex(0);
    setQuantity(1);
    setIsLightboxOpen(false);
  }, [product]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, activeIndex]); 

  // Find related products from the passed prop
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const nextImage = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Drag / Swipe Logic
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setDragStart(clientX);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(false);
    if (dragStart === null) return;
    
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = clientX - dragStart;
    
    // Threshold for swipe
    if (diff > 50) {
      prevImage();
    } else if (diff < -50) {
      nextImage();
    }
    setDragStart(null);
  };

  // Advanced 3D Calculation for Glassmorphism
  const getSlideStyle = (index: number) => {
    const total = images.length;
    let diff = (index - activeIndex + total) % total;
    if (diff > total / 2) diff -= total;

    // Common transition
    const transition = "transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"; 

    if (diff === 0) {
      // Active: Center
      return {
        className: `${transition} absolute z-30 w-[260px] h-[350px] md:w-[320px] md:h-[420px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 shadow-2xl shadow-mocha-900/30 group cursor-zoom-in`,
        style: { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)' }
      };
    } else if (diff === -1 || (activeIndex === 0 && index === total - 1)) {
      // Prev: Left
      return {
        className: `${transition} absolute z-20 w-[260px] h-[350px] md:w-[320px] md:h-[420px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60 cursor-pointer hover:opacity-80`,
        style: { transform: 'translate(-85%, -50%) scale(0.85) rotate(-6deg)', filter: 'blur(1px)' }
      };
    } else if (diff === 1 || (activeIndex === total - 1 && index === 0)) {
      // Next: Right
      return {
        className: `${transition} absolute z-20 w-[260px] h-[350px] md:w-[320px] md:h-[420px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60 cursor-pointer hover:opacity-80`,
        style: { transform: 'translate(-15%, -50%) scale(0.85) rotate(6deg)', filter: 'blur(1px)' }
      };
    } else {
      // Hidden
      return {
        className: `${transition} absolute z-10 w-[260px] h-[350px] md:w-[320px] md:h-[420px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none`,
        style: { transform: 'translate(-50%, -50%) scale(0.5)' }
      };
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-cream-50">
      <SectionWrapper>
        {/* Back Button */}
        <div className="mb-6">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-mocha-400 hover:text-mocha-800 transition-colors group"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:-translate-x-1 transition-transform duration-300">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-body text-sm tracking-wide">Trở lại Cửa Hàng</span>
            </button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-mocha-300 mb-8 border-b border-mocha-100 pb-4">
          <button onClick={onBack} className="hover:text-mocha-800 transition-colors">Sản Phẩm</button>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-mocha-800 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Glassmorphism Gallery Container */}
          <div className="relative h-[450px] md:h-[550px] flex flex-col items-center justify-center perspective-1000 select-none">
             
             {/* The Cards Area */}
             <div 
                className="relative w-full h-full touch-pan-y"
                onMouseDown={handleDragStart}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchEnd={handleDragEnd}
             >
                {images.map((img, index) => {
                  const { className, style } = getSlideStyle(index);
                  const isCenter = (index - activeIndex + images.length) % images.length === 0;

                  return (
                    <div 
                        key={index} 
                        className={className} 
                        style={style}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isDragging) {
                                if (isCenter) {
                                    setIsLightboxOpen(true);
                                } else {
                                    setActiveIndex(index);
                                }
                            }
                        }}
                    >
                       <div className="w-full h-full rounded-xl overflow-hidden bg-white relative border-[4px] border-white group-hover:border-cream-100 transition-colors">
                          <img 
                            src={img} 
                            alt="" 
                            className="w-full h-full object-cover"
                            draggable="false"
                          />
                          
                          {/* Glass Overlay for non-active items */}
                          {!isCenter && (
                              <div className="absolute inset-0 bg-cream-100/30 backdrop-blur-[1px]"></div>
                          )}

                          {/* Expand Icon Hint for Center Item */}
                          {isCenter && (
                            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                                </svg>
                            </div>
                          )}
                       </div>
                    </div>
                  );
                })}
             </div>

             {/* Simple Indicator Dots */}
             <div className="absolute bottom-4 flex gap-3 z-40">
                {images.map((_, idx) => (
                    <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`rounded-full transition-all duration-300 ${
                        idx === activeIndex ? 'bg-mocha-800 w-2 h-2 scale-125' : 'bg-mocha-300 w-2 h-2 hover:bg-mocha-500'
                    }`}
                    />
                ))}
            </div>

          </div>

          {/* Details Section */}
          <FadeIn delay={200} className="flex flex-col justify-center">
            <h1 className="font-serif text-4xl md:text-5xl text-mocha-900 mb-6 leading-tight">{product.name}</h1>
            <p className="font-body text-2xl text-mocha-400 mb-8 font-light italic">{product.price}</p>
            
            <div className="h-[1px] w-full bg-cream-200 mb-8"></div>

            <p className="font-body text-mocha-600 text-lg leading-loose mb-10">
              {product.description || "Một thiết kế hoa theo mùa, sử dụng những bông hoa tươi nhất trong ngày. Được bó thủ công và gói trong giấy đặc trưng của Lamie."}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-6 mb-12">
               <div className="flex items-center border border-mocha-200 rounded-full px-6 py-3 space-x-6 bg-white shadow-sm">
                 <button onClick={() => handleQuantityChange(-1)} className="text-mocha-800 hover:text-mocha-500 font-light text-lg">-</button>
                 <span className="font-serif text-xl text-mocha-900 w-6 text-center">{quantity}</span>
                 <button onClick={() => handleQuantityChange(1)} className="text-mocha-800 hover:text-mocha-500 font-light text-lg">+</button>
               </div>
               <Button className="flex-grow py-4 shadow-md hover:shadow-lg">Thêm Vào Giỏ</Button>
            </div>

            {/* Info Tabs */}
            <div className="border-t border-cream-200 pt-2">
               <div className="flex gap-8 border-b border-cream-200">
                  <button 
                    onClick={() => setActiveTab('care')}
                    className={`py-4 text-xs uppercase tracking-widest transition-colors ${activeTab === 'care' ? 'text-mocha-900 border-b border-mocha-800 -mb-[1px]' : 'text-mocha-300 hover:text-mocha-500'}`}
                  >
                    Chăm Sóc
                  </button>
                  <button 
                     onClick={() => setActiveTab('delivery')}
                     className={`py-4 text-xs uppercase tracking-widest transition-colors ${activeTab === 'delivery' ? 'text-mocha-900 border-b border-mocha-800 -mb-[1px]' : 'text-mocha-300 hover:text-mocha-500'}`}
                  >
                    Giao Hàng
                  </button>
               </div>
               <div className="py-6 font-body text-sm text-mocha-500 leading-relaxed min-h-[100px]">
                 {activeTab === 'care' && (
                   <ul className="space-y-3">
                     <li className="flex gap-3 items-center"><LeafIcon className="w-4 h-4 text-mocha-300" /> Cắt gốc hoa một góc 45° khi nhận được.</li>
                     <li className="flex gap-3 items-center"><LeafIcon className="w-4 h-4 text-mocha-300" /> Thay nước mỗi ngày và để nơi thoáng mát.</li>
                     <li className="flex gap-3 items-center"><LeafIcon className="w-4 h-4 text-mocha-300" /> Tránh ánh nắng trực tiếp và gió lùa.</li>
                   </ul>
                 )}
                 {activeTab === 'delivery' && (
                   <p className="animate-fade-in-up">
                     Lamie giao hàng hàng ngày tại Hà Nội. Đơn hàng đặt trước 12h trưa có thể giao trong ngày. 
                     Mỗi bó hoa đều được dưỡng nước để đảm bảo độ tươi mới khi đến tay bạn.
                   </p>
                 )}
               </div>
            </div>
          </FadeIn>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-cream-200">
             <h3 className="font-serif text-3xl text-mocha-900 mb-8 text-center">Có Thể Bạn Cũng Thích</h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {relatedProducts.map((p) => (
                   <ProductCard key={p.id} product={p} onClick={onRelatedProductClick} />
                ))}
             </div>
          </div>
        )}
      </SectionWrapper>

      {/* LIGHTBOX OVERLAY */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-mocha-900/90 backdrop-blur-md transition-opacity duration-300 animate-fade-in-up">
           
           {/* Close Button */}
           <button 
             onClick={() => setIsLightboxOpen(false)}
             className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 z-50"
           >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
           </button>

           {/* Main Image Container */}
           <div className="relative w-full h-full p-4 md:p-12 flex items-center justify-center">
              <img 
                src={images[activeIndex]} 
                alt="Full screen view" 
                className="max-h-full max-w-full object-contain shadow-2xl rounded-sm"
              />

              {/* Navigation Arrows (Lightbox) */}
              <button 
                 onClick={(e) => { e.stopPropagation(); prevImage(); }}
                 className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4"
              >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M15 19L8 12L15 5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              </button>
              <button 
                 onClick={(e) => { e.stopPropagation(); nextImage(); }}
                 className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4"
              >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M9 5L16 12L9 19" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              </button>
              
              {/* Image Counter */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 font-body text-sm tracking-widest">
                 {activeIndex + 1} / {images.length}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};