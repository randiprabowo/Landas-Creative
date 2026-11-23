import test from 'node:test';
import assert from 'node:assert/strict';
import { assertContentIntegrity, parseContentRows } from '../src/utils/content-integrity.ts';

const draft = (id, slug = id) => ({ id, data: { slug, publishStatus: 'draft' } });
const empty = () => ({ services: [], properties: [], projects: [] });

test('ID JSON ganda ditolak sebelum loader dapat menimpa data', () => {
  assert.throws(() => parseContentRows('[{"id":"qa"},{"id":"qa"}]'), /ID duplikat/);
});
test('ID JSON kosong, berspasi, atau bukan string ditolak', () => {
  for (const id of ['', ' qa ', 7]) assert.throws(() => parseContentRows(JSON.stringify([{ id }])), /ID teks/);
});
test('bentuk array kosong tetap valid; objek bukan array ditolak', () => {
  assert.deepEqual(parseContentRows('[]'), []);
  assert.throws(() => parseContentRows('{}'), /array/);
});
test('slug bentrok antara draft dan published menghentikan publikasi', () => {
  const content = empty();
  content.services = [{ ...draft('qa-a', 'sama'), body: 'Uraian QA', data: { slug: 'sama', publishStatus: 'published' } }, draft('qa-b', 'sama')];
  assert.throws(() => assertContentIntegrity(content), /Slug duplikat/);
});
test('referensi hilang pada draft juga ditolak', () => {
  const content = empty();
  content.services = [draft('qa')];
  content.services[0].data.relatedProjectIds = [{ collection: 'projects', id: 'tidak-ada' }];
  assert.throws(() => assertContentIntegrity(content), /Referensi proyek/);
});
test('referensi silang yang ada tetap valid meskipun keduanya draft', () => {
  const content = empty();
  content.services = [draft('qa-layanan')]; content.projects = [draft('qa-proyek')];
  content.services[0].data.relatedProjectIds = [{ collection: 'projects', id: 'qa-proyek' }];
  content.projects[0].data.relatedServiceIds = [{ collection: 'services', id: 'qa-layanan' }];
  assert.doesNotThrow(() => assertContentIntegrity(content));
});
test('uraian layanan dan proyek published yang kosong ditolak', () => {
  for (const name of ['services', 'projects']) {
    const content = empty(); content[name] = [{ id: 'qa', data: { slug: 'qa', publishStatus: 'published' } }];
    assert.throws(() => assertContentIntegrity(content), /Uraian published/);
  }
});
test('HTML mentah tidak dapat masuk melalui uraian layanan published', () => {
  const content = empty(); content.services = [{ id: 'qa', body: '<img src=x onerror=alert(1)>', data: { slug: 'qa', publishStatus: 'published' } }];
  assert.throws(() => assertContentIntegrity(content), /tanpa HTML/);
});
test('H1 tambahan dalam body tidak menghasilkan judul utama ganda', () => {
  const content = empty(); content.services = [{ id: 'qa', body: '# Judul ganda', data: { slug: 'qa', publishStatus: 'published' } }];
  assert.throws(() => assertContentIntegrity(content), /H1/);
});
