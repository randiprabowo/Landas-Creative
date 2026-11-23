import test from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'astro/zod';
import { createServiceSchema, createPropertySchema, createProjectSchema } from '../src/schemas/content.ts';
import { canonicalUrl, robotsText, sitemapXml, serializeJsonLd } from '../src/utils/seo.ts';
import { assertContentIntegrity } from '../src/utils/content-integrity.ts';

// Stub hanya resolusi aset/referensi Astro; aturan publikasi memakai schema aplikasi yang sama.
const image = () => z.string().min(1);
const reference = (collection) => z.object({ id: z.string(), collection: z.literal(collection) });
const schemas = { service: createServiceSchema(image, reference), property: createPropertySchema(image), project: createProjectSchema(image, reference) };
const picture = { src: 'asset-test.webp', alt: 'Aset uji', caption: 'Keterangan uji', kind: 'ilustrasi', permissionConfirmed: true };
const common = { slug: 'konten-uji', title: 'Konten uji', publishStatus: 'published', summary: 'Ringkasan uji', createdAt: '2026-11-10T00:00:00+07:00', updatedAt: '2026-11-14T00:00:00+07:00' };
const samples = {
  service: { ...common, category: 'pembangunan-rumah', scope: ['Lingkup uji'], steps: ['Langkah uji'], coverImage: picture },
  property: { ...common, propertyType: 'rumah-komersial', description: 'Deskripsi uji', region: 'Wilayah uji', publicLocation: 'Lokasi publik uji', landAreaM2: 72, buildingAreaM2: 45, availability: 'tersedia', images: [picture], marketingRole: 'Peran uji' },
  project: { ...common, category: 'desain-3d', publicLocation: 'Lokasi publik uji', projectStatus: 'selesai', scope: ['Lingkup uji'], images: [picture] },
};
test('schema yang sama menerima data lengkap tanpa mengubah koleksi produksi', () => {
  for (const [key, sample] of Object.entries(samples)) assert.equal(schemas[key].safeParse(sample).success, true);
});
test('published menolak ringkasan kosong, gambar tanpa izin, dan urutan tanggal salah', () => {
  for (const [key, sample] of Object.entries(samples)) {
    assert.equal(schemas[key].safeParse({ ...sample, summary: '  ' }).success, false);
    assert.equal(schemas[key].safeParse({ ...sample, updatedAt: '2026-11-01T00:00:00+07:00' }).success, false);
    const data = key === 'service' ? { ...sample, coverImage: { ...picture, permissionConfirmed: false } } : { ...sample, images: [picture, { ...picture, permissionConfirmed: false }] };
    assert.equal(schemas[key].safeParse(data).success, false);
  }
});
test('published memerlukan gambar, lingkup/proses layanan, scope/caption proyek', () => {
  assert.equal(schemas.service.safeParse({ ...samples.service, coverImage: undefined }).success, false);
  for (const key of ['scope', 'steps']) assert.equal(schemas.service.safeParse({ ...samples.service, [key]: [] }).success, false);
  assert.equal(schemas.project.safeParse({ ...samples.project, scope: [] }).success, false);
  assert.equal(schemas.project.safeParse({ ...samples.project, images: [{ ...picture, caption: undefined }] }).success, false);
  assert.equal(schemas.property.safeParse({ ...samples.property, images: [] }).success, false);
});
test('harga published wajib disetujui dan angka rupiah utuh positif yang aman', () => {
  for (const [key, field] of [['service', 'startingPrice'], ['property', 'price']]) {
    assert.equal(schemas[key].safeParse({ ...samples[key], [field]: 400000000, priceConfirmed: false }).success, false);
    assert.equal(schemas[key].safeParse({ ...samples[key], [field]: 400000000, priceConfirmed: true }).success, true);
    for (const value of [0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1, '400000000']) assert.equal(schemas[key].safeParse({ ...samples[key], [field]: value, priceConfirmed: true }).success, false);
  }
});
test('ketiga tipe properti memerlukan lokasi, peran pemasaran, luas valid, dan izin denah', () => {
  for (const propertyType of ['rumah-komersial', 'rumah-subsidi', 'ruko']) {
    const sample = { ...samples.property, propertyType };
    for (const key of ['region', 'publicLocation', 'marketingRole', 'description']) assert.equal(schemas.property.safeParse({ ...sample, [key]: ' ' }).success, false);
    for (const key of ['landAreaM2', 'buildingAreaM2']) for (const value of [0, -1, undefined]) assert.equal(schemas.property.safeParse({ ...sample, [key]: value }).success, false);
    assert.equal(schemas.property.safeParse({ ...sample, floorPlan: { ...picture, permissionConfirmed: false } }).success, false);
  }
});
test('draft tetap default; enum, slug, alt, dan daftar whitespace divalidasi', () => {
  assert.equal(schemas.service.parse({ ...samples.service, publishStatus: undefined }).publishStatus, 'draft');
  assert.equal(schemas.service.safeParse({ ...samples.service, scope: [' '] }).success, false);
  assert.equal(schemas.property.safeParse({ ...samples.property, availability: 'ready' }).success, false);
  assert.equal(schemas.project.safeParse({ ...samples.project, slug: '../rahasia' }).success, false);
  assert.equal(schemas.project.safeParse({ ...samples.project, images: [{ ...picture, alt: ' ' }] }).success, false);
});
test('Markdown layanan menolak protokol berbahaya dan gambar tanpa metadata izin', () => {
  const content = (body) => ({ services: [{ id: 'uji', body, data: { slug: 'uji', publishStatus: 'published' } }], projects: [], properties: [] });
  for (const body of ['[klik](javascript:alert(1))', '![foto](foto.webp)', '![foto][aset]']) assert.throws(() => assertContentIntegrity(content(body)));
  assert.doesNotThrow(() => assertContentIntegrity(content('## Uraian\nData: lingkup pekerjaan. Teks dengan [tautan](https://example.test).')));
});
const approved = { siteUrl: 'https://example.test', indexingEnabled: true };
test('SEO tidak menghasilkan domain/canonical fiktif sebelum domain dan indexing siap', () => {
  for (const settings of [{ siteUrl: null, indexingEnabled: false }, { siteUrl: null, indexingEnabled: true }, { siteUrl: approved.siteUrl, indexingEnabled: false }]) {
    assert.equal(canonicalUrl(settings, '/properti'), null);
    assert.equal(robotsText(settings), 'User-agent: *\nDisallow: /\n');
    assert.doesNotMatch(sitemapXml(settings, [{ path: '/' }]), /<loc>/);
  }
});
test('canonical menghapus query/fragment, memakai domain resmi, mengecualikan preview/404', () => {
  assert.equal(canonicalUrl(approved, '/properti/?min=0#filter'), 'https://example.test/properti');
  for (const path of ['/404', '/_preview/kartu', '/_preview/detail/properti']) assert.equal(canonicalUrl(approved, path), null);
  assert.equal(canonicalUrl(approved, '/kontak', true), null);
  assert.throws(() => canonicalUrl(approved, '//other.test'));
});
test('sitemap dan robots berasal dari rute yang diberikan dan domain resmi', () => {
  const xml = sitemapXml(approved, [{ path: '/' }, { path: '/properti/terbit', updatedAt: common.updatedAt }, { path: '/_preview/kartu' }, { path: '/404' }]);
  assert.equal((xml.match(/<loc>/g) ?? []).length, 2);
  assert.match(xml, /<lastmod>2026-11-14/);
  assert.match(robotsText(approved), /Sitemap: https:\/\/example\.test\/sitemap.xml/);
});
test('JSON-LD menghindari penutupan script dan mempertahankan nilai teks', () => {
  const value = { name: '</script><script>alert(1)</script>&' };
  const serialized = serializeJsonLd(value);
  assert.doesNotMatch(serialized, /<|>|&/);
  assert.deepEqual(JSON.parse(serialized), value);
});
