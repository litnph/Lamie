import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const readProjectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('global design tokens expose the approved Lamie foundations', async () => {
  const styles = await readProjectFile('styles.css');
  const requiredTokens = [
    '--paper', '--ink', '--mocha', '--sage', '--rose', '--focus', '--font-display',
    '--font-body', '--page-x', '--section-y', '--radius-sm', '--shadow-soft', '--container-wide',
  ];
  for (const token of requiredTokens) assert.match(styles, new RegExp(token), `Missing required token: ${token}`);
});

test('document language, metadata and licensed font candidates are explicit', async () => {
  const html = await readProjectFile('index.html');
  assert.match(html, /<html lang="vi">/);
  assert.match(html, /name="description"/);
  assert.match(html, /family=Be\+Vietnam\+Pro/);
  assert.match(html, /family=Lora/);
  assert.doesNotMatch(html, /cdn\.tailwindcss\.com|type="importmap"/);
});

test('reduced motion, focus, target size and responsive safeguards are global', async () => {
  const styles = await readProjectFile('styles.css');
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /min-height:\s*2\.75rem/);
  assert.match(styles, /max-width:\s*1023px/);
  assert.match(styles, /max-width:\s*767px/);
  assert.match(styles, /max-width:\s*389px/);
});

test('application shell exposes real routes and removes fake commerce from the active tree', async () => {
  const [app, router, header] = await Promise.all([
    readProjectFile('App.tsx'),
    readProjectFile('app/router.ts'),
    readProjectFile('components/storefront/SiteHeader.tsx'),
  ]);
  assert.match(app, /skip-link/);
  assert.match(app, /ContactDialog/);
  assert.match(router, /\/mau-hoa/);
  assert.match(router, /popstate/);
  assert.match(header, /aria-label="Điều hướng chính"/);
  assert.doesNotMatch(app, /ChatBox|Login|Member|cart|lamie_token/);
});

test('dialogs provide Escape, focus trapping, focus restoration and body scroll lock', async () => {
  const dialog = await readProjectFile('components/storefront/Dialog.tsx');
  assert.match(dialog, /aria-modal="true"/);
  assert.match(dialog, /event\.key === 'Escape'/);
  assert.match(dialog, /event\.key !== 'Tab'/);
  assert.match(dialog, /returnFocusRef\.current\?\.focus/);
  assert.match(dialog, /document\.body\.style\.overflow = 'hidden'/);
});

test('editorial concept assets are optimized and wired without impersonating catalog products', async () => {
  const assetPaths = [
    'public/images/editorial/hero-botanical-editorial.webp',
    'public/images/editorial/story-florist-craft.webp',
    'public/images/editorial/category-fresh-flowers.webp',
    'public/images/editorial/category-lasting-flowers.webp',
    'public/images/editorial/product-placeholder.webp',
  ];
  const sizes = await Promise.all(assetPaths.map((path) => stat(new URL(`../${path}`, import.meta.url))));
  for (const asset of sizes) {
    assert.ok(asset.size > 50_000, 'Concept asset is unexpectedly small or empty');
    assert.ok(asset.size < 250_000, 'Concept asset should remain below 250 kB');
  }

  const [home, productVisual, styles] = await Promise.all([
    readProjectFile('pages/storefront/HomePage.tsx'),
    readProjectFile('components/storefront/ProductVisual.tsx'),
    readProjectFile('styles.css'),
  ]);
  assert.match(home, /Ảnh concept tạo mới/);
  assert.match(home, /hero-botanical-editorial\.webp/);
  assert.match(home, /story-florist-craft\.webp/);
  assert.match(styles, /category-fresh-flowers\.webp/);
  assert.match(styles, /category-lasting-flowers\.webp/);
  assert.match(productVisual, /product-placeholder\.webp/);
});
