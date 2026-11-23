const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
export const formatPrice = (value: number) => rupiah.format(value).replace(/\s/g, '');
export const formatArea = (value: number) => `${new Intl.NumberFormat('id-ID').format(value)} m²`;
export const formatDate = (value: string) => new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'long', timeZone: 'Asia/Jakarta',
}).format(new Date(value));
