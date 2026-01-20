
import React from 'react';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { FadeIn } from '../../components/ui/FadeIn';

const IMAGES = [
  { src: "https://picsum.photos/id/1011/600/800", span: "row-span-2" },
  { src: "https://picsum.photos/id/1012/600/600", span: "" },
  { src: "https://picsum.photos/id/319/600/400", span: "" },
  { src: "https://picsum.photos/id/250/600/700", span: "row-span-2" },
  { src: "https://picsum.photos/id/65/600/800", span: "" },
  { src: "https://picsum.photos/id/111/600/600", span: "" },
];

export const Gallery: React.FC = () => (
  <SectionWrapper id="gallery" className="bg-cream-50">
    <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-widest text-mocha-300 font-bold block mb-2">Portfolio</span>
        <h2 className="font-serif text-5xl text-mocha-900">Lamie's Gallery</h2>
        <div className="h-[1px] w-12 bg-mocha-800 mx-auto mt-6"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 auto-rows-[200px] md:auto-rows-[300px]">
      {IMAGES.map((img, i) => (
        <FadeIn key={i} delay={i * 100} className={`relative overflow-hidden rounded-lg group ${img.span}`}>
          <img 
            src={img.src} 
            alt="Gallery" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-mocha-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white font-serif italic text-lg tracking-widest">@lamie.flower</span>
          </div>
        </FadeIn>
      ))}
    </div>
  </SectionWrapper>
);
