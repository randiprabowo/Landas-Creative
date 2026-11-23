export interface SeoSettings { siteUrl: string | null; indexingEnabled: boolean; }
export const publicPagePaths = ['/', '/tentang', '/layanan', '/properti', '/portofolio', '/kemitraan', '/kontak', '/privasi'] as const;

export function canonicalUrl(settings: SeoSettings, path: string, exclude = false): string | null {
  if (exclude || !settings.indexingEnabled || !settings.siteUrl || path === '/404' || path.startsWith('/_preview/') || /^\/admin(?:\/|$)/.test(path)) return null;
  const url = new URL(path, settings.siteUrl);
  url.search = ''; url.hash = '';
  if (url.origin !== new URL(settings.siteUrl).origin) throw new Error('URL canonical harus berada pada domain website.');
  return url.href.replace(/\/$/, path === '/' ? '/' : '');
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

export function xmlEscape(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

interface SitemapEntry { path: string; updatedAt?: string; }
export function sitemapXml(settings: SeoSettings, entries: SitemapEntry[]): string {
  const urls = entries.flatMap((entry) => {
    const url = canonicalUrl(settings, entry.path);
    return url ? [`<url><loc>${xmlEscape(url)}</loc>${entry.updatedAt ? `<lastmod>${xmlEscape(entry.updatedAt)}</lastmod>` : ''}</url>`] : [];
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>\n`;
}

export function robotsText(settings: SeoSettings): string {
  const home = canonicalUrl(settings, '/');
  return home ? `User-agent: *\nAllow: /\nDisallow: /_preview/\nDisallow: /admin/\nSitemap: ${new URL('/sitemap.xml', home).href}\n` : 'User-agent: *\nDisallow: /\n';
}
