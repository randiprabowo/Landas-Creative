import type { ImageMetadata } from 'astro';

const images = import.meta.glob<ImageMetadata>('/src/assets/**/*.{png,jpg,jpeg,webp,avif,svg}', {
  eager: true,
  import: 'default',
});

/** Hanya aset lokal yang dikenal build; tidak mengunduh URL eksternal. */
export function resolveAsset(path: string): ImageMetadata {
  const key = path.startsWith('/') ? path : `/${path}`;
  const image = images[key];
  if (!image) throw new Error(`Aset lokal tidak ditemukan: ${path}`);
  return image;
}
