import React, { useState, useEffect } from 'react';
import { LamieLogoIcon, Button } from './Base';

interface HeaderProps {
  currentView: 'home' | 'shop' | 'product' | 'admin';
  setView: (view: 'home' | 'shop' | 'product' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // Scroll detection for navbar background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  // Scroll Spy Logic using IntersectionObserver
  useEffect(() => {
    if (currentView !== 'home') return;

    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Trigger when section is in middle of viewport
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['about', 'signature', 'gallery', 'contact'];
    
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [currentView]);

  const navLinks = [
    { name: 'Về Lamie', href: '#about', type: 'section' },
    { name: 'Sản Phẩm', href: '#shop', type: 'page' },
    { name: 'Dấu Ấn', href: '#signature', type: 'section' },
    { name: 'Thư Viện', href: '#gallery', type: 'section' },
  ];

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, link: { name: string, href: string, type: string }) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (link.type === 'page' && link.name === 'Sản Phẩm') {
      setView('shop');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If we are on shop or product page and click a section link, go home first
      if (currentView !== 'home') {
        setView('home');
        // Wait for render cycle then scroll
        setTimeout(() => {
          const element = document.querySelector(link.href);
          if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
          }
        }, 100);
      } else {
        // Already on home, just scroll
        const element = document.querySelector(link.href);
        if (element) {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSection('');
  };

  // Helper to determine if link is active
  const isLinkActive = (link: { name: string, href: string, type: string }) => {
    if (link.name === 'Sản Phẩm') {
      return currentView === 'shop' || currentView === 'product';
    }
    return currentView === 'home' && activeSection === link.href.replace('#', '');
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'bg-white/85 backdrop-blur-md py-3 shadow-sm border-b border-cream-200/50' 
          : 'bg-transparent py-5 md:py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo Area */}
          <a 
            href="#home" 
            onClick={handleLogoClick}
            className="flex items-center gap-3 group relative z-50"
          >
            <LamieLogoIcon className="w-9 h-9 md:w-10 md:h-10 text-mocha-800 transition-transform duration-700 group-hover:rotate-12" />
            <div className="flex flex-col">
              <span className="font-serif text-2xl md:text-3xl text-mocha-800 leading-none tracking-tight">Lamie</span>
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-mocha-300 ml-1">Flower Shop</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isLinkActive(link);
              return (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => handleNavigation(e, link)}
                  className={`font-body text-sm tracking-wide transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-mocha-800 after:transition-all after:duration-300 hover:after:w-full ${
                    active 
                      ? 'text-mocha-900 font-medium after:w-full' 
                      : 'text-mocha-800 after:w-0'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
            <a href="#contact" onClick={(e) => handleNavigation(e, {name: 'Liên Hệ', href: '#contact', type: 'section'})}>
              <Button 
                variant={activeSection === 'contact' ? 'primary' : 'outline'} 
                className={`px-6 py-2 text-xs rounded-md transition-all ${activeSection === 'contact' ? '' : 'border-mocha-300 hover:bg-mocha-800 hover:text-white'}`}
              >
                Liên Hệ
              </Button>
            </a>
          </nav>

          {/* Mobile Toggle Button */}
          <button 
            className="md:hidden text-mocha-800 p-2 -mr-2 focus:outline-none"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      <div 
        className={`fixed inset-0 bg-mocha-900/20 backdrop-blur-[2px] z-50 transition-opacity duration-500 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer (Refined & Slimmer) */}
      <div 
        className={`fixed top-0 right-0 h-full w-[75%] max-w-[280px] bg-cream-50 z-[60] shadow-xl transform transition-transform duration-700 cubic-bezier(0.19, 1, 0.22, 1) ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
         <div className="flex flex-col h-full p-6 md:p-8 relative">
            {/* Background Decor */}
            <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
                <LamieLogoIcon className="w-48 h-48 text-mocha-800" />
            </div>

            {/* Close Button (More minimal) */}
            <div className="flex justify-end mb-8">
                <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-mocha-400 hover:text-mocha-800 p-2 rounded-full hover:bg-cream-100 transition-colors"
                >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>

            {/* Logo inside Drawer */}
            <div className="flex flex-col items-center gap-2 mb-12 opacity-90">
               <LamieLogoIcon className="w-10 h-10 text-mocha-800" />
               <span className="font-serif text-lg text-mocha-800 tracking-wide">Lamie</span>
            </div>

            {/* Links (Refined typography) */}
            <nav className="flex flex-col items-center gap-7">
              {navLinks.map((link, idx) => {
                const active = isLinkActive(link);
                return (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    className={`font-serif text-xl tracking-wide transition-all relative group flex items-center gap-2 ${
                      active 
                        ? 'text-mocha-900 font-normal not-italic' 
                        : 'text-mocha-800 font-light italic hover:text-mocha-500'
                    }`}
                    onClick={(e) => handleNavigation(e, link)}
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  >
                    {/* Active Indicator Dot for Mobile */}
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-mocha-800 absolute -left-4"></span>}
                    
                    {link.name}
                    
                    {/* Underline for non-active hover state */}
                    {!active && (
                      <span className="absolute -bottom-1 left-1/2 w-0 h-[0.5px] bg-mocha-300 transition-all duration-300 -translate-x-1/2 group-hover:w-full"></span>
                    )}
                  </a>
                );
              })}
            </nav>

            {/* CTA (Lighter visual weight) */}
            <div className="mt-12 w-full">
               <a href="#contact" onClick={(e) => handleNavigation(e, {name: 'Liên Hệ', href: '#contact', type: 'section'})}>
                <Button 
                  variant={activeSection === 'contact' ? 'primary' : 'outline'}
                  className="w-full justify-center rounded-md py-3 text-xs"
                >
                    Đặt Hẹn Tư Vấn
                </Button>
              </a>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-6 text-center">
               <p className="font-body text-[10px] text-mocha-300 tracking-widest uppercase">© 2024 Lamie</p>
            </div>
         </div>
      </div>
    </>
  );
};

interface FooterProps {
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="bg-mocha-900 text-cream-100 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
             <LamieLogoIcon className="w-8 h-8 text-cream-100" />
             <span className="font-serif text-2xl">Lamie</span>
          </div>
          <p className="font-body text-mocha-100 text-sm leading-relaxed mb-6">
            Gói trọn những khoảnh khắc dịu dàng qua ngôn ngữ của loài hoa.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-6">Cửa Hàng</h4>
          <ul className="space-y-4 font-body text-sm text-mocha-100">
            <li><a href="#" className="hover:text-white transition-colors">Tất cả</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Gói dài hạn</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Dịp đặc biệt</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Workshop</a></li>
          </ul>
        </div>

        <div>
           <h4 className="font-serif text-lg mb-6">Công Ty</h4>
           <ul className="space-y-4 font-body text-sm text-mocha-100">
            <li><a href="#" className="hover:text-white transition-colors">Câu chuyện</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sự bền vững</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Điều khoản</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-6">Kết Nối</h4>
           <p className="font-body text-xs text-mocha-200 mb-4">
            Đăng ký để nhận cảm hứng và mẹo chăm sóc hoa hàng tuần.
          </p>
          <div className="flex border-b border-mocha-500 pb-2">
            <input 
              type="email" 
              placeholder="Địa chỉ email" 
              className="bg-transparent border-none focus:outline-none text-sm w-full text-cream-100 placeholder-mocha-500"
            />
            <button className="text-xs uppercase tracking-widest text-mocha-300 hover:text-white transition-colors">Gửi</button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-mocha-800 flex flex-col md:flex-row justify-between items-center text-[10px] text-mocha-300 uppercase tracking-widest">
        <span>© 2024 Tiệm Hoa Lamie. All rights reserved.</span>
        <div className="flex gap-6 mt-4 md:mt-0 items-center">
          <span>Instagram</span>
          <span>Pinterest</span>
          <span>Facebook</span>
          {onAdminClick && (
            <button 
              onClick={onAdminClick} 
              className="text-mocha-500 hover:text-mocha-300 transition-colors ml-4 cursor-pointer"
              title="Quản trị viên"
            >
              Quản trị
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
