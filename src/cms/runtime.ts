import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import type { APIRoute } from 'astro';

const packageEntry = createRequire(import.meta.url).resolve('@sveltia/cms');
const distribution = join(dirname(packageEntry), '..', 'dist');
const fonts = join(distribution, '..', 'npm', 'assets');

export async function getStaticPaths() {
  const chunks = await readdir(join(distribution, 'chunks'), { recursive: true });
  const assets = ['sveltia-cms.js', ...chunks.filter((file) => file.endsWith('.js'))
    .map((file) => 'chunks/' + file.replaceAll('\\', '/'))];
  const paths = assets.map((asset) => ({ params: { asset }, props: { file: join(distribution, asset), type: 'text/javascript' } }));
  for (const name of ['material-symbols-outlined', 'source-sans-3']) {
    const font = (await readdir(fonts)).find((file) => file.startsWith(name + '-latin-') && file.endsWith('.woff2'));
    if (!font) throw new Error('Font editor tidak ditemukan: ' + name);
    paths.push({ params: { asset: name + '.woff2' }, props: { file: join(fonts, font), type: 'font/woff2' } });
    paths.push({ params: { asset: name + '.LICENSE.txt' }, props: { file: join(fonts, name + '.LICENSE.txt'), type: 'text/plain' } });
  }
  return paths;
}

export const GET: APIRoute = async ({ props }) => new Response(
  new Uint8Array(await readFile(props.file)),
  { headers: { 'Content-Type': props.type } },
);
