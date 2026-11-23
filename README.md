# Landas Creative

Website profil, layanan, properti, dan portofolio **Landas Creative**. Logo **LNDS**, tagline **Foundations & Growth**. Bahasa utama Indonesia.

**Pengelola konten lokal tersedia di `/admin`.** Sveltia CMS menyimpan perubahan ke Markdown, JSON, dan folder gambar. Website pengunjung tetap statis. Lima layanan masih draft, katalog properti dan proyek kosong, WhatsApp dan indexing menunggu persetujuan. [Panduan konten dan CMS](docs/CONTENT_GUIDE.md) · [Deployment manual](docs/DEPLOYMENT_GUIDE.md) · [Checklist rilis](docs/RELEASE_CHECKLIST.md) · [Progres](docs/IMPLEMENTATION_PLAN.md).

Hasil pemeriksaan dan batas verifikasi setiap tahap tercatat di rencana implementasi. Warning koleksi kosong masih disengaja. Bukti tiap tahap disimpan di `docs/verification/`.

## Prasyarat dan instalasi

- Node.js **≥22.23.4** sesuai engines Astro yang dipilih; implementasi diperiksa dengan Node **24.15.0** dan npm **12.0.2**.
- npm **≥9.6.5**. Gunakan npm dan lockfile yang tersedia agar instalasi konsisten.
- Astro **7.4.12**, `@astrojs/check` **0.9.12**, TypeScript **6.0.3**. TypeScript dipilih dari rentang peer dependency alat check (`^5 || ^6`), bukan memaksakan major terbaru yang belum didukung.

Jalankan dari root project:

```sh
npm ci
```

`npm ci` mengikuti `package-lock.json`. Gunakan `npm install` hanya bila sengaja mengubah dependensi, lalu simpan perubahan lockfile. Tidak memerlukan API key, database, backend, atau file `.env`.

## Menjalankan dan memeriksa

Untuk menyunting dari komputer ini, jalankan `npm run dev`, buka `http://localhost:4321/admin` di Chrome atau Edge desktop, pilih **Work with Local Repository**, lalu pilih folder **Landas-Creative** yang berisi `package.json`. Gunakan port pada terminal jika berbeda. Git lokal sudah diinisialisasi di workspace ini. Saat bekerja dari salinan tanpa folder `.git`, jalankan `git init` sekali di root salinan itu. Buka beranda di tab kedua untuk melihat perubahan.

```sh
npm run dev
```

Buka alamat lokal yang dicetak Astro (biasanya `http://localhost:4321`).

```sh
npm run check
npm run test:content
npm test
npm run build
npm run preview
```

- `check`: sinkronisasi koleksi dan pemeriksaan TypeScript/Astro.
- `test:content`: tes runner bawaan Node untuk ID duplikat, slug bentrok, referensi hilang, serta uraian published.
- `test` mencakup konfigurasi CMS, konten, validasi media, pencarian, formulir, SEO, serta inventaris artefak.
- `build`: menghasilkan website statis ke `dist/`; tidak memublikasikan apa pun. Build sendiri tidak menggantikan pemeriksaan tipe, jadi jalankan keduanya.
- `preview`: menyajikan `dist/` secara lokal setelah build. Hosting produksi harus mengatur fallback 404 memakai `404.html`.

Untuk meninjau kartu tanpa mengubah draft, jalankan **dev** lalu buka `/_preview/kartu`. Tersedia juga detail DEMO: `/_preview/detail/layanan`, `/_preview/detail/properti`, `/_preview/detail/properti-terjual`, `/_preview/detail/proyek`. Semua diinjeksi hanya untuk development, berada di luar `src/pages`, dan tidak ikut build produksi. Rincian ada pada panduan konten. Jangan memublikasikan development server.

Untuk mencoba filter dan form, buka **`/_preview/interaksi`** pada server dev. Empat listing/harga/wilayah di sana sintetis dan berlabel DEMO; nomor kontak tetap nonaktif. Galeri pada detail properti DEMO menyediakan tiga gambar (satu sengaja gagal) dan denah untuk pengujian. Pada produksi, kontrol filter baru tampil bila ada properti published; katalog kosong tetap rapi.

Jika lingkungan terbatas memblokir penulisan konfigurasi telemetry Astro di direktori pengguna, nonaktifkan telemetry untuk sesi terminal tersebut sebelum menjalankan perintah. PowerShell:

```powershell
$env:ASTRO_TELEMETRY_DISABLED = '1'
npm run check
npm run build
```

Pada shell POSIX: `ASTRO_TELEMETRY_DISABLED=1 npm run check` (terapkan juga ke perintah lain bila diperlukan). Ini tidak membutuhkan perubahan izin sistem.

QA lanjutan memakai Chrome terpisah dan server lokal development 4322/preview 4323. Jalankan `npm run qa:build`, `npm run qa:browser`, kemudian `npm run qa:lighthouse`. Petunjuk tiga terminal, batas pengujian, serta lokasi screenshot/laporan ada di [QA_REPORT.md](docs/QA_REPORT.md). Playwright Core 1.65.1, axe Playwright 4.14.0, dan Lighthouse 13.6.0 adalah devDependency yang tidak ikut bundle website; tidak mengunduh browser baru.

## Persiapan rilis lokal

```sh
npm run release:check
npm run release:snapshot
npm run release:verify -- .releases/ID
```

`release:check` membaca kekurangan data prarilis; exit 1 saat ini diharapkan dan dijelaskan dalam laporan readiness. Ia tidak mengonfirmasi informasi bisnis. `release:snapshot` menjalankan check/test/build sebelum menyalin output ke ID baru, lalu mencatat hash dalam manifest. Ganti `ID` pada verify dengan ID hasil snapshot. Tidak ada perintah deploy.

Snapshot ada di `.releases/ID/site/`, manifest di luar web root. Seluruh snapshot bertanda **local-review-only**, `deploymentApproved: false`. Instalasi bersih Tahap 6 dilakukan pada salinan terpisah; 22 berkas build identik pada Node/npm/OS yang diuji. Lihat [bukti reproducibility](docs/verification/stage-6/reproducibility.json) dan [latihan rollback](docs/verification/stage-6/rollback-drill.json). Snapshot build bukan backup sumber yang dapat disunting; pengaturan version control/backup sumber dan host tetap perlu disepakati.

## Struktur folder

```text
docs/
  PRD_Landas_Creative.md       # Kebutuhan dan kriteria penerimaan
  DESIGN_Landas_Creative.md    # Acuan visual
  IMPLEMENTATION_PLAN.md      # Pemetaan FR, progres, data bisnis, hasil check
  CONTENT_GUIDE.md            # Lokasi data dan cara mengisi konten
  QA_REPORT.md                # Hasil, batas penerimaan FR, cara menjalankan ulang QA
  DEPLOYMENT_GUIDE.md          # Kontrak hosting, snapshot, prosedur deploy/rollback nanti
  RELEASE_CHECKLIST.md         # Data/instruksi pemilik dan pemeriksaan sebelum rilis
  verification/              # Bukti screenshot per tahap
references/
  logo.jpeg                   # Referensi asli, dipertahankan
src/
  assets/brand/logo.jpeg      # Salinan identik logo untuk optimasi Astro
  assets/illustrations/      # SVG arsitektur konseptual, bukan bukti pekerjaan
  components/                # Kartu, PropertyCatalog, Gallery, MessageForm, navigasi/fallback
    details/                 # Template isi detail layanan/properti/proyek
  content/
    services/*.md            # Lima layanan draft
    properties.json          # Koleksi properti kosong []
    projects.json            # Koleksi proyek kosong []
  data/
    site.json                # Identitas, kontak, flag verifikasi, SEO dasar
    site.ts                  # Validasi konfigurasi dan kontak terverifikasi
    home.json                # Copy beranda dan pengaturan foto hero
    home.ts                  # Validasi copy dan izin foto hero
    pages.json               # Copy katalog, profil Tentang, pesan detail
    pages.ts                 # Validasi copy halaman
    contact.json             # Copy kontak/kemitraan/form; terms null sampai disetujui
    contact.ts               # Validasi copy kontak/kemitraan
    labels.ts                # Label kategori/status konsisten
    navigation.ts            # Rute katalog/detail
  dev/                       # Fixture dan halaman DEMO khusus astro dev
  layouts/                   # BaseLayout, CatalogLayout, DetailLayout
  schemas/content.ts         # Schema bersama yang juga diuji lewat unit test
  pages/
    index.astro              # Beranda; hanya mengambil konten published
    404.astro                # Halaman tidak ditemukan
    layanan/                 # Katalog dan [slug].astro published
    properti/                # Katalog dan [slug].astro published
    portofolio/              # Katalog dan [slug].astro published
    tentang.astro            # Profil/komitmen; visi/misi opsional terverifikasi
    kontak.astro             # Kanal resmi opsional dan penyusun pesan browser
    kemitraan.astro          # Informasi minat agen; tanpa janji komisi
    privasi.astro            # Pemrosesan aktual dan perpindahan ke layanan eksternal
    robots.txt.ts            # Endpoint statis; memblokir crawl sebelum persetujuan
    sitemap.xml.ts           # Endpoint statis; hanya URL published saat indexing siap
  styles/
    tokens.css               # Warna, tipografi, spacing, breakpoint
    global.css               # Reset ringan, container, tombol, fokus
    forms.css                # Label, input, error, grid form
    contact.css              # Layout kontak/kemitraan responsif
  utils/content.ts           # Query published dan validasi slug unik
  utils/content-integrity.ts # ID JSON, slug, referensi, kelengkapan body
  utils/assets.ts            # Resolver aset lokal untuk konfigurasi
  utils/format.ts            # Rupiah dan luas
  utils/property-search.ts   # Filter AND, rentang, dan pengurutan
  utils/whatsapp.ts          # Penyusunan teks dan encoding tautan nomor terverifikasi
  utils/seo.ts               # Canonical, sitemap, robots, serialisasi JSON-LD
  content.config.ts          # Loader dan schema koleksi
tests/content-integrity.test.mjs # Regresi integritas konten tanpa test framework
tests/interactions.test.mjs     # Regresi pencarian/filter/urutan/pesan
tests/schema-seo.test.mjs       # Schema publikasi, harga/izin, guard SEO
tests/release-files.test.mjs    # Deteksi artefak berubah/hilang/tambahan
scripts/qa-*.mjs             # Audit build, browser/axe, dan Lighthouse lokal
scripts/release.mjs          # Laporan readiness, snapshot review, verifikasi hash
scripts/lib/release-files.mjs # Inventaris SHA-256 deterministik
.releases/                  # Snapshot lokal, diabaikan Git/check tipe; bukan folder upload utuh
.verification/              # Area kerja pengujian terisolasi, diabaikan Git/check tipe
astro.config.mjs             # Output static; tanpa adapter/server
tsconfig.json                # TypeScript strict
package.json
package-lock.json
```

## Konten dan konfigurasi awal

Acuan tetap [PRD](docs/PRD_Landas_Creative.md) dan [DESIGN](docs/DESIGN_Landas_Creative.md). Keduanya tidak diubah oleh implementasi ini.

- Lima layanan tetap **draft**, hanya dari kategori/informasi pada PRD. Harga referensi belum dimasukkan sebagai harga aktif. Properti/proyek produksi sengaja kosong. Data DEMO hanya ada di `src/dev` dan tidak ikut hasil produksi.
- ID layanan berasal dari nama berkas Markdown. ID properti/proyek nantinya wajib diisi sebagai field `id` unik dalam setiap objek JSON. Slug disimpan terpisah; jangan mengganti ID yang sudah direferensikan.
- Tanggal berupa string ISO 8601 dengan zona waktu, misalnya `2026-11-14T00:00:00+07:00`. Angka harga/luas tidak diformat sebagai teks.
- Untuk semua daftar/rute publik, gunakan `getPublishedEntries()` atau `getPublishedContent()`; jangan mengakses koleksi mentah untuk daftar atau `getStaticPaths`. Helper memeriksa slug duplikat (termasuk draft), referensi silang, dan body published. Parser JSON juga menolak ID duplikat sebelum loader.
- Schema memeriksa ringkasan/gambar berizin saat published, tanggal, angka positif, enum, caption proyek, lingkup/proses, serta persetujuan harga. Harga rupiah berupa integer positif yang aman. Lokasi/peran pemasaran/luas divalidasi untuk ketiga tipe properti. Schema dipisahkan dari loader agar aturan yang sama dapat diuji; pengisian bisnis tetap menunggu persetujuan.
- Field gambar memakai `src` relatif terhadap berkas konten menuju aset lokal, `alt`, `caption` opsional (wajib untuk proyek published), `kind`, dan `permissionConfirmed`. Gunakan jenis `visualisasi-3d` untuk render; label visualnya dibuat pada tahap galeri/kartu. Denah opsional juga memerlukan izin.
- `src/data/site.json` menyimpan nomor referensi dengan `whatsappConfirmed: false`. `verifiedWhatsappNumber` bernilai `null` sampai dikonfirmasi; fondasi tidak menghasilkan tautan WhatsApp aktif.
- Alamat, wilayah layanan, email, media sosial, dan domain tetap kosong sampai data resmi tersedia. Isi hanya fakta yang disetujui; field opsional yang tidak kosong dianggap sudah disetujui pemilik.
- Nama perusahaan pada header adalah teks, bukan gambar ulang logo LNDS. Logo JPEG asli tampil utuh di footer. Header final menunggu logo transparan/SVG resmi; system font dipakai sesuai fallback DESIGN. Hero memakai ilustrasi SVG berlabel sampai foto asli berizin diisi pada konfigurasi.

Navigasi katalog dan Tentang menuju halaman masing-masing. Hero/konsultasi membuka `/kontak#pesan`, kemitraan `/kemitraan`, dan footer menyediakan privasi. Detail item mempersiapkan referensi hanya dari konten published. Form menampilkan pratinjau; Lanjut ke WhatsApp hanya aktif bila nomor resmi terkonfirmasi. Isian tidak disimpan atau dikirim ke server. Properti terjual hanya menawarkan pencarian alternatif, tanpa pemesanan/survei.

Menu mobile tetap menampilkan navigasi tanpa JavaScript. Daftar properti published dan seluruh gambar galeri juga tersedia sebagai HTML. Form dan kontrol interaktif hanya ditampilkan setelah JavaScript terpasang. Galeri memakai native dialog/Escape serta penanganan fokus ringan. Perilaku ini telah diuji melalui browser QA; penggunaan pembaca layar dan perangkat fisik tetap perlu diperiksa sebelum rilis.

## Sebelum rilis

Website memakai `noindex, nofollow`, robots `Disallow: /`, serta sitemap kosong selama domain/indexing belum disetujui. `siteUrl` dalam `src/data/site.json` mengatur `site` Astro; hanya origin HTTPS tanpa path/query. Setelah persetujuan domain dan indexing, konfigurasi yang sama membangun canonical, URL Open Graph, schema Organization/Breadcrumb, robots, serta sitemap URL published. 404/DEMO tetap dikecualikan. Jangan mengedit hasil dist/robots secara manual atau mengaktifkan flag sebelum diinstruksikan. Noindex bukan kontrol akses; jangan memasukkan data rahasia ke konten statis.

Analytics belum dipasang. Target SEO serta pengukuran katalog terisi dan satu detail nyata menunggu domain, konten, dan aset final. Uji alih WhatsApp menunggu konfirmasi nomor. Zoom native, pembaca layar dan perangkat fisik juga perlu ditinjau. CMS adalah perluasan setelah MVP dan hanya dipakai pengelola.

Konten yang berubah melalui validasi, pratinjau, konfirmasi bisnis, build, lalu upload manual oleh pemilik. Git lokal telah diinisialisasi untuk CMS. Simpan cadangan sumber dan catatan persetujuan rilis. Prosedur snapshot dan rollback tersedia di [panduan deployment](docs/DEPLOYMENT_GUIDE.md).
