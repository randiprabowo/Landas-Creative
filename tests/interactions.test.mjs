import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultFilters, findProperties, parsePriceRange } from '../src/utils/property-search.ts';
import { buildWhatsappUrl, composeMessage } from '../src/utils/whatsapp.ts';

const base = { title: 'Rumah', region: 'Utara', publicLocation: 'Kota A', propertyType: 'rumah-komersial', availability: 'tersedia', featured: false, updatedAt: '2026-11-10T00:00:00+07:00' };
const entries = [
  { ...base, id: 'a', title: 'Rumah Taman', price: 400, featured: true },
  { ...base, id: 'b', title: 'Ruko', region: 'Selatan', propertyType: 'ruko', availability: 'dipesan', price: 700, updatedAt: '2026-11-13T00:00:00+07:00' },
  { ...base, id: 'c', availability: 'terjual', price: 200 },
  { ...base, id: 'd', updatedAt: '2026-11-14T00:00:00+07:00' },
];
const ids = (filters = {}) => findProperties(entries, { ...defaultFilters, ...filters }).map(({ id }) => id);

test('pencarian mengabaikan kapital dan spasi tepi pada nama/lokasi/wilayah', () => {
  assert.deepEqual(ids({ query: '  TAMAN  ' }), ['a']);
  assert.deepEqual(ids({ query: 'selATan' }), ['b']);
  assert.equal(ids({ query: ' kota A ' }).length, 4);
});
test('semua filter digabung AND dan rentang harga inklusif', () => {
  assert.deepEqual(ids({ query: 'rumah', type: 'rumah-komersial', region: 'Utara', availability: 'tersedia', min: '400', max: '400' }), ['a']);
  assert.deepEqual(ids({ type: 'ruko', region: 'Utara' }), []);
});
test('harga kosong dikecualikan hanya ketika rentang harga aktif, termasuk nol', () => {
  assert.equal(ids().length, 4);
  assert.deepEqual(ids({ min: '0' }), ['a', 'b', 'c']);
  assert.deepEqual(ids({ max: '200' }), ['c']);
});
test('rentang menolak format nonangka, negatif, pecahan, unsafe integer, min > max', () => {
  for (const bad of ['-1', '1.000', '2,5', '3e2', 'abc', '9007199254740992']) assert.ok(parsePriceRange(bad, '').error);
  assert.equal(parsePriceRange('600', '400').field, 'max');
  assert.deepEqual(parsePriceRange(' 0 ', ''), { lower: 0, upper: undefined });
  assert.deepEqual(parsePriceRange('', ''), { lower: undefined, upper: undefined });
});
test('unggulan default dan terbaru menggunakan updatedAt, tanpa memutasi sumber', () => {
  assert.deepEqual(ids(), ['a', 'd', 'b', 'c']);
  assert.deepEqual(ids({ sort: 'newest' }), ['d', 'b', 'a', 'c']);
  assert.deepEqual(entries.map(({ id }) => id), ['a', 'b', 'c', 'd']);
});
test('harga kosong terakhir pada kedua arah harga', () => {
  assert.deepEqual(ids({ sort: 'price-asc' }), ['c', 'a', 'b', 'd']);
  assert.deepEqual(ids({ sort: 'price-desc' }), ['b', 'a', 'c', 'd']);
});
test('reset ke filter default memulihkan seluruh hasil dan unggulan', () => {
  assert.equal(ids({ query: 'tidak ditemukan' }).length, 0);
  assert.deepEqual(ids(defaultFilters), ['a', 'd', 'b', 'c']);
});
test('nomor belum dikonfirmasi/tidak valid tidak menghasilkan link; encoding pesan utuh', () => {
  assert.equal(buildWhatsappUrl(null, 'Pesan'), null);
  for (const bad of ['', '+6281234567890', '081234567890', '62<script>']) assert.equal(buildWhatsappUrl(bad, 'Pesan'), null);
  // Nomor sintetis hanya dipakai dalam tes; tidak diaktifkan atau dihubungi.
  const message = 'Nama: DEMO & A\nKebutuhan: atap + desain? 100% #test';
  const url = new URL(buildWhatsappUrl('6281230000000', message));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.searchParams.get('text'), message);
  assert.equal(buildWhatsappUrl('6281230000000', '  '), null);
});
const fields = { name: ' DEMO ', interest: 'Pembangunan Rumah', location: ' Wilayah DEMO ', message: ' Kebutuhan & pertanyaan ' };
test('pesan properti memuat nama, ID, URL, dan survei hanya untuk status belum terjual', () => {
  const context = { kind: 'property', id: 'DEMO-01', title: 'DEMO Rumah', path: '/properti/demo', availability: 'tersedia' };
  const message = composeMessage(fields, context, 'https://example.test/properti/demo');
  for (const fragment of ['Nama: DEMO', 'DEMO Rumah', 'ID properti: DEMO-01', 'jadwal survei', 'https://example.test/properti/demo', 'Lokasi: Wilayah DEMO']) assert.ok(message.includes(fragment));
  assert.doesNotMatch(composeMessage(fields, { ...context, availability: 'terjual' }), /survei|pemesanan/);
});
test('pesan layanan/proyek/kemitraan berbeda sesuai konteks', () => {
  assert.match(composeMessage(fields, { kind: 'service', title: 'Desain 3D', id: 's', path: '/layanan/s' }), /konsultasi layanan Desain 3D/);
  assert.match(composeMessage(fields, { kind: 'project', title: 'Proyek', id: 'p', path: '/portofolio/p' }), /pekerjaan serupa/);
  const partnership = composeMessage(fields, undefined, undefined, true);
  assert.match(partnership, /kemitraan agen pemasaran/);
  assert.doesNotMatch(partnership, /komisi|berhasil terkirim/);
});
