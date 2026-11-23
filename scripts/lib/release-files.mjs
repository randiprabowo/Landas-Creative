import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function fileInventory(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Symlink tidak disertakan dalam snapshot: ${relative}`);
    if (entry.isDirectory()) files.push(...await fileInventory(path, relative));
    else if (entry.isFile()) {
      const bytes = await readFile(path);
      files.push({ path: relative, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
    } else throw new Error(`Tipe berkas tidak didukung: ${relative}`);
  }
  return files.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
}

export function inventoryDigest(files) {
  return createHash('sha256').update(JSON.stringify(files)).digest('hex');
}

export function inventoryDifferences(expected, actual) {
  const expectedMap = new Map(expected.map((file) => [file.path, file.sha256]));
  const actualMap = new Map(actual.map((file) => [file.path, file.sha256]));
  const changes = [];
  for (const [path, hash] of expectedMap) {
    if (!actualMap.has(path)) changes.push(`Hilang: ${path}`);
    else if (actualMap.get(path) !== hash) changes.push(`Berubah: ${path}`);
  }
  for (const path of actualMap.keys()) if (!expectedMap.has(path)) changes.push(`Tambahan: ${path}`);
  return changes;
}
