
import React from 'react';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { FadeIn } from '../../components/ui/FadeIn';

const IMAGES = [
  "https://picsum.photos/id/1011/900/700",
  "https://picsum.photos/id/1012/900/700",
  "https://picsum.photos/id/319/900/700",
  "https://picsum.photos/id/250/900/700",
  "https://picsum.photos/id/65/900/700",
  "https://picsum.photos/id/111/900/700"
];

type Lang = 'vi' | 'en';

export const Gallery: React.FC<{ lang: Lang }> = ({ lang }) => (
  <SectionWrapper id="gallery" className="bg-cream-50">
    <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-widest text-mocha-300 font-bold block mb-2">{lang === 'vi' ? 'Khoanh khac' : 'Portfolio'}</span>
        <h2 className="font-serif text-5xl text-mocha-900">{lang === 'vi' ? 'Thu vien Lamie' : "Lamie's Gallery"}</h2>
        <div className="h-[1px] w-12 bg-mocha-800 mx-auto mt-6"></div>
    </div>
    
    <FadeIn>
      <div className="relative overflow-hidden rounded-2xl border border-cream-200 bg-white p-3 md:p-4 shadow-sm">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-10 md:w-16 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 md:w-16 bg-gradient-to-l from-white to-transparent z-10"></div>

        <div className="flex w-max gap-3 animate-gallery-marquee">
          {[0, 1, 2, 3].map((panel) => (
            <div key={panel} className="shrink-0 w-[680px] md:w-[980px]">
              <div className="grid grid-cols-6 grid-rows-4 gap-2 md:gap-3 h-[320px] md:h-[470px]">
                <div className="col-span-2 row-span-3 rounded-md overflow-hidden">
                  <img src={IMAGES[0]} alt="Lamie gallery" className="w-full h-full object-cover" />
                </div>
                <div className="col-span-2 row-span-2 rounded-md overflow-hidden">
                  <img src={IMAGES[1]} alt="Lamie gallery" className="w-full h-full object-cover" />
                </div>
                <div className="col-span-2 row-span-2 rounded-md overflow-hidden">
                  <img src={IMAGES[2]} alt="Lamie gallery" className="w-full h-full object-cover" />
                </div>
                <div className="col-span-2 row-span-1 rounded-md overflow-hidden">
                  <img src={IMAGES[3]} alt="Lamie gallery" className="w-full h-full object-cover" />
                </div>
                <div className="col-span-2 row-span-2 rounded-md overflow-hidden">
                  <img src={IMAGES[4]} alt="Lamie gallery" className="w-full h-full object-cover" />
                </div>
                <div className="col-span-2 row-span-1 rounded-md overflow-hidden">
                  <img src={IMAGES[5]} alt="Lamie gallery" className="w-full h-full object-cover" />
                </div>
                <div className="col-span-1 row-span-1 rounded-md overflow-hidden">
                  <img src={IMAGES[2]} alt="Lamie gallery" className="w-full h-full object-cover" />
                </div>
                <div className="col-span-1 row-span-1 rounded-md overflow-hidden">
                  <img src={IMAGES[4]} alt="Lamie gallery" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-center text-xs tracking-[0.2em] uppercase text-mocha-400 mt-6">
        @tiemhoalamie
      </p>
    </FadeIn>
  </SectionWrapper>
);
