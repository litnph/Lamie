import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readProjectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('global design tokens expose every Phase 1 foundation', async () => {
  const html = await readProjectFile('index.html');
  const requiredTokens = [
    '--color-canvas',
    '--color-text-primary',
    '--color-focus',
    '--font-display',
    '--text-heading-1',
    '--space-page-x',
    '--space-section-y',
    '--radius-sm',
    '--shadow-sm',
    '--container-content',
    '--duration-fast',
  ];

  for (const token of requiredTokens) {
    assert.match(html, new RegExp(token), `Missing required token: ${token}`);
  }
});

test('Phase 1 primitives use semantic foundation classes and states', async () => {
  const [button, formControls, card, container] = await Promise.all([
    readProjectFile('components/common/Button.tsx'),
    readProjectFile('components/ui/FormControls.tsx'),
    readProjectFile('components/ui/Card.tsx'),
    readProjectFile('components/ui/PageContainer.tsx'),
  ]);

  assert.match(button, /color-action-primary/);
  assert.match(button, /focus-visible/);
  assert.match(button, /aria-busy/);
  assert.match(formControls, /lamie-control/);
  assert.match(formControls, /aria-invalid/);
  assert.match(card, /lamie-card/);
  assert.match(container, /lamie-page-container/);
});

test('reduced motion and responsive container safeguards are global', async () => {
  const html = await readProjectFile('index.html');

  assert.match(html, /prefers-reduced-motion:\s*reduce/);
  assert.match(html, /calc\(100% - \(2 \* var\(--space-page-x\)\)\)/);
});

test('application shell exposes accessible navigation landmarks', async () => {
  const [mainLayout, header, mobileMenu, sidebar] = await Promise.all([
    readProjectFile('components/layout/MainLayout.tsx'),
    readProjectFile('components/layout/Header.tsx'),
    readProjectFile('components/layout/MobileMenu.tsx'),
    readProjectFile('components/layout/AccountSidebar.tsx'),
  ]);

  assert.match(mainLayout, /Skip to content/);
  assert.match(mainLayout, /id="main-content"/);
  assert.match(header, /aria-controls="mobile-navigation"/);
  assert.match(mobileMenu, /aria-modal="true"/);
  assert.match(mobileMenu, /event\.key === 'Escape'/);
  assert.match(mobileMenu, /event\.key !== 'Tab'/);
  assert.match(mobileMenu, /inert={!isOpen}/);
  assert.match(sidebar, /aria-label="Account navigation"/);
});

test('member dashboard provides loading, empty, and responsive order states', async () => {
  const dashboard = await readProjectFile('pages/member.page.tsx');

  assert.match(dashboard, /DashboardSkeleton/);
  assert.match(dashboard, /DashboardError/);
  assert.match(dashboard, /No orders yet/);
  assert.match(dashboard, /aria-busy={isLoading}/);
  assert.match(dashboard, /caption className="sr-only">Recent orders/);
  assert.match(dashboard, /xl:hidden/);
  assert.match(dashboard, /hidden overflow-hidden[\s\S]*xl:block/);
});
