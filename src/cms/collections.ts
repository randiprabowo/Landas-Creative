import type { EntryCollection, Field } from '@sveltia/cms';
import { categoryLabels, propertyTypeLabels, availabilityLabels, projectStatusLabels } from '../data/labels.ts';
import { group, kind, lines, mediaFields, permission, photo, prose, select, short, toggle } from './fields.ts';

const slug: Field = { ...short('slug', 'Slug URL'), unique: true,
  pattern: ['^[a-z0-9]+(?:-[a-z0-9]+)*$', 'Gunakan huruf kecil, angka, dan tanda hubung.'] };
const id: Field = { ...short('id', 'ID tetap'), unique: true, hint: 'Pertahankan ID yang sudah dirujuk oleh konten lain.' };
const common: Field[] = [
  short('title', 'Judul'), slug, { ...select('publishStatus', 'Status publikasi', ['draft', 'published'], 'draft'),
    hint: 'Pilih published hanya untuk konten yang sudah disetujui pemilik.' },
  toggle('featured', 'Tampilkan sebagai pilihan'), prose('summary', 'Ringkasan', false),
  { name: 'createdAt', label: 'Dibuat', widget: 'datetime', auto_now: ['create'], output_utc: true },
  { name: 'updatedAt', label: 'Diperbarui', widget: 'datetime', auto_now: true, output_utc: true },
];
const category = select('category', 'Kategori pekerjaan', Object.keys(categoryLabels));
const imageFields = [photo('src', 'Berkas gambar'), short('alt', 'Deskripsi aksesibel'),
  prose('caption', 'Keterangan gambar', false), kind, permission];
const gallery: Field = { name: 'images', label: 'Galeri foto dan visualisasi', widget: 'list', required: false, fields: imageFields };
const confirmed = toggle('priceConfirmed', 'Harga sudah dikonfirmasi oleh pemilik');
const number = (name: string, label: string, min: number, required = false): Field =>
  ({ name, label, widget: 'number', value_type: 'int', min, required });
const area = (name: string, label: string): Field => ({ name, label, widget: 'number', value_type: 'float', step: 0.01 });
const relation = (name: string, label: string, collection: string, value: string): Field =>
  ({ name, label, collection, widget: 'relation', multiple: true, required: false, value_field: value,
     search_fields: ['title', 'slug'], display_fields: ['title'] });
const jsonMedia = { media_folder: '../assets/photos', public_folder: '../assets/photos' };

export const collections: EntryCollection[] = [
  {
    name: 'services', label: 'Layanan', folder: 'src/content/services', create: true,
    format: 'yaml-frontmatter', extension: 'md', slug: '{{fields.slug}}',
    media_folder: '../../assets/photos', public_folder: '../../assets/photos',
    fields: [...common, category, { name: 'body', label: 'Uraian layanan (Markdown)', widget: 'text', required: false,
      hint: 'Gunakan paragraf, daftar dan judul mulai ##. Masukkan gambar melalui kolom sampul.' },
      lines('scope', 'Lingkup pekerjaan'), lines('exclusions', 'Pengecualian'), lines('steps', 'Langkah pekerjaan'),
      group('coverImage', 'Gambar sampul', imageFields, false), ...mediaFields, number('startingPrice', 'Harga mulai (Rp)', 1),
      short('priceUnit', 'Satuan harga', false), prose('priceNote', 'Catatan harga', false), confirmed,
      relation('relatedProjectIds', 'Proyek terkait', 'projects', 'id')],
  },
  {
    name: 'properties', label: 'Properti', file: 'src/content/properties.json', create: true, ...jsonMedia,
    fields: [id, ...common, select('propertyType', 'Tipe properti', Object.keys(propertyTypeLabels)),
      select('availability', 'Ketersediaan', Object.keys(availabilityLabels)), prose('description', 'Deskripsi'),
      short('region', 'Wilayah'), short('publicLocation', 'Lokasi yang boleh ditampilkan'),
      prose('marketingRole', 'Peran pemasaran Landas Creative'), number('price', 'Harga (Rp)', 1),
      short('priceLabel', 'Keterangan pengganti harga', false), confirmed, area('landAreaM2', 'Luas tanah (m²)'),
      area('buildingAreaM2', 'Luas bangunan (m²)'), number('bedrooms', 'Kamar tidur', 0),
      number('bathrooms', 'Kamar mandi', 0), number('floors', 'Jumlah lantai', 1),
      lines('facilities', 'Fasilitas'), gallery, ...mediaFields, group('floorPlan', 'Denah', imageFields, false)],
  },
  {
    name: 'projects', label: 'Portofolio proyek', file: 'src/content/projects.json', create: true, ...jsonMedia,
    fields: [id, ...common, category, prose('body', 'Uraian proyek', false), short('publicLocation', 'Lokasi yang boleh ditampilkan'),
      number('year', 'Tahun', 1), select('projectStatus', 'Status pengerjaan', Object.keys(projectStatusLabels)),
      lines('scope', 'Lingkup pekerjaan'), gallery, relation('relatedServiceIds', 'Layanan terkait', 'services', '{{slug}}')],
  },
];
