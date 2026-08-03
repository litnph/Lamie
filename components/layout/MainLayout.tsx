
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ViewState } from '../../types/common';

interface MainLayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isLoggedIn?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, currentView, setView, isLoggedIn = false }) => {
  const isMinimal = currentView === 'login';
  return (
    <div className="flex min-h-[100dvh] w-full max-w-full flex-col overflow-x-hidden bg-[var(--color-canvas)]">
      <a href="#main-content" className="fixed left-4 top-3 z-[70] -translate-y-20 rounded-[var(--radius-sm)] bg-[var(--color-action-primary)] px-4 py-2 text-sm text-[var(--color-text-on-strong)] transition-transform focus:translate-y-0">
        Skip to content
      </a>
      {!isMinimal && <Header currentView={currentView} setView={setView} isLoggedIn={isLoggedIn} />}
      <main id="main-content" tabIndex={-1} className="w-full max-w-full flex-grow">{children}</main>
      {!isMinimal && <Footer />}
    </div>
  );
};
