type CollectionName = 'services' | 'properties' | 'projects';
interface Entry {
  id: string;
  body?: string;
  data: {
    slug: string;
    publishStatus: 'draft' | 'published';
    body?: string;
    relatedProjectIds?: { id: string; collection: string }[];
    relatedServiceIds?: { id: string; collection: string }[];
  };
}

/** Memeriksa ID sebelum file loader dapat menimpa item dengan ID yang sama. */
export function parseContentRows(source: string): { id: string; [key: string]: unknown }[] {
  const rows: unknown = JSON.parse(source);
  if (!Array.isArray(rows)) throw new Error('Koleksi JSON harus berupa array.');
  const ids = new Set<string>();
  return rows.map((row: unknown) => {
    if (!row || typeof row !== 'object' || !('id' in row) || typeof row.id !== 'string' || !row.id.trim() || row.id !== row.id.trim()) {
      throw new Error('Setiap item JSON wajib memiliki ID teks yang tidak kosong atau berspasi tepi.');
    }
    if (ids.has(row.id)) throw new Error(`ID duplikat: ${row.id}`);
    ids.add(row.id);
    return row as { id: string; [key: string]: unknown };
  });
}

export function assertContentIntegrity(content: Record<CollectionName, Entry[]>): void {
  for (const name of Object.keys(content) as CollectionName[]) {
    const ids = new Set<string>();
    const slugs = new Set<string>();
    for (const entry of content[name]) {
      if (ids.has(entry.id)) throw new Error(`ID duplikat pada ${name}: ${entry.id}`);
      if (slugs.has(entry.data.slug)) throw new Error(`Slug duplikat pada ${name}: ${entry.data.slug}`);
      ids.add(entry.id);
      slugs.add(entry.data.slug);
      if (entry.data.publishStatus === 'published') {
        const body = name === 'services' ? entry.body : name === 'projects' ? entry.data.body : null;
        if (body !== null && !body?.trim()) throw new Error(`Uraian published belum diisi: ${name}/${entry.id}`);
        if (name === 'services' && body && /<\/?[a-z]|<!--/i.test(body)) {
          throw new Error(`Gunakan Markdown tanpa HTML mentah: ${name}/${entry.id}`);
        }
        if (name === 'services' && body && /^#\s/m.test(body)) {
          throw new Error(`Judul H1 sudah disediakan template: ${name}/${entry.id}`);
        }
        if (name === 'services' && body && /(?:\]\s*\(|^\s*\[[^\]]+\]:\s*)\s*(?:javascript|vbscript|data)\s*:/im.test(body)) {
          throw new Error(`Protokol tautan tidak diizinkan: ${name}/${entry.id}`);
        }
        if (name === 'services' && body && /!\[[^\]]*\]\s*(?:\(|\[)/.test(body)) {
          throw new Error(`Gunakan field gambar terstruktur dengan izin: ${name}/${entry.id}`);
        }
      }
    }
  }
  for (const entry of content.services) {
    for (const ref of entry.data.relatedProjectIds ?? []) {
      if (!content.projects.some((project) => project.id === ref.id)) throw new Error(`Referensi proyek tidak ditemukan: ${entry.id} → ${ref.id}`);
    }
  }
  for (const entry of content.projects) {
    for (const ref of entry.data.relatedServiceIds ?? []) {
      if (!content.services.some((service) => service.id === ref.id)) throw new Error(`Referensi layanan tidak ditemukan: ${entry.id} → ${ref.id}`);
    }
  }
}
