import React, { useEffect, useState } from 'react';
import { Hero } from '../sections/home/Hero';
import { About, WhyChoose } from '../sections/home/Content';
import { Collections } from '../sections/home/Collections';
import { Contact } from '../sections/home/Contact';
import { Gallery } from '../sections/home/Gallery';
import { CatalogState, FlowerProduct } from '../features/product/product.type';
import { ViewState } from '../types/common';

interface HomeProps {
  catalog: CatalogState;
  onRetry: () => void;
  onNavigate: (view: ViewState, product?: FlowerProduct) => void;
}

const SECTIONS = ['home', 'about', 'collections', 'gallery', 'contact'];
type Lang = 'vi' | 'en';

const Home: React.FC<HomeProps> = ({ catalog, onRetry, onNavigate }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [lang, setLang] = useState<Lang>('vi');

  const labels: Record<Lang, Record<string, string>> = {
    vi: {
      home: 'Trang chủ',
      about: 'Câu chuyện',
      collections: 'Bộ sưu tập',
      gallery: 'Thư viện',
      contact: 'Liên hệ',
    },
    en: {
      home: 'Home',
      about: 'Story',
      collections: 'Collections',
      gallery: 'Gallery',
      contact: 'Contact',
    },
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 },
    );

    SECTIONS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [lang]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const sectionIcon: Record<string, React.ReactNode> = {
    home: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V10.5z" /></svg>,
    about: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 10v6" /><circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" /></svg>,
    collections: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></svg>,
    gallery: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 16l-5-4-4 3-3-2-6 5" /></svg>,
    contact: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" /></svg>,
  };

  return (
    <div className="relative">
      <div className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 md:right-4 md:flex">
        <div className="inline-flex rounded-[var(--radius-pill)] border border-[var(--color-border-subtle)] bg-[color:rgb(255_254_250/0.88)] p-0.5 shadow-[var(--shadow-xs)] backdrop-blur-md" role="group" aria-label={lang === 'vi' ? 'Ngôn ngữ' : 'Language'}>
          {(['vi', 'en'] as const).map((language) => (
            <button
              type="button"
              key={language}
              onClick={() => setLang(language)}
              aria-pressed={lang === language}
              className={`min-h-8 rounded-[var(--radius-pill)] px-2.5 py-1 text-[11px] font-medium uppercase transition-colors ${lang === language ? 'bg-[var(--color-action-primary)] text-[var(--color-text-on-strong)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}
            >
              {language}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2" aria-label={lang === 'vi' ? 'Đi đến phần' : 'Jump to section'} role="navigation">
          {SECTIONS.map((id) => (
            <button type="button" key={id} onClick={() => scrollToSection(id)} className="group relative" aria-label={`${lang === 'vi' ? 'Đi đến' : 'Scroll to'} ${labels[lang][id]}`} aria-current={activeSection === id ? 'location' : undefined}>
              <span className={`flex h-8 w-8 items-center justify-center rounded-[var(--radius-pill)] border shadow-[var(--shadow-xs)] backdrop-blur-sm transition-colors duration-[var(--duration-base)] ${activeSection === id ? 'border-[var(--color-action-primary)] bg-[var(--color-action-primary)] text-[var(--color-text-on-strong)]' : 'border-[var(--color-border-subtle)] bg-[color:rgb(255_254_250/0.9)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]'}`}>{sectionIcon[id]}</span>
              <span className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-[var(--radius-sm)] bg-[var(--color-text-primary)] px-2 py-1 text-[11px] text-[var(--color-text-on-strong)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{labels[lang][id]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="animate-fade-in-up">
        <Hero lang={lang} onShopClick={() => onNavigate('shop')} />
        <About lang={lang} />
        <Collections
          lang={lang}
          catalog={catalog}
          onRetry={onRetry}
          onViewAll={() => onNavigate('shop')}
          onProductClick={(product) => onNavigate('product', product)}
        />
        <Gallery lang={lang} />
        <WhyChoose lang={lang} />
        <Contact lang={lang} />
      </div>
    </div>
  );
};

export default Home;
