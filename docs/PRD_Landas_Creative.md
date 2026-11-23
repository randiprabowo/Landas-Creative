# PRD — Website Landas Creative

Versi 1.0 • 14 November 2026 • Status: rancangan untuk implementasi

## 1. Ringkasan produk

Website berbahasa Indonesia yang menggabungkan profil perusahaan, katalog layanan, katalog properti, portofolio proyek, dan informasi kemitraan. Nama perusahaan: **Landas Creative**. Identitas logo: **LNDS**. Tagline logo: **Foundations & Growth**.

Tujuan utama: membantu calon pelanggan memahami penawaran, menilai bukti pekerjaan, lalu berkonsultasi atau menjadwalkan survei melalui WhatsApp. Pengunjung tidak perlu membuat akun.

## 2. Sasaran pengguna dan kebutuhan

| Pengguna | Kebutuhan | Hasil yang diharapkan |
|---|---|---|
| Pemilik tanah/rumah | Membangun rumah, sumur bor, atau atap | Mengirim kebutuhan untuk penawaran |
| Calon pembeli | Mencari rumah atau ruko | Membuka detail dan menjadwalkan survei |
| Pengembang/pemilik properti | Dukungan pembangunan dan pemasaran | Menghubungi perusahaan |
| Calon agen freelance | Memahami peluang kemitraan | Menghubungi bagian kemitraan |

## 3. Prinsip dan batas lingkup

- Utamakan kecepatan, informasi jelas, foto asli, dan penggunaan melalui HP.
- Bedakan layanan yang ditawarkan, properti yang dipasarkan, dan proyek sebagai bukti pekerjaan.
- MVP tanpa keranjang, checkout, pembayaran, akun pelanggan, dashboard admin, database, atau backend khusus.
- Pengelolaan awal melalui berkas konten terstruktur. Ini sederhana secara teknis, tetapi perubahan tetap membutuhkan editor/developer dan proses build ulang.
- Jika staf harus mengelola katalog sendiri setiap hari, evaluasi CMS sebelum implementasi; CMS merupakan pengembangan terpisah.
- Jangan menampilkan statistik, testimoni, sertifikasi, garansi, legalitas, atau proyek fiktif.

## 4. Stack yang dipilih

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Website | Astro dengan output statis | Halaman konten dan detail dihasilkan saat build |
| Bahasa | TypeScript | Memvalidasi bentuk data dan mengurangi kesalahan |
| Tampilan | CSS biasa, design tokens, CSS Grid/Flexbox | Sedikit dependensi dan mudah disesuaikan |
| Interaksi | JavaScript/TypeScript kecil | Menu, filter, pencarian, galeri, dan penyusunan pesan |
| Konten | Astro Content Collections, Markdown dan JSON | Struktur konsisten tanpa database |
| Foto | Aset lokal teroptimasi, WebP/AVIF bila sesuai | Menjaga ukuran unduhan |
| Kontak | Tautan WhatsApp dengan pesan terisi | Tidak membutuhkan penyimpanan formulir di server |
| Hosting | Hosting statis dengan HTTPS dan domain sendiri | Tidak membutuhkan server aplikasi berjalan terus |

Tidak memasang React, Next.js, library UI besar, library animasi, atau state manager untuk MVP. Gunakan versi stabil yang kompatibel saat implementasi dan simpan lockfile. Hosting final dipilih saat pembangunan; dokumen ini tidak menetapkan harga hosting atau domain.

Rujukan teknis: [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) dan [Astro Routing](https://docs.astro.build/en/guides/routing/). Astro mendukung koleksi konten saat build dan pembuatan halaman statis per item.

## 5. Struktur halaman

| URL | Isi utama |
|---|---|
| `/` | Hero, pengenalan, layanan, properti pilihan, proyek pilihan, proses kerja, CTA |
| `/tentang` | Profil, arah kerja, visi, misi, komitmen |
| `/layanan` | Daftar layanan dan harga indikatif bila terverifikasi |
| `/layanan/[slug]` | Lingkup, contoh hasil, proses, hal yang memengaruhi biaya, CTA |
| `/properti` | Pencarian, filter, kartu properti |
| `/properti/[slug]` | Galeri, harga, lokasi, spesifikasi, denah opsional, status, CTA survei |
| `/portofolio` | Proyek yang benar-benar pernah/sedang dikerjakan |
| `/portofolio/[slug]` | Konteks, lingkup, dokumentasi, hasil, status proyek |
| `/kemitraan` | Penjelasan agen freelance dan tombol minat bergabung |
| `/kontak` | Kontak, area layanan, formulir penyusun pesan WhatsApp |
| `/privasi` | Penjelasan pemrosesan data dan layanan pihak ketiga yang benar-benar digunakan |
| `/404` | Pesan halaman tidak ditemukan dan tautan kembali |

Navigasi utama: Beranda, Layanan, Properti, Portofolio, Tentang Kami, tombol Konsultasi. Kemitraan dan Kontak tersedia di footer.

## 6. Kebutuhan fungsional dan kriteria penerimaan

| ID | Kebutuhan | Kriteria penerimaan |
|---|---|---|
| FR-01 | Beranda | Identitas, penawaran utama, dan CTA terlihat jelas; hanya item published ditampilkan |
| FR-02 | Layanan | Tersedia pembangunan rumah, desain 3D rumah, sumur bor, atap spandek/baja ringan, serta pemasaran properti; layanan pembangunan menjelaskan rumah pribadi, komersial, dan subsidi |
| FR-03 | Detail layanan | Menampilkan lingkup, batas cakupan, cara kerja, harga bila disetujui, dan pesan WhatsApp sesuai layanan |
| FR-04 | Katalog properti | Pencarian nama/lokasi; filter tipe, wilayah, status, dan rentang harga; semua filter digabung dengan AND |
| FR-05 | Aturan pencarian | Tidak peka huruf besar/kecil, menghapus spasi tepi; tersedia jumlah hasil dan reset; tanpa hasil menampilkan pesan serta CTA konsultasi |
| FR-06 | Rentang harga | Nilai min/max dalam rupiah, min tidak melebihi max; properti tanpa harga dikecualikan ketika filter harga aktif dan dijelaskan pada UI |
| FR-07 | Detail properti | Memuat harga atau Hubungi kami, spesifikasi, lokasi publik, status, tanggal pembaruan, dan tombol survei |
| FR-08 | Status properti | Tersedia, Dipesan, Terjual; Terjual tidak memiliki CTA pemesanan/survei, tetapi dapat menawarkan pencarian alternatif |
| FR-09 | Galeri | Foto utama dan thumbnail; dapat dioperasikan keyboard; gambar gagal punya fallback; modal opsional harus dapat ditutup Escape |
| FR-10 | Portofolio | Foto diberi keterangan, lokasi sebatas izin pemilik, lingkup, dan status; render diberi label Visualisasi 3D |
| FR-11 | Kontak | Form memuat nama, layanan/minat, lokasi, dan pesan; tombol berlabel Lanjut ke WhatsApp; data belum dianggap terkirim sampai pengguna mengirim di WhatsApp |
| FR-12 | Kemitraan | Menjelaskan minat bergabung tanpa menjanjikan komisi tertentu; CTA menyusun pesan kemitraan |
| FR-13 | Responsif | Semua rute dapat digunakan pada lebar 360, 768, dan 1440 px tanpa overflow horizontal |
| FR-14 | Konten kosong | Bagian pilihan disembunyikan bila kosong; halaman katalog menjelaskan data belum tersedia; tidak membuat data contoh terlihat sebagai penawaran nyata |

Semua kebutuhan di atas masuk MVP. Pengurutan properti: unggulan sebagai default, terbaru berdasarkan updatedAt, harga rendah/tinggi; harga yang belum tersedia ditempatkan terakhir pada kedua urutan harga. Maksimal asumsi awal 50 properti dan 30 proyek; jika jauh lebih besar, evaluasi pagination dan pencarian sebelum menambah data.

## 7. Alur pengguna

1. Jasa: beranda → layanan → detail → isi kebutuhan → WhatsApp → tindak lanjut tim.
2. Properti: katalog → filter → detail → jadwalkan survei → WhatsApp dengan ID dan URL properti.
3. Kepercayaan: portofolio → detail proyek → konsultasi pekerjaan serupa.
4. Mitra: kemitraan → baca informasi → WhatsApp bagian kemitraan.

## 8. Model data

Semua entitas konten memiliki id unik, slug unik, title, publishStatus (`draft`/`published`), featured, createdAt, updatedAt. Tanggal memakai ISO 8601. Mata uang IDR, angka disimpan sebagai angka tanpa format titik.

| Entitas | Field khusus |
|---|---|
| SiteSettings | brandName, tagline, logo, whatsappNumber, email opsional, publicAddress opsional, serviceAreas, socialLinks, defaultSeo, siteUrl |
| Service | category, summary, body Markdown, scope[], exclusions[], steps[], coverImage, startingPrice opsional, priceUnit opsional, priceNote, relatedProjectIds[] |
| Property | propertyType (`rumah-komersial`/`rumah-subsidi`/`ruko`), summary, description, region, publicLocation, price opsional, priceLabel, landAreaM2, buildingAreaM2, bedrooms opsional, bathrooms opsional, floors opsional, availability, images[], floorPlan opsional, facilities[], marketingRole |
| Project | category, summary, body, publicLocation, year opsional, projectStatus (`berjalan`/`selesai`), scope[], images[], relatedServiceIds[] |
| Image | src, alt, caption opsional, kind (`foto-proyek`/`visualisasi-3d`/`ilustrasi`), permissionConfirmed |

Validasi: published wajib memiliki ringkasan dan gambar utama yang diizinkan; harga dan luas harus positif bila diisi; data wajib untuk tipe tertentu dicek sebelum publish; referensi silang harus ada. Informasi sensitif seperti dokumen tanah dan identitas pemilik tidak disimpan di repositori publik. Jangan mengartikan foto brosur sebagai bukti proyek milik perusahaan.

Contoh konfigurasi kontak sementara: nomor pada brosur `087851996059` dinormalisasi menjadi `6287851996059`. **Wajib dikonfirmasi sebelum peluncuran.** Tautan dibangun dari nomor yang divalidasi dan `encodeURIComponent(message)`.

Contoh pesan: “Halo Landas Creative, saya tertarik dengan [nama properti], ID [id]. Saya ingin menanyakan ketersediaan dan jadwal survei. [URL]”. Untuk layanan: “Halo Landas Creative, saya ingin konsultasi [layanan]. Lokasi: [...]. Kebutuhan: [...]”.

## 9. Konten harga dari brosur

| Layanan | Nilai referensi | Status publikasi |
|---|---|---|
| Sumur bor | Mulai Rp12.000.000 | Perlu konfirmasi cakupan, kedalaman, dan komponen biaya |
| Spandek/baja ringan | Mulai Rp140.000/m² | Perlu konfirmasi material, pengukuran luas, dan pemasangan |
| Desain 3D rumah | Mulai Rp400.000, rumah 1 lantai | Perlu konfirmasi hasil yang diterima dan jumlah revisi |

Nilai tersebut disalin dari referensi pengguna, bukan penawaran terbaru yang telah diverifikasi. Harga final menyesuaikan ukuran, spesifikasi, kondisi lokasi, dan lingkup. Harga properti, stok, dan syarat program tidak boleh dibuat sendiri.

## 10. Pengelolaan dan arsitektur

Alur konten: editor mengubah Markdown/JSON dan foto → validasi schema → preview → pemeriksaan bisnis → build → publish hosting statis. Perubahan hanya muncul setelah build/publish berhasil. Jika build gagal, versi live sebelumnya tetap digunakan. Rollback memakai versi hasil build sebelumnya.

Struktur yang disarankan:

```text
src/
  components/       # Header, Footer, ServiceCard, PropertyCard, Gallery
  layouts/          # BaseLayout, DetailLayout
  pages/            # Rute dan template detail
  content/services/
  content/properties/
  content/projects/
  data/site.json
  assets/           # Foto untuk diproses saat build
  styles/tokens.css
  styles/global.css
  content.config.ts
public/             # Favicon dan aset yang tidak perlu diproses
```

Tidak ada endpoint penyimpanan lead pada MVP. Form hanya menyusun pesan di browser; jangan menyimpan field pengguna di localStorage atau analytics. Pembukaan WhatsApp memindahkan pengguna ke layanan pihak ketiga.

## 11. Persyaratan nonfungsional

- Konten utama tersedia sebagai HTML; JavaScript hanya untuk interaksi. Filter boleh membutuhkan JavaScript; jika dinonaktifkan, daftar lengkap dan tautan detail tetap tersedia.
- Target Lighthouse mobile: Performance ≥90, Accessibility ≥95, SEO ≥95 pada beranda, katalog, dan satu detail setelah aset final dimasukkan. Catat kondisi pengujian; nilai ini target, bukan hasil yang sudah diuji.
- Target field Core Web Vitals setelah data cukup: LCP ≤2,5 detik, INP ≤200 ms, CLS ≤0,1 pada persentil 75.
- Anggaran awal beranda: transfer ≤1,5 MB, JavaScript aplikasi terkompresi ≤50 KB; hero diutamakan, foto bawah dilazy-load, dimensi gambar dicantumkan.
- Gunakan HTTPS, hindari script pihak ketiga yang tidak diperlukan, jangan memasukkan rahasia ke frontend, dan render konten dari sumber tepercaya tanpa HTML mentah yang tidak disanitasi.
- SEO: judul/deskripsi unik, canonical dari domain final, sitemap, robots.txt, Open Graph, breadcrumb, dan schema Organization yang hanya berisi fakta terkonfirmasi. Halaman draft tidak ikut hasil build.
- Aksesibilitas: heading berurutan, landmark, alt, focus terlihat, label form, kontras AA, target sentuh minimal 44 px.
- Peta menggunakan tautan eksternal saat alamat tersedia; embed peta dan video tidak dimuat otomatis.

## 12. Pengukuran keberhasilan

Sebelum analytics dipasang: pemeriksaan manual CTA dan pencatatan lead oleh tim. Jika analytics disetujui, ukur view layanan/properti, klik WhatsApp berdasarkan ID item, dan klik kemitraan tanpa isi pesan/nama/nomor pengguna. Klik WhatsApp adalah niat kontak, bukan bukti pesan terkirim atau transaksi. Baseline dan target bisnis ditetapkan setelah satu bulan operasional; tidak mengarang target konversi.

## 13. Tahapan implementasi

1. Finalisasi identitas, kontak, wilayah layanan, harga, dan aset yang boleh digunakan.
2. Bangun design tokens, layout responsif, beranda, dan komponen kartu.
3. Buat schema konten, daftar/detail layanan, properti, dan proyek.
4. Tambahkan filter, galeri, WhatsApp, kemitraan, SEO, dan halaman kosong/error.
5. Uji konten, keyboard, HP, tautan, performa, dan hasil build; siapkan preview.
6. Setelah informasi bisnis lengkap, pasang domain dan publikasikan versi yang disetujui.

## 14. Daftar penerimaan rilis

- [ ] Seluruh FR-01 sampai FR-14 dan aturan pengurutan lolos pemeriksaan.
- [ ] Filter gabungan, reset, harga kosong, dan hasil kosong benar.
- [ ] Draft tidak muncul di daftar, detail, sitemap, atau pencarian.
- [ ] Nomor WhatsApp, encoding pesan, dan URL item benar di HP/desktop.
- [ ] Status Terjual tidak menawarkan pemesanan/survei untuk item itu.
- [ ] Foto render diberi label dan seluruh aset memiliki izin.
- [ ] Tidak ada placeholder, klaim palsu, tautan mati, atau error build.
- [ ] Semua halaman dapat dinavigasi keyboard; menu dan galeri dapat ditutup.
- [ ] Harga, alamat, area layanan, dan informasi kemitraan disetujui pemilik.
- [ ] Build dapat direproduksi dari lockfile dan rollback terdokumentasi.

## 15. Pengembangan berikutnya

CMS untuk staf nonteknis, dashboard properti, integrasi CRM, formulir server dengan proteksi spam, analitik, blog, dan pencarian lanjutan. Masing-masing membutuhkan evaluasi kebutuhan dan biaya; tidak menjadi ketergantungan MVP.

## 16. Data yang masih diperlukan

Logo resolusi tinggi/transparan; konfirmasi nomor WhatsApp; alamat dan area layanan; email/media sosial bila ada; foto pekerjaan asli; minimal satu properti nyata bila katalog ingin terisi; harga dan status terbaru; cakupan paket layanan; detail kemitraan. Katalog dapat diluncurkan dalam keadaan kosong yang dijelaskan dengan jujur bila properti belum tersedia.

Dokumen pendamping: `DESIGN_Landas_Creative.md`. Rujukan bisnis: `Portofolio_Landas_Creative.md`, logo LNDS, dan brosur layanan yang diberikan pengguna.
