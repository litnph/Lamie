import { chromium } from 'playwright-core';

const executablePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const baseUrl = process.env.LAMIE_PREVIEW_URL ?? 'http://127.0.0.1:4173';
const baseOrigin = new URL(baseUrl).origin;
const cases = [
  { path: '/', expected: 'home', readySelector: '.hero' },
  { path: '/mau-hoa', expected: 'empty-catalog', readySelector: '.honest-empty' },
  { path: '/mau-hoa/mau-demo-01', expected: 'missing-product', readySelector: '.not-found-page h1' },
  { path: '/duong-dan-khong-ton-tai', expected: 'not-found', readySelector: '.not-found-page' },
];

const browser = await chromium.launch({ executablePath, headless: true });
const report = [];
let failed = false;

try {
  for (const item of cases) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce', locale: 'vi-VN' });
    const errors = [];
    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(`console: ${message.text()}`);
    });
    page.on('response', (response) => {
      if (new URL(response.url()).origin === baseOrigin && response.status() >= 400) {
        errors.push(`response ${response.status()}: ${response.url()}`);
      }
    });

    const response = await page.goto(`${baseUrl}${item.path}`, { waitUntil: 'domcontentloaded' });
    await page.locator('main#main-content').waitFor({ state: 'visible' });
    await page.locator(item.readySelector).waitFor({ state: 'visible' });
    if (response?.status() !== 200) errors.push(`document status: ${response?.status() ?? 'none'}`);
    if (await page.locator('.preview-notice, .demo-flag').count()) errors.push('demo marker rendered in production');
    if ((await page.locator('.product-card').count()) > 0) errors.push('demo product card rendered in production');

    if (item.expected === 'empty-catalog' && !(await page.locator('.honest-empty').isVisible())) {
      errors.push('production catalog empty state missing');
    }
    if (item.expected === 'missing-product' && !(await page.locator('.not-found-page h1').isVisible())) {
      errors.push('missing product state missing');
    }
    if (item.expected === 'not-found' && !(await page.locator('.not-found-page').isVisible())) {
      errors.push('404 state missing');
    }

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    if (dimensions.scrollWidth > dimensions.clientWidth + 1) errors.push(`horizontal overflow ${dimensions.scrollWidth - dimensions.clientWidth}px`);
    report.push({ ...item, title: await page.title(), ...dimensions, errors });
    if (errors.length) failed = true;
    await page.close();
  }
} finally {
  await browser.close();
}

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (failed) process.exitCode = 1;
