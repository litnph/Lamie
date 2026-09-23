import { chromium } from 'playwright-core';

const executablePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const baseUrl = 'http://127.0.0.1:3000';
const browser = await chromium.launch({ executablePath, headless: true });
const output = {};

const setup = async (width, height, reducedMotion = 'no-preference') => {
  const context = await browser.newContext({ viewport: { width, height }, locale: 'vi-VN', reducedMotion, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  page.setDefaultTimeout(10_000);
  return { context, page };
};

const ready = async (page, path) => {
  await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    const main = document.querySelector('main#main-content');
    return Boolean(main && !main.classList.contains('page-loader'));
  });
  await page.waitForTimeout(150);
};

const count = async (page) => Number(await page.locator('.results-heading strong').textContent());

try {
  {
    const { context, page } = await setup(1440, 1000);
    await ready(page, '/mau-hoa?dip=Sinh%20nh%E1%BA%ADt,Khai%20tr%C6%B0%C6%A1ng');
    const before = { url: page.url(), chips: await page.locator('.active-filters > button:not(.clear-filters)').allTextContents(), count: await count(page) };
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('main.catalog-page'));
    await page.waitForTimeout(100);
    const after = { url: page.url(), chips: await page.locator('.active-filters > button:not(.clear-filters)').allTextContents(), count: await count(page) };
    output.urlReload = { before, after };

    await ready(page, '/mau-hoa?q=hoa+hong+do&dong=hoa-tuoi&kieu=bo-hoa&min=400000');
    const narrowed = await count(page);
    await page.getByRole('button', { name: 'Xóa tất cả bộ lọc' }).click({ force: true });
    await page.waitForFunction(() => Number(document.querySelector('.results-heading strong')?.textContent) === 24);
    output.clearFilters = { narrowed, cleared: await count(page), url: page.url() };
    await context.close();
  }

  {
    const { context, page } = await setup(1024, 900);
    await page.route('**/fe-data/images/products/**', (route) => route.abort());
    await ready(page, '/mau-hoa/mau-demo-01');
    const visual = page.locator('.detail-gallery .product-visual').first();
    await visual.locator('> span').waitFor({ state: 'visible' });
    output.fallback = {
      src: await visual.locator('img').getAttribute('src'),
      alt: await visual.locator('img').getAttribute('alt'),
      label: await visual.locator('> span').textContent(),
    };
    await context.close();
  }

  {
    const { context, page } = await setup(360, 800);
    await ready(page, '/mau-hoa/mau-demo-01');
    const state = async (label) => page.evaluate((labelValue) => {
      const cta = document.querySelector('.mobile-sticky-cta');
      const heading = document.querySelector('#product-title');
      const style = getComputedStyle(cta);
      return { label: labelValue, scrollY, className: cta.className, display: style.display, visibility: style.visibility, opacity: style.opacity, pointerEvents: style.pointerEvents, transform: style.transform, ctaRect: cta.getBoundingClientRect().toJSON(), headingRect: heading.getBoundingClientRect().toJSON() };
    }, label);
    const states = [await state('initial-150ms')];
    await page.waitForTimeout(400); states.push(await state('initial-550ms'));
    await page.locator('#product-title').evaluate((element) => window.scrollTo(0, element.getBoundingClientRect().top + scrollY - 110));
    await page.waitForTimeout(350); states.push(await state('heading-read'));
    await page.evaluate(() => window.scrollTo(0, 0));
    states.push(await state('return-immediate'));
    await page.waitForTimeout(350); states.push(await state('return-350ms'));
    output.mobileCta = states;
    await page.screenshot({ path: '.impeccable/audit-2026-09-23/mobile-detail-top.png', fullPage: false, animations: 'disabled' });
    await context.close();
  }

  {
    const { context, page } = await setup(390, 844);
    await ready(page, '/mau-hoa');
    const targets = await page.evaluate(() => [...document.querySelectorAll('button,a,input,select,textarea')]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width && rect.height;
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { tag: element.tagName, text: (element.textContent ?? element.getAttribute('aria-label') ?? '').trim().slice(0, 70), width: Math.round(rect.width * 10) / 10, height: Math.round(rect.height * 10) / 10 };
      }));
    output.touchTargets = { total: targets.length, below44Both: targets.filter((item) => item.width < 44 && item.height < 44), below44Either: targets.filter((item) => item.width < 44 || item.height < 44).slice(0, 30) };

    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    await page.waitForTimeout(150);
    output.textResize = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflowX: getComputedStyle(document.querySelector('.app-shell')).overflowX,
      clipped: [...document.querySelectorAll('a,button,input,select,textarea')].filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width && rect.height && (rect.left < -1 || rect.right > document.documentElement.clientWidth + 1);
      }).map((element) => ({ tag: element.tagName, text: (element.textContent ?? element.getAttribute('aria-label') ?? '').trim().slice(0, 70), rect: element.getBoundingClientRect().toJSON() })),
    }));
    await page.screenshot({ path: '.impeccable/audit-2026-09-23/catalog-390-text-200.png', fullPage: false, animations: 'disabled' });
    await context.close();
  }

  {
    const { context, page } = await setup(1440, 1000);
    await ready(page, '/');
    const selectors = ['body', '.content-draft-note', '.hero__facts dt', '.hero__copy > p:not(.content-draft-note)', '.preview-notice p', '.site-footer', '.site-footer a'];
    output.colorSamples = await page.evaluate((items) => items.map((selector) => {
      const element = document.querySelector(selector);
      if (!element) return { selector, missing: true };
      const style = getComputedStyle(element);
      let ancestor = element;
      let background = style.backgroundColor;
      while (ancestor && (background === 'rgba(0, 0, 0, 0)' || background === 'transparent')) {
        ancestor = ancestor.parentElement;
        if (ancestor) background = getComputedStyle(ancestor).backgroundColor;
      }
      return { selector, color: style.color, background, fontSize: style.fontSize, fontWeight: style.fontWeight };
    }), selectors);
    await context.close();
  }

  {
    const { context, page } = await setup(1024, 900);
    await ready(page, '/mau-hoa');
    const trigger = page.getByRole('button', { name: 'Xem nhanh' }).first();
    await trigger.click();
    await page.getByRole('dialog').getByRole('button', { name: 'Liên hệ mẫu này' }).click();
    const beforeTab = await page.locator('[role="dialog"]').evaluateAll((dialogs) => dialogs.map((dialog) => ({ text: dialog.querySelector('h2')?.textContent, labelledBy: dialog.getAttribute('aria-labelledby'), resolved: document.getElementById(dialog.getAttribute('aria-labelledby') ?? '')?.textContent })));
    const focusTrail = [];
    for (let i = 0; i < 8; i += 1) {
      await page.keyboard.press('Tab');
      focusTrail.push(await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: (document.activeElement?.textContent ?? document.activeElement?.getAttribute('aria-label') ?? '').trim().slice(0, 60), withinDialog: Boolean(document.activeElement?.closest('[role="dialog"]')), dialogHeading: document.activeElement?.closest('[role="dialog"]')?.querySelector('h2')?.textContent })));
    }
    output.nestedDialogs = { dialogs: beforeTab, focusTrail };
    await context.close();
  }
} catch (error) {
  output.error = error instanceof Error ? error.stack : String(error);
} finally {
  await browser.close();
}

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
if (output.error) process.exitCode = 1;
