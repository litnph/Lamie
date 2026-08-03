import React, { useEffect, useRef } from 'react';
import { ViewState } from '../../types/common';
import { LamieLogoIcon } from '../common/Icons';
import { PrimaryNavigation } from './Navigation';

interface MobileMenuProps {
  isOpen: boolean;
  currentView: ViewState;
  isLoggedIn: boolean;
  onClose: () => void;
  onNavigate: (view: ViewState) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, currentView, isLoggedIn, onClose, onNavigate }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      ) as HTMLElement[];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <div className={`fixed inset-0 z-50 md:hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!isOpen} inert={!isOpen}>
      <button
        type="button"
        aria-label="Close navigation menu"
        tabIndex={-1}
        onClick={onClose}
        className={`absolute inset-0 bg-[var(--color-overlay)] transition-opacity duration-[var(--duration-base)] ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        ref={panelRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`absolute right-0 top-0 flex h-[100dvh] w-[min(88vw,24rem)] flex-col border-l border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-lg)] transition-transform duration-[var(--duration-slow)] ease-[var(--ease-enter)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-5">
          <div className="flex items-center gap-2">
            <LamieLogoIcon className="h-8 w-8 text-[var(--color-action-primary)]" />
            <span className="font-serif text-xl text-[var(--color-text-primary)]">Lamie</span>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="relative h-11 w-11 rounded-[var(--radius-sm)] text-[var(--color-text-primary)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-surface-subtle)]"
            aria-label="Close navigation menu"
          >
            <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
            <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
          </button>
        </div>

        <PrimaryNavigation currentView={currentView} onNavigate={onNavigate} orientation="vertical" className="mt-8 flex" />

        <div className="mt-auto border-t border-[var(--color-border-subtle)] pt-5">
          <button
            type="button"
            onClick={() => onNavigate(isLoggedIn ? 'member' : 'login')}
            className="flex min-h-14 w-full items-center justify-between rounded-[var(--radius-sm)] px-4 text-left text-sm font-medium text-[var(--color-text-primary)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-surface-subtle)]"
          >
            <span>{isLoggedIn ? 'My account' : 'Login / Register'}</span>
            <span aria-hidden="true">→</span>
          </button>
          <p className="px-4 pt-5 text-xs leading-relaxed text-[var(--color-text-muted)]">Fresh flowers delivered across Ho Chi Minh City.</p>
        </div>
      </aside>
    </div>
  );
};
