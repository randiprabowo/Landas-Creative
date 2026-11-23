import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join, sep } from 'node:path';
import { fileInventory, inventoryDigest, inventoryDifferences } from '../scripts/lib/release-files.mjs';

test('inventaris snapshot stabil dan membedakan nama, isi, serta aset nested', async () => {
  const root = await mkdtemp(join(tmpdir(), 'landas-release-test-'));
  try {
    await mkdir(join(root, '_astro'));
    await writeFile(join(root, 'index.html'), '<h1>Uji</h1>');
    await writeFile(join(root, '_astro', 'app.css'), 'body{}');
    const first = await fileInventory(root);
    const second = await fileInventory(root);
    assert.deepEqual(first, second);
    assert.deepEqual(first.map((file) => file.path), ['_astro/app.css', 'index.html']);
    assert.equal(inventoryDigest(first), inventoryDigest(second));
    await writeFile(join(root, 'index.html'), '<h1>Diubah</h1>');
    const changed = await fileInventory(root);
    assert.notEqual(inventoryDigest(first), inventoryDigest(changed));
    assert.deepEqual(inventoryDifferences(first, changed), ['Berubah: index.html']);
  } finally {
    const target = resolve(root), allowed = resolve(tmpdir());
    assert.ok(target.startsWith(`${allowed}${sep}`) && target.split(sep).at(-1).startsWith('landas-release-test-'));
    await rm(target, { recursive: true });
  }
});

test('verifikasi menemukan berkas hilang dan tambahan agar rollback tidak menyisakan versi baru', () => {
  const before = [{ path: 'index.html', sha256: 'a' }, { path: 'properti/index.html', sha256: 'b' }];
  const after = [{ path: 'index.html', sha256: 'a' }, { path: 'stale.html', sha256: 'c' }];
  assert.deepEqual(inventoryDifferences(before, after), ['Hilang: properti/index.html', 'Tambahan: stale.html']);
});

test('salinan identik cocok walau urutan input verifikasi berbeda', () => {
  const files = [{ path: 'index.html', sha256: 'a' }, { path: '_astro/logo.png', sha256: 'b' }];
  assert.deepEqual(inventoryDifferences(files, [...files].reverse()), []);
});
