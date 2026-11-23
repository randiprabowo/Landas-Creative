import { z } from 'astro/zod';
import data from './pages.json';
const text = z.string().trim().min(1);
const localHref = z.string().regex(/^\/(?!\/)[^\\\s]*$/);
const heading = z.object({ eyebrow: text, title: text, description: text });
const catalog = heading.extend({ emptyTitle: text, emptyDescription: text, actionLabel: text, actionHref: localHref });
export const pages = z.object({
  services: catalog, properties: catalog, projects: catalog,
  about: heading.extend({ profileTitle: text, profile: text, vision: text.nullable().default(null), mission: z.array(text).default([]), commitmentTitle: text }),
  privacy: heading.extend({ sections: z.array(z.object({
    title: text, paragraphs: z.array(text).min(1), linkLabel: text.optional(),
    linkHref: z.union([localHref, z.url({ protocol: /^https$/ })]).optional(),
  }).refine((section) => Boolean(section.linkLabel) === Boolean(section.linkHref), 'Isi label dan tujuan tautan berpasangan.')).min(1) }),
  notFound: heading.extend({ seoTitle: text, seoDescription: text, actionLabel: text }),
  detail: z.object({ costNote: text, contactNotice: text, contactActionLabel: text, contactHref: localHref }),
}).parse(data);
