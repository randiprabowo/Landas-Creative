import { z } from 'astro/zod';
import raw from './contact.json';
const text = z.string().trim().min(1);
const heading = z.object({ eyebrow: text, title: text, description: text });
export const contactCopy = z.object({
  contact: heading.extend({ informationTitle: text, introduction: text, pendingNotice: text, areaEmpty: text, formTitle: text }),
  partnership: heading.extend({ informationTitle: text, introduction: text, terms: text.nullable().default(null), termsPending: text, preparation: z.array(text).min(1), formTitle: text }),
  form: z.object({ handoffNotice: text, privacyNotice: text, previewLabel: text, submitLabel: text }),
}).parse(raw);
