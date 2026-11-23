export interface SearchableProperty {
  id: string;
  title: string;
  region: string;
  publicLocation: string;
  propertyType: string;
  availability: string;
  featured: boolean;
  updatedAt: string;
  price?: number;
}
export type PropertySort = 'featured' | 'newest' | 'price-asc' | 'price-desc';
export interface PropertyFilters {
  query: string; type: string; region: string; availability: string;
  min: string; max: string; sort: PropertySort;
}
export const defaultFilters: PropertyFilters = { query: '', type: '', region: '', availability: '', min: '', max: '', sort: 'featured' };
const normalize = (value: string) => value.trim().toLocaleLowerCase('id-ID');

export function parsePriceRange(min: string, max: string) {
  const parse = (value: string) => value.trim() === '' ? undefined : /^\d+$/.test(value.trim()) && Number.isSafeInteger(Number(value)) ? Number(value) : NaN;
  const lower = parse(min), upper = parse(max);
  if (Number.isNaN(lower)) return { error: 'Harga minimum harus berupa angka rupiah utuh, tanpa titik atau koma.', field: 'min' as const };
  if (Number.isNaN(upper)) return { error: 'Harga maksimum harus berupa angka rupiah utuh, tanpa titik atau koma.', field: 'max' as const };
  if (lower !== undefined && upper !== undefined && lower > upper) return { error: 'Harga minimum tidak boleh melebihi harga maksimum.', field: 'max' as const };
  return { lower, upper };
}

// Harga yang diteruskan ke fungsi ini harus sudah terkonfirmasi.
export function findProperties<T extends SearchableProperty>(entries: readonly T[], filters: PropertyFilters): T[] {
  const range = parsePriceRange(filters.min, filters.max);
  if (range.error) return [];
  const query = normalize(filters.query);
  const priceActive = range.lower !== undefined || range.upper !== undefined;
  const result = entries.filter((entry) =>
    (!query || normalize(`${entry.title} ${entry.region} ${entry.publicLocation}`).includes(query)) &&
    (!filters.type || entry.propertyType === filters.type) &&
    (!filters.region || entry.region === filters.region) &&
    (!filters.availability || entry.availability === filters.availability) &&
    (!priceActive || (entry.price !== undefined && (range.lower === undefined || entry.price >= range.lower) && (range.upper === undefined || entry.price <= range.upper)))
  );
  return result.sort((a, b) => {
    if (filters.sort === 'price-asc' || filters.sort === 'price-desc') {
      if (a.price === undefined && b.price !== undefined) return 1;
      if (a.price !== undefined && b.price === undefined) return -1;
      if (a.price !== undefined && b.price !== undefined && a.price !== b.price) return filters.sort === 'price-asc' ? a.price - b.price : b.price - a.price;
    }
    if (filters.sort === 'featured' && a.featured !== b.featured) return Number(b.featured) - Number(a.featured);
    return Date.parse(b.updatedAt) - Date.parse(a.updatedAt) || a.id.localeCompare(b.id, 'id');
  });
}
