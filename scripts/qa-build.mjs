import assert from 'node:assert/strict';
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { remoteBackend } from '../src/cms/backend.mjs';

const origin = process.env.QA_PRODUCTION_URL ?? 'http://127.0.0.1:4323';
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(new URL(origin).hostname));
const site = JSON.parse(await readFile('src/data/site.json', 'utf8'));
const editor = remoteBackend(JSON.parse(await readFile('src/cms/access.json', 'utf8')));
async function walk(directory) {
  const result = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, item.name);
    result.push(...(item.isDirectory() ? await walk(path) : [path]));
  }
  return result;
}
const files = await walk('dist');
const pages = new Map();
for (const path of files.filter((file) => file.endsWith('.html'))) {
  const name = relative('dist', path).replaceAll('\\', '/');
  if (name === 'admin/index.html') continue;
  pages.set(name === 'index.html' ? '/' : name === '404.html' ? '/404' : `/${name.replace(/\/index\.html$/, '')}`, await readFile(path, 'utf8'));
}
const decode = (value) => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const report = { date: new Date().toISOString(), pages: [], internalLinks: 0, assets: [], hiddenRoutes: [], issues: [], leaks: [], budgets: {}, sourceHashes: {} };
const adminResponse = await fetch(origin + '/admin/index.html');
if (editor) {
  const adminHtml = await adminResponse.text();
  const configResponse = await fetch(origin + '/admin/config.json');
  assert.equal(adminResponse.status, 200);
  assert.ok(adminHtml.includes('content="noindex, nofollow"') && adminHtml.includes('/admin/runtime/sveltia-cms.js'));
  assert.equal(configResponse.status, 200);
  assert.deepEqual((await configResponse.json()).backend, editor);
} else {
  assert.equal(adminResponse.status, 404);
  assert.ok(!files.some((file) => relative('dist', file).replaceAll('\\', '/').startsWith('admin/')));
}
const titles = new Set(), descriptions = new Set(), assets = new Set();
function assetUrls(html) {
  const result = new Set([...html.matchAll(/(?:src|href)="(\/_astro\/[^"\s]+)"/g)].map((m) => decode(m[1])));
  for (const match of html.matchAll(/srcset="([^"]+)"/g)) for (const src of match[1].split(',')) {
    const url = src.trim().split(' ')[0]; if (url?.startsWith('/_astro/')) result.add(decode(url));
  }
  return result;
}
for (const [path, html] of pages) {
  const status = (await fetch(origin + path)).status;
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/name="description" content="([^"]+)"/)?.[1];
  report.pages.push({ path, status, title, description });
  if (status !== 200 || !title || titles.has(title) || !description || descriptions.has(description)) report.issues.push(`${path}: HTTP/title/description`);
  titles.add(title); descriptions.add(description);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  if (new Set(ids).size !== ids.length || (html.match(/<h1(?:\s|>)/g) ?? []).length !== 1 || !html.includes('lang="id"')) report.issues.push(`${path}: structure`);
  if (!html.includes('property="og:title"') || !html.includes('property="og:description"')) report.issues.push(`${path}: Open Graph`);
  if (!site.indexingEnabled && (!html.includes('content="noindex, nofollow"') || html.includes('rel="canonical"') || html.includes('property="og:url"') || html.includes('application/ld+json'))) report.issues.push(`${path}: indexing guard`);
  for (const match of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    const href = decode(match[1]); if (!/^(?:\/|#)/.test(href)) continue;
    report.internalLinks++;
    const url = new URL(href, origin + path), target = pages.get(url.pathname.replace(/\/$/, '') || '/');
    if (!target || (url.hash && !target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`))) report.issues.push(`${path}: missing ${href}`);
  }
  assetUrls(html).forEach((url) => assets.add(url));
}
for (const path of assets) {
  const response = await fetch(origin + path); report.assets.push({ path, status: response.status });
  if (response.status !== 200) report.issues.push(`Asset ${path}`);
}
const hidden = ['/_preview/kartu', '/_preview/interaksi', '/_preview/detail/layanan', '/_preview/detail/properti', '/_preview/detail/properti-terjual', '/_preview/detail/proyek', '/properti/tidak-ada', '/portofolio/tidak-ada'];
for (const filename of await readdir('src/content/services')) {
  const content = await readFile(join('src/content/services', filename), 'utf8');
  if (/^publishStatus:\s*(['"]?)draft\1\s*(?:#.*)?$/m.test(content)) hidden.push(`/layanan/${content.match(/^slug:\s*["']?([^\s"']+)/m)?.[1]}`);
}
for (const path of hidden) { const status = (await fetch(origin + path)).status; report.hiddenRoutes.push({ path, status }); if (status !== 404) report.issues.push(`Hidden ${path}`); }
for (const path of files.filter((file) => /\.(?:html|js|json|svg|xml)$/.test(file))) {
  const name = relative('dist', path).replaceAll('\\', '/');
  if (name.startsWith('admin/runtime/') && name.endsWith('.js')) {
    // The editor contains its own example strings. Verify the exact locked distribution instead.
    assert.deepEqual(await readFile(path), await readFile(join('node_modules/@sveltia/cms/dist', name.slice('admin/runtime/'.length))));
    continue;
  }
  const text = await readFile(path, 'utf8');
  if (/DEMO|\/_preview\/|77777777|123456789|Catatan draft/.test(text) || (!site.whatsappConfirmed && site.whatsappNumber && text.includes(site.whatsappNumber))) report.leaks.push(path);
}
const robots = await (await fetch(origin + '/robots.txt')).text(), sitemap = await (await fetch(origin + '/sitemap.xml')).text();
report.indexing = { enabled: site.indexingEnabled, robots, sitemapEntries: (sitemap.match(/<loc>/g) ?? []).length };
if (!site.indexingEnabled && (robots !== 'User-agent: *\nDisallow: /\n' || report.indexing.sitemapEntries !== 0)) report.issues.push('Robots/sitemap guard');
const home = pages.get('/');
let rawBytes = Buffer.byteLength(home), scripts = [...home.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter((m) => !m[1].includes('application/ld+json')).map((m) => m[2]).join('\n');
for (const url of assetUrls(home)) { const bytes = Buffer.from(await (await fetch(origin + url)).arrayBuffer()); rawBytes += bytes.length; if (/\.m?js$/.test(url)) scripts += bytes.toString('utf8'); }
report.budgets = { homeRawUpperBoundBytesIncludingAllImageVariants: rawBytes, homeApplicationJsGzipEstimateBytes: gzipSync(scripts).length, transferLimitBytes: 1500000, jsLimitBytes: 50000, note: 'Batas atas raw memakai seluruh varian srcset, bukan pengukuran transfer field. Ukuran JavaScript adalah estimasi gzip.' };
if (rawBytes > 1500000 || report.budgets.homeApplicationJsGzipEstimateBytes > 50000) report.issues.push('Home budget');
for (const path of ['docs/PRD_Landas_Creative.md', 'docs/DESIGN_Landas_Creative.md', 'src/data/site.json']) report.sourceHashes[path] = createHash('sha256').update(await readFile(path)).digest('hex');
const output = process.env.QA_OUTPUT_DIR ?? 'docs/verification/stage-5';
await mkdir(output, { recursive: true });
await writeFile(join(output, 'build-audit.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ pages: pages.size, internalLinks: report.internalLinks, assets: report.assets.length, hiddenRoutes: hidden.length, budgets: report.budgets, issues: report.issues, leaks: report.leaks }));
if (report.issues.length || report.leaks.length) process.exitCode = 1;
