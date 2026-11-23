import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { parseContentRows } from './utils/content-integrity';
import { createServiceSchema, createPropertySchema, createProjectSchema } from './schemas/content';

const services = defineCollection({
  loader: glob({
    base: './src/content/services', pattern: '*.md',
    // ID referensi mengikuti nama berkas; slug URL dapat diubah terpisah.
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: ({ image }) => createServiceSchema(image, reference),
});
const properties = defineCollection({
  loader: file('./src/content/properties.json', { parser: parseContentRows }),
  schema: ({ image }) => createPropertySchema(image),
});
const projects = defineCollection({
  loader: file('./src/content/projects.json', { parser: parseContentRows }),
  schema: ({ image }) => createProjectSchema(image, reference),
});
export const collections = { services, properties, projects };
