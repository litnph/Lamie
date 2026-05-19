
import React, { useEffect, useState } from 'react';
import { Hero } from '../sections/home/Hero';
import { About, WhyChoose } from '../sections/home/Content';
import { Collections } from '../sections/home/Collections';
import { Contact } from '../sections/home/Contact';
import { Gallery } from '../sections/home/Gallery';
import { FlowerProduct } from '../features/product/product.type';

interface HomeProps {
  products: FlowerProduct[];
  onNavigate: (view: string, product?: FlowerProduct) => void;
}

const SECTIONS = ['home', 'about', 'collections', 'gallery', 'contact'];
type Lang = 'vi' | 'en';

const Home: React.FC<HomeProps> = ({ products, onNavigate }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [lang, setLang] = useState<Lang>('vi');

  const labels: Record<Lang, Record<string, string>> = {
    vi: {
      home: 'Trang chủ',
      about: 'Câu chuyện',
      collections: 'Bộ sưu tập',
      gallery: 'Thư viện',
      contact: 'Liên hệ',
      jumpTo: 'Đi đến',
      language: 'Ngôn ngữ'
    },
    en: {
      home: 'Home',
      about: 'Story',
      collections: 'Collections',
      gallery: 'Gallery',
      contact: 'Contact',
      jumpTo: 'Jump to',
      language: 'Language'
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const sectionIcon: Record<string, React.ReactNode> = {
    home: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V10.5z" />
      </svg>
    ),
    about: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 10v6" />
        <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    collections: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="7" height="7" rx="1.5" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" />
      </svg>
    ),
    gallery: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 16l-5-4-4 3-3-2-6 5" />
      </svg>
    ),
    contact: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" />
      </svg>
    )
  };

  return (
    <div className="relative">
      <div className="fixed right-3 md:right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-3">
        <div className="bg-white/85 backdrop-blur-md border border-cream-200 shadow-sm rounded-full p-0.5 inline-flex">
            <button
              onClick={() => setLang('vi')}
              className={`px-2.5 py-1 text-[10px] rounded-full transition-colors ${
                lang === 'vi' ? 'bg-mocha-800 text-white' : 'text-mocha-500 hover:text-mocha-800'
              }`}
              aria-label="Switch language to Vietnamese"
            >
              VI
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 text-[10px] rounded-full transition-colors ${
                lang === 'en' ? 'bg-mocha-800 text-white' : 'text-mocha-500 hover:text-mocha-800'
              }`}
              aria-label="Switch language to English"
            >
              EN
            </button>
        </div>

        <div className="flex flex-col gap-2">
          {SECTIONS.map((id) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="group relative"
              aria-label={`Scroll to ${id}`}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-sm backdrop-blur-sm transition-all duration-300 ${
                  activeSection === id
                    ? 'bg-mocha-800 text-white border-mocha-800'
                    : 'bg-white/90 text-mocha-700 border-cream-200 hover:border-mocha-300'
                }`}
              >
                {sectionIcon[id]}
              </span>
              <span className="absolute right-10 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] px-2 py-1 rounded-md bg-mocha-900 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {labels[lang][id]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="animate-fade-in-up">
        <Hero lang={lang} onShopClick={() => onNavigate('shop')} />
        <About lang={lang} />
        <Collections lang={lang} products={products} onProductClick={(p) => onNavigate('product', p)} />
        <Gallery lang={lang} />
        <WhyChoose lang={lang} />
        <Contact lang={lang} />
      </div>
    </div>
  );
};

export default Home;
