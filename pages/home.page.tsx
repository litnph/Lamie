
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

const Home: React.FC<HomeProps> = ({ products, onNavigate }) => {
  const [activeSection, setActiveSection] = useState('home');

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

  return (
    <div className="relative">
      {/* Quick Nav Dots */}
      <div className="fixed right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-40 hidden md:flex flex-col gap-4">
        {SECTIONS.map((id) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className="group flex items-center gap-2 justify-end"
            aria-label={`Scroll to ${id}`}
          >
            <span className={`text-[10px] uppercase font-bold tracking-widest text-mocha-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
              {id}
            </span>
            <div 
              className={`w-2 h-2 rounded-full border border-mocha-800 transition-all duration-300 ${activeSection === id ? 'bg-mocha-800 scale-125' : 'bg-transparent hover:bg-mocha-800/50'}`} 
            />
          </button>
        ))}
      </div>

      <div className="animate-fade-in-up">
        <Hero onShopClick={() => onNavigate('shop')} />
        <About />
        <Collections products={products} onProductClick={(p) => onNavigate('product', p)} />
        <Gallery />
        <WhyChoose />
        <Contact />
      </div>
    </div>
  );
};

export default Home;
