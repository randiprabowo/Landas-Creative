// Hanya diimpor oleh route yang diinjeksi untuk `astro dev`.
// Jangan memindahkan fixture ke Content Collections atau src/data/home.json.
import type { CollectionEntry } from 'astro:content';
import illustration from '../assets/illustrations/architecture.svg';

const metadata = {
  publishStatus: 'draft' as const, featured: false,
  createdAt: '2026-11-14T00:00:00+07:00', updatedAt: '2026-11-14T00:00:00+07:00',
};
const serviceNames = [
  ['pembangunan-rumah', 'Pembangunan Rumah'], ['desain-3d', 'Desain 3D Rumah'],
  ['sumur-bor', 'Sumur Bor'], ['atap-spandek-baja-ringan', 'Atap Spandek & Baja Ringan'],
  ['pemasaran-properti', 'Pemasaran Properti'],
] as const;

export const demoServices: CollectionEntry<'services'>['data'][] = serviceNames.map(([category, title]) => ({
  ...metadata, category, slug: `demo-${category}`, title: `DEMO — ${title}`,
  summary: 'Contoh susunan kartu untuk meninjau ikon, judul, ringkasan, dan ruang antarelemen. Bukan penawaran.',
  scope: [], exclusions: [], steps: [], priceNote: '', priceConfirmed: false, relatedProjectIds: [],
}));

export const demoProperties: CollectionEntry<'properties'>['data'][] = ['tersedia', 'terjual'].map((availability, index) => ({
  ...metadata, slug: `demo-properti-${index + 1}`, title: index ? 'DEMO — Judul properti panjang untuk menguji susunan kartu di layar kecil' : 'DEMO — Contoh susunan kartu properti',
  summary: 'Data buatan untuk pratinjau desain.', description: 'Bukan properti yang dipasarkan.',
  propertyType: 'rumah-komersial', region: 'Wilayah DEMO', publicLocation: 'Lokasi DEMO',
  priceLabel: 'Hubungi kami untuk informasi harga', priceConfirmed: false,
  landAreaM2: 72, buildingAreaM2: 45, bedrooms: 2, bathrooms: 1, floors: 1,
  availability: availability as 'tersedia' | 'terjual', images: [], facilities: [], marketingRole: 'DEMO — bukan hubungan pemasaran nyata',
}));

export const demoProjects: CollectionEntry<'projects'>['data'][] = [{
  ...metadata, slug: 'demo-konsep-arsitektur', title: 'DEMO — Konsep arsitektur',
  category: 'desain-3d', summary: 'Ilustrasi konsep untuk meninjau komposisi kartu. Bukan proyek Landas Creative.',
  body: '', publicLocation: 'Lokasi DEMO', projectStatus: 'berjalan', scope: [], relatedServiceIds: [],
  images: [{ src: illustration, alt: 'Diagram arsitektur konseptual untuk pratinjau DEMO', caption: 'DEMO · Ilustrasi buatan, bukan dokumentasi pekerjaan.', kind: 'visualisasi-3d', permissionConfirmed: true }],
}];
