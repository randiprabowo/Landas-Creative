import type { CollectionEntry } from 'astro:content';
import { demoServices, demoProperties, demoProjects } from './fixtures';
import illustration from '../assets/illustrations/architecture.svg';
import floorPlan from './floor-plan.svg';

const demoImage = { src: illustration, alt: 'DEMO — ilustrasi konsep arsitektur, bukan pekerjaan nyata', caption: 'DEMO · Ilustrasi konseptual, bukan dokumentasi pekerjaan.', kind: 'ilustrasi' as const, permissionConfirmed: true };
const service = demoServices[0]!;
export const demoServiceEntry: CollectionEntry<'services'> = {
  id: 'demo-layanan', collection: 'services',
  data: { ...service, title: 'DEMO — Pembangunan Rumah', coverImage: demoImage,
    scope: ['DEMO — contoh lingkup pertama', 'DEMO — contoh lingkup kedua'],
    exclusions: ['DEMO — contoh batas cakupan; bukan ketentuan bisnis.'],
    steps: ['DEMO — pembahasan kebutuhan', 'DEMO — peninjauan lingkup', 'DEMO — pembahasan rencana'],
    startingPrice: 77777777, priceConfirmed: false,
  },
};
export const demoPropertyEntry: CollectionEntry<'properties'> = {
  id: 'demo-properti', collection: 'properties',
  data: { ...demoProperties[0]!, images: [demoImage, { ...demoImage, src: floorPlan, alt: 'DEMO — skema ruang untuk thumbnail kedua', caption: 'DEMO · Skema ruang buatan, bukan properti nyata.' }, { ...demoImage, src: { src: '/_preview/gambar-galeri-tidak-ada.svg', width: 960, height: 720, format: 'svg' }, alt: 'DEMO — gambar ketiga sengaja gagal', caption: 'DEMO · Memeriksa fallback galeri gagal.' }], price: 123456789, priceConfirmed: false,
    description: 'DEMO — data buatan untuk mengevaluasi deskripsi properti. Bukan listing yang dipasarkan.\n\nParagraf kedua memeriksa ruang dan keterbacaan teks pada layar kecil.',
    facilities: ['DEMO — contoh fasilitas untuk menguji daftar'],
    floorPlan: { src: floorPlan, alt: 'DEMO — skema ruang buatan dalam orientasi portrait', caption: 'DEMO · Bukan denah properti yang ditawarkan.', kind: 'ilustrasi', permissionConfirmed: true },
  },
};
export const demoSoldEntry: CollectionEntry<'properties'> = {
  ...demoPropertyEntry, id: 'demo-properti-terjual',
  data: { ...demoPropertyEntry.data, ...demoProperties[1]!, images: [], floorPlan: undefined },
};
export const demoProjectEntry: CollectionEntry<'projects'> = {
  id: 'demo-proyek', collection: 'projects',
  data: { ...demoProjects[0]!, body: 'DEMO — konteks dan hasil di sini adalah teks buatan untuk meninjau susunan detail. Bukan proyek nyata Landas Creative.', scope: ['DEMO — contoh lingkup visualisasi', 'DEMO — contoh penyajian dokumentasi'] },
};
