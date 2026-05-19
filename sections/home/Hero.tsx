
import React from 'react';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { FadeIn } from '../../components/ui/FadeIn';
import { Button } from '../../components/common/Button';
import { LeafIcon } from '../../components/common/Icons';

type Lang = 'vi' | 'en';

export const Hero: React.FC<{ onShopClick: () => void; lang: Lang }> = ({ onShopClick, lang }) => (
  <SectionWrapper id="home" className="min-h-screen flex items-center pt-24">
    <div className="absolute top-0 right-0 w-1/3 h-full bg-cream-200/50 -z-10" />
    <div className="absolute bottom-10 left-10 text-mocha-100 opacity-20 transform -rotate-12 animate-float">
        <LeafIcon className="w-64 h-64" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <FadeIn delay={200} className="space-y-8 order-2 md:order-1">
        <div className="flex items-center gap-4 text-mocha-300 text-xs uppercase tracking-widest">
           <div className="h-[1px] w-12 bg-mocha-300"></div>
           {lang === 'vi' ? 'Tiem Hoa Lamie' : 'Lamie Flower Shop'}
        </div>
        <h1 className="font-serif text-7xl md:text-8xl text-mocha-900 leading-[0.9]">
          {lang === 'vi' ? 'Lamie' : 'Lamie'} <br />
          <span className="italic font-light text-mocha-500">
            {lang === 'vi' ? 'mot chut tho, mot chut vintage.' : 'minimal bloom, poetic vintage touch.'}
          </span>
        </h1>
        <p className="font-body text-mocha-500 text-lg max-w-md">
          {lang === 'vi'
            ? 'Lamie theo duoi phong cach toi gian hien dai: duong net gon gang, bang mau diu, de moi bo hoa tro thanh mot thong diep tinh te.'
            : 'Lamie embraces modern minimalism with clean lines and calm tones, so each bouquet feels like a refined message.'}
        </p>
        <div className="flex gap-4">
          <Button onClick={onShopClick}>{lang === 'vi' ? 'Xem cua hang' : 'Shop now'}</Button>
          <Button variant="text">{lang === 'vi' ? 'Ve Lamie' : 'About Lamie'}</Button>
        </div>
      </FadeIn>
      <FadeIn delay={400} className="relative flex justify-center order-1 md:order-2">
        <div className="rounded-lg overflow-hidden border-[8px] border-white shadow-2xl aspect-[3/4] w-full max-w-md bg-cream-100">
          <img src="https://picsum.photos/id/106/800/1200" alt="Lamie Signature Flower Arrangement" className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-110" />
        </div>
        <div className="absolute -bottom-8 -right-4 w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg border border-cream-200 animate-float">
           <div className="text-center">
              <span className="block font-serif text-2xl text-mocha-800">100%</span>
              <span className="block text-[8px] uppercase tracking-widest text-mocha-300">{lang === 'vi' ? 'Tuoi moi' : 'Fresh'}</span>
           </div>
        </div>
      </FadeIn>
    </div>
  </SectionWrapper>
);
