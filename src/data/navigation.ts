export interface BreadcrumbItem { label: string; href?: string; }

// Rute katalog dan template detail sudah tersedia sejak Tahap 3.
export const catalogRoutes: Record<'services' | 'properties' | 'projects', string | null> = {
  services: '/layanan', properties: '/properti', projects: '/portofolio',
};

export function detailHref(collection: keyof typeof catalogRoutes, slug: string): string | undefined {
  const root = catalogRoutes[collection];
  return root ? `${root}/${slug}` : undefined;
}

export const mainNavigation = [
  { label: 'Beranda', href: '/' },
  { label: 'Layanan', href: catalogRoutes.services ?? '/#layanan' },
  { label: 'Properti', href: catalogRoutes.properties ?? '/#properti' },
  { label: 'Portofolio', href: catalogRoutes.projects ?? '/#portofolio' },
  { label: 'Tentang Kami', href: '/tentang' },
] as const;
