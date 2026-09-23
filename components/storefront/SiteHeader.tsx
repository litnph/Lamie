import { useEffect, useState } from 'react';
import type { AppRoute } from '../../app/router';
import { AppLink } from './AppLink';
import { Dialog } from './Dialog';
import { ArrowIcon, FlowerMark, MenuIcon } from './Icons';

interface SiteHeaderProps {
  route: AppRoute;
  navigate: (to: string) => void;
  onContact: () => void;
}

const navItems = [
  { label: 'Trang chủ', href: '/', route: 'home' },
  { label: 'Mẫu hoa', href: '/mau-hoa', route: 'catalog' },
  { label: 'Quy trình', href: '/#quy-trinh', route: 'process' },
  { label: 'Liên hệ', href: '/#lien-he', route: 'contact' },
] as const;

export const SiteHeader = ({ route, navigate, onContact }: SiteHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => setCompact(window.scrollY > 32);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeRoute = route.name === 'product' ? 'catalog' : route.name;

  return (
    <>
      <header className={`site-header ${compact ? 'site-header--compact' : ''}`}>
        <div className="site-header__inner">
          <AppLink href="/" navigate={navigate} className="wordmark" aria-label="Lamie — Trang chủ">
            <FlowerMark className="wordmark__mark" />
            <span>
              <strong>Lamie</strong>
              <small>tiệm hoa · bản chữ chờ duyệt</small>
            </span>
          </AppLink>

          <nav className="desktop-nav" aria-label="Điều hướng chính">
            {navItems.map((item) => (
              <AppLink
                key={item.label}
                href={item.href}
                navigate={navigate}
                aria-current={item.route === activeRoute ? 'page' : undefined}
              >
                {item.label}
              </AppLink>
            ))}
          </nav>

          <div className="header-actions">
            <button type="button" className="button button--ink header-contact" onClick={onContact}>
              Tư vấn đặt hoa <ArrowIcon />
            </button>
            <button type="button" className="icon-button mobile-menu-button" onClick={() => setMenuOpen(true)} aria-label="Mở menu" aria-expanded={menuOpen}>
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <Dialog open={menuOpen} title="Điều hướng" onClose={() => setMenuOpen(false)} variant="sheet" className="mobile-nav-dialog">
        <nav className="mobile-nav" aria-label="Điều hướng trên điện thoại">
          {navItems.map((item) => (
            <AppLink key={item.label} href={item.href} navigate={(to) => { setMenuOpen(false); navigate(to); }}>
              {item.label}<ArrowIcon />
            </AppLink>
          ))}
          <button type="button" className="button button--ink" onClick={() => { setMenuOpen(false); onContact(); }}>Tư vấn đặt hoa</button>
        </nav>
      </Dialog>
    </>
  );
};
