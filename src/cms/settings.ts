import type { CollectionFile, Field } from '@sveltia/cms';
import { action, group, heading, kind, lines, mediaFields, permission, photo, prose, short, toggle } from './fields.ts';

function settingsFile(name: string, label: string, fields: Field[]): CollectionFile {
  return { name, label, file: 'src/data/' + name + '.json', format: 'json', fields };
}
const localLink = (name: string, label: string): Field => ({
  ...short(name, label), pattern: ['^/(?!/)[^\\\\\\s]*$', 'Gunakan alamat di dalam website, diawali satu garis miring.'],
});
const catalog = [...heading, short('emptyTitle', 'Judul saat kosong'), prose('emptyDescription', 'Pesan saat kosong'), action, localLink('actionHref', 'Tujuan tombol')];
const steps = (name: string, label: string, count: number): Field => ({
  name, label, widget: 'list', min: count, max: count, summary: '{{fields.title}}',
  fields: [short('title', 'Judul'), prose('description', 'Keterangan')],
});

export const settings = [
  settingsFile('site', 'Identitas, kontak dan SEO', [
    { ...short('brandName', 'Nama perusahaan'), readonly: true }, { ...short('tagline', 'Tagline resmi'), readonly: true },
    { ...photo('logo', 'Logo resmi LNDS'), media_folder: '/src/assets/brand', public_folder: '/src/assets/brand' },
    { ...short('whatsappNumber', 'Nomor WhatsApp', false), pattern: ['^62[1-9][0-9]{7,12}$', 'Mulai dengan 62, tanpa spasi atau tanda +.'] },
    toggle('whatsappConfirmed', 'Pemilik sudah menyetujui aktivasi nomor ini'),
    { ...short('email', 'Email publik', false), type: 'email' }, prose('publicAddress', 'Alamat publik', false),
    lines('serviceAreas', 'Area layanan'), { name: 'socialLinks', label: 'Media sosial resmi', widget: 'list', required: false,
      fields: [short('label', 'Nama kanal'), { ...short('url', 'Alamat HTTPS'), pattern: ['^https://', 'Gunakan HTTPS.'] }] },
    { ...short('siteUrl', 'Domain resmi', false), hint: 'Isi setelah domain ditetapkan. Gunakan HTTPS tanpa path.' },
    toggle('indexingEnabled', 'Pemilik sudah menyetujui pengindeksan mesin pencari'),
    group('defaultSeo', 'Judul dan deskripsi pencarian', [short('title', 'Judul'), prose('description', 'Deskripsi')]),
  ]),
  settingsFile('home', 'Beranda dan footer', [
    group('hero', 'Pembuka beranda', [...heading, short('accent', 'Baris judul berwarna teal'),
      short('primaryLabel', 'Tombol utama'), short('secondaryLabel', 'Tombol kedua'),
      group('media', 'Foto pembuka', [photo('src', 'Gambar', false), short('alt', 'Deskripsi aksesibel', false),
        prose('caption', 'Keterangan', false), kind, permission]), ...mediaFields]),
    group('introduction', 'Perkenalan dan komitmen', [...heading, steps('commitments', 'Tiga komitmen', 3)]),
    group('services', 'Layanan', [...heading, short('emptyTitle', 'Judul saat kosong'), prose('emptyDescription', 'Pesan saat kosong'), short('emptyActionLabel', 'Teks tombol saat kosong')]),
    group('properties', 'Properti pilihan', heading), group('projects', 'Proyek pilihan', heading),
    group('workflow', 'Cara kerja', [...heading, steps('steps', 'Lima langkah', 5)]),
    group('partnership', 'Ajakan kemitraan', [...heading, prose('notice', 'Catatan'), action]),
    group('closing', 'Ajakan penutup', [...heading, action]),
    group('availability', 'Keterangan ketersediaan', [prose('contact', 'Kontak'), prose('properties', 'Properti'), prose('projects', 'Proyek')]),
    group('footer', 'Footer', [prose('description', 'Deskripsi perusahaan')]),
  ]),
  settingsFile('pages', 'Katalog, profil, privasi dan 404', [
    group('services', 'Katalog layanan', catalog), group('properties', 'Katalog properti', catalog), group('projects', 'Katalog portofolio', catalog),
    group('about', 'Tentang kami', [...heading, short('profileTitle', 'Judul profil'), prose('profile', 'Profil perusahaan'),
      prose('vision', 'Visi', false), lines('mission', 'Misi'), short('commitmentTitle', 'Judul komitmen')]),
    group('detail', 'Halaman detail', [prose('costNote', 'Catatan biaya'), prose('contactNotice', 'Catatan kontak'), short('contactActionLabel', 'Teks tombol'), localLink('contactHref', 'Tujuan tombol')]),
    group('privacy', 'Kebijakan privasi', [...heading, { name: 'sections', label: 'Bagian kebijakan', widget: 'list', min: 1,
      fields: [short('title', 'Judul bagian'), lines('paragraphs', 'Paragraf', true), short('linkLabel', 'Teks tautan', false), short('linkHref', 'Alamat tautan', false)] }]),
    group('notFound', 'Halaman 404', [...heading, short('seoTitle', 'Judul tab'), prose('seoDescription', 'Deskripsi halaman'), action]),
  ]),
  settingsFile('contact', 'Halaman kontak, kemitraan dan formulir', [
    group('contact', 'Kontak', [...heading, short('informationTitle', 'Judul informasi'), prose('introduction', 'Petunjuk konsultasi'), prose('pendingNotice', 'Pesan kontak belum aktif'),
      prose('areaEmpty', 'Pesan area belum tersedia'), short('formTitle', 'Judul formulir')]),
    group('partnership', 'Kemitraan', [...heading, short('informationTitle', 'Judul informasi'), prose('introduction', 'Keterangan'),
      prose('terms', 'Ketentuan resmi yang sudah disetujui', false), prose('termsPending', 'Pesan saat ketentuan belum tersedia'),
      lines('preparation', 'Yang bisa disiapkan', true), short('formTitle', 'Judul formulir')]),
    group('form', 'Petunjuk formulir WhatsApp', [prose('handoffNotice', 'Penjelasan sebelum membuka WhatsApp'),
      prose('privacyNotice', 'Catatan privasi'), short('previewLabel', 'Tombol pratinjau'), short('submitLabel', 'Tombol WhatsApp')]),
  ]),
];
