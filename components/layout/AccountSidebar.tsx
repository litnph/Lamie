import React from 'react';

interface AccountSidebarProps {
  onLogout: () => void;
}

const accountItems = ['Dashboard', 'My Orders', 'Addresses', 'Wishlist', 'Account Details'];

export const AccountSidebar: React.FC<AccountSidebarProps> = ({ onLogout }) => (
  <aside aria-label="Account navigation" className="lg:col-span-3">
    <div className="flex items-center gap-4 border-b border-[var(--color-border-subtle)] pb-6 md:block">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface-subtle)] md:mb-4 md:h-20 md:w-20">
        <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Sophie Lenoir" className="h-full w-full object-cover" />
      </div>
      <div>
        <h2 className="font-serif text-2xl text-[var(--color-text-primary)]">Sophie Lenoir</h2>
        <p className="text-sm text-[var(--color-text-muted)]">Member since 2023</p>
      </div>
    </div>

    <nav aria-label="Account sections" className="-mx-1 mt-4 flex gap-1 overflow-x-auto px-1 pb-2 md:mx-0 md:mt-6 md:flex-col md:overflow-visible md:px-0">
      {accountItems.map((item, index) => (
        <button
          key={item}
          type="button"
          aria-current={index === 0 ? 'page' : undefined}
          className={`min-h-11 shrink-0 rounded-[var(--radius-sm)] px-4 text-left text-sm font-medium transition-colors duration-[var(--duration-fast)] md:w-full ${index === 0 ? 'bg-[var(--color-action-primary)] text-[var(--color-text-on-strong)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]'}`}
        >
          {item}
        </button>
      ))}
      <button
        type="button"
        onClick={onLogout}
        className="min-h-11 shrink-0 rounded-[var(--radius-sm)] px-4 text-left text-sm font-medium text-[var(--color-danger-text)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-danger-bg)] md:mt-3 md:w-full"
      >
        Logout
      </button>
    </nav>
  </aside>
);
