import { z } from 'astro/zod';
import rawHome from './home.json';
import { resolveAsset } from '../utils/assets';
import { supplementalMedia } from '../schemas/media';

const text = z.string().trim().min(1);
const section = z.object({ eyebrow: text, title: text, description: text });
const item = z.object({ title: text, description: text });
const homeSchema = z.object({
  hero: section.extend({
    accent: text,
    primaryLabel: text,
    secondaryLabel: text,
    ...supplementalMedia,
    media: z.object({
      src: z.string().min(1).nullable().default(null), alt: z.string().default(''), caption: z.string().default(''),
      kind: z.enum(['foto-proyek', 'visualisasi-3d', 'ilustrasi']),
      permissionConfirmed: z.boolean(),
    }).superRefine((media, context) => {
      if (media.src && media.permissionConfirmed && (!media.alt.trim() || !media.caption.trim())) {
        context.addIssue({ code: 'custom', message: 'Gambar hero yang disetujui wajib memiliki alt dan caption.' });
      }
    }),
  }),
  introduction: section.extend({ commitments: z.array(item).length(3) }),
  services: section.extend({ emptyTitle: text, emptyDescription: text, emptyActionLabel: text }),
  properties: section,
  projects: section,
  workflow: section.extend({ steps: z.array(item).length(5) }),
  partnership: section.extend({ notice: text, actionLabel: text }),
  closing: section.extend({ actionLabel: text }),
  availability: z.object({ contact: text, properties: text, projects: text }),
  footer: z.object({ description: text }),
});

export const home = homeSchema.parse(rawHome);
// Foto yang belum diizinkan tidak pernah diteruskan ke komponen publik.
export const heroImage = home.hero.media.src && home.hero.media.permissionConfirmed
  ? resolveAsset(home.hero.media.src) : undefined;
