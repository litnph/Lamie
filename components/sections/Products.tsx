import React from 'react';
import { SectionWrapper, FadeIn, Button } from '../ui/Base';
import { FlowerProduct, GalleryItem } from '../../types';

interface ProductCardProps {
  product: FlowerProduct;
  onClick?: (product: FlowerProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => (
  <div className="group cursor-pointer" onClick={() => onClick && onClick(product)}>
    <div className="relative overflow-hidden rounded-md bg-white aspect-[3/4] mb-3 md:mb-4">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110 opacity-95 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-mocha-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 hidden md:block">
        <span className="inline-block bg-white/95 backdrop-blur-sm px-4 py-2 rounded text-xs font-body tracking-widest text-mocha-800 shadow-sm">XEM CHI TIẾT</span>
      </div>
    </div>
    <div className="text-center space-y-1">
      <h3 className="font-serif text-base md:text-xl text-mocha-900 group-hover:text-mocha-500 transition-colors leading-tight">{product.name}</h3>
      <p className="font-body text-xs md:text-sm text-mocha-300">{product.price}</p>
    </div>
  </div>
);

interface CollectionsProps {
  products: FlowerProduct[];
  onProductClick?: (product: FlowerProduct) => void;
  onViewAllClick?: () => void;
}

export const Collections: React.FC<CollectionsProps> = ({ products, onProductClick, onViewAllClick }) => {
  // Use first 4 products for the home page collection
  const displayedProducts = products.slice(0, 4);

  return (
    <SectionWrapper id="collections">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16">
        <div>
           <span className="font-body text-xs uppercase tracking-[0.2em] text-mocha-300 mb-2 block">Tuyển Tập Chọn Lọc</span>
           <h2 className="font-serif text-4xl md:text-5xl text-mocha-900">Bộ Sưu Tập Hoa</h2>
        </div>
        <div className="hidden md:block">
           <Button variant="text" onClick={onViewAllClick}>Xem Tất Cả &rarr;</Button>
        </div>
      </div>

      {/* Grid: 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {displayedProducts.map((p, i) => (
          <FadeIn key={p.id} delay={i * 100}>
            <ProductCard product={p} onClick={onProductClick} />
          </FadeIn>
        ))}
      </div>
      
      <div className="mt-12 text-center md:hidden">
         <Button variant="outline" onClick={onViewAllClick}>Xem Tất Cả</Button>
      </div>
    </SectionWrapper>
  );
};

export const SignatureBouquets: React.FC = () => {
  return (
    <SectionWrapper id="signature" className="bg-mocha-800 text-cream-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
         <FadeIn className="relative">
            <div className="absolute inset-0 border border-mocha-500 transform translate-x-4 translate-y-4 rounded-md"></div>
            <img 
              src="https://picsum.photos/id/292/800/600" 
              alt="Signature Arrangement" 
              className="relative z-10 w-full rounded-md shadow-2xl filter sepia-[.2]"
            />
         </FadeIn>
         
         <FadeIn delay={200} className="space-y-8">
           <div className="inline-block border border-mocha-500 px-3 py-1 rounded text-[10px] uppercase tracking-widest">
             Bán Chạy Nhất
           </div>
           <h2 className="font-serif text-5xl md:text-6xl text-cream-100 leading-tight">
             Dấu Ấn <br/> Lamie
           </h2>
           <p className="font-body text-mocha-100 text-lg leading-relaxed font-light">
             Một thiết kế phóng khoáng, tự nhiên với những cành hoa đẹp nhất trong mùa. 
             Tựa như vừa được hái từ một khu vườn nước Anh, gói ghém trong giấy nến 
             đặc trưng và ruy băng lụa mềm mại.
           </p>
           <ul className="space-y-4 font-body text-sm text-mocha-100 border-t border-mocha-500 pt-8">
             <li className="flex items-center gap-3">
               <span className="w-1.5 h-1.5 bg-cream-100 rounded-full"></span>
               Bao gồm 25-30 cành hoa tuyển chọn
             </li>
             <li className="flex items-center gap-3">
               <span className="w-1.5 h-1.5 bg-cream-100 rounded-full"></span>
               Thiệp viết tay calligraphy
             </li>
             <li className="flex items-center gap-3">
               <span className="w-1.5 h-1.5 bg-cream-100 rounded-full"></span>
               Lớp dưỡng ẩm thân thiện môi trường
             </li>
           </ul>
           <Button className="bg-cream-100 text-mocha-900 hover:bg-white mt-4 rounded-md">Đặt Bó Dấu Ấn — 1.200.000₫</Button>
         </FadeIn>
      </div>
    </SectionWrapper>
  );
};

export const Gallery: React.FC = () => {
  const images: GalleryItem[] = [
    { id: 'g1', src: 'https://picsum.photos/id/28/600/600', alt: 'Forest detail', span: false },
    { id: 'g2', src: 'https://picsum.photos/id/111/600/800', alt: 'Vintage car with flowers', span: true },
    { id: 'g3', src: 'https://picsum.photos/id/249/600/600', alt: 'Bridge blur', span: false },
    { id: 'g4', src: 'https://picsum.photos/id/305/600/600', alt: 'Soft petals', span: false },
    { id: 'g5', src: 'https://picsum.photos/id/364/600/600', alt: 'Table setting', span: false },
  ];

  return (
    <SectionWrapper id="gallery" className="pb-0 overflow-x-hidden">
       <div className="text-center mb-8 md:mb-12">
          <h2 className="font-serif text-3xl text-mocha-900 italic">Nhật Ký Ảnh</h2>
          <p className="font-body text-xs uppercase tracking-widest text-mocha-300 mt-2">@lamie_flowers</p>
       </div>
       
       {/* Unified Grid Layout for Mobile and Desktop */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[300px]">
          {images.map((img, i) => (
             <FadeIn 
               key={img.id} 
               delay={i * 100} 
               className={`relative overflow-hidden group rounded-lg ${img.span ? 'row-span-2' : 'row-span-1'}`}
             >
               <img 
                 src={img.src} 
                 alt={img.alt} 
                 className="w-full h-full object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-110 filter grayscale-[20%] group-hover:grayscale-0"
               />
               <div className="absolute inset-0 bg-cream-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
             </FadeIn>
          ))}
          
          <div className="bg-cream-200 flex flex-col items-center justify-center text-center p-4 md:p-6 row-span-1 rounded-lg">
             <span className="font-serif text-xl md:text-2xl text-mocha-500 mb-2">Theo Dõi</span>
             <p className="font-body text-[10px] md:text-xs text-mocha-300 mb-2 md:mb-4">Cảm hứng mỗi ngày</p>
             <Button variant="text" className="text-xs">Instagram &rarr;</Button>
          </div>
       </div>
    </SectionWrapper>
  );
};