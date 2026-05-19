
import React from 'react';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { FadeIn } from '../../components/ui/FadeIn';
import { LeafIcon } from '../../components/common/Icons';

type Lang = 'vi' | 'en';

export const About: React.FC<{ lang: Lang }> = ({ lang }) => (
  <SectionWrapper id="about" className="bg-white">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
      <FadeIn className="order-2 md:order-1 space-y-8">
        <span className="text-xs uppercase tracking-widest text-mocha-300 font-bold">
          {lang === 'vi' ? 'Cau chuyen Lamie' : 'The Lamie Story'}
        </span>
        <h2 className="font-serif text-5xl text-mocha-900">
          {lang === 'vi' ? 'Hoa duoc thiet ke de cham vao cam xuc.' : 'Designed to move your emotions.'}
        </h2>
        <div className="h-[1px] w-16 bg-mocha-800"></div>
        <p className="font-body text-mocha-600 text-lg leading-relaxed">
          {lang === 'vi'
            ? 'Tai Lamie, hoa la ngon ngu cua su quan tam. Tu bo hoa nho danh cho ngay thuong den set hoa cho dip dac biet, tat ca deu giu chat toi gian, hien dai va dieu do vintage nhe.'
            : 'At Lamie, flowers are a language of care. From small everyday bouquets to special occasion sets, every design keeps a minimalist, modern mood with a subtle vintage note.'}
        </p>
      </FadeIn>
      <FadeIn delay={200} className="order-1 md:order-2">
        <div className="relative p-4 border border-mocha-100 rounded-lg">
          <img src="https://public.readdy.ai/ai/img_res/31107d7838c235c0a0448ed48724ad1c.jpg" alt="Florist arranging flowers at Lamie shop" className="w-full rounded shadow-sm" />
        </div>
      </FadeIn>
    </div>
  </SectionWrapper>
);

export const WhyChoose: React.FC<{ lang: Lang }> = ({ lang }) => (
  <SectionWrapper className="bg-cream-50">
     <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          {
            vi: 'Hoa tuoi moi moi ngay',
            en: 'Fresh flowers daily'
          },
          {
            vi: 'Phong cach toi gian hien dai',
            en: 'Modern minimalist style'
          },
          {
            vi: 'Giao hoa nhanh toan TP.HCM',
            en: 'Same-day delivery in HCMC'
          }
        ].map((t, i) => (
          <FadeIn key={i} delay={i * 200} className="text-center p-8 border border-cream-200 bg-white rounded-lg">
            <div className="w-12 h-12 bg-cream-100 rounded-full mx-auto mb-6 flex items-center justify-center text-mocha-500">
              <LeafIcon className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-mocha-900 mb-3">{lang === 'vi' ? t.vi : t.en}</h3>
            <p className="font-body text-mocha-500 text-sm">
              {lang === 'vi'
                ? 'Tu khau chon hoa, phoi mau den dong goi, Lamie giu mot trai nghiem chin chu, mem mai va de tiep can.'
                : 'From curation and palette matching to wrapping, Lamie keeps the whole experience thoughtful, soft, and easy to enjoy.'}
            </p>
          </FadeIn>
        ))}
     </div>
  </SectionWrapper>
);
