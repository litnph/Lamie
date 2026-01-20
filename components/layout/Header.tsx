
import React, { useState } from 'react';
import { ViewState } from '../../types/common';
import { LamieLogoIcon } from '../common/Icons';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView, isLoggedIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', action: () => handleHomeScroll('home') },
    { label: 'Shop', action: () => setView('shop'), isActive: currentView === 'shop' },
    { label: 'Story', action: () => handleHomeScroll('about') },
    { label: 'Gallery', action: () => handleHomeScroll('gallery') },
    { label: 'Contact', action: () => handleHomeScroll('contact') },
  ];

  const handleHomeScroll = (elementId: string) => {
    setIsMobileMenuOpen(false);
    if (currentView !== 'home') {
      setView('home');
      // Allow time for render before scrolling
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(elementId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${currentView === 'home' ? 'bg-white/80 backdrop-blur-md border-b border-transparent' : 'bg-white border-b border-cream-200'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        
        {/* Mobile Toggle */}
        <button className="md:hidden text-mocha-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>

        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => handleHomeScroll('home')}
        >
          <LamieLogoIcon className="w-10 h-10 text-mocha-800 transition-transform group-hover:rotate-12" />
          <span className="font-serif text-2xl tracking-wide text-mocha-900">Lamie</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className={`text-sm uppercase tracking-widest font-bold transition-colors ${
                item.isActive ? 'text-mocha-900 border-b border-mocha-900' : 'text-mocha-400 hover:text-mocha-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setView('shop')}
            className="text-mocha-900 hover:text-mocha-500 transition-colors relative"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span className="absolute -top-1 -right-2 bg-mocha-800 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">2</span>
          </button>
          
          <button 
            onClick={() => setView(isLoggedIn ? 'member' : 'login')}
            className="text-mocha-900 hover:text-mocha-500 transition-colors flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {isLoggedIn && <span className="hidden md:inline text-xs font-bold uppercase tracking-wide">My Account</span>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 z-50 bg-white transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center border-b border-cream-200">
          <span className="font-serif text-2xl text-mocha-900">Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)}>✕</button>
        </div>
        <nav className="p-6 flex flex-col gap-6">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="text-left font-serif text-2xl text-mocha-900"
            >
              {item.label}
            </button>
          ))}
          <div className="h-[1px] bg-cream-200 w-full my-2"></div>
          <button onClick={() => { setIsMobileMenuOpen(false); setView(isLoggedIn ? 'member' : 'login'); }} className="text-left font-serif text-2xl text-mocha-900">
            {isLoggedIn ? 'My Account' : 'Login / Register'}
          </button>
        </nav>
      </div>
    </header>
  );
};
