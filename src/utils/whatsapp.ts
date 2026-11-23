export interface MessageFields { name: string; interest: string; location: string; message: string; }
export interface MessageContext { kind: 'service' | 'property' | 'project'; title: string; id: string; path: string; availability?: string; }

export function consultationLink(kind: 'layanan' | 'properti' | 'proyek', slug: string, preview = false): string {
  const destination = preview ? '/_preview/interaksi' : '/kontak';
  return `${destination}?${kind}=${encodeURIComponent(preview ? kind : slug)}#pesan`;
}

export function buildWhatsappUrl(verifiedNumber: string | null, message: string): string | null {
  if (!verifiedNumber || !/^62[1-9]\d{7,12}$/.test(verifiedNumber) || !message.trim()) return null;
  return `https://wa.me/${verifiedNumber}?text=${encodeURIComponent(message)}`;
}

export function composeMessage(fields: MessageFields, context?: MessageContext, itemUrl?: string, partnership = false): string {
  const lines = ['Halo Landas Creative,', `Nama: ${fields.name.trim()}`];
  if (partnership) lines.push('Saya ingin mengetahui informasi kemitraan agen pemasaran.');
  else if (context?.kind === 'property') {
    lines.push(`Saya tertarik dengan ${context.title}.`, `ID properti: ${context.id}`);
    lines.push(context.availability === 'terjual' ? 'Saya ingin menanyakan pilihan properti lain.' : 'Saya ingin menanyakan ketersediaan dan jadwal survei.');
  } else if (context?.kind === 'service') lines.push(`Saya ingin konsultasi layanan ${context.title}.`);
  else if (context?.kind === 'project') lines.push(`Saya ingin membahas pekerjaan serupa dengan ${context.title}.`);
  else lines.push(`Minat: ${fields.interest.trim()}`);
  if (context && itemUrl) lines.push(`Referensi: ${itemUrl}`);
  lines.push(`Lokasi: ${fields.location.trim()}`, `Kebutuhan: ${fields.message.trim()}`);
  return lines.join('\n');
}
