import { z } from 'astro/zod';
import { modelFileName, parseYouTubeId } from '../utils/media.ts';

const text = z.string().trim().min(1);

export const supplementalMedia = {
  video: z.object({
    url: text.refine((value) => Boolean(parseYouTubeId(value)), 'Gunakan URL video YouTube atau ID video.'),
    title: text,
    caption: text.optional(),
    permissionConfirmed: z.boolean().default(false),
  }).optional(),
  model: z.object({
    src: text.refine((value) => Boolean(modelFileName(value)), 'Pilih file .glb dari folder src/assets/models.'),
    title: text,
    caption: text,
    permissionConfirmed: z.boolean().default(false),
  }).optional(),
};

export type VideoMedia = z.infer<typeof supplementalMedia.video>;
export type ModelMedia = z.infer<typeof supplementalMedia.model>;
