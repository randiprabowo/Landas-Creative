import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';
import { assertContentIntegrity } from './content-integrity';

type Content = { [K in CollectionKey]: CollectionEntry<K>[] };

/** Tanpa cache modul agar perubahan koleksi tetap terbaca pada development. */
export async function getPublishedContent(): Promise<Content> {
  const [services, properties, projects] = await Promise.all([
    getCollection('services'), getCollection('properties'), getCollection('projects'),
  ]);
  assertContentIntegrity({ services, properties, projects });
  return {
    services: services.filter(({ data }) => data.publishStatus === 'published'),
    properties: properties.filter(({ data }) => data.publishStatus === 'published'),
    projects: projects.filter(({ data }) => data.publishStatus === 'published'),
  };
}

/** Gunakan juga untuk getStaticPaths; tidak ada akses rute publik untuk draft. */
export async function getPublishedEntries<C extends CollectionKey>(collection: C): Promise<CollectionEntry<C>[]> {
  return (await getPublishedContent())[collection];
}
