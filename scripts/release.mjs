import { readFile, writeFile, readdir, mkdir, cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve, relative, sep } from 'node:path';
import { fileInventory, inventoryDigest, inventoryDifferences } from './lib/release-files.mjs';
import { spawn } from 'node:child_process';

const command = process.argv[2];
const root = process.cwd();
const site = JSON.parse(await readFile('src/data/site.json', 'utf8'));

async function readiness() {
  const contact = JSON.parse(await readFile('src/data/contact.json', 'utf8'));
  const serviceFiles = (await readdir('src/content/services')).filter((name) => name.endsWith('.md'));
  const services = await Promise.all(serviceFiles.map(async (name) => {
    const source = await readFile(join('src/content/services', name), 'utf8');
    return { id: name.replace(/\.md$/, ''), published: /^publishStatus:\s*(['"]?)published\1\s*(?:#.*)?$/m.test(source), category: source.match(/^category:\s*(['"]?)([\w-]+)\1\s*(?:#.*)?$/m)?.[2] };
  }));
  const properties = JSON.parse(await readFile('src/content/properties.json', 'utf8'));
  const projects = JSON.parse(await readFile('src/content/projects.json', 'utf8'));
  const pending = [];
  if (!site.siteUrl) pending.push('Domain resmi belum diisi.');
  if (!site.indexingEnabled) pending.push('Indexing masih nonaktif; persetujuan dan QA domain resmi diperlukan.');
  if (!site.whatsappConfirmed || !site.whatsappNumber) pending.push('Kanal WhatsApp resmi belum dikonfirmasi/diaktifkan.');
  if (!site.serviceAreas?.length) pending.push('Area layanan resmi belum tersedia.');
  const categories = new Set(services.filter((entry) => entry.published).map((entry) => entry.category));
  for (const name of ['pembangunan-rumah', 'desain-3d', 'sumur-bor', 'atap-spandek-baja-ringan', 'pemasaran-properti']) if (!categories.has(name)) pending.push(`Konten layanan ${name} belum published sesuai persetujuan pemilik.`);
  if (!contact.partnership.terms) pending.push('Ketentuan kemitraan resmi belum diisi.');
  return {
    status: pending.length ? 'not-ready' : 'manual-review-required',
    automaticChecksOnly: true,
    pending,
    content: { servicesPublished: services.filter((entry) => entry.published).length, propertiesPublished: properties.filter((entry) => entry.publishStatus === 'published').length, projectsPublished: projects.filter((entry) => entry.publishStatus === 'published').length },
    notes: ['Katalog properti/proyek kosong diperbolehkan dengan empty state; bukan penghalang otomatis.', 'Laporan ini tidak menyetujui konten, biaya, hosting, indexing, atau publikasi.', 'Pemeriksaan manual dan instruksi pemilik mengikuti docs/RELEASE_CHECKLIST.md.'],
  };
}

async function sourceInventory() {
  const paths = ['package.json', 'package-lock.json', 'astro.config.mjs', 'tsconfig.json', '.npmrc', '.node-version'];
  const files = [];
  for (const path of paths) { const bytes = await readFile(path); files.push({ path, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') }); }
  const directories = ['src'];
  // Git clones omit the optional public folder when it contains no files.
  if (existsSync('public')) directories.push('public');
  for (const directory of directories) files.push(...(await fileInventory(directory)).map((file) => ({ ...file, path: `${directory}/${file.path}` })));
  return files.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
}

if (command === 'check') {
  const report = { date: new Date().toISOString(), ...await readiness() };
  await mkdir('docs/verification/stage-6', { recursive: true });
  await writeFile('docs/verification/stage-6/readiness.json', `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (report.pending.length) process.exitCode = 1;
} else if (command === 'snapshot') {
  const sourceFiles = await sourceInventory();
  const npmCli = process.env.npm_execpath;
  if (!npmCli) throw new Error('Jalankan snapshot melalui npm run release:snapshot.');
  for (const task of ['check', 'test', 'build']) {
    await new Promise((done, fail) => {
      const child = spawn(process.execPath, [npmCli, 'run', task], { stdio: 'inherit', env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' } });
      child.once('error', fail);
      child.once('exit', (code) => code === 0 ? done() : fail(new Error(`Pemeriksaan ${task} gagal (${code}); snapshot tidak dibuat.`)));
    });
  }
  if (inventoryDigest(sourceFiles) !== inventoryDigest(await sourceInventory())) throw new Error('Sumber berubah selama pemeriksaan/build. Jalankan snapshot ulang setelah penyuntingan selesai.');
  const files = await fileInventory('dist');
  if (!files.some((file) => file.path === 'index.html') || !files.some((file) => file.path === '404.html')) throw new Error('Jalankan build statis sebelum membuat snapshot.');
  const buildDigest = inventoryDigest(files);
  const id = `${new Date().toISOString().replace(/[:.]/g, '-')}-${buildDigest.slice(0, 10)}`;
  await mkdir('.releases', { recursive: true });
  const directory = join('.releases', id);
  await mkdir(directory); // Tidak menimpa snapshot yang sudah ada.
  await cp('dist', join(directory, 'site'), { recursive: true, errorOnExist: true, force: false });
  const manifest = { formatVersion: 1, id, createdAt: new Date().toISOString(), purpose: 'local-review-only', deploymentApproved: false, node: process.version, buildDigest, sourceDigest: inventoryDigest(sourceFiles), files, sourceFiles, readiness: await readiness() };
  await writeFile(join(directory, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  const differences = inventoryDifferences(files, await fileInventory(join(directory, 'site')));
  if (differences.length) throw new Error(`Snapshot tidak cocok: ${differences.join(', ')}`);
  console.log(JSON.stringify({ directory: resolve(directory), id, files: files.length, buildDigest, purpose: manifest.purpose, deploymentApproved: false }, null, 2));
} else if (command === 'verify') {
  const argument = process.argv[3];
  if (!argument) throw new Error('Gunakan: npm run release:verify -- .releases/ID');
  const directory = resolve(argument), releases = resolve('.releases');
  if (!directory.startsWith(`${releases}${sep}`)) throw new Error('Verifikasi hanya menerima snapshot di .releases dalam project ini.');
  const manifest = JSON.parse(await readFile(join(directory, 'manifest.json'), 'utf8'));
  const actual = await fileInventory(join(directory, 'site'));
  const differences = inventoryDifferences(manifest.files, actual);
  if (inventoryDigest(manifest.files) !== manifest.buildDigest) differences.push('Digest manifest tidak cocok.');
  console.log(JSON.stringify({ directory: relative(root, directory), verified: differences.length === 0, differences, note: 'Verifikasi integritas lokal, bukan tanda tangan/persetujuan deployment.' }, null, 2));
  if (differences.length) process.exitCode = 1;
} else {
  throw new Error('Perintah tersedia: check, snapshot, verify. Tidak ada perintah deploy.');
}
