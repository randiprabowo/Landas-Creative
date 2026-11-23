import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { getPublishedContent } from '../utils/content';
import { publicPagePaths, sitemapXml } from '../utils/seo';

export const GET: APIRoute = async () => {
  const { services, properties, projects } = await getPublishedContent();
  const entries = [
    ...publicPagePaths.map((path) => ({ path })),
    ...services.map(({ data }) => ({ path: `/layanan/${data.slug}`, updatedAt: data.updatedAt })),
    ...properties.map(({ data }) => ({ path: `/properti/${data.slug}`, updatedAt: data.updatedAt })),
    ...projects.map(({ data }) => ({ path: `/portofolio/${data.slug}`, updatedAt: data.updatedAt })),
  ];
  return new Response(sitemapXml(site, entries), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
