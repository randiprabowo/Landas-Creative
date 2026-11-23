import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';

const dev = process.env.QA_DEV_URL ?? 'http://127.0.0.1:4322';
const production = process.env.QA_PRODUCTION_URL ?? 'http://127.0.0.1:4323';
for (const value of [dev, production]) assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(new URL(value).hostname), 'QA hanya untuk server lokal.');
const output = process.env.QA_OUTPUT_DIR ?? 'docs/verification/stage-5';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: process.env.QA_BROWSER_CHANNEL ?? 'chrome', headless: true });
const report = { browser: browser.version(), date: new Date().toISOString(), responsive: [], accessibility: [], interactions: [], errors: [], unexpectedTransmissions: [] };
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'id-ID', reducedMotion: 'reduce' });
await context.route('**/*', (route) => ['localhost', '127.0.0.1', '[::1]'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
const page = await context.newPage();
page.setDefaultTimeout(8000);
page.on('pageerror', (error) => report.errors.push(error.message));
page.on('request', (request) => { if (!['GET', 'HEAD'].includes(request.method())) report.unexpectedTransmissions.push({ method: request.method(), url: request.url() }); });
const record = (name) => { report.interactions.push(name); console.log(`PASS ${name}`); };
async function settleImages() {
  for (const image of await page.locator('img').elementHandles()) {
    if (!await image.isVisible()) continue;
    await image.evaluate((el) => { el.scrollIntoView({ block: 'nearest' }); return el.decode().catch(() => {}); });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
}
async function a11y(path, state = 'initial') {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
  report.accessibility.push({ path, state, violations: result.violations.map(({ id, impact, description, nodes }) => ({ id, impact, description, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) })), incomplete: result.incomplete.map(({ id }) => id) });
}
const visibleIds = () => page.locator('[data-property-item]:visible').evaluateAll((nodes) => nodes.map((node) => node.dataset.id));
async function reset() { await page.getByRole('button', { name: 'Reset Pencarian & Filter' }).click(); await page.waitForFunction(() => document.querySelector('[data-property-count]')?.textContent === '4 dari 4 properti'); }
async function fillMessage() {
  await page.getByRole('textbox', { name: /^Nama/ }).fill('DEMO QA');
  const interest = page.getByLabel('Layanan / minat');
  if (await interest.isEnabled()) await interest.selectOption({ label: 'Konsultasi umum' });
  await page.getByLabel('Lokasi / wilayah').fill('Wilayah DEMO');
  await page.locator('textarea[name="message"]').fill('DEMO — rencana & pertanyaan + kebutuhan.');
}
try {
  await page.goto(`${dev}/_preview/interaksi`);
  await page.locator('[data-property-controls]').waitFor({ state: 'visible' });
  assert.deepEqual(await visibleIds(), ['demo-a', 'demo-d', 'demo-b', 'demo-c']);
  await page.getByLabel('Cari nama atau lokasi').fill('  RuMaH A  ');
  await page.waitForFunction(() => document.querySelector('[data-property-count]')?.textContent?.startsWith('1 dari 4'));
  assert.deepEqual(await visibleIds(), ['demo-a']); record('search trim/case');
  await reset();
  await page.getByLabel('Tipe properti').selectOption('ruko');
  await page.getByLabel('Wilayah', { exact: true }).selectOption('Wilayah DEMO Utara');
  assert.deepEqual(await visibleIds(), []);
  assert.equal(await page.locator('[data-property-no-results]').isVisible(), true); record('AND and empty results');
  await reset();
  await page.getByLabel('Status ketersediaan').selectOption('dipesan');
  assert.deepEqual(await visibleIds(), ['demo-b']); record('availability filter');
  await reset();
  await page.getByLabel('Harga minimum (Rp)').fill('400000000');
  await page.getByLabel('Harga maksimum (Rp)').fill('400000000');
  await page.getByRole('button', { name: 'Terapkan Filter', exact: true }).click();
  assert.deepEqual(await visibleIds(), ['demo-a']); record('inclusive range and missing-price exclusion');
  await page.getByLabel('Harga minimum (Rp)').fill('800000000');
  await page.getByRole('button', { name: 'Terapkan Filter', exact: true }).click();
  assert.equal(await page.locator('#property-price-error').isVisible(), true);
  assert.equal(await page.locator('#property-max').getAttribute('aria-invalid'), 'true');
  await page.getByLabel('Harga minimum (Rp)').fill('1.000');
  await page.getByRole('button', { name: 'Terapkan Filter', exact: true }).click();
  assert.equal(await page.locator('#property-min').getAttribute('aria-invalid'), 'true'); record('range/format errors');
  await reset();
  for (const [sort, expected] of [['newest', ['demo-d', 'demo-b', 'demo-c', 'demo-a']], ['price-asc', ['demo-c', 'demo-a', 'demo-b', 'demo-d']], ['price-desc', ['demo-b', 'demo-a', 'demo-c', 'demo-d']]]) {
    await page.getByLabel('Urutkan').selectOption(sort); assert.deepEqual(await visibleIds(), expected);
  }
  record('all sort orders, missing price last');
  await reset(); record('reset restores all and default sort');
  await page.getByRole('button', { name: 'Pratinjau Pesan', exact: true }).click();
  assert.equal(await page.locator('[data-field-error="name"]').isVisible(), true);
  assert.equal(await page.locator('#message-name').evaluate((el) => el === document.activeElement), true);
  await fillMessage();
  await page.getByRole('button', { name: 'Pratinjau Pesan', exact: true }).click();
  assert.match(await page.locator('[data-message-text]').innerText(), /Nama: DEMO QA/);
  assert.equal(await page.getByRole('button', { name: 'Lanjut ke WhatsApp' }).isDisabled(), true);
  assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0); record('form validation/preview, unconfirmed WhatsApp, no storage');
  await a11y('/_preview/interaksi', 'preview');
  await settleImages();
  await page.screenshot({ path: `${output}/filters-desktop.jpg`, type: 'jpeg', quality: 85, fullPage: true });
  await page.goto(`${dev}/_preview/detail/properti`);
  const thumbs = page.locator('[data-gallery-thumbnail]');
  await thumbs.first().focus(); await page.keyboard.press('ArrowRight');
  assert.equal(await thumbs.nth(1).getAttribute('aria-pressed'), 'true');
  await page.keyboard.press('End');
  assert.equal(await thumbs.nth(2).getAttribute('aria-pressed'), 'true');
  await page.locator('#documentation-image-3 [data-image-fallback]').waitFor({ state: 'visible' });
  await page.keyboard.press('Home');
  assert.equal(await thumbs.first().getAttribute('aria-pressed'), 'true');
  record('gallery arrows/Home/End and broken-image fallback');
  await page.locator('#documentation-image-1 [data-gallery-enlarge]').click();
  assert.equal(await page.locator('dialog[open]').count(), 1);
  await page.keyboard.press('Tab'); assert.equal(await page.locator('dialog[open]').evaluate((el) => el.contains(document.activeElement)), true);
  await page.keyboard.press('Shift+Tab'); assert.equal(await page.locator('dialog[open]').evaluate((el) => el.contains(document.activeElement)), true);
  await a11y('/_preview/detail/properti', 'gallery-dialog');
  await page.screenshot({ path: `${output}/gallery-dialog-desktop.jpg`, type: 'jpeg', quality: 85 });
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog[open]').count(), 0);
  assert.equal(await page.locator('#documentation-image-1 [data-gallery-enlarge]').evaluate((el) => el === document.activeElement), true);
  record('gallery dialog Escape and focus return');
  await page.locator('#floor-plan-image-1 [data-gallery-enlarge]').click();
  await page.waitForFunction(() => document.querySelector('dialog[open] img')?.naturalHeight > 0);
  assert.equal(await page.locator('dialog[open] img').evaluate((el) => el.naturalHeight > el.naturalWidth), true);
  await page.locator('dialog[open] [data-gallery-close]').click(); record('portrait floor plan enlargement and close');
  await page.getByRole('link', { name: 'Siapkan Pertanyaan' }).click();
  await page.locator('[data-message-context]').waitFor({ state: 'visible' });
  await fillMessage();
  await page.getByRole('button', { name: 'Pratinjau Pesan', exact: true }).click();
  const propertyMessage = await page.locator('[data-message-text]').innerText();
  assert.match(propertyMessage, /ID properti: demo-properti/); assert.ok(propertyMessage.includes(`${dev}/_preview/detail/properti`));
  await page.getByRole('button', { name: 'Hapus Referensi' }).click(); assert.equal(await page.getByLabel('Layanan / minat').isEnabled(), true); record('property context, ID/URL, remove reference');
  await page.goto(`${dev}/_preview/detail/properti-terjual`);
  assert.equal(await page.getByRole('link', { name: 'Cari Properti Lain' }).count(), 1);
  assert.equal(await page.getByRole('link', { name: /Jadwalkan Survei|Siapkan Pertanyaan/ }).count(), 0); record('sold property has alternatives only');
  await page.goto(`${dev}/_preview/detail/layanan`);
  await page.getByRole('link', { name: 'Siapkan Pertanyaan' }).click(); await fillMessage();
  await page.getByRole('button', { name: 'Pratinjau Pesan', exact: true }).click(); assert.match(await page.locator('[data-message-text]').innerText(), /konsultasi layanan DEMO/); record('service message context');
  await page.goto(`${dev}/_preview/detail/proyek`);
  await page.getByRole('link', { name: 'Siapkan Pertanyaan' }).click(); await fillMessage();
  await page.getByRole('button', { name: 'Pratinjau Pesan', exact: true }).click(); assert.match(await page.locator('[data-message-text]').innerText(), /pekerjaan serupa/); record('project message context');
  await page.goto(`${production}/kemitraan`);
  await page.getByRole('textbox', { name: /^Nama/ }).fill('DEMO QA');
  await page.getByLabel('Lokasi / wilayah').fill('Wilayah DEMO');
  await page.locator('textarea').fill('DEMO — minat kemitraan');
  await page.getByRole('button', { name: 'Pratinjau Pesan', exact: true }).click();
  assert.match(await page.locator('[data-message-text]').innerText(), /kemitraan agen pemasaran/); record('partnership message');
  const productionPaths = ['/', '/layanan', '/properti', '/portofolio', '/tentang', '/kontak', '/kemitraan', '/privasi', '/tidak-ditemukan'];
  const devPaths = ['/_preview/kartu', '/_preview/interaksi', '/_preview/detail/layanan', '/_preview/detail/properti', '/_preview/detail/properti-terjual', '/_preview/detail/proyek'];
  for (const [origin, paths] of [[production, productionPaths], [dev, devPaths]]) {
    for (const width of [360, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const path of paths) {
        await page.goto(origin + path); await settleImages();
        const metrics = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, h1: document.querySelectorAll('h1').length, title: document.title }));
        report.responsive.push({ path, width, ...metrics }); assert.equal(metrics.scroll, metrics.client, `Overflow ${path} @ ${width}`); assert.equal(metrics.h1, 1);
        if (origin === production && path === '/properti') {
          const centers = await page.locator('.breadcrumb a, .breadcrumb .separator, .breadcrumb [aria-current]').evaluateAll((items) => items.map((item) => {
            const range = document.createRange();
            range.selectNodeContents(item);
            const rect = range.getBoundingClientRect();
            return rect.top + rect.height / 2;
          }));
          assert.equal(centers.length, 3);
          assert.ok(Math.max(...centers) - Math.min(...centers) < 2, 'Teks breadcrumb harus sejajar');
          const columns = await page.locator('.footer-navigation li').evaluateAll((items) => new Set(items.map((item) => Math.round(item.getBoundingClientRect().left))).size);
          assert.equal(columns, 2, 'Navigasi footer harus terbagi dua kolom');
        }
        if (width === 360 || width === 1440) await a11y(path);
        if (origin === production && (path === '/kontak' || path === '/')) await page.screenshot({ path: `${output}/${path === '/' ? 'home' : 'contact'}-${width}.jpg`, type: 'jpeg', quality: 85, fullPage: true });
        if (origin === dev && path === '/_preview/detail/properti' && width === 360) await page.screenshot({ path: `${output}/property-demo-mobile.jpg`, type: 'jpeg', quality: 85, fullPage: true });
      }
    }
  }
  await page.setViewportSize({ width: 360, height: 900 });
  await page.goto(`${dev}/_preview/interaksi`);
  assert.equal(await page.locator('[data-property-filters]').getAttribute('open'), null);
  await page.getByText('Filter properti', { exact: true }).click();
  await page.getByLabel('Status ketersediaan').selectOption('tersedia');
  await page.locator('[data-property-filters] summary').click();
  assert.match(await page.locator('[data-property-active]').innerText(), /Tersedia/);
  assert.deepEqual(await visibleIds(), ['demo-a', 'demo-d']);
  await reset(); record('mobile filter collapse, visible active values, reset');
  await page.locator('[data-property-controls]').screenshot({ path: `${output}/filters-mobile.jpg`, type: 'jpeg', quality: 85 });
  await page.goto(`${production}/kontak`);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'), 'false');
  assert.equal(await page.locator('[data-menu-toggle]').evaluate((el) => el === document.activeElement), true); record('mobile menu Escape/focus');
  await page.keyboard.press('Tab'); // Menu is followed by the main content when collapsed.
  await page.goto(production);
  await page.keyboard.press('Tab'); assert.equal(await page.locator('.skip-link').evaluate((el) => el === document.activeElement), true);
  await page.keyboard.press('Enter'); assert.equal(await page.locator('main').evaluate((el) => el === document.activeElement), true); record('keyboard skip link');
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 900 } });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${dev}/_preview/interaksi`);
  assert.equal(await staticPage.locator('[data-property-item]:visible').count(), 4);
  assert.equal(await staticPage.locator('[data-property-controls]').isVisible(), false);
  assert.equal(await staticPage.locator('[data-message-form]').isVisible(), false);
  await staticPage.goto(`${dev}/_preview/detail/properti`);
  assert.equal(await staticPage.locator('[data-gallery-panel]:visible').count(), 4);
  await staticPage.goto(`${production}/kontak`);
  assert.equal(await staticPage.locator('#primary-navigation').isVisible(), true);
  await noJs.close(); record('no-JavaScript catalog/gallery/navigation, form does not submit');
  const reflow = await browser.newContext({ viewport: { width: 720, height: 500 }, deviceScaleFactor: 2 });
  const reflowPage = await reflow.newPage();
  for (const path of productionPaths) { await reflowPage.goto(production + path); const m = await reflowPage.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth })); assert.equal(m.client, m.scroll); }
  await reflow.close(); record('reflow simulation equivalent to 1440px at 200% (720 CSS px, DPR 2)');
  assert.deepEqual(report.unexpectedTransmissions, []); record('no form POST or other transmission');
  report.passed = report.errors.length === 0 && report.accessibility.every((item) => !item.violations.length);
} catch (error) {
  report.failure = error.stack; report.passed = false; console.error(error);
  await page.screenshot({ path: `${output}/failure.jpg`, fullPage: true }).catch(() => {});
} finally {
  await writeFile(`${output}/browser-audit.json`, `${JSON.stringify(report, null, 2)}\n`);
  await browser.close();
}
console.log(JSON.stringify({ passed: report.passed, interactions: report.interactions.length, responsive: report.responsive.length, violations: report.accessibility.filter((r) => r.violations.length).length, errors: report.errors }));
if (!report.passed) process.exitCode = 1;
