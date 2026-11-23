import { readFile, realpath } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import type { APIRoute, GetStaticPaths } from 'astro';
import { home } from '../../../data/home';
import { getPublishedContent } from '../../../utils/content';
import { modelDirectory, modelFileName } from '../../../utils/media';

export const getStaticPaths = (async () => {
  const { services, properties } = await getPublishedContent();
  const models = [home.hero.model, ...services.map(({ data }) => data.model), ...properties.map(({ data }) => data.model)];
  const files = new Set(models.flatMap((model) => model?.permissionConfirmed ? [modelFileName(model.src)!] : []));
  return [...files].map((file) => ({ params: { file }, props: { file } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const root = await realpath(resolve(modelDirectory));
  const path = await realpath(resolve(root, props.file));
  if (dirname(path) !== root) throw new Error('Simpan file model langsung di ' + modelDirectory + '.');
  const bytes = await readFile(path);

  // GLB 2.0 with embedded resources works on a static host without decoder downloads.
  const jsonLength = bytes.length >= 20 ? bytes.readUInt32LE(12) : 0;
  if (!jsonLength || bytes.toString('ascii', 0, 4) !== 'glTF' || bytes.readUInt32LE(4) !== 2 ||
    bytes.readUInt32LE(8) !== bytes.length || bytes.toString('ascii', 16, 20) !== 'JSON' || jsonLength > bytes.length - 20) {
    throw new Error('Format GLB 2.0 tidak valid: ' + props.file);
  }
  const model = JSON.parse(bytes.toString('utf8', 20, 20 + jsonLength));
  const decoderExtensions = ['KHR_draco_mesh_compression', 'EXT_meshopt_compression', 'KHR_texture_basisu'];
  const hasExternalResource = [...(model.buffers ?? []), ...(model.images ?? [])].some((resource) => resource.uri !== undefined && !resource.uri.startsWith('data:'));
  if (hasExternalResource || model.extensionsUsed?.some((extension: string) => decoderExtensions.includes(extension))) {
    throw new Error('Ekspor ulang GLB dengan tekstur tertanam, tanpa kompresi Draco, Meshopt, atau KTX2: ' + props.file);
  }
  return new Response(new Uint8Array(bytes), { headers: { 'Content-Type': 'model/gltf-binary' } });
};
