import { demoPropertyEntry } from './detail-fixtures';
import type { CollectionEntry } from 'astro:content';
// Harga/area/lokasi sintetis hanya untuk menguji interaksi di astro dev.
const scenarios = [
  { id: 'demo-a', title: 'DEMO — Rumah A', region: 'Wilayah DEMO Utara', propertyType: 'rumah-komersial', availability: 'tersedia', price: 400000000, featured: true, updatedAt: '2026-11-10T00:00:00+07:00' },
  { id: 'demo-b', title: 'DEMO — Ruko B', region: 'Wilayah DEMO Selatan', propertyType: 'ruko', availability: 'dipesan', price: 700000000, featured: false, updatedAt: '2026-11-13T00:00:00+07:00' },
  { id: 'demo-c', title: 'DEMO — Rumah C', region: 'Wilayah DEMO Utara', propertyType: 'rumah-subsidi', availability: 'terjual', price: 200000000, featured: false, updatedAt: '2026-11-11T00:00:00+07:00' },
  { id: 'demo-d', title: 'DEMO — Rumah tanpa harga', region: 'Wilayah DEMO Utara', propertyType: 'rumah-komersial', availability: 'tersedia', price: undefined, featured: false, updatedAt: '2026-11-14T00:00:00+07:00' },
] as const;
export const searchFixtures: CollectionEntry<'properties'>[] = scenarios.map(({ id, ...data }) => ({ ...demoPropertyEntry, id, data: { ...demoPropertyEntry.data, ...data, slug: id, priceConfirmed: data.price !== undefined, publicLocation: `${data.region} · Lokasi sintetis`, images: [], floorPlan: undefined } }));
