import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const executablePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const baseUrl = process.env.LAMIE_QA_URL ?? 'http://127.0.0.1:3000';
const outputDir = new URL('../.impeccable/review/', import.meta.url);

const allCases = [
  { name: 'desktop', path: '/', width: 1440, height: 1000 },
  { name: 'laptop-1024-catalog', path: '/mau-hoa?dip=Sinh%20nh%E1%BA%ADt', width: 1024, height: 900 },
  { name: 'tablet-768-catalog', path: '/mau-hoa?dong=hoa-tuoi', width: 768, height: 1024 },
  { name: 'mobile', path: '/', width: 390, height: 844 },
  { name: 'mobile-360-detail', path: '/mau-hoa/mau-demo-01', width: 360, height: 800 },
];
const requestedCases = new Set((process.env.LAMIE_QA_CASES ?? '').split(',').filter(Boolean));
const cases = requestedCases.size ? allCases.filter((item) => requestedCases.has(item.name)) : allCases;

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
const report = [];
let failed = false;

try {
  for (const item of cases) {
    const context = await browser.newContext({
      viewport: { width: item.width, height: item.height },
      reducedMotion: 'reduce',
      colorScheme: 'light',
      locale: 'vi-VN',
    });
    const page = await context.newPage();
    page.setDefaultTimeout(15_000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(`console: ${message.text()}`);
    });
    page.on('response', (response) => {
      if (response.status() >= 400) errors.push(`response ${response.status()}: ${response.url()}`);
    });
    page.on('requestfailed', (request) => {
      errors.push(`request failed: ${request.url()} (${request.failure()?.errorText ?? 'unknown error'})`);
    });

    await page.goto(`${baseUrl}${item.path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 8_000 }).catch(() => undefined);
    await page.locator('main#main-content').waitFor({ state: 'visible' });
    await page.evaluate(async () => {
      await Promise.race([document.fonts.ready, new Promise((resolve) => window.setTimeout(resolve, 3_000))]);
      const scrollHeight = document.documentElement.scrollHeight;
      for (let top = 0; top < scrollHeight; top += Math.max(window.innerHeight * 0.8, 480)) {
        window.scrollTo(0, top);
        await new Promise((resolve) => window.setTimeout(resolve, 40));
      }
      window.scrollTo(0, 0);
      await Promise.race([
        Promise.all(Array.from(document.images).map((image) => image.decode().catch(() => undefined))),
        new Promise((resolve) => window.setTimeout(resolve, 8_000)),
      ]);
      window.scrollTo(0, 0);
    });

    if (item.name === 'desktop') {
      const trigger = page.getByRole('button', { name: /Tư vấn đặt hoa/ });
      await trigger.click();
      await page.getByRole('dialog', { name: 'Liên hệ cùng Lamie' }).waitFor();
      const channelCount = await page.locator('.channel-grid > button').count();
      if (channelCount !== 5) errors.push(`contact channel count: expected 5, received ${channelCount}`);
      await page.keyboard.press('Escape');
      if (!(await trigger.evaluate((element) => element === document.activeElement))) errors.push('contact dialog did not restore focus');
    }

    if (item.name === 'tablet-768-catalog') {
      const trigger = page.getByRole('button', { name: /Bộ lọc/ });
      await trigger.click();
      await page.getByRole('dialog', { name: /Bộ lọc/ }).waitFor();
      await page.keyboard.press('Escape');
      if (!(await trigger.evaluate((element) => element === document.activeElement))) errors.push('filter sheet did not restore focus');
    }

    if (item.name === 'laptop-1024-catalog') {
      const quickView = page.getByRole('button', { name: 'Xem nhanh' }).first();
      await quickView.click();
      await page.getByRole('dialog', { name: 'Xem nhanh mẫu hoa' }).waitFor();
      await page.keyboard.press('Escape');
    }

    if (item.name === 'mobile-360-detail') {
      const stickyCta = page.locator('.mobile-sticky-cta');
      if (await stickyCta.evaluate((element) => getComputedStyle(element).visibility !== 'hidden')) errors.push('mobile CTA is visible before the product heading is readable');
      await page.locator('#product-title').evaluate((element) => {
        window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 120, behavior: 'instant' });
      });
      await page.locator('.mobile-sticky-cta--visible').waitFor();
      const overlapsHeading = await page.evaluate(() => {
        const heading = document.querySelector('#product-title')?.getBoundingClientRect();
        const cta = document.querySelector('.mobile-sticky-cta')?.getBoundingClientRect();
        return Boolean(heading && cta && heading.bottom > cta.top && heading.top < cta.bottom);
      });
      if (overlapsHeading) errors.push('mobile CTA overlaps the product heading');
    }

    const metrics = await page.evaluate(() => {
      const root = document.documentElement;
      const heading = document.querySelector('.hero h1');
      const catalogGrid = document.querySelector('.catalog-product-grid');
      let heroLines = null;
      if (heading) {
        const style = getComputedStyle(heading);
        const lineHeight = Number.parseFloat(style.lineHeight);
        heroLines = Math.round(heading.getBoundingClientRect().height / lineHeight);
      }
      return {
        title: document.title,
        clientWidth: root.clientWidth,
        scrollWidth: root.scrollWidth,
        fullHeight: root.scrollHeight,
        heroLines,
        footerVisible: Boolean(document.querySelector('footer')),
        catalogColumns: catalogGrid ? getComputedStyle(catalogGrid).gridTemplateColumns.split(' ').length : null,
      };
    });

    if (metrics.scrollWidth > metrics.clientWidth + 1) errors.push(`horizontal overflow ${metrics.scrollWidth - metrics.clientWidth}px`);
    if (!metrics.footerVisible) errors.push('footer missing');
    if (item.name === 'desktop' && metrics.heroLines !== null && metrics.heroLines > 2) errors.push(`desktop hero has ${metrics.heroLines} lines`);
    if (item.name === 'mobile' && metrics.heroLines !== null && metrics.heroLines > 3) errors.push(`mobile hero has ${metrics.heroLines} lines`);
    if (item.name === 'tablet-768-catalog' && metrics.catalogColumns !== 2) errors.push(`tablet catalog has ${metrics.catalogColumns} columns`);

    const screenshotPath = new URL(`${item.name}.png`, outputDir);
    await page.screenshot({ path: screenshotPath.pathname.slice(1), fullPage: item.name !== 'mobile-360-detail', animations: 'disabled' });
    report.push({ ...item, ...metrics, errors });
    if (errors.length) failed = true;
    await context.close();
  }
} finally {
  await browser.close();
}

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (failed) process.exitCode = 1;
