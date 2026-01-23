
import React from 'react';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { FadeIn } from '../../components/ui/FadeIn';
import { LeafIcon } from '../../components/common/Icons';

export const About: React.FC = () => (
  <SectionWrapper id="about" className="bg-white">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
      <FadeIn className="order-2 md:order-1 space-y-8">
        <span className="text-xs uppercase tracking-widest text-mocha-300 font-bold">The Story</span>
        <h2 className="font-serif text-5xl text-mocha-900">Flowers <br />From The Heart.</h2>
        <div className="h-[1px] w-16 bg-mocha-800"></div>
        <p className="font-body text-mocha-600 text-lg leading-relaxed">Lamie doesn't just sell flowers; we convey gentle emotions through every twig and leaf. With refined aesthetics, each creation is a whisper of the soul.</p>
      </FadeIn>
      <FadeIn delay={200} className="order-1 md:order-2">
        <div className="relative p-4 border border-mocha-100 rounded-lg">
          <img src="https://public.readdy.ai/ai/img_res/31107d7838c235c0a0448ed48724ad1c.jpg" alt="Florist arranging flowers at Lamie shop" className="w-full rounded shadow-sm" />
        </div>
      </FadeIn>
    </div>
  </SectionWrapper>
);

export const WhyChoose: React.FC = () => (
  <SectionWrapper className="bg-cream-50">
     <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {["Fresh Selection", "Artistic Design", "Eco-Friendly"].map((t, i) => (
          <FadeIn key={i} delay={i * 200} className="text-center p-8 border border-cream-200 bg-white rounded-lg">
            <div className="w-12 h-12 bg-cream-100 rounded-full mx-auto mb-6 flex items-center justify-center text-mocha-500">
              <LeafIcon className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-mocha-900 mb-3">{t}</h3>
            <p className="font-body text-mocha-500 text-sm">We are committed to bringing the best experience to our customers through every product.</p>
          </FadeIn>
        ))}
     </div>
  </SectionWrapper>
);
