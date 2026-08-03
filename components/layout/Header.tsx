import React, { useCallback, useState } from 'react';
import { ViewState } from '../../types/common';
import { LamieLogoIcon } from '../common/Icons';
import { PageContainer } from '../ui/PageContainer';
import { MobileMenu } from './MobileMenu';
import { PrimaryNavigation } from './Navigation';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isLoggedIn: boolean;
}

const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...props }) => (
  <button
    type="button"
    className={`inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-primary)] transition-[color,background-color,transform] duration-[var(--duration-fast)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-accent)] active:translate-y-px ${className}`}
    {...props}
  />
);

export const Header: React.FC<HeaderProps> = ({ currentView, setView, isLoggedIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useCallback((view: ViewState) => {
    setIsMobileMenuOpen(false);
    setView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setView]);

  const accountView: ViewState = isLoggedIn ? 'member' : 'login';

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--color-border-subtle)] bg-[color:rgb(255_254_250/0.9)] backdrop-blur-xl">
        <PageContainer size="wide" className="grid h-20 grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="group flex w-fit items-center gap-3 rounded-[var(--radius-sm)] text-left"
            aria-label="Lamie home"
          >
            <LamieLogoIcon className="h-10 w-10 text-[var(--color-action-primary)] transition-transform duration-[var(--duration-slow)] ease-[var(--ease-enter)] group-hover:rotate-6" />
            <span className="flex flex-col">
              <span className="font-serif text-2xl leading-none tracking-[-0.025em] text-[var(--color-text-primary)]">Lamie</span>
              <span className="mt-1 hidden text-[10px] tracking-[0.16em] text-[var(--color-text-muted)] sm:block">Flower shop</span>
            </span>
          </button>

          <PrimaryNavigation currentView={currentView} onNavigate={navigate} className="hidden md:flex" />

          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <IconButton onClick={() => navigate('shop')} aria-label="Open flower shop" className="relative">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-action-primary)] px-1 text-[9px] leading-none text-[var(--color-text-on-strong)]">2</span>
            </IconButton>

            <button
              type="button"
              onClick={() => navigate(accountView)}
              className="hidden min-h-11 items-center gap-2 rounded-[var(--radius-sm)] px-3 text-sm text-[var(--color-text-primary)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-accent)] sm:flex"
              aria-label={isLoggedIn ? 'Open my account' : 'Log in or register'}
            >
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="hidden lg:inline">{isLoggedIn ? 'My account' : 'Sign in'}</span>
            </button>

            <IconButton
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              className="md:hidden"
            >
              <span aria-hidden="true" className="flex w-5 flex-col gap-1.5">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-3/4 self-end bg-current" />
              </span>
            </IconButton>
          </div>
        </PageContainer>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        currentView={currentView}
        isLoggedIn={isLoggedIn}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={navigate}
      />
    </>
  );
};
