import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const origin = process.env.QA_PRODUCTION_URL ?? 'http://127.0.0.1:4323';
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(new URL(origin).hostname), 'Lighthouse QA hanya untuk server lokal.');
const directory = 'docs/verification/stage-5/lighthouse';
await mkdir(directory, { recursive: true });
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--disable-dev-shm-usage'] });
const summary = { date: new Date().toISOString(), reports: [], note: 'Baseline localhost dengan aset sementara dan katalog kosong. SEO noindex disengaja. Bukan hasil field Core Web Vitals; ulangi setelah aset/domain/konten final.' };
try {
  for (const [name, path] of [['home', '/'], ['properties', '/properti'], ['contact', '/kontak']]) {
    const result = await lighthouse(origin + path, { port: chrome.port, output: 'html', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], formFactor: 'mobile', throttlingMethod: 'simulate' });
    if (!result) throw new Error('Lighthouse tidak menghasilkan laporan.');
    const lhr = result.lhr;
    await writeFile(`${directory}/${name}.html`, result.report);
    await writeFile(`${directory}/${name}.json`, JSON.stringify(lhr, null, 2));
    summary.reports.push({ path, lighthouseVersion: lhr.lighthouseVersion, userAgent: lhr.userAgent, settings: lhr.configSettings, scores: Object.fromEntries(Object.entries(lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)])), metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'].map((key) => [key, lhr.audits[key]?.numericValue])), failedAudits: Object.values(lhr.audits).filter((audit) => audit.score !== null && audit.score < 1).map(({ id, title, score, displayValue }) => ({ id, title, score, displayValue })), runtimeError: lhr.runtimeError });
    console.log(JSON.stringify(summary.reports.at(-1).scores));
  }
} finally {
  await Promise.resolve(chrome.kill());
  await writeFile(`${directory}/summary.json`, `${JSON.stringify(summary, null, 2)}\n`);
}
if (summary.reports.some((report) => report.runtimeError)) process.exitCode = 1;
