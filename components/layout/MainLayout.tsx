
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
    <div className="min-h-screen flex flex-col bg-cream-50 selection:bg-mocha-100">
      {!isMinimal && <Header currentView={currentView} setView={setView} isLoggedIn={isLoggedIn} />}
      <main className="flex-grow">{children}</main>
      {!isMinimal && <Footer />}
    </div>
  );
};
