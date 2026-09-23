import { chromium } from 'playwright-core';

const browser = await chromium.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true });
const baseUrl = 'http://127.0.0.1:4173';
const scenarios = [
  { name: 'desktop-unthrottled', viewport: { width: 1440, height: 1000 }, throttle: false },
  { name: 'mobile-slow4g-cpu4x', viewport: { width: 390, height: 844 }, throttle: true },
];
const results = [];

for (const scenario of scenarios) {
  const context = await browser.newContext({ viewport: scenario.viewport, locale: 'vi-VN', reducedMotion: 'no-preference' });
  const page = await context.newPage();
  const session = await context.newCDPSession(page);
  await session.send('Network.enable');
  await session.send('Network.setCacheDisabled', { cacheDisabled: true });
  if (scenario.throttle) {
    await session.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: 1_600_000 / 8,
      uploadThroughput: 750_000 / 8,
      connectionType: 'cellular4g',
    });
    await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }
  await page.addInitScript(() => {
    window.__auditVitals = { lcp: 0, cls: 0, events: [], longTasks: [] };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__auditVitals.lcp = entry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__auditVitals.cls += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) if (entry.interactionId) window.__auditVitals.events.push({ name: entry.name, duration: entry.duration, interactionId: entry.interactionId });
      }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
    } catch {}
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) window.__auditVitals.longTasks.push(entry.duration);
      }).observe({ type: 'longtask', buffered: true });
    } catch {}
  });
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') runtimeErrors.push(message.text()); });
  const started = Date.now();
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.waitForFunction(() => document.querySelector('main.home-page'));
  await page.waitForTimeout(2500);
  await page.locator('.hero__actions button').click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource');
    const vital = window.__auditVitals;
    const interactions = new Map();
    for (const event of vital.events) interactions.set(event.interactionId, Math.max(interactions.get(event.interactionId) ?? 0, event.duration));
    return {
      lcpMs: Math.round(vital.lcp),
      cls: Math.round(vital.cls * 10000) / 10000,
      maxInteractionDurationMs: interactions.size ? Math.max(...interactions.values()) : null,
      maxLongTaskMs: vital.longTasks.length ? Math.round(Math.max(...vital.longTasks)) : 0,
      domContentLoadedMs: Math.round(navigation.domContentLoadedEventEnd),
      loadEventMs: Math.round(navigation.loadEventEnd),
      transferBytes: Math.round(resources.reduce((sum, entry) => sum + (entry.transferSize || 0), navigation.transferSize || 0)),
      decodedBodyBytes: Math.round(resources.reduce((sum, entry) => sum + (entry.decodedBodySize || 0), navigation.decodedBodySize || 0)),
      resources: resources.length,
      byType: Object.fromEntries([...new Set(resources.map((entry) => entry.initiatorType))].map((type) => [type, resources.filter((entry) => entry.initiatorType === type).length])),
    };
  });
  await page.screenshot({ path: `.impeccable/audit-2026-09-23/perf-${scenario.name}.png`, fullPage: false, animations: 'disabled' });
  results.push({ ...scenario, wallTimeMs: Date.now() - started, ...metrics, runtimeErrors });
  await context.close();
}

await browser.close();
process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
