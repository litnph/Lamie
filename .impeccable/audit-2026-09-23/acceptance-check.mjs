import { chromium } from 'playwright-core';

const executablePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const baseUrl = 'http://127.0.0.1:3000';
const output = { environment: {}, matrix: [], searches: {}, flows: {}, accessibility: {}, responsive: {}, content: {}, errors: [] };
const browser = await chromium.launch({ executablePath, headless: true });

const getPage = async (width = 1440, height = 900, options = {}) => {
  const context = await browser.newContext({
    viewport: { width, height },
    locale: 'vi-VN',
    reducedMotion: options.reducedMotion ?? 'no-preference',
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10_000);
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => { if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`); });
  page.on('requestfailed', (request) => runtimeErrors.push(`requestfailed: ${request.url()} ${request.failure()?.errorText ?? ''}`));
  return { context, page, runtimeErrors };
};

const goto = async (page, path) => {
  const response = await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
  await page.locator('main#main-content').waitFor({ state: 'visible' });
  await page.waitForFunction(() => {
    const main = document.querySelector('main#main-content');
    return Boolean(main && !main.classList.contains('page-loader'));
  });
  await page.evaluate(() => Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 2500))]));
  await page.waitForTimeout(80);
  return response;
};

const snapshot = async (page) => page.evaluate(() => {
  const visible = (element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
  };
  const brokenImages = [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src);
  const offscreen = [...document.querySelectorAll('a,button,input,select,textarea')]
    .filter(visible)
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.left < -1 || rect.right > document.documentElement.clientWidth + 1;
    })
    .slice(0, 10)
    .map((element) => ({ tag: element.tagName, text: (element.textContent ?? element.getAttribute('aria-label') ?? '').trim().slice(0, 80), rect: element.getBoundingClientRect().toJSON() }));
  return {
    title: document.title,
    h1Count: document.querySelectorAll('h1').length,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    fullHeight: document.documentElement.scrollHeight,
    brokenImages,
    offscreen,
    footer: Boolean(document.querySelector('footer')),
  };
});

const readResultCount = async (page) => Number(await page.locator('.results-heading strong').first().textContent());
const search = async (page, term) => {
  await page.locator('input[type="search"]').fill(term);
  await page.waitForTimeout(60);
  return {
    term,
    count: await readResultCount(page),
    names: await page.locator('.product-card h3').allTextContents(),
    url: page.url(),
  };
};

try {
  {
    const probe = await getPage();
    output.environment.userAgent = await probe.page.evaluate(() => navigator.userAgent);
    await probe.context.close();
  }

  const viewports = [
    { name: '1440', width: 1440, height: 1000 },
    { name: '1024', width: 1024, height: 900 },
    { name: '768', width: 768, height: 1024 },
    { name: '390', width: 390, height: 844 },
    { name: '360', width: 360, height: 800 },
  ];
  const routes = [
    { name: 'Home', path: '/' },
    { name: 'Catalog', path: '/mau-hoa' },
    { name: 'Detail', path: '/mau-hoa/mau-demo-01' },
  ];
  for (const viewport of viewports) {
    for (const route of routes) {
      const { context, page, runtimeErrors } = await getPage(viewport.width, viewport.height);
      await goto(page, route.path);
      const state = await snapshot(page);
      const columns = await page.locator('.catalog-product-grid').count()
        ? await page.locator('.catalog-product-grid').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length)
        : null;
      output.matrix.push({ viewport: viewport.name, route: route.name, path: route.path, ...state, columns, runtimeErrors });
      await context.close();
    }
  }

  {
    const { context, page, runtimeErrors } = await getPage(1440, 1000);
    await goto(page, '/mau-hoa');
    const terms = ['Dịu hồng', 'diu hong', 'DIU HONG', 'đỏ', 'do', 'DEMO-001', 'hoa hồng đỏ', 'lam tinh', 'hoa lam tinh', 'sao xanh', 'hoa sao xanh', 'box', 'hộp', 'bouquet', 'bó', 'cử nhân', 'tốt nghiệp'];
    for (const term of terms) output.searches[term] = await search(page, term);
    output.searches.suggestions = {
      listboxes: await page.getByRole('listbox').count(),
      options: await page.getByRole('option').count(),
      datalists: await page.locator('datalist').count(),
    };

    await goto(page, '/mau-hoa?dip=Sinh%20nh%E1%BA%ADt,Khai%20tr%C6%B0%C6%A1ng');
    const orCount = await readResultCount(page);
    await goto(page, '/mau-hoa?dip=Sinh%20nh%E1%BA%ADt&dong=hoa-sap-lua');
    const andCount = await readResultCount(page);
    output.searches.filterLogic = { orCount, andCount, activeChips: await page.locator('.active-filters > button:not(.clear-filters)').count() };

    await goto(page, '/mau-hoa?bao-gia=1');
    const quoteCount = await readResultCount(page);
    await goto(page, '/mau-hoa?bao-gia=1&min=0&max=2000000');
    const quoteWithNumericCount = await readResultCount(page);
    await goto(page, '/mau-hoa?min=0&max=2000000');
    const numericCardsWithQuoteText = await page.locator('.product-card__price', { hasText: 'Liên hệ báo giá' }).count();
    output.searches.priceEligibility = { quoteCount, quoteWithNumericCount, numericCardsWithQuoteText };

    await goto(page, '/mau-hoa');
    const initialCards = await page.locator('.product-card').count();
    while (await page.getByRole('button', { name: /Xem thêm/ }).count()) await page.getByRole('button', { name: /Xem thêm/ }).click();
    const allCards = await page.locator('.product-card').count();
    const totalCount = await readResultCount(page);
    const lastStatuses = await page.locator('.product-card .status-badge').allTextContents();
    output.searches.loadMoreAndSort = { initialCards, allCards, totalCount, lastFourStatuses: lastStatuses.slice(-4) };

    await goto(page, '/mau-hoa');
    await page.locator('.catalog-sidebar').getByText('Sinh nhật', { exact: true }).click();
    const firstUrl = page.url();
    await page.locator('.catalog-sidebar').getByText('Khai trương', { exact: true }).click();
    const secondUrl = page.url();
    await page.goBack(); await page.waitForTimeout(100);
    const backUrl = page.url();
    await page.goForward(); await page.waitForTimeout(100);
    const forwardUrl = page.url();
    await page.reload(); await page.locator('main#main-content').waitFor();
    output.searches.urlState = { firstUrl, secondUrl, backUrl, forwardUrl, reloadUrl: page.url(), activeChipsAfterReload: await page.locator('.active-filters > button:not(.clear-filters)').count() };
    output.searches.runtimeErrors = runtimeErrors;
    await context.close();
  }

  {
    const { context, page, runtimeErrors } = await getPage(1440, 1000);
    await goto(page, '/');
    await page.locator('.occasion-card', { hasText: 'Sinh nhật' }).click();
    const afterOccasion = page.url();
    await page.locator('.product-card__image-link').first().click();
    const afterProduct = page.url();
    await page.getByRole('button', { name: /Liên hệ đặt mẫu này|Nhờ tư vấn mẫu tương tự/ }).click();
    const channels = await page.locator('.channel-grid > button').allTextContents();
    output.flows.A = { afterOccasion, afterProduct, dialog: await page.getByRole('dialog').count(), channels, runtimeErrors };
    await context.close();
  }

  {
    const { context, page, runtimeErrors } = await getPage(1440, 1000);
    await goto(page, '/mau-hoa');
    await page.locator('input[type="search"]').fill('hoa hong do');
    const afterSearch = await readResultCount(page);
    await page.locator('.catalog-sidebar input[type="number"]').first().fill('400000');
    await page.locator('.catalog-sidebar').getByText('Hoa tươi', { exact: true }).click();
    await page.locator('.catalog-sidebar').getByText('Bó hoa', { exact: true }).click();
    const narrowedCount = await readResultCount(page);
    const narrowedUrl = page.url();
    if (await page.getByRole('button', { name: 'Xóa tất cả bộ lọc' }).count()) {
      await page.getByRole('button', { name: 'Xóa tất cả bộ lọc' }).click({ force: true });
    } else {
      await page.locator('.active-filters .clear-filters').click({ force: true });
    }
    await page.waitForTimeout(60);
    const clearedCount = await readResultCount(page);
    output.flows.B = { afterSearch, narrowedCount, narrowedUrl, clearedCount, runtimeErrors };
    await context.close();
  }

  {
    const { context, page, runtimeErrors } = await getPage(1024, 900);
    const detailCases = [
      { slug: 'mau-demo-01', kind: 'fixed' },
      { slug: 'mau-demo-05', kind: 'contact' },
      { slug: 'mau-demo-03', kind: 'seasonal' },
      { slug: 'mau-demo-21', kind: 'paused' },
    ];
    const cases = [];
    for (const item of detailCases) {
      await goto(page, `/mau-hoa/${item.slug}`);
      cases.push({
        ...item,
        h1: await page.locator('h1').textContent(),
        price: await page.locator('.detail-price').textContent(),
        status: await page.locator('.detail-info .status-badge').textContent(),
        delivery: await page.locator('.delivery-note').innerText(),
        cta: await page.locator('.detail-contact-button').textContent(),
        galleryImages: await page.locator('.detail-gallery img').count(),
      });
    }
    await goto(page, '/mau-hoa/khong-ton-tai');
    const missingProduct = await page.locator('.not-found-page h1').textContent();
    await goto(page, '/duong-dan-khong-ton-tai');
    const missingRoute = await page.locator('.not-found-page h1').textContent();
    output.flows.C = { cases, missingProduct, missingRoute, runtimeErrors };
    await context.close();
  }

  {
    const { context, page, runtimeErrors } = await getPage(1440, 1000);
    await page.addInitScript(() => {
      window.__auditOpened = [];
      window.open = (href, target, features) => { window.__auditOpened.push({ href, target, features }); return null; };
    });
    await goto(page, '/');
    await page.locator('.hero').getByRole('button', { name: 'Nhờ Lamie tư vấn' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('Ngày nhận dự kiến').fill('2026-10-01');
    await dialog.getByLabel('Ngân sách dự kiến').fill('700000');
    await dialog.getByLabel('Khu vực/địa chỉ giao').fill('Thủ Đức');
    await dialog.getByLabel('Nội dung trên thiệp').fill('Chúc mừng');
    await dialog.getByLabel('Ghi chú thêm').fill('Ưu tiên màu kem');
    await dialog.getByRole('button', { name: /Sao chép nội dung/ }).click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    const channelNames = ['Instagram', 'TikTok', 'Gọi hotline', 'Zalo', 'Facebook'];
    for (const name of channelNames) await dialog.getByRole('button', { name: new RegExp(name) }).click();
    output.flows.D = {
      copied,
      channels: await dialog.locator('.channel-grid > button').allTextContents(),
      opened: await page.evaluate(() => window.__auditOpened),
      truthfulCopy: await dialog.getByText(/Lamie chưa nhận được gì/).textContent(),
      runtimeErrors,
    };
    await context.close();
  }

  {
    const { context, page, runtimeErrors } = await getPage(390, 844);
    await goto(page, '/mau-hoa');
    await page.locator('input[type="search"]').fill('hoa');
    await page.getByRole('button', { name: /Bộ lọc/ }).click();
    const sheet = page.getByRole('dialog');
    await sheet.getByText('Sinh nhật', { exact: true }).click();
    await sheet.getByText('Hoa tươi', { exact: true }).click();
    const expectedCount = Number((await sheet.getByRole('button', { name: /Xem \d+ mẫu/ }).textContent()).match(/\d+/)?.[0]);
    await sheet.getByRole('button', { name: /Xem \d+ mẫu/ }).click();
    const resultCount = await readResultCount(page);
    const beforeBodyClick = page.url();
    await page.locator('.product-card').first().locator('.product-card__body').click({ position: { x: 2, y: 2 } });
    const afterBodyClick = page.url();
    await page.locator('.product-card__image-link').first().click();
    const afterImageClick = page.url();
    const ctaInitial = await page.locator('.mobile-sticky-cta').evaluate((element) => ({ visibility: getComputedStyle(element).visibility, className: element.className }));
    await page.locator('#product-title').scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    const ctaAfterHeading = await page.locator('.mobile-sticky-cta').evaluate((element) => ({ visibility: getComputedStyle(element).visibility, className: element.className }));
    output.flows.E = { expectedCount, resultCount, beforeBodyClick, afterBodyClick, afterImageClick, ctaInitial, ctaAfterHeading, runtimeErrors };
    await context.close();
  }

  {
    const { context, page, runtimeErrors } = await getPage(1024, 900);
    await goto(page, '/mau-hoa');
    await page.keyboard.press('Tab');
    const tabSequence = [];
    for (let i = 0; i < 12; i += 1) {
      tabSequence.push(await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: (document.activeElement?.textContent ?? document.activeElement?.getAttribute('aria-label') ?? '').trim().slice(0, 60), href: document.activeElement?.getAttribute('href') })));
      await page.keyboard.press('Tab');
    }
    const quickTrigger = page.getByRole('button', { name: 'Xem nhanh' }).first();
    await quickTrigger.focus(); await page.keyboard.press('Enter');
    const quickDialog = page.getByRole('dialog');
    const quickName = await quickDialog.getAttribute('aria-labelledby');
    await page.keyboard.press('Escape');
    const quickFocusRestored = await quickTrigger.evaluate((element) => element === document.activeElement);
    await quickTrigger.click();
    await page.getByRole('dialog').getByRole('button', { name: 'Liên hệ mẫu này' }).click();
    const dialogs = await page.locator('[role="dialog"]').evaluateAll((elements) => elements.map((element) => ({
      labelledBy: element.getAttribute('aria-labelledby'),
      resolvedLabel: document.getElementById(element.getAttribute('aria-labelledby') ?? '')?.textContent,
    })));
    await page.keyboard.press('Escape');
    output.flows.F = { tabSequence, quickName, quickFocusRestored, nestedDialogs: dialogs, dialogsAfterEscape: await page.locator('[role="dialog"]').count(), runtimeErrors };
    await context.close();
  }

  {
    const { context, page, runtimeErrors } = await getPage(390, 844, { reducedMotion: 'reduce' });
    await goto(page, '/');
    const motion = await page.evaluate(() => ({
      media: matchMedia('(prefers-reduced-motion: reduce)').matches,
      marqueeDuration: getComputedStyle(document.querySelector('.occasion-marquee__track')).animationDuration,
      marqueeWidth: getComputedStyle(document.querySelector('.occasion-marquee__track')).width,
      processSteps: document.querySelectorAll('.process-card').length,
      hiddenProcessSteps: [...document.querySelectorAll('.process-card')].filter((element) => getComputedStyle(element).visibility === 'hidden' || getComputedStyle(element).display === 'none').length,
      runningAnimations: document.getAnimations().filter((animation) => animation.playState === 'running').length,
    }));
    await page.locator('.hero').getByRole('button', { name: 'Nhờ Lamie tư vấn' }).click();
    const contactWorks = await page.getByRole('dialog').isVisible();
    output.accessibility.reducedMotion = { ...motion, contactWorks, runtimeErrors };
    await context.close();
  }

  {
    const { context, page, runtimeErrors } = await getPage(390, 844);
    await goto(page, '/mau-hoa');
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    await page.waitForTimeout(100);
    const state = await snapshot(page);
    output.accessibility.textScale200 = { ...state, runtimeErrors };
    await context.close();
  }

  {
    const { context, page, runtimeErrors } = await getPage(1024, 900);
    await page.route('**/fe-data/images/products/**', (route) => route.abort());
    await goto(page, '/mau-hoa/mau-demo-01');
    await page.locator('.product-visual > span').waitFor({ state: 'visible' });
    output.content.imageFallback = {
      placeholderSrc: await page.locator('.product-visual img').first().getAttribute('src'),
      label: await page.locator('.product-visual > span').first().textContent(),
      alt: await page.locator('.product-visual img').first().getAttribute('alt'),
      runtimeErrors: runtimeErrors.filter((error) => !error.includes('ERR_FAILED')),
    };
    await context.close();
  }

  {
    const { context, page, runtimeErrors } = await getPage(360, 800);
    await goto(page, '/mau-hoa/mau-demo-01');
    const initial = await page.locator('.mobile-sticky-cta').evaluate((element) => ({ visibility: getComputedStyle(element).visibility, className: element.className }));
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((resolve) => setTimeout(resolve, 10)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(150);
    const afterWarmReturn = await page.locator('.mobile-sticky-cta').evaluate((element) => ({ visibility: getComputedStyle(element).visibility, className: element.className }));
    output.responsive.mobileCtaVerification = { initial, afterWarmReturn, runtimeErrors };
    await context.close();
  }
} catch (error) {
  output.errors.push(error instanceof Error ? `${error.stack}` : String(error));
} finally {
  await browser.close();
}

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
if (output.errors.length) process.exitCode = 1;
