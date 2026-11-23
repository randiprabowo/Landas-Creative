import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { posix } from 'node:path';
import { settings } from '../src/cms/settings.ts';
import { collections } from '../src/cms/collections.ts';
import { remoteBackend } from '../src/cms/backend.mjs';

function checkFields(value, fields, path) {
  for (const [name, item] of Object.entries(value)) {
    const field = fields.find((field) => field.name === name);
    assert.ok(field, 'Kolom CMS belum tersedia untuk ' + path + '.' + name);
    if (!item || !field.fields) continue;
    for (const child of Array.isArray(item) ? item : [item]) checkFields(child, field.fields, path + '.' + name);
  }
}

test('semua properti berkas pengaturan yang ada memiliki kolom editor', async () => {
  for (const entry of settings) {
    checkFields(JSON.parse(await readFile(entry.file, 'utf8')), entry.fields, entry.name);
  }
});

test('koleksi CMS mempertahankan struktur Astro, referensi gambar dan status awal draft', () => {
  for (const collection of collections) {
    const base = collection.folder || posix.dirname(collection.file);
    assert.equal(posix.join(base, collection.public_folder), 'src/assets/photos');
    assert.equal(collection.fields.find((field) => field.name === 'publishStatus').default, 'draft');
    if (collection.file) assert.ok(collection.fields.find((field) => field.name === 'id'));
  }
});

test('akses daring memerlukan konfigurasi lengkap dan menggunakan PKCE', () => {
  assert.equal(remoteBackend({}), null);
  assert.throws(() => remoteBackend({ repository: 'grup/project' }));
  const backend = remoteBackend({ repository: 'grup/project', branch: 'konten', applicationId: 'a'.repeat(64) });
  assert.equal(backend.branch, 'konten');
  assert.equal(backend.auth_type, 'pkce');
  assert.deepEqual(backend.auth_methods, ['oauth']);
});
