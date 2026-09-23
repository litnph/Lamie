import { useCallback, useEffect, useState } from 'react';

export type AppRoute =
  | { name: 'home' }
  | { name: 'catalog' }
  | { name: 'product'; slug: string }
  | { name: 'not-found' };

export interface BrowserLocation {
  pathname: string;
  search: string;
  hash: string;
  route: AppRoute;
}

export const parseRoute = (pathname: string): AppRoute => {
  const normalized = pathname !== '/' ? pathname.replace(/\/+$/, '') : pathname;
  if (normalized === '/') return { name: 'home' };
  if (normalized === '/mau-hoa') return { name: 'catalog' };
  const match = normalized.match(/^\/mau-hoa\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  if (match) return { name: 'product', slug: match[1] };
  return { name: 'not-found' };
};

const readLocation = (): BrowserLocation => ({
  pathname: window.location.pathname,
  search: window.location.search,
  hash: window.location.hash,
  route: parseRoute(window.location.pathname),
});

export interface NavigateOptions {
  replace?: boolean;
  preserveScroll?: boolean;
}

export const useBrowserRouter = () => {
  const [location, setLocation] = useState<BrowserLocation>(readLocation);

  useEffect(() => {
    const handlePopState = () => setLocation(readLocation());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, options: NavigateOptions = {}) => {
    const url = new URL(to, window.location.origin);
    const next = `${url.pathname}${url.search}${url.hash}`;
    if (options.replace) window.history.replaceState({}, '', next);
    else window.history.pushState({}, '', next);
    setLocation(readLocation());

    if (!options.preserveScroll) {
      if (url.hash) {
        window.requestAnimationFrame(() => {
          document.querySelector(url.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    }
  }, []);

  return { location, navigate };
};
