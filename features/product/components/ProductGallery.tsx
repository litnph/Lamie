
import React, { useState, useCallback } from 'react';

interface ProductGalleryProps {
  images: string[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const nextImage = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const getSlideStyle = (index: number) => {
    const total = images.length;
    let diff = (index - activeIndex + total) % total;
    if (diff > total / 2) diff -= total;

    const baseClass = "transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] absolute top-1/2 left-1/2";
    
    if (diff === 0) {
      return {
        className: `${baseClass} z-30 w-[260px] h-[350px] md:w-[320px] md:h-[420px] opacity-100 shadow-2xl cursor-zoom-in`,
        style: { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)' }
      };
    } else if (diff === -1 || (activeIndex === 0 && index === total - 1)) {
      return {
        className: `${baseClass} z-20 w-[260px] h-[350px] md:w-[320px] md:h-[420px] opacity-60 cursor-pointer hover:opacity-80`,
        style: { transform: 'translate(-85%, -50%) scale(0.85) rotate(-6deg)', filter: 'blur(1px)' }
      };
    } else if (diff === 1 || (activeIndex === total - 1 && index === 0)) {
      return {
        className: `${baseClass} z-20 w-[260px] h-[350px] md:w-[320px] md:h-[420px] opacity-60 cursor-pointer hover:opacity-80`,
        style: { transform: 'translate(-15%, -50%) scale(0.85) rotate(6deg)', filter: 'blur(1px)' }
      };
    } else {
      return {
        className: `${baseClass} z-10 w-[260px] h-[350px] md:w-[320px] md:h-[420px] opacity-0 pointer-events-none`,
        style: { transform: 'translate(-50%, -50%) scale(0.5)' }
      };
    }
  };

  return (
    <>
      <div className="relative h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden">
        {images.map((img, index) => {
          const { className, style } = getSlideStyle(index);
          const isCenter = (index - activeIndex + images.length) % images.length === 0;
          return (
            <div 
              key={index} 
              className={className} 
              style={style}
              onClick={() => isCenter ? setIsLightboxOpen(true) : setActiveIndex(index)}
            >
               <div className="w-full h-full rounded-xl overflow-hidden bg-white border-[4px] border-white">
                  <img src={img} alt="" className="w-full h-full object-cover" />
               </div>
            </div>
          );
        })}
        
        <div className="absolute bottom-4 flex gap-3 z-40">
           {images.map((_, idx) => (
               <button key={idx} onClick={() => setActiveIndex(idx)} className={`rounded-full transition-all duration-300 ${idx === activeIndex ? 'bg-mocha-800 w-2 h-2 scale-125' : 'bg-mocha-300 w-2 h-2'}`} />
           ))}
       </div>
      </div>

      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-mocha-900/95 backdrop-blur-md animate-fade-in-up" onClick={() => setIsLightboxOpen(false)}>
           <img src={images[activeIndex]} className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl" />
           <button className="absolute top-6 right-6 text-white p-2">✕</button>
           <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-4">❮</button>
           <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-4">❯</button>
        </div>
      )}
    </>
  );
};
