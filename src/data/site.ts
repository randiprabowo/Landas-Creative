import { z } from 'astro/zod';
import rawSite from './site.json';

const httpsUrl = z.url({ protocol: /^https$/ });

const siteSchema = z.object({
  brandName: z.literal('Landas Creative'),
  tagline: z.literal('Foundations & Growth'),
  logo: z.string().min(1),
  // Format internasional tanpa tanda +. Nilai referensi belum boleh diaktifkan.
  whatsappNumber: z.string().regex(/^62[1-9]\d{7,12}$/).nullable().default(null),
  whatsappConfirmed: z.boolean(),
  email: z.email().nullable().default(null),
  publicAddress: z.string().trim().min(1).nullable().default(null),
  serviceAreas: z.array(z.string().trim().min(1)).default([]),
  socialLinks: z.array(z.object({ label: z.string().min(1), url: httpsUrl })).default([]),
  siteUrl: httpsUrl.refine((value) => {
    const url = new URL(value);
    return url.pathname === '/' && !url.search && !url.hash && !url.username && !url.password;
  }, 'Domain website harus HTTPS pada root, tanpa path, query, kredensial, atau fragment.').nullable().default(null),
  indexingEnabled: z.boolean(),
  defaultSeo: z.object({ title: z.string().min(1), description: z.string().min(1) }),
}).superRefine((data, context) => {
  if (data.whatsappConfirmed && !data.whatsappNumber) {
    context.addIssue({ code: 'custom', path: ['whatsappNumber'], message: 'Kontak terkonfirmasi harus memiliki nomor.' });
  }
  if (data.indexingEnabled && !data.siteUrl) {
    context.addIssue({ code: 'custom', path: ['siteUrl'], message: 'Konfirmasi domain sebelum mengaktifkan indexing.' });
  }
});

export const site = siteSchema.parse(rawSite);

// Tidak mengekspor nomor referensi sebagai kontak yang siap digunakan.
export const verifiedWhatsappNumber = site.whatsappConfirmed ? site.whatsappNumber : null;
