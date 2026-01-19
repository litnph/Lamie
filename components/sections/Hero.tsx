import React from 'react';
import { SectionWrapper, Button, FadeIn, LeafIcon } from '../ui/Base';

interface HeroProps {
  onShopClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick }) => {
  return (
    <SectionWrapper id="home" className="min-h-screen flex items-center pt-32 pb-12">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-cream-200/50 -z-10" />
      <div className="absolute bottom-10 left-10 text-mocha-100 opacity-20 transform -rotate-12 animate-float">
        <LeafIcon className="w-64 h-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
        {/* Text Content */}
        <FadeIn delay={200} className="order-2 md:order-1 flex flex-col items-start space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-mocha-300"></div>
            <span className="uppercase tracking-[0.3em] text-xs text-mocha-300 font-body">Thành lập 2024</span>
          </div>
          
          <h1 className="font-serif text-6xl md:text-8xl text-mocha-900 leading-[0.9]">
            Vẻ Đẹp <br />
            <span className="italic font-light text-mocha-500">Dịu Dàng</span> Cho <br />
            Mỗi Ngày.
          </h1>

          <p className="font-body text-mocha-500 text-lg leading-relaxed max-w-md">
            Chúng tôi gom góp những khoảnh khắc bình yên qua những bông hoa theo mùa và nghệ thuật cắm hoa thủ công. Lấy cảm hứng từ nhịp điệu thong thả của tự nhiên.
          </p>

          <div className="flex gap-4 pt-4">
            <Button onClick={onShopClick}>Xem Bộ Sưu Tập</Button>
            <Button variant="text">Câu Chuyện Của Lamie</Button>
          </div>
        </FadeIn>

        {/* Hero Image */}
        <FadeIn delay={400} className="order-1 md:order-2 relative">
          <div className="relative z-10 rounded-lg overflow-hidden border-[8px] border-white shadow-xl aspect-[3/4] max-w-md mx-auto">
             <img 
              src="https://picsum.photos/id/106/800/1200" 
              alt="Cô gái cầm hoa" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]"
            />
          </div>
          {/* Circular text decoration */}
          <div className="absolute -bottom-8 -right-4 md:right-8 w-28 h-28 bg-cream-50 rounded-full flex items-center justify-center shadow-lg animate-float border border-cream-200">
             <div className="text-center">
               <span className="block font-serif text-xl text-mocha-800">100%</span>
               <span className="block font-body text-[9px] uppercase tracking-widest text-mocha-500">Hoa Tươi</span>
             </div>
          </div>
        </FadeIn>
      </div>
    </SectionWrapper>
  );
};