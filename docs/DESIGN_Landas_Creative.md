# Design Specification — Landas Creative

Versi 1.0 • 14 November 2026 • Pendamping PRD_Landas_Creative.md

## 1. Arah visual

Profesional, tenang, kokoh, dan mudah didekati. Mengambil hijau teal, navy gelap, dan krem dari referensi LNDS. Nuansa arsitektur hadir melalui garis tipis dan komposisi rapi. Warna berikut adalah interpretasi visual untuk UI, bukan hasil pengukuran warna resmi logo.

Nama perusahaan selalu **Landas Creative**. Logo tetap **LNDS** dengan tagline **Foundations & Growth**. Hindari penggunaan LNDS Group sebagai nama perusahaan dalam konten baru.

## 2. Palet dan design tokens

| Token | HEX | Penggunaan |
|---|---|---|
| brand | `#226B60` | Tombol utama, link, aksen |
| brand-hover | `#195449` | Hover tombol utama |
| ink | `#192D3A` | Judul, navigasi, teks utama |
| canvas | `#F7F6ED` | Latar krem utama |
| surface | `#FFFFFF` | Kartu dan form |
| surface-soft | `#EAF2EE` | Latar section pendukung |
| muted | `#52636B` | Teks sekunder |
| border | `#D8E2DC` | Batas kartu/dekorasi |
| control-border | `#71857C` | Batas input yang harus terlihat |
| focus | `#226B60` | Outline fokus dengan offset |
| success | `#216347` | Status tersedia |
| warning | `#785400` | Teks status dipesan pada krem muda |
| danger | `#A23333` | Pesan kesalahan |

Gunakan kira-kira 65% krem/putih, 25% navy/teks/foto, 10% hijau. Persentase adalah arah komposisi, bukan aturan pengukuran. Teks putih pada tombol hijau; teks navy pada krem. Warna border dekoratif tidak dipakai sebagai satu-satunya penanda input atau status. Verifikasi kontras saat implementasi: teks normal ≥4,5:1, teks besar dan komponen interaktif ≥3:1.

```css
:root {
  --color-brand: #226b60;
  --color-brand-hover: #195449;
  --color-ink: #192d3a;
  --color-canvas: #f7f6ed;
  --color-surface: #fff;
  --color-surface-soft: #eaf2ee;
  --color-muted: #52636b;
  --color-border: #d8e2dc;
  --color-control-border: #71857c;
  --radius-control: 10px;
  --radius-card: 16px;
  --radius-section: 24px;
  --shadow-card: 0 8px 28px rgb(25 45 58 / 7%);
  --container: 1200px;
}
```

## 3. Tipografi

Gunakan satu keluarga font sans-serif: **Plus Jakarta Sans**, self-hosted WOFF2 jika lisensi dan aset tersedia; fallback `system-ui, sans-serif`. Batasi 400, 600, dan 700; gunakan font-display swap. Jika mengutamakan unduhan terkecil, system font dapat menjadi fallback implementasi tanpa mengubah hierarki.

| Elemen | Desktop | Mobile | Bobot |
|---|---|---|---|
| H1 hero | 56–64 px | 34–40 px | 700 |
| H1 detail | 40–48 px | 30–34 px | 700 |
| H2 section | 32–40 px | 26–30 px | 700 |
| H3 kartu | 20–24 px | 20 px | 600 |
| Body | 16–18 px | 16 px | 400 |
| Label/caption | 14 px | 14 px | 600/400 |

Line-height heading 1,15–1,25; body 1,6–1,75. Paragraf maksimal sekitar 65 karakter per baris. Hindari judul panjang seluruhnya kapital seperti pada brosur; UI membutuhkan hierarki yang lebih ringan.

## 4. Layout dan responsivitas

- Container maksimal 1200 px; gutter 20 px mobile, 32 px tablet, 40 px desktop.
- Spacing memakai skala 4, 8, 12, 16, 24, 32, 48, 64, 80, 96 px.
- Jarak section: 80–96 px desktop, 48–64 px mobile.
- Breakpoint: mobile <768 px; tablet 768–1023 px; desktop ≥1024 px.
- Grid kartu: 1 kolom mobile, 2 tablet, 3 desktop. Hindari kartu dengan lebar tetap yang melampaui viewport.
- Header desktop tinggi sekitar 80 px; mobile 64–72 px. Menu mobile berupa panel sederhana dengan tombol buka/tutup, aria-expanded, dan fokus yang benar.
- Tombol WhatsApp mengambang boleh digunakan dengan label aksesibel; posisikan agar tidak menutupi tombol lain, footer, atau konten pada HP.

## 5. Rancangan beranda

### Header

Logo LNDS kiri; navigasi kanan; tombol Konsultasi. Gunakan ruang kosong logo, jangan meregangkan atau memotong. Logo lengkap bertagline tidak diperkecil sampai sulit dibaca; gunakan simbol resmi saja di layar kecil jika asetnya tersedia. Teks nama perusahaan tetap terbaca oleh pembaca layar.

### Hero

Desktop dua kolom: teks 45%, foto 55%. Mobile: teks, tombol, lalu foto. Krem sebagai dasar, judul navy, penekanan satu frasa hijau. Foto asli rumah/proyek dengan sudut pandang rapi. Garis arsitektur tipis hanya di ruang kosong, tidak di belakang teks utama.

Copy awal:

- Eyebrow: Konstruksi • Properti • Infrastruktur Air
- Judul: **Merencanakan dengan jelas. Membangun dengan terarah.**
- Deskripsi: Landas Creative membantu kebutuhan pembangunan rumah, desain 3D, sumur bor, baja ringan, dan pemasaran properti melalui proses yang terencana.
- Tombol utama: **Konsultasikan Kebutuhan**
- Tombol kedua: **Jelajahi Properti**

Tidak memakai carousel otomatis, video latar, counter angka palsu, atau efek berat. Jika belum ada foto asli, gunakan visualisasi berlabel jelas sebagai ilustrasi, tanpa mengesankan hasil proyek.

### Urutan section

1. Pengantar singkat dan tiga komitmen: perencanaan jelas, lingkup transparan, komunikasi progres. Ini komitmen perusahaan, bukan sertifikasi.
2. Layanan: lima kartu, masing-masing ikon, judul, ringkasan, harga opsional, dan tautan detail.
3. Properti pilihan: maksimal tiga item nyata dan tombol Lihat Semua Properti.
4. Portofolio pilihan: maksimal tiga proyek nyata dengan foto besar.
5. Cara kerja: konsultasi, survei, rencana/penawaran, pelaksanaan, serah terima. Dibuat grid/wrap desktop dan daftar vertikal mobile.
6. Ajakan kemitraan dengan latar soft green.
7. CTA penutup berlatar navy: **Punya rencana pembangunan atau sedang mencari properti?**
8. Footer: logo/nama, navigasi, kontak terverifikasi, area layanan, privasi, copyright.

## 6. Kartu layanan

Ikon garis konsisten, berkas SVG lokal, kotak ikon hijau pucat. Susunan: ikon → judul → ringkasan maksimal 2–3 baris → harga opsional → Lihat Layanan. Harga diawali **Mulai dari**. Catatan biaya ada dekat harga/detail, bukan hanya tersembunyi di footer.

Jangan menyatukan judul “Spandek Baja Ringan” jika membingungkan cakupan. Gunakan **Atap Spandek & Baja Ringan**; detail menjelaskan rangka, penutup, dan pekerjaan yang termasuk.

## 7. Katalog dan kartu properti

Halaman berisi judul, pengantar, pencarian, filter, jumlah hasil, pengurutan, dan grid. Pada mobile, filter dapat dibuka melalui tombol Filter; nilai aktif terlihat dan dapat direset. Kontrol memakai label nyata, tidak hanya placeholder.

Kartu:

1. Foto rasio 4:3 dengan object-fit cover.
2. Badge teks Tersedia/Dipesan/Terjual; status tidak bergantung warna saja.
3. Jenis properti dan lokasi singkat.
4. Nama properti yang dapat diklik.
5. Harga jelas atau Hubungi kami.
6. Luas tanah, luas bangunan, kamar sesuai data.
7. Tautan Lihat Detail.

Hindari seluruh kartu sebagai tombol yang membungkus tombol lain. Jika menggunakan stretched link, pastikan elemen interaktif tidak tumpang tindih. Harga kosong tidak ditampilkan sebagai Rp0. Format ukuran `72 m²`, harga `Rp450.000.000`.

## 8. Halaman detail properti

Breadcrumb → nama dan lokasi → galeri → harga/status → spesifikasi → deskripsi/fasilitas → denah opsional → CTA survei → properti terkait.

Desktop dapat memakai panel ringkasan di kanan. Pada mobile panel berada di alur dokumen; CTA sticky hanya bila tidak menutupi konten dan memiliki ruang bawah yang cukup. Gambar denah bisa diperbesar tanpa cropping yang menghilangkan ukuran.

Tampilkan “Informasi diperbarui [tanggal]”. Properti terjual menunjukkan status jelas serta CTA **Cari Properti Lain**. Peran Landas Creative sebagai pemasar dijelaskan sesuai hubungan nyata; jangan mengklaim sebagai pengembang jika tidak benar.

## 9. Portofolio dan detail layanan

Portofolio memakai foto sebagai fokus dengan label jenis pekerjaan, lokasi umum, dan status. Foto sebelum/sesudah boleh ditampilkan berpasangan jika tersedia; urutkan vertikal pada mobile. Bedakan **Visualisasi 3D**, **Proses Pengerjaan**, dan **Hasil Selesai**.

Detail layanan mengutamakan ringkasan manfaat, lingkup pekerjaan, alur, faktor biaya, dokumentasi terkait, dan CTA spesifik. Hindari memindahkan seluruh dokumen prosedur panjang ke beranda.

## 10. Tombol, form, dan feedback

| Komponen | Gaya/perilaku |
|---|---|
| Primary | Hijau, teks putih, radius 10 px, tinggi minimal 48 px |
| Secondary | Krem/putih, teks dan border hijau |
| Text link | Hijau dengan underline pada konteks paragraf |
| Input | Putih, border control-border, label di atas, tinggi minimal 48 px |
| Error | Pesan teks dekat field; tidak hanya border merah |
| Focus | Outline 3 px dengan offset; tetap terlihat di latar gelap |
| Empty state | Penjelasan singkat, reset filter atau konsultasi |

Form kontak: nama, pilihan minat, lokasi, pesan. Tombol **Lanjut ke WhatsApp**. Teks pendamping: “Pesan akan dibuka di WhatsApp. Silakan periksa lalu kirim untuk menghubungi tim kami.” Tidak menampilkan “Pesan berhasil terkirim” sebelum ada pengiriman yang dapat diverifikasi.

## 11. Foto dan logo

- Utamakan foto proyek dan properti asli dengan izin penggunaan.
- Jangan mengunduh/mengambil foto dalam brosur untuk diklaim sebagai proyek nyata tanpa konfirmasi.
- Hero rasio 4:3 atau 3:2; katalog 4:3; kartu proyek 3:2. Foto detail boleh mempertahankan rasio aslinya.
- Gunakan warna natural dan pencahayaan konsisten. Hindari filter hijau tebal pada bangunan.
- Jangan membuat ulang logo menggunakan font biasa atau mengubah arah panah. Minta PNG transparan resolusi tinggi atau SVG resmi.
- Tekstur kertas pada referensi cukup diterjemahkan menjadi latar krem polos agar ringan. Ornamen garis blueprint opsional, sedikit, dan dekoratif.

## 12. Gerakan dan aksesibilitas

Transisi hover 150–200 ms; maksimal perubahan warna, shadow kecil, atau pergeseran ≤2 px. Konten tidak disembunyikan sambil menunggu animasi. Hormati prefers-reduced-motion. Tidak memerlukan GSAP atau animasi scroll untuk MVP.

Gunakan satu H1 per halaman, skip link, fokus keyboard yang jelas, alt yang menjelaskan foto, label tombol yang spesifik, dan urutan baca yang sama dengan urutan visual. Ikon dekoratif disembunyikan dari pembaca layar.

## 13. Nada bahasa dan contoh microcopy

Bahasa Indonesia yang jelas, bersahabat, dan konkret. Hindari klaim “paling murah”, “pasti disetujui”, atau “air pasti jernih”.

| Konteks | Teks |
|---|---|
| CTA layanan | Minta Penawaran |
| CTA properti | Jadwalkan Survei |
| Harga belum tersedia | Hubungi kami untuk informasi harga |
| Hasil kosong | Belum ada properti yang sesuai. Coba ubah filter atau konsultasikan kebutuhan Anda. |
| Katalog kosong | Informasi properti sedang disiapkan. Hubungi tim untuk menanyakan pilihan yang tersedia. |
| Proyek belum tersedia | Dokumentasi proyek akan ditambahkan setelah siap dipublikasikan. |
| Harga indikatif | Biaya akhir menyesuaikan ukuran, spesifikasi, kondisi lokasi, dan lingkup pekerjaan. |
| Kemitraan | Tertarik bergabung sebagai agen pemasaran? Kenali peluang kemitraan bersama Landas Creative. |

## 14. Checklist desain sebelum rilis

- [ ] Logo benar, warna konsisten, dan nama Landas Creative seragam.
- [ ] Hero terbaca tanpa harus menunggu animasi.
- [ ] Foto asli dan visualisasi memiliki label yang tepat.
- [ ] Kartu tetap rapi saat nama panjang, harga kosong, dan foto gagal.
- [ ] Filter, status, validasi, empty state, dan halaman 404 dirancang.
- [ ] Tidak ada overflow pada 360/768/1440 px dan zoom 200%.
- [ ] Navigasi keyboard, kontras, dan pembaca layar diperiksa.
- [ ] Tombol mengambang/sticky tidak menutupi konten.
- [ ] Foto dan font teroptimasi; tidak ada embed berat otomatis.

Desain ini merupakan spesifikasi implementasi, bukan mockup layar yang telah dibangun atau diuji.
