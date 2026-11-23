import type { Field, StringField, TextField, ObjectFieldWithSubFields, ListField } from '@sveltia/cms';

export const short = (name: string, label: string, required = true): StringField =>
  ({ name, label, widget: 'string', required });
export const prose = (name: string, label: string, required = true): TextField =>
  ({ name, label, widget: 'text', required });
export const group = (name: string, label: string, fields: Field[], required = true): ObjectFieldWithSubFields =>
  ({ name, label, widget: 'object', fields, required, collapsed: true });
export const lines = (name: string, label: string, required = false): ListField =>
  ({ name, label, widget: 'list', required, field: short('text', 'Teks') });
export const toggle = (name: string, label: string): Field =>
  ({ name, label, widget: 'boolean', default: false });
export const select = (name: string, label: string, options: string[], initial?: string): Field =>
  ({ name, label, widget: 'select', options, ...(initial && { default: initial }) });
export const photo = (name: string, label: string, required = true): Field =>
  ({ name, label, required, widget: 'image', choose_url: false, accept: '.jpg,.jpeg,.png,.webp,.avif,.svg' });
export const kind = select('kind', 'Jenis gambar', ['foto-proyek', 'visualisasi-3d', 'ilustrasi']);
export const permission = toggle('permissionConfirmed', 'Izin penggunaan gambar sudah dikonfirmasi');
export const heading = [short('eyebrow', 'Label bagian'), short('title', 'Judul'), prose('description', 'Pengantar')];
export const action = short('actionLabel', 'Teks tombol');

export const mediaFields: Field[] = [
  group('video', 'Video YouTube', [
    { ...short('url', 'Tautan atau ID video YouTube'), hint: 'Salin tautan video yang mengizinkan penyematan. Gunakan URL video, bukan URL kanal.' },
    short('title', 'Judul video'),
    prose('caption', 'Keterangan video', false),
    toggle('permissionConfirmed', 'Video sudah disetujui untuk tampil'),
  ], false),
  group('model', 'Model 3D interaktif', [
    { name: 'src', label: 'File model (.glb)', widget: 'file', accept: '.glb', choose_url: false,
      media_folder: '/src/assets/models', public_folder: '/src/assets/models',
      hint: 'Ekspor GLB dengan tekstur tertanam. Gunakan nama berkas tanpa spasi.' },
    short('title', 'Judul model'),
    prose('caption', 'Keterangan model dan konteks visualisasi'),
    toggle('permissionConfirmed', 'Model sudah disetujui untuk tampil'),
  ], false),
];
