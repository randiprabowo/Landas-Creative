import type { SchemaContext, reference as Reference } from 'astro:content';
import { z } from 'astro/zod';
import { supplementalMedia } from './media.ts';

const category = z.enum([
  'pembangunan-rumah', 'desain-3d', 'sumur-bor',
  'atap-spandek-baja-ringan', 'pemasaran-properti',
]);

const common = {
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1),
  publishStatus: z.enum(['draft', 'published']).default('draft'),
  featured: z.boolean().default(false),
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
  summary: z.string().trim().default(''),
};

function imageSchema(image: SchemaContext['image']) {
  return z.object({
    // Path relatif ke berkas konten. Astro memvalidasi dan memproses aset lokal.
    src: image(),
    alt: z.string().trim().min(1),
    caption: z.string().trim().min(1).optional(),
    kind: z.enum(['foto-proyek', 'visualisasi-3d', 'ilustrasi']),
    permissionConfirmed: z.boolean().default(false),
  });
}

type PublicationData = {
  publishStatus: 'draft' | 'published';
  summary: string;
  createdAt: string;
  updatedAt: string;
};

function validatePublication(
  data: PublicationData,
  images: { permissionConfirmed: boolean }[],
  imagePath: string,
  context: z.RefinementCtx,
) {
  if (Date.parse(data.updatedAt) < Date.parse(data.createdAt)) {
    context.addIssue({ code: 'custom', path: ['updatedAt'], message: 'updatedAt tidak boleh sebelum createdAt.' });
  }
  if (data.publishStatus !== 'published') return;
  if (!data.summary) {
    context.addIssue({ code: 'custom', path: ['summary'], message: 'Konten published wajib memiliki ringkasan.' });
  }
  if (!images.length || images.some((image) => !image.permissionConfirmed)) {
    context.addIssue({ code: 'custom', path: [imagePath], message: 'Konten published wajib memiliki gambar utama dan izin untuk seluruh gambar.' });
  }
}

export function createServiceSchema(image: SchemaContext['image'], reference: typeof Reference) {
  return z.object({
    ...common,
    category,
    scope: z.array(z.string().trim().min(1)).default([]),
    exclusions: z.array(z.string().trim().min(1)).default([]),
    steps: z.array(z.string().trim().min(1)).default([]),
    coverImage: imageSchema(image).optional(),
    ...supplementalMedia,
    startingPrice: z.number().int().positive().max(Number.MAX_SAFE_INTEGER).optional(),
    priceUnit: z.string().trim().min(1).optional(),
    priceNote: z.string().default(''),
    priceConfirmed: z.boolean().default(false),
    relatedProjectIds: z.array(reference('projects')).default([]),
  }).superRefine((data, context) => {
    validatePublication(data, data.coverImage ? [data.coverImage] : [], 'coverImage', context);
    if (data.publishStatus === 'published' && (!data.scope.length || !data.steps.length)) {
      context.addIssue({ code: 'custom', path: ['scope'], message: 'Lengkapi lingkup dan proses layanan sebelum diterbitkan.' });
    }
    if (data.publishStatus === 'published' && data.startingPrice !== undefined && !data.priceConfirmed) {
      context.addIssue({ code: 'custom', path: ['startingPrice'], message: 'Harga layanan harus dikonfirmasi sebelum diterbitkan.' });
    }
  });
}

export function createPropertySchema(image: SchemaContext['image']) {
  return z.object({
    ...common,
    propertyType: z.enum(['rumah-komersial', 'rumah-subsidi', 'ruko']),
    description: z.string().trim().min(1),
    region: z.string().trim().min(1),
    publicLocation: z.string().trim().min(1),
    price: z.number().int().positive().max(Number.MAX_SAFE_INTEGER).optional(),
    priceLabel: z.string().default('Hubungi kami untuk informasi harga'),
    priceConfirmed: z.boolean().default(false),
    landAreaM2: z.number().positive(),
    buildingAreaM2: z.number().positive(),
    bedrooms: z.number().int().nonnegative().optional(),
    bathrooms: z.number().int().nonnegative().optional(),
    floors: z.number().int().positive().optional(),
    availability: z.enum(['tersedia', 'dipesan', 'terjual']),
    images: z.array(imageSchema(image)).default([]),
    floorPlan: imageSchema(image).optional(),
    ...supplementalMedia,
    facilities: z.array(z.string().trim().min(1)).default([]),
    marketingRole: z.string().trim().min(1),
  }).superRefine((data, context) => {
    validatePublication(data, data.images, 'images', context);
    if (data.publishStatus !== 'published') return;
    if (data.price !== undefined && !data.priceConfirmed) {
      context.addIssue({ code: 'custom', path: ['price'], message: 'Harga properti harus dikonfirmasi sebelum diterbitkan.' });
    }
    if (data.floorPlan && !data.floorPlan.permissionConfirmed) {
      context.addIssue({ code: 'custom', path: ['floorPlan'], message: 'Izin denah wajib dikonfirmasi.' });
    }
  });
}

export function createProjectSchema(image: SchemaContext['image'], reference: typeof Reference) {
  return z.object({
    ...common,
    category,
    body: z.string().default(''),
    publicLocation: z.string().trim().min(1),
    year: z.number().int().positive().optional(),
    projectStatus: z.enum(['berjalan', 'selesai']),
    scope: z.array(z.string().trim().min(1)).default([]),
    images: z.array(imageSchema(image)).default([]),
    relatedServiceIds: z.array(reference('services')).default([]),
  }).superRefine((data, context) => {
    validatePublication(data, data.images, 'images', context);
    if (data.publishStatus === 'published' && !data.scope.length) {
      context.addIssue({ code: 'custom', path: ['scope'], message: 'Lingkup proyek published wajib diisi.' });
    }
    if (data.publishStatus === 'published' && data.images.some((image) => !image.caption)) {
      context.addIssue({ code: 'custom', path: ['images'], message: 'Dokumentasi proyek published wajib memiliki keterangan gambar.' });
    }
  });
}
