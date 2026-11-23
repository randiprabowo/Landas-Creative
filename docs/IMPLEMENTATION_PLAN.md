# Rencana implementasi — Landas Creative

Checkpoint terbaru **23 November 2026**. Situs publik berjalan di Cloudflare Workers menurut konfirmasi pemilik. Backend CMS GitHub telah disiapkan dan diuji lokal.

## Akses CMS daring

- [x] Periksa 404 pada `/admin`. Build publik sebelumnya memakai konfigurasi CMS tanpa repository daring. Repository yang terhubung menggunakan GitHub.
- [x] Konfigurasikan backend GitHub untuk `randiprabowo/Landas-Creative`, branch `main`. Token pribadi dimasukkan oleh pengguna melalui panel CMS. Alur GitLab PKCE tetap tersedia.
- [x] Lulus check tipe, 40 tes, build, pemeriksaan rute `/admin` pada Wrangler, dan pemeriksaan layar masuk token pada Chrome. Audit aset dan rute publik lulus. [Hasil audit](verification/cms-github/build-audit.json)
- [ ] Pemilik mendorong perubahan ke branch Cloudflare, membuat token yang dibatasi ke repository, dan memeriksa login pada deployment terbaru. [Panduan akses editor](DEPLOYMENT_GUIDE.md#akses-editor-setelah-mvp)

## Deploy Cloudflare

- [x] Tinjau log pemilik. Build Astro menghasilkan sembilan halaman. Tahap deploy gagal saat konfigurasi otomatis Wrangler mencari `public/.assetsignore`.
- [x] Tambahkan [wrangler.jsonc](../wrangler.jsonc) untuk Worker `landas-creative` dengan direktori aset `dist/`. Perbarui [panduan build Cloudflare](DEPLOYMENT_GUIDE.md#cloudflare-workers-yang-terhubung-ke-git).
- [x] Uji Wrangler 4.166.0 dengan `deploy --dry-run` dan server lokal. Beranda, properti, kontak, robots, sitemap, dan CSS merespons HTTP 200. URL dengan garis miring di akhir dialihkan ke URL kanonis. Halaman tidak dikenal, admin, dan preview merespons HTTP 404.
- [ ] Pemilik memasukkan konfigurasi ke branch yang terhubung, lalu memeriksa hasil deployment Cloudflare.

## Media tambahan dan konsultasi

- [x] Sediakan kolom opsional **Video YouTube** dan **Model 3D interaktif** di CMS untuk hero, layanan, dan properti. Rute GLB statis dibangun dari referensi berizin pada hero dan detail terbit.
- [x] Muat YouTube dalam mode privasi yang ditingkatkan saat pemutar dipilih. Muat paket model-viewer 4.4.0 dan GLB lokal saat penampil 3D dipilih. Ukuran chunk penampil sekitar 1 MB sebelum kompresi. Build mengeluarkan peringatan ukuran untuk chunk yang dimuat setelah klik. Ilustrasi hero tersedia saat kolom foto belum diisi.
- [x] Sediakan tombol chat mengambang menuju formulir konsultasi, termasuk referensi layanan/properti dan penawaran alternatif untuk properti terjual. Formulir memakai konfigurasi nomor resmi yang sama.
- [x] Uji CMS menyimpan URL dan file GLB pada salinan data. Uji video, model, penutupan dialog, fokus, fallback ketika file gagal, serta responsif dan alur pesan pada build terisolasi. Permintaan YouTube dan WhatsApp ditangkap secara lokal untuk pengujian tersebut. [Uji browser media](verification/media/feature-audit.json) · [Uji CMS](verification/media/cms-audit.json)
- [x] Check tipe memeriksa 86 berkas tanpa error, warning, atau hint. 39 tes lulus. Build menghasilkan 9 halaman publik. Audit HTTP memeriksa 173 tautan, 10 aset dan 13 rute tersembunyi tanpa masalah. Regresi akhir lulus pada 45 kombinasi halaman dan viewport serta 32 audit axe setelah tombol chat mendapat landmark navigasi. [Audit build](verification/media/build-audit.json) · [Regresi browser](verification/media/regression/browser-audit.json)
- [ ] Pemilik mengisi URL video dan menyediakan file GLB yang berizin. Playback YouTube asli dan WebGL pada perangkat pengguna perlu diperiksa dengan aset tersebut.
- [ ] Pemilik mengonfirmasi nomor dan aktivasi WhatsApp, lalu menguji alih ke nomor resmi sebelum peluncuran. [Panduan konten](CONTENT_GUIDE.md)

## Perluasan setelah Tahap 6

Permintaan pemilik memperluas batas MVP pada PRD §3 dan §15 untuk menambahkan panel editor. PRD dan DESIGN asli dipertahankan.

- [x] Siapkan Sveltia CMS 0.270.0 untuk pengaturan bisnis, halaman, kontak, kemitraan, footer, Markdown layanan, koleksi JSON properti/proyek, dan media. Lima layanan tetap draft dan kedua katalog produksi tetap kosong.
- [x] Sediakan editor lokal dengan izin folder browser dan Git lokal. Untuk editor daring, konfigurasi GitLab PKCE bersifat opsional. Salinan project utama belum terhubung ke remote.
- [x] Ratakan teks breadcrumb dan bagi navigasi footer menjadi dua kolom. Logo mempertahankan rasio. Verifikasi Chrome pada 360, 768 dan 1440 px menemukan selisih vertikal teks breadcrumb 0 px, dua kolom tautan, dan lebar dokumen sama dengan viewport.
- [x] Uji simpan melalui UI pada salinan data di sistem berkas privat Chrome. Email, Markdown layanan dan body, properti dengan luas desimal, proyek, dan unggahan galeri tersimpan. Gambar memakai path relatif dan izin false. Berkas hasil simpan dipakai untuk build Astro terisolasi. Email uji muncul di halaman kontak salinan dan rute detail draft tetap absen.
- [x] Validasi konfigurasi lokal dan daring terhadap schema paket CMS. Build dari salinan dengan pengenal OAuth uji menghasilkan halaman editor. Login simulasi menghasilkan redirect URI, state dan challenge S256 yang sesuai. Permintaan dicegat di browser sebelum mencapai GitLab.
- [x] Project utama lulus pemeriksaan tipe, 36 tes dan build 9 halaman pengunjung. Audit HTTP memeriksa 166 tautan, 10 aset dan 13 rute tersembunyi. URL admin mengembalikan 404 pada build awal. Regresi mencakup 22 kelompok interaksi, 45 kombinasi rute/viewport, dan 32 audit axe dengan nol pelanggaran. [Laporan HTTP](verification/cms/build-audit.json) · [Laporan browser](verification/cms/regression/browser-audit.json)
- [x] Perbarui [panduan pengelola](CONTENT_GUIDE.md) dan [panduan login daring serta deployment manual](DEPLOYMENT_GUIDE.md). [Admin](verification/cms/admin.png) · [Footer HP](verification/cms/footer-360.png) · [Footer desktop](verification/cms/footer-1440.png) · [Breadcrumb](verification/cms/breadcrumb-360.png)
- [x] Pada 22 November, jalankan ulang check (80 berkas, 0 error/warning/hint), 36 tes dan build. Verifikasi snapshot lokal `2026-11-21T23-41-50-855Z-07e1b3ec41` mencocokkan 22 berkas. Salinan uji sementara sudah dibersihkan. Pada server lokal, beranda, katalog properti, editor, konfigurasi dan bundle CMS menjawab HTTP 200.
- [ ] Untuk akses daring, pemilik menyiapkan repository privat, aplikasi OAuth dan domain. Login serta hak tulis akun nyata perlu diperiksa pada konfigurasi tersebut.
- [ ] Pemilik mengisi dan menyetujui data bisnis, lalu memilih versi untuk upload manual.

## Acuan dan kondisi awal

- PRD v1.0 dan DESIGN v1.0 sudah dibaca seluruhnya. Keduanya tetap menjadi acuan; tidak ada perubahan isi dokumen.
- Folder awal hanya berisi kedua dokumen dan `references/logo.jpeg` (1.408 × 768 px). Tidak ada project aplikasi, `.git`, atau AGENTS.md pada workspace dan direktori induk yang diperiksa.
- Logo JPEG berisi logo lengkap, tagline, latar bertekstur, serta margin besar. Gunakan utuh untuk pratinjau identitas; jangan menggambar ulang, memotong logo, atau menganggapnya foto pekerjaan.
- Dokumen bisnis `Portofolio_Landas_Creative.md` yang disebut PRD tidak tersedia. Ini data pendukung yang masih dibutuhkan, bukan penghalang fondasi.

## Kebutuhan utama dan batas MVP

Website Indonesia menghubungkan profil perusahaan, lima layanan, properti, proyek nyata, kemitraan, dan konsultasi melalui WhatsApp. Identitas: **Landas Creative**, logo **LNDS**, tagline **Foundations & Growth**. Desain memakai teal, navy, dan krem, CSS tokens, HTML semantik, serta pendekatan responsif.

Astro statis + TypeScript + Content Collections + Markdown/JSON. JavaScript hanya untuk interaksi. Tidak ada database, backend, akun, CMS/admin, pembayaran, checkout, analytics, atau embed pihak ketiga pada fondasi. Perubahan konten memerlukan build ulang. Tidak ada publikasi atau layanan berbayar dalam tahap ini.

Data draft tidak boleh menjadi penawaran publik. Properti dan proyek tetap kosong sampai data nyata disetujui. Tidak membuat statistik, testimoni, legalitas, atau klaim hasil pekerjaan. Gambar wajib memiliki izin; visualisasi 3D harus dilabeli. Form nantinya hanya membuka pesan, bukan memastikan pengiriman.

## Data bisnis yang belum tersedia

- [ ] Nomor WhatsApp: `087851996059` / `6287851996059` dari PRD **belum terkonfirmasi**. Simpan dengan penanda verifikasi false; jangan membuat tautan WhatsApp aktif.
- [ ] Domain final, alamat publik, wilayah layanan, email, dan media sosial resmi.
- [ ] Logo transparan/SVG resmi untuk header final; lisensi/aset font Plus Jakarta Sans. Sementara gunakan nama perusahaan sebagai teks header, logo asli utuh pada area identitas, dan system font sesuai opsi DESIGN.
- [ ] Cakupan, pengecualian, proses, serta persetujuan publikasi lima layanan. Pembangunan mencakup rumah pribadi, komersial, dan subsidi sesuai FR-02.
- [ ] Harga brosur belum terkonfirmasi: sumur bor mulai Rp12.000.000; atap mulai Rp140.000/m²; desain 3D mulai Rp400.000 untuk satu lantai. Tidak menjadi harga aktif pada konten.
- [ ] Properti nyata: ID, foto berizin, lokasi publik, spesifikasi, harga, status, peran pemasaran, tanggal pembaruan, dan persetujuan publikasi.
- [ ] Proyek nyata: dokumentasi berizin, jenis foto/render, lingkup, status, dan lokasi yang boleh ditampilkan; dokumen portofolio pendukung.
- [ ] Syarat dan kontak kemitraan; tidak menjanjikan komisi.
- [ ] Profil perusahaan tambahan, visi, dan misi resmi bila ingin ditampilkan. Field visi/misi pada halaman Tentang tetap kosong dan disembunyikan.

## Keputusan fondasi

1. Lanjutkan dalam workspace yang tersedia tanpa scaffold yang menimpa dokumen/aset.
2. Versi stabil diverifikasi dari registry npm dan dipasang dengan versi persis: Astro 7.4.12, @astrojs/check 0.9.12, TypeScript 6.0.3. Node lokal 24.15.0 memenuhi engines Astro (≥22.23.4); npm 12.0.2. TypeScript terbaru saat pemeriksaan adalah major 7, tetapi peer check baru mendukung ^5/^6; karena itu pilih 6.0.3. Lockfile disimpan.
3. `src/content/services/*.md` untuk isi layanan; `src/content/properties.json` dan `src/content/projects.json` untuk koleksi data yang awalnya kosong. Lima layanan dibuat **draft**, bukan DEMO atau penawaran terbit.
4. Schema bersama memuat metadata, tanggal ISO, slug, jenis gambar, izin, dan validasi angka positif. Konten published membutuhkan ringkasan serta gambar utama berizin. Harga hanya boleh diterbitkan setelah dikonfirmasi. Referensi antarkoleksi memakai Content Collections.
5. Konfigurasi identitas/kontak dipisahkan dari komponen. Kontak belum terkonfirmasi tidak menghasilkan tautan kontak aktif. Domain kosong tidak menghasilkan canonical palsu; fondasi memakai noindex sampai tahap persiapan rilis.
6. Navigasi fondasi menuju section yang tersedia. Rute katalog/detail belum dibuat; tautan akan dipindahkan ke rute final pada Tahap 2–4. Menu mobile harus tetap dapat digunakan tanpa JavaScript, dengan peningkatan interaksi kecil untuk tombol dan Escape.
7. Buat BaseLayout, header/footer, tokens/global CSS, halaman awal sederhana, dan 404. Halaman awal hanya memeriksa identitas, tipografi, navigasi, layanan draft, serta kondisi data kosong; belum beranda lengkap.

## Pemetaan FR-01 sampai FR-14

| FR | Implementasi dan tahap utama | Bukti penerimaan yang direncanakan |
| --- | --- | --- |
| FR-01 | T1 layout/identitas dan helper published; T2 beranda lengkap | CTA jelas; hanya published; pilihan kosong disembunyikan |
| FR-02 | T1 lima draft layanan + category; T3 katalog | Lima kategori sesuai PRD; pembangunan pribadi/komersial/subsidi |
| FR-03 | T1 schema lingkup/pengecualian/proses/harga; T3 detail; T4 WA | Isi terverifikasi dan pesan sesuai layanan |
| FR-04 | T1 schema properti; T3 katalog; T4 filter | Nama/lokasi, tipe/wilayah/status/harga, gabungan AND |
| FR-05 | T4 pencarian dan reset; T5 pengujian | Trim, case-insensitive, jumlah, hasil kosong, CTA |
| FR-06 | T1 schema harga positif/konfirmasi; T4 validasi filter | Rupiah numerik, min ≤ max; harga kosong dikecualikan dengan penjelasan |
| FR-07 | T1 schema spesifikasi/status/tanggal; T3 detail; T4 WA | Harga atau hubungi; lokasi publik, pembaruan, survei |
| FR-08 | T1 enum status; T3/T4 tampilan/CTA | Terjual tidak menawarkan survei/pemesanan; alternatif tersedia |
| FR-09 | T1 schema gambar/izin; T4 galeri; T5 pengujian | Keyboard, fallback gambar, Escape jika modal |
| FR-10 | T1 schema proyek/jenis gambar; T3 portofolio | Dokumentasi nyata, caption, izin lokasi, label Visualisasi 3D |
| FR-11 | T1 konfigurasi kontak tidak aktif; T4 form/WA | Field berlabel; Lanjut ke WhatsApp; pesan belum dianggap terkirim |
| FR-12 | T4 halaman kemitraan | Minat bergabung, tanpa janji komisi, pesan kemitraan |
| FR-13 | T1 tokens/layout/menu; T2–T4 semua rute; T5 audit | 360/768/1440 px, keyboard, zoom, tanpa overflow |
| FR-14 | T1 data kosong jujur; T2 section pilihan; T3/T4 katalog | Tidak ada item palsu; pilihan kosong disembunyikan; katalog menjelaskan |

Pengurutan properti pada T4: unggulan default, terbaru menurut updatedAt, harga rendah/tinggi dengan harga kosong selalu terakhir. Asumsi kapasitas PRD: 50 properti dan 30 proyek; evaluasi ulang bila terlampaui.

## Checklist bertahap

### Tahap 1 — Analisis dan fondasi

- [x] Baca PRD dan DESIGN seluruhnya; periksa repository, AGENTS.md, dan aset.
- [x] Ringkas kebutuhan, batas MVP, data yang belum tersedia, serta pemetaan semua FR.
- [x] Siapkan Astro statis, TypeScript strict, versi stabil kompatibel, lockfile, dan ignore.
- [x] Buat schema/koleksi layanan, properti, proyek, serta konfigurasi identitas/kontak.
- [x] Buat tokens, global CSS, BaseLayout, header/footer responsif.
- [x] Buat halaman awal sederhana dan 404; hindari tautan menuju rute yang belum tersedia.
- [x] Lengkapi README: instalasi, development, check, build, preview, struktur folder, batas tahap.
- [x] Jalankan pemeriksaan tipe/build serta catat hasil sebenarnya dan batas verifikasi.
- [x] Perbarui checkpoint dan berhenti menunggu instruksi Tahap 2.

### Tahap 2 — Beranda dan komponen visual utama

- [x] Hero sesuai DESIGN dengan ilustrasi berlabel sampai foto asli tersedia; kartu layanan dan komponen visual reusable.
- [x] Pengantar/tiga komitmen, lima langkah kerja, CTA, ajakan kemitraan.
- [x] Properti/proyek pilihan hanya bila published + featured tersedia; sembunyikan bila kosong.
- [x] Pertahankan navigasi anchor fungsional selama rute final belum tersedia; uji responsif tahap ini.
- [x] Pusatkan copy beranda dan konfigurasi gambar; tulis `docs/CONTENT_GUIDE.md`.
- [x] Buat preview kartu DEMO khusus development di luar rute produksi; pastikan build tidak memuat route/data DEMO.
- [x] Periksa 360/768/1440 px, menu, tautan, tipe/build; simpan screenshot desktop/mobile dan hasil sebenarnya.

Keputusan Tahap 2: jangan mengubah draft/persetujuan bisnis. Beranda memakai ilustrasi SVG arsitektur berlabel karena foto asli belum tersedia. Bagian pilihan properti/proyek disembunyikan saat kosong; navigasi yang belum memiliki rute menuju informasi katalog di footer. Layanan kosong mendapat penjelasan singkat, sedangkan lima kartu ditinjau lewat preview development. CTA konsultasi/kemitraan mengarah ke alur atau informasi kontak yang tersedia, tanpa tautan WhatsApp yang belum dikonfirmasi. Halaman penuh kontak/kemitraan/detail tetap pada tahap berikutnya.

### Tahap 3 — Katalog dan detail

- [x] Rute katalog/detail layanan, properti, portofolio; profil tentang perusahaan.
- [x] Draft tidak muncul di daftar atau getStaticPaths; slug/ID unik dan referensi valid.
- [x] Keadaan katalog kosong, harga kosong, label gambar/render, status properti.
- [x] Breadcrumb, template detail reusable, metadata dasar, dan navigasi menuju rute yang benar-benar tersedia.
- [x] Validasi ID/slug/referensi dan kelengkapan published; uji regresi batas draft/data.
- [x] Preview detail DEMO development tanpa mengubah draft atau memasukkan fixture ke build produksi.
- [x] Perbarui panduan konten/README, periksa tipe/build/360–768–1440 px, lalu berhenti di checkpoint.

Keputusan Tahap 3: katalog produksi memakai konten published saja dan menampilkan empty state jujur saat kosong. Detail statis dihasilkan dari daftar published, sehingga lima layanan draft tetap 404 pada URL publik. Preview development akan memakai template detail yang sama dengan label DEMO. Tidak mengaktifkan filter, pengurutan interaktif, thumbnail/modal galeri, form/WhatsApp, atau halaman kemitraan penuh sebelum Tahap 4. Dokumentasi gambar pada Tahap 3 ditampilkan statis dengan caption/label dan fallback; harga/nomor belum terkonfirmasi tetap tidak dipublikasikan. Halaman Tentang memakai profil/komitmen yang sudah ada, tanpa mengarang sejarah, visi, misi, atau legalitas.

### Tahap 4 — Interaksi dan kontak

- [x] Implementasi pencarian/filter AND/reset/jumlah hasil dan aturan rentang harga; tes logika lolos.
- [x] Pengurutan sesuai PRD termasuk harga kosong terakhir pada kedua arah; tes logika lolos.
- [x] Implementasi galeri thumbnail/keyboard/native dialog/Escape/fallback dan hasil pencarian kosong; HTML/template diperiksa, interaksi browser belum diverifikasi.
- [x] Implementasi pesan WhatsApp sesuai item/status, form pratinjau, kontak dan kemitraan; nomor tetap belum terkonfirmasi dan tombol alih WhatsApp nonaktif.
- [x] Halaman privasi sesuai pemrosesan aktual; tanpa endpoint atau penyimpanan field pengguna.
- [x] Preview interaksi DEMO terpisah; audit build, tes, check, dan dokumentasi pengisian.
- [x] Verifikasi browser Tahap 4 dituntaskan pada Tahap 5: pencarian/filter/reset/error, form/validasi/konteks, galeri/Escape/fokus, mode tanpa JavaScript, serta 360/768/1440 px. Riwayat penghentian Computer Use tetap tercatat di log Tahap 4; hasil baru memakai Chrome QA terpisah.
- [ ] Uji alih WhatsApp di HP/desktop setelah nomor dikonfirmasi dan aktivasi diinstruksikan. Tidak menghubungi nomor referensi atau mengirim pesan pada tahap ini.

Keputusan Tahap 4: kontrol filter hanya tampil jika ada data published. Katalog produksi yang kosong tetap memakai empty state. Preview development terpisah menampung empat properti/harga sintetis dan form tanpa kontak aktif. Form kontak publik dapat menyusun pratinjau; nomor referensi tidak dikirim ke browser, dan tombol Lanjut ke WhatsApp disabled dengan penjelasan sampai dikonfirmasi. CTA detail membawa slug, sedangkan form mencocokkan referensi dengan daftar published sebelum memasukkan nama/ID/URL item. Properti terjual tidak memperoleh CTA survei. Tidak ada draft yang dipromosikan.

### Tahap 5 — Kualitas dan penerimaan

- [x] Uji implementasi FR-01–FR-14 serta batas pengurutan/draft; status penerimaan dan keterbatasan data nyata dipetakan di `QA_REPORT.md`.
- [x] Judul/deskripsi unik, Open Graph, canonical, schema Organization/Breadcrumb, robots/sitemap mengikuti satu konfigurasi resmi. Domain belum tersedia; canonical/schema URL tidak diterbitkan, sitemap kosong, noindex/Disallow dipertahankan.
- [x] Audit otomatis axe dan keyboard; 45 kombinasi 360/768/1440 px tanpa overflow. Simulasi reflow 200% pada 9 halaman produksi lolos (720 CSS px/DPR 2), bukan pengujian zoom native manual.
- [x] Audit schema konten/izin/harga/lokasi per tipe, link/aset, kebocoran draft/DEMO, serta anggaran raw/gzip.
- [x] Baseline Lighthouse mobile aktual pada beranda, katalog kosong, dan kontak; laporan HTML/JSON disimpan. Performance/Accessibility/Best Practices 100; SEO 66 karena blokir indexing yang disengaja.
- [ ] Ulangi Lighthouse setelah aset final pada beranda, katalog berisi data, dan satu detail nyata. Target SEO ≥95 serta canonical/OG/schema pada domain resmi menunggu persetujuan domain/indexing.
- [ ] Pembaca layar, zoom browser native 200%, serta pemeriksaan perangkat fisik sebelum rilis. Audit otomatis/simulasi tidak menggantikan pemeriksaan ini.

Keputusan Tahap 5: pemeriksaan browser memakai Playwright Core + Chrome lokal terpisah, axe untuk audit otomatis, dan Lighthouse untuk baseline; semuanya devDependency dengan versi persis/lockfile, tanpa library runtime atau unduhan browser baru. Schema konten dipisahkan dari loader agar aturan yang sama dapat diuji. Harga memakai integer rupiah aman; whitespace wajib dan gambar Markdown yang melewati metadata izin ditolak. Nomor/domain/draft tidak diaktifkan demi pemeriksaan. Tidak mengubah PRD/DESIGN; penerimaan bisnis yang belum tersedia tetap terbuka.

### Tahap 6 — Pengelolaan konten dan kesiapan deployment

- [x] Lengkapi CONTENT_GUIDE: alur editorial, menambah data nyata, foto/path/izin, harga/status, penarikan/slug/referensi, tanggal, dan penanganan error.
- [x] DEPLOYMENT_GUIDE: kontrak hosting statis, konfigurasi build/domain/404/cache, snapshot, peninjauan, deployment setelah instruksi, backup sumber, serta rollback.
- [x] RELEASE_CHECKLIST dan laporan otomatis prarilis memisahkan kekurangan data dari hasil teknis. Tidak mengisi persetujuan atas nama pemilik.
- [x] `npm ci` pada salinan terpisah dari lockfile yang sama; check/test/build lolos; 22 berkas hasil build identik dengan project utama/snapshot pada lingkungan yang diuji.
- [x] Snapshot review lokal dengan inventaris SHA-256, guard perubahan sumber selama check/test/build, serta perintah verifikasi. Tidak ada perintah deploy; metadata menyatakan deploymentApproved=false.
- [x] Latihan rollback lokal A → B → A, termasuk berkas tambahan versi B yang hilang setelah pemulihan versi utuh. Audit HTTP/tautan/aset/draft pada salinan hasil pemulihan lolos.
- [x] Perbarui README, tautan dokumentasi, bukti verifikasi, dan checkpoint; pertahankan PRD/DESIGN serta seluruh data/flag bisnis.
- [x] Hentikan preview milik QA dan bersihkan instalasi sementara setelah bukti disimpan. Snapshot/bukti tetap tersedia; node_modules utama dipertahankan.
- [ ] Konfirmasi data bisnis, instruksi publikasi layanan/kontak/indexing, domain, hosting, pemilik akun/anggaran, dan proses backup/version control sumber.
- [ ] Tuntaskan penerimaan rilis dengan konten/aset/domain nyata, QA manual/perangkat fisik, alih WhatsApp, Lighthouse final, serta tinjauan log hosting.
- [ ] Deployment/peluncuran hanya bila diinstruksikan pengguna; **tidak dilakukan pada Tahap 6**.

Keputusan Tahap 6: persiapan tetap provider-neutral karena hosting/domain belum dipilih. Tidak mendaftar layanan, menambah CI/remote, mengubah DNS, atau membeli paket. `.verification/` dipakai untuk instalasi/latihan terisolasi; `.releases/` menyimpan artefak review di luar sumber/web root dan keduanya dikecualikan dari Git/check tipe. Skrip release memakai Node bawaan tanpa dependensi baru; snapshot otomatis menjalankan check/test/build dan mendeteksi perubahan input selama proses. Readiness saat ini not-ready/exit 1 karena data yang diketahui belum lengkap, bukan kegagalan aplikasi atau alasan untuk menghentikan persiapan lokal.

## Usulan perubahan dokumen

Tidak ada usulan perubahan kebutuhan saat ini. Pembagian tahap mengikuti instruksi pengguna yang lebih rinci. Pilihan format koleksi dan fallback font berada dalam lingkup yang sudah diizinkan PRD/DESIGN.

## Log pemeriksaan Tahap 1

Semua hasil berikut diperoleh pada 14 November 2026. Hasil ini hanya mencakup fondasi yang sudah dibuat, bukan penerimaan seluruh MVP.

| Pemeriksaan | Hasil sebenarnya |
| --- | --- |
| Instalasi npm | Selesai, 265 paket ditambahkan; audit saat instalasi melaporkan 0 vulnerabilities. `package-lock.json` versi 3 tersimpan. |
| Versi terpasang (`npm ls --depth=0`) | Astro 7.4.12, @astrojs/check 0.9.12, TypeScript 6.0.3; tidak ada peer dependency error. |
| `npm run check`, percobaan awal | Terhenti karena konfigurasi telemetry mencoba menulis ke direktori pengguna di luar sandbox; belum merupakan hasil check aplikasi. |
| `npm run check` dengan telemetry dinonaktifkan | Pemeriksaan awal menunjukkan 4 hint API Zod deprecated. API diperbarui ke Zod 4. Pemeriksaan **terakhir: 13 berkas, 0 error, 0 warning, 0 hint**, exit 0. |
| `npm run build` dengan telemetry dinonaktifkan | Berhasil, exit 0; output static ke `dist/`, 2 halaman (`index.html`, `404.html`), 3 varian WebP logo. |
| Peringatan konten | File loader/query memperingatkan koleksi properti/proyek kosong. Ini kondisi data yang disengaja, bukan data yang diisi untuk menghilangkan warning. |
| Preview lokal | `astro preview --host 127.0.0.1`; beranda HTTP 200, CSS dan gambar utama HTTP 200, URL tak dikenal HTTP 404 dengan halaman 404 khusus. Percobaan server/fetch dalam sandbox tidak dapat diakses; verifikasi berhasil setelah server/fetch dijalankan di host dengan akses jaringan lokal. Tidak ada publikasi. |
| HTML hasil build | `lang=id`, tepat satu H1, noindex/nofollow, tidak ada tautan WhatsApp aktif atau isi body draft layanan. Seluruh anchor yang dipakai beranda memiliki target. |
| Responsif beranda | Browser lokal pada viewport 360, 768, 1440 px: scrollWidth sama dengan clientWidth (345, 753, 1425 px, setelah scrollbar), tanpa overflow horizontal. Grid 1/2/3 kolom sesuai breakpoint. |
| Responsif 404 | Diperiksa pada 360, 768, 1440 px; tanpa overflow horizontal. Tombol kembali beranda berhasil digunakan. |
| Menu mobile | Membuka menu menghasilkan aria-expanded=true dan navigasi terlihat. Escape menghasilkan aria-expanded=false, panel tersembunyi, fokus kembali ke tombol. Fokus terlihat pada screenshot tablet. |
| Gambar asli | Salinan logo di `src/assets/brand` memiliki SHA-256 yang sama dengan referensi; logo tampil utuh. Gambar yang dimuat di browser tidak rusak. Fallback kegagalan gambar diimplementasikan, belum diuji dengan simulasi jaringan gagal. |
| Kontras token utama | Putih/teal 6,29:1; putih/hover 8,73:1; navy/krem 13,10:1; muted/krem 5,77:1; teal/soft green 5,52:1; control-border/putih 3,93:1. Memenuhi ambang untuk penggunaan masing-masing yang diuji. Ini bukan audit aksesibilitas lengkap. |

Bukti visual desktop: [pratinjau Tahap 1](verification/stage-1-desktop.jpg). Logo dioptimalkan Astro ke WebP tanpa mengubah berkas referensi. CSS dan JavaScript menu/fallback tetap kecil; belum dilakukan pengukuran transfer terkompresi resmi.

Belum dijalankan: Lighthouse, field Core Web Vitals, pembaca layar, zoom 200%, uji JavaScript dinonaktifkan secara langsung, simulasi gambar gagal, pengujian filter/galeri/WhatsApp (fitur belum dibuat), audit schema lengkap/referensi silang, serta uji instalasi ulang `npm ci`. Pemeriksaan tersebut tetap pada tahap terkait; tidak diklaim lolos.

## Serah terima Tahap 1 (arsip)

- Sumber utama: `astro.config.mjs`, `tsconfig.json`, `package.json`/lockfile, `src/content.config.ts`, `src/data/`, `src/styles/`, `src/layouts/BaseLayout.astro`, `src/components/`, `src/pages/`, dan README.
- Lima layanan tetap draft; properti/proyek kosong. Tidak ada harga referensi menjadi penawaran atau nomor WhatsApp aktif. Tidak ada data DEMO yang ikut build.
- PRD dan DESIGN dipertahankan. Tidak ada deployment, pendaftaran Site/domain, atau layanan berbayar.
- Server preview sementara dihentikan setelah pemeriksaan; pratinjau dapat dijalankan ulang mengikuti README. Screenshot disimpan agar hasil tetap dapat ditinjau.
- Langkah berikutnya hanya setelah instruksi pengguna: **Tahap 2 — beranda dan komponen visual utama**. Periksa checkpoint serta data bisnis sebelum meneruskan.

## Log pemeriksaan Tahap 2

Pemeriksaan pada 14 November 2026, menggunakan dependensi/lockfile Tahap 1 tanpa penambahan paket. Hasil berikut mencakup beranda, komponen, dan layout yang sudah dibuat; bukan penerimaan seluruh FR MVP.

| Pemeriksaan | Hasil sebenarnya |
| --- | --- |
| PRD/DESIGN dan konten awal | SHA-256 PRD/DESIGN sama dengan Tahap 1. Lima layanan masih draft; properti/proyek tetap `[]`; whatsappConfirmed tetap false. Tidak ada harga bisnis yang diaktifkan. |
| Tipe | `npm run check` terakhir dengan telemetry dinonaktifkan: **26 berkas, 0 error, 0 warning, 0 hint**, exit 0. |
| Build | `npm run build` terakhir: exit 0, output static, **2 halaman** (`index.html`, `404.html`). Ilustrasi SVG dan logo WebP diproses sebagai aset lokal. |
| Warning konten | Loader/query masih memperingatkan koleksi properti/proyek kosong. Kondisi ini disengaja dan tidak ditutupi oleh data buatan. |
| Produksi tanpa DEMO/draft | Pemindaian berkas HTML/JS/JSON/CSS pada dist tidak menemukan marker/data DEMO, path preview, nomor referensi WhatsApp, atau isi body draft. Tidak ada kartu layanan draft atau section featured kosong pada HTML produksi. Tepat satu H1 pada beranda. |
| Route development | `astro dev` menampilkan `/_preview/kartu`: 5 layanan, 2 properti, 1 proyek DEMO, ditandai jelas. Route tidak didaftarkan pada build/preview. |
| HTTP hasil produksi | Beranda 200; `/_preview/kartu` 404; URL tidak dikenal 404. Sembilan URL CSS/varian gambar yang ditemukan pada HTML diperiksa, seluruhnya 200. |
| Responsif beranda produksi | Viewport 360/768/1440 px: scrollWidth sama dengan clientWidth 345/753/1425 px (scrollbar mengurangi lebar isi). Tidak ada overflow horizontal. Alur kerja 1/2/5 kolom sesuai ukuran. |
| Responsif 404 produksi | Diperiksa ulang setelah perubahan footer pada 360/768/1440 px; tidak ada overflow horizontal. |
| Responsif kartu DEMO | Viewport 360/768/1440 px: grid 1/2/3 kolom, tanpa overflow. Judul panjang, harga kosong, gambar kosong, status tersedia/terjual, dan label Visualisasi 3D diperiksa. Properti DEMO terjual tidak memiliki link survei/pemesanan. |
| Menu | Pada development dan hasil produksi: tombol membuka panel dengan aria-expanded=true; Escape menutup panel dan mengembalikan fokus ke tombol, aria-expanded=false. |
| Tujuan link | Semua anchor beranda memiliki target pada ketiga ukuran. Klik Informasi Properti membawa ke pemberitahuan katalog di footer. Tombol konsultasi/kemitraan tidak membuka kontak belum terkonfirmasi. Link detail yang belum tersedia diganti teks biasa. |
| Fallback gambar | Fixture development sengaja meminta gambar tidak ada; gambar gagal disembunyikan dan teks “Gambar belum tersedia” terlihat. Request 404/500 image optimizer pada fixture ini adalah kegagalan yang disengaja; fixture tidak ada pada produksi. |
| Bukti visual | Screenshot desktop/mobile hasil produksi, versi halaman penuh, serta screenshot kartu DEMO disimpan. Logo lazy-loaded dipastikan termuat sebelum screenshot halaman penuh akhir; kedua gambar produksi complete dan naturalWidth > 0. |

Bukti visual:

- [Desktop — viewport](verification/stage-2-desktop.jpg) dan [halaman penuh](verification/stage-2-desktop-full.jpg).
- [Mobile — viewport](verification/stage-2-mobile.jpg) dan [halaman penuh](verification/stage-2-mobile-full.jpg).
- [Kartu layanan — DEMO development](verification/stage-2-demo-cards.jpg), bukan penawaran produksi.

Belum dijalankan pada Tahap 2: Lighthouse, field Core Web Vitals, pembaca layar, zoom 200%, audit keyboard seluruh alur, uji langsung JavaScript dinonaktifkan, instalasi ulang npm ci, serta penerimaan filter/galeri/form WhatsApp yang belum dibuat. Kontras token dasar mengikuti hasil Tahap 1; tidak mengklaim audit aksesibilitas lengkap. Foto asli belum tersedia sehingga komposisi foto nyata belum dapat dievaluasi.

## Serah terima Tahap 2 (arsip)

- Beranda mengikuti urutan DESIGN dengan pengecualian data kosong: properti/proyek pilihan tidak dirender; layanan menampilkan empty state karena semua item masih draft. Tidak ada promosi draft menjadi published.
- Copy terpusat di `src/data/home.json`, identitas/kontak tetap di `src/data/site.json`. Lokasi, cara mengubah, izin gambar, batas preview, serta checklist data bisnis dijelaskan pada **`docs/CONTENT_GUIDE.md`**.
- Komponen utama: SectionHeading, ServiceIcon, ServiceCard, PropertyCard, ProjectCard, ContentImage/fallback, ProcessSteps, Callout, serta Footer yang memakai konfigurasi logo. Header dan fondasi tokens/TypeScript Tahap 1 dipertahankan.
- Belum tersedia: foto hero/proyek/properti asli berizin, logo transparan untuk header, konfirmasi kontak/harga/wilayah, data katalog nyata, dan detail ketentuan kemitraan. Semua tetap ada pada checklist internal, tidak menjadi klaim pengunjung.
- Penanganan rute: navigasi masih menuju section beranda yang berfungsi. Katalog/detail/kontak/privasi belum dibuat. Footer menampung informasi katalog kosong; CTA utama mengarah ke alur kerja, kemitraan ke informasi kontak. Tidak ada link placeholder atau WhatsApp aktif.
- Tidak ada framework/dependensi baru, deployment, pendaftaran Site/domain, atau layanan berbayar. Server dev dan preview sementara dihentikan setelah pemeriksaan.
- **Berhenti di Tahap 2.** Berikutnya hanya setelah instruksi pengguna: **Tahap 3 — katalog serta detail layanan, properti, dan portofolio**.

## Log pemeriksaan Tahap 3

Dilakukan pada 14 November 2026 (Asia/Jakarta). Dependensi dan lockfile dipertahankan; tes memakai runner bawaan Node. Belum ada konten bisnis yang dipromosikan menjadi published.

| Pemeriksaan | Hasil sebenarnya |
| --- | --- |
| Repository/dokumen | Workspace tetap tanpa `.git`/AGENTS.md. PRD/DESIGN dibaca ulang; SHA-256 keduanya sama dengan Tahap 1. Logo asli dipertahankan. |
| Tipe terakhir | `npm run check` dengan telemetry dinonaktifkan: **48 berkas, 0 error, 0 warning, 0 hint**, exit 0. |
| Tes konten | `npm run test:content`: **9 tes lolos, 0 gagal**, exit 0. Meliputi ID JSON duplikat/kosong, bentuk array, benturan slug draft/published, referensi hilang/valid, body published kosong, HTML mentah, dan H1 tambahan. |
| Identitas konten | Default loader Astro mengikuti `data.slug`; loader layanan sekarang menetapkan `generateId` dari nama berkas tanpa `.md`. ID referensi tidak ikut berubah ketika slug URL diganti. Lima ID awal tetap sama. Parser JSON menolak ID duplikat sebelum loader menimpa data. |
| Referensi | Query bersama memeriksa semua entri, termasuk draft, sebelum memilih published. Referensi hilang menghentikan build; konten terkait tetap disaring ke published. Tidak memakai cache modul agar perubahan konten development tetap terbaca. |
| Build terakhir | `npm run build`: exit 0, **6 halaman statis**: beranda, 404, layanan, properti, portofolio, Tentang. Tidak ada detail produksi karena seluruh data masih draft/kosong. Template detail tetap dikompilasi dan diperiksa tipenya. |
| Warning konten | Loader/query memperingatkan properti/proyek kosong, termasuk saat membuat getStaticPaths. Ini kondisi yang disengaja, bukan error build atau data yang diisi dengan penawaran buatan. |
| HTTP produksi | Beranda dan empat halaman baru masing-masing 200. Kelima URL layanan draft, dua detail yang tidak ada, dan lima route DEMO masing-masing **404** (12 pemeriksaan URL tersembunyi/tidak ada). |
| Tautan/HTML | Audit enam HTML hasil build: **104 tautan/anchor internal**, tidak ada tujuan/anchor hilang. Setiap halaman memiliki satu H1, lang=id, dan tidak ada ID HTML ganda. Sembilan URL aset CSS/gambar diperiksa, seluruhnya 200. |
| Tidak ada kebocoran | Pemindaian HTML/JS/JSON/SVG produksi tidak menemukan marker/data DEMO, path preview, harga uji belum disetujui, nomor WhatsApp referensi, atau body draft. Properti/proyek tetap kosong; lima layanan masih draft; whatsappConfirmed=false. |
| Responsif produksi | Beranda, layanan, properti, portofolio, Tentang, dan 404 diuji pada 360/768/1440 px (**18 kombinasi**). ScrollWidth sama dengan clientWidth 345/753/1425 px setelah scrollbar. Tidak ada overflow horizontal; satu H1 dan judul sesuai halaman. |
| Responsif detail DEMO | Layanan, properti tersedia, properti terjual, dan proyek pada 360/768/1440 px (**12 kombinasi**): tidak ada overflow; satu H1; harga uji belum disetujui tidak tampak. |
| Status/denah/media | Properti terjual hanya menawarkan Cari Properti Lain, tidak memiliki link survei/pemesanan. Denah portrait DEMO memakai aspect-ratio 600/800 dan object-fit contain. Label ilustrasi/Visualisasi 3D, caption, format tanggal Asia/Jakarta, serta rendering Markdown diperiksa pada preview. Semua gambar dimuat sebelum screenshot detail penuh. |
| Navigasi/keyboard | Tautan Properti header membuka katalog; menu mobile membuka/menutup dengan aria-expanded yang benar. Enter pada link menu Layanan membuka `/layanan`. Escape menutup menu dan mengembalikan fokus ke tombol. |
| Browser/preview | Inisialisasi browser sempat timeout; koneksi dipulihkan melalui API browser yang sama, lalu seluruh pemeriksaan di atas selesai. Server QA development port 4322 dan produksi 4323 digunakan agar tidak mengambil port standar pengguna; keduanya dihentikan setelah selesai. Tidak ada publikasi. |

Bukti dan hasil terstruktur:

- [Katalog produksi desktop](verification/stage-3-catalog-desktop.jpg) dan [mobile](verification/stage-3-catalog-mobile.jpg).
- [Detail layanan DEMO desktop](verification/stage-3-service-demo-desktop.jpg) dan [detail properti DEMO mobile](verification/stage-3-property-demo-mobile.jpg), bukan penawaran atau proyek nyata.
- [Tentang — desktop](verification/stage-3-about-desktop.jpg).
- [Audit build/HTTP/tautan](verification/stage-3-build-audit.json), [ukuran halaman produksi](verification/stage-3-production-metrics.json), dan [ukuran detail DEMO](verification/stage-3-detail-metrics.json).

Batas verifikasi: belum ada detail published dengan data nyata untuk diperiksa pada hasil produksi. Komponen detail dan Markdown diuji lewat preview development, sedangkan guard getStaticPaths/draft diverifikasi melalui hasil build/HTTP. Belum dilakukan audit bisnis per tipe secara lengkap, Lighthouse, field Core Web Vitals, pembaca layar, zoom 200%, uji langsung JavaScript dinonaktifkan, atau instalasi ulang npm ci. Filter/pengurutan, thumbnail/modal galeri, form/WhatsApp belum dibuat dan tidak diklaim lolos.

## Serah terima checkpoint Tahap 3

- Rute publik baru: `/layanan`, `/properti`, `/portofolio`, `/tentang`. Template `[slug].astro` untuk ketiga koleksi hanya membangun konten published. Katalog kosong ditangani dengan jelas; tidak ada promosi draft atau listing/portofolio fiktif.
- Komponen/layout utama: CatalogLayout, DetailLayout, Breadcrumb, AvailabilityBadge, ContactNotice, Documentation, dan `components/details/ServiceDetail`, `PropertyDetail`, `ProjectDetail`. Kartu/warna/fondasi Tahap 1–2 digunakan kembali.
- Data copy baru terpusat di `src/data/pages.json`; data bisnis tetap di `src/data/site.json` dan koleksi awal. Profil tambahan/visi/misi hanya muncul bila diisi dengan informasi resmi. `CONTENT_GUIDE.md` dan README diperbarui dengan struktur serta cara pengisian/preview.
- Guard publikasi: ringkasan/gambar berizin/harga terkonfirmasi yang sudah ada, ditambah kelengkapan lingkup/proses/body; HTML mentah dan H1 ganda pada body layanan ditolak. Tidak ada dependensi besar atau framework tambahan.
- Preview detail hanya lewat **`npm run dev`**, dari `/_preview/kartu` atau empat path `/_preview/detail/...` yang dijelaskan panduan. Fixture tetap berada di `src/dev` dan tidak disalin ke koleksi produksi.
- Data yang masih dibutuhkan tetap pada checklist internal: kontak/harga/wilayah, logo transparan, dokumentasi berizin, lingkup layanan, properti/proyek nyata, serta ketentuan kemitraan. Pekerjaan berjalan tanpa mengarang data tersebut.
- **Berhenti di Tahap 3.** Berikutnya hanya setelah instruksi pengguna: **Tahap 4 — pencarian/filter/pengurutan, galeri interaktif, WhatsApp, kontak, dan kemitraan**. Tidak ada deployment atau layanan berbayar.

## Log pemeriksaan Tahap 4

Dilakukan pada 14 November 2026 (Asia/Jakarta). Tidak ada dependensi/framework baru, perubahan lockfile, promosi draft, aktivasi nomor/harga referensi, atau publikasi. PRD dan DESIGN dibaca ulang serta dipertahankan.

| Pemeriksaan | Hasil sebenarnya |
| --- | --- |
| Repository/aset/dokumen | Tidak ada `.git`/AGENTS.md pada workspace dan direktori induk yang diperiksa. Referensi tetap hanya logo JPEG. SHA-256 PRD/DESIGN sama dengan tahap sebelumnya. |
| Tipe terakhir | `npm run check` dengan telemetry dinonaktifkan: **60 berkas, 0 error, 0 warning, 0 hint**, exit 0. |
| Tes logika | `npm test`: **19 tes lolos, 0 gagal**, exit 0. Sembilan tes integritas lama dan sepuluh tes pencarian/nama/lokasi/trim/kapital, AND, batas harga inklusif, harga kosong, format/rentang tidak valid, default/reset, updatedAt, urutan harga dua arah, validasi nomor/encoding, dan variasi pesan item/kemitraan. Tidak membuka WhatsApp atau mengirim pesan. |
| Build | `npm run build`: exit 0, **9 halaman statis**. Tambahan `/kontak`, `/kemitraan`, `/privasi`; lima draft layanan tetap tanpa halaman detail produksi. |
| Warning konten | File loader/query masih memperingatkan koleksi properti/proyek kosong. Ini kondisi yang disengaja, bukan error dan tidak diisi dengan data fiktif. |
| HTTP produksi | Kesembilan URL halaman hasil build 200 (termasuk `/404` yang dibuka langsung). Enam URL preview development, lima layanan draft, dan dua detail tidak ada masing-masing **404**: 13 pemeriksaan tersembunyi/tidak ada. |
| HTML/tautan/aset | **166 tautan/anchor internal** pada sembilan HTML memiliki tujuan; tidak ada ID ganda, satu H1 per halaman, lang=id. **9 URL aset** CSS/gambar diperiksa melalui HTTP, semuanya 200. |
| Pemisahan data | Pemindaian HTML/JS/JSON/SVG produksi tidak menemukan DEMO, path preview, nomor WhatsApp referensi, harga uji tersembunyi, atau body draft. Lima layanan tetap draft; properti/proyek `[]`; whatsappConfirmed=false. |
| Form HTML | Kontak dan kemitraan memiliki empat field wajib/label/error, tombol pratinjau, tautan privasi, serta tombol Lanjut ke WhatsApp disabled. Form disembunyikan sampai handler JavaScript terpasang; nomor referensi tidak ada dalam HTML. Ini pemeriksaan HTML, bukan hasil simulasi pengisian browser. |
| Preview development/HTML | Delapan halaman publik dan lima route interaksi/detail DEMO merespons 200. Fixture filter memiliki empat properti; detail properti memiliki tiga gambar galeri dan satu denah, tiga thumbnail, rasio denah 600/800, serta URL fallback sengaja gagal. Harga detail belum disetujui tetap tidak terlihat. Tautan konteks layanan/properti/proyek menuju form DEMO; properti terjual hanya alternatif. |
| Browser/responsif | Chrome QA diinisialisasi, tetapi Computer Use melaporkan dihentikan pengguna dengan **physical Escape** sebelum tampilan website dapat diperiksa. Tidak ada kontrol browser lanjutan. **360/768/1440 px, klik/keyboard galeri, validasi form interaktif, mode tanpa JavaScript, dan screenshot Tahap 4 belum diverifikasi**. Hasil Tahap 3 tidak digunakan sebagai bukti perubahan baru. |
| Penyimpanan/transmisi | Pemeriksaan sumber tidak menemukan localStorage/sessionStorage, fetch, XMLHttpRequest, sendBeacon, atau analytics untuk field form. Pesan dirender dengan textContent. Referensi form berasal dari daftar published, bukan teks bebas query. Handoff memakai `encodeURIComponent` dan nomor terverifikasi; saat ini nomor tidak diteruskan ke browser. |

Bukti terstruktur: [audit build/HTTP/tautan/form](verification/stage-4-build-audit.json) dan [audit HTML preview development](verification/stage-4-preview-audit.json). Tidak ada screenshot baru pada tahap ini. Tes logika serta audit HTML tidak menggantikan pemeriksaan browser.

Belum dijalankan: verifikasi browser yang tercantum di atas, uji alih WhatsApp HP/desktop (nomor belum dikonfirmasi), detail produksi dengan konten bisnis nyata, Lighthouse, field Core Web Vitals, pembaca layar, zoom 200%, instalasi bersih `npm ci`, serta tinjauan hosting/log akses sebelum rilis. Semua tetap menjadi tugas terbuka pada checkpoint kualitas/persiapan rilis.

## Serah terima checkpoint Tahap 4

- Komponen utama: `PropertyCatalog.astro`, `Gallery.astro`, `MessageForm.astro`; helper murni `utils/property-search.ts` dan `utils/whatsapp.ts`. Komponen detail, ContactNotice, Header/Footer, beranda, serta katalog memakai fondasi sebelumnya.
- Pencarian/filter AND dan empat pengurutan memproses daftar published di browser. Tanpa JavaScript daftar lengkap tetap ada; katalog kosong produksi menggunakan empty state, sedangkan kontrol ditinjau lewat `/_preview/interaksi` pada **dev**.
- Galeri menampilkan gambar berizin dengan label/caption, thumbnail, fallback, perbesaran native dialog, dan handler keyboard. Denah tetap utuh. Implementasi tersedia; pengujian interaksi masih terbuka.
- Halaman kontak/kemitraan menyediakan pratinjau dan guard kontak belum terkonfirmasi. Tidak ada data formulir dikirim ke backend. Ketentuan kemitraan tetap null; tidak membuat janji komisi. Privasi menjelaskan perilaku aktual dan batas layanan eksternal.
- Copy baru terpusat di `src/data/contact.json`; pengisian kontak tetap di `src/data/site.json`, konten nyata pada koleksi yang sama. README dan `CONTENT_GUIDE.md` mencantumkan lokasi, cara mengisi, preview, serta tugas verifikasi yang masih terbuka.
- Data yang diperlukan: konfirmasi nomor, kanal/alamat/wilayah/domain, persetujuan harga/cakupan layanan, properti/proyek nyata dan media berizin, logo transparan resmi, serta ketentuan kemitraan. Tidak menebak atau memublikasikannya.
- Server QA development 4322 dan preview 4323 dihentikan setelah pemeriksaan. Tidak ada deployment, pendaftaran domain/Site, layanan berbayar, atau pengiriman pesan.
- **Berhenti pada checkpoint implementasi Tahap 4.** Berikutnya setelah instruksi pengguna: **Tahap 5 — SEO, aksesibilitas, performa, validasi konten, dan responsif**, termasuk menutup verifikasi browser Tahap 4 yang tertunda.

## Log pemeriksaan Tahap 5

14 November 2026 (Asia/Jakarta). Fondasi Tahap 1–4 dipertahankan, verifikasi Tahap 4 yang tertunda dilanjutkan dengan browser QA terpisah. Tidak ada publikasi atau pengiriman pesan.

| Pemeriksaan | Hasil aktual |
| --- | --- |
| Dokumen/repository | PRD/DESIGN dibaca kembali; SHA-256 sama dengan tahap sebelumnya. Tidak ada Git/AGENTS pada workspace dan direktori induk yang diperiksa. |
| Dependensi QA | Tambahan devDependency versi persis: playwright-core 1.65.1, @axe-core/playwright 4.14.0, Lighthouse 13.6.0; lockfile diperbarui. Instalasi menambahkan 91 paket, audit instalasi melaporkan 0 vulnerabilities. Paket aplikasi Astro/TS dipertahankan; tidak ada framework/JS runtime baru pada website. |
| Tipe terakhir | `npm run check`: **69 berkas, 0 error, 0 warning, 0 hint**, exit 0. Hint await pada skrip QA awal sudah diselesaikan. |
| Unit/schema | `npm test`: **30 tes lolos, 0 gagal**. Tambahan schema publikasi yang sama dengan loader, izin/caption/ringkasan/tanggal, tiga tipe properti/lokasi/peran/luas, konfirmasi harga integer aman, whitespace/slug/enum, Markdown, canonical, robots/sitemap, JSON-LD. Tidak memodifikasi koleksi untuk fixture. |
| Build | `npm run build`: exit 0; 9 HTML + robots.txt + sitemap.xml statis. Warning koleksi kosong tetap disengaja. Tidak ada halaman detail produksi karena belum ada data published. |
| Browser akhir | `npm run qa:browser`: exit 0; **22 kelompok interaksi**, **45 kombinasi halaman/viewport**, **32 audit axe**, 0 violation/incomplete, 0 error JS, 0 POST/transmisi formulir yang tidak diharapkan. Chrome 157.0.8103.51 headless dengan konteks terpisah dari profil pengguna. |
| Perbaikan dari QA | Label merek mengikuti nama/tagline terlihat; siklus Tab dialog tetap pada kontrol Tutup; fokus/Escape kembali ke pemicu; heading katalog dan tinggi link judul kartu diperbaiki; ringkasan nilai filter aktif tetap terlihat saat panel mobile ditutup. Favicon memakai logo resmi utuh yang diperkecil, menyelesaikan request 404 awal. |
| Responsif/keyboard | Semua 9 halaman produksi dan 6 preview DEMO pada 360/768/1440 px tanpa overflow. Filter mobile, form/error/fokus, thumbnail/panah/Home/End, perbesaran/denah, Tab/Shift+Tab/Escape, menu dan skip link lolos. Reflow 9 halaman pada 720 CSS px/DPR 2 lolos sebagai simulasi 200%; zoom native manual belum diuji. |
| JavaScript nonaktif | Kartu lengkap, gambar galeri statis, dan navigasi mobile tetap tersedia. Form/kontrol interaktif tersembunyi agar tidak submit HTTP. Diuji langsung melalui browser context tanpa JavaScript. |
| HTTP/build akhir | `npm run qa:build`: exit 0; **166 tautan/anchor internal**, **10 URL aset HTTP 200**, **13 URL draft/preview/tidak ada HTTP 404**; judul/deskripsi unik, lang=id, satu H1, tidak ada ID ganda. |
| Data produksi | Output bebas DEMO/path preview/nomor referensi/harga uji/body draft. Lima layanan tetap draft, properti/proyek `[]`, whatsappConfirmed=false, siteUrl=null, indexingEnabled=false. PRD/DESIGN tidak diubah. |
| SEO | Metadata/OG tersedia, canonical dan schema berbasis URL digate oleh domain+indexing. Robots Disallow dan sitemap kosong sesuai status. URL query/fragment/404/preview dikecualikan; branch domain siap diuji dengan example.test hanya dalam unit test. |
| Anggaran | Batas atas beranda raw termasuk seluruh varian srcset **94.739 byte**, estimasi gzip JavaScript aplikasi **515 byte**, di bawah anggaran 1,5 MB/50 KB. Bukan data transfer hosting/field. |
| Lighthouse akhir | Baseline mobile tiga halaman (`/`, `/properti` kosong, `/kontak`): masing-masing **Performance 100, Accessibility 100, Best Practices 100, SEO 66**. Satu run terakhir per halaman; Lighthouse 13.6.0, Chrome 157, emulasi 412×823/DPR 1,75, simulated RTT 150 ms/throughput 1.638,4 Kbps/CPU 4×. SEO gagal is-crawlable karena noindex/Disallow disengaja, target ≥95 belum terpenuhi. |
| Batas pengukuran | Tidak ada detail published/foto final untuk baseline rilis. LCP lab sekitar 1,05 dtk beranda dan 0,76 dtk katalog/kontak; TBT 0 ms, CLS 0. Tidak mengklaim INP atau Core Web Vitals persentil 75. |

Skrip QA awal sempat berhenti karena locator nama ambigu dan penantian gambar fallback; skrip diperbaiki. Audit pertama juga menemukan label merek, siklus fokus dialog, serta request favicon. Hasil akhir di atas diperoleh setelah perbaikan, bukan klaim bahwa percobaan pertama lolos.

Laporan lengkap/matriks FR/cara menjalankan ulang: **[QA_REPORT.md](QA_REPORT.md)**. Bukti: [browser](verification/stage-5/browser-audit.json), [build/HTTP/budget](verification/stage-5/build-audit.json), [Lighthouse](verification/stage-5/lighthouse/summary.json). Screenshot [kontak desktop](verification/stage-5/contact-1440.jpg), [kontak mobile](verification/stage-5/contact-360.jpg), [galeri dialog DEMO](verification/stage-5/gallery-dialog-desktop.jpg), [properti DEMO mobile](verification/stage-5/property-demo-mobile.jpg), [filter mobile](verification/stage-5/filters-mobile.jpg).

## Serah terima checkpoint Tahap 5

- SEO terpusat di `components/Seo.astro` dan `utils/seo.ts`, dengan endpoint statis robots/sitemap. BaseLayout menyediakan favicon logo utuh; detail menerima gambar utama berizin. Data domain/kontak tetap pada lokasi yang sama dan tidak diaktifkan.
- `schemas/content.ts` memisahkan validasi dari loader tanpa mengubah data koleksi. Tes 30 kasus dan skrip `qa:build`, `qa:browser`, `qa:lighthouse` dapat dijalankan ulang; laporan dan screenshot tersedia di `docs/verification/stage-5/`.
- Verifikasi interaksi tertunda Tahap 4 selesai secara teknis. Konten penawaran nyata, izin media, nomor/harga/domain, dan ketentuan kemitraan tetap menunggu pemilik; tidak dipromosikan sebagai data terkonfirmasi.
- README/CONTENT_GUIDE diperbarui. QA_REPORT membedakan hasil otomatis, simulasi reflow, baseline Lighthouse, dan penerimaan rilis yang belum terpenuhi.
- Sebelum rilis: uji kontak nyata setelah diinstruksikan, domain/canonical/OG/schema/sitemap resmi, ulang Lighthouse dengan aset/katalog/detail nyata, pembaca layar/zoom native/perangkat fisik, serta instalasi bersih dan kesiapan hosting/rollback. Ini tidak ditutupi dengan data DEMO atau pengaktifan indexing.
- Server QA 4322/4323 dihentikan setelah pemeriksaan. Tidak ada deployment, pendaftaran layanan, atau pesan keluar.
- **Berhenti di Tahap 5.** Berikutnya hanya setelah instruksi pengguna: **Tahap 6 — dokumentasi pengelolaan konten dan persiapan deployment**; publikasi tetap memerlukan instruksi tersendiri.

## Log pemeriksaan Tahap 6

14 November 2026 (Asia/Jakarta). PRD/DESIGN dan progres dibaca kembali. Repository tetap tanpa Git/AGENTS pada workspace dan direktori induk yang diperiksa; pekerjaan Tahap 1–5 dipertahankan. Tidak ada perubahan tampilan atau aktivasi data bisnis.

| Pemeriksaan | Hasil aktual |
| --- | --- |
| Instalasi bersih | `npm ci --no-audit --no-fund` pada `.verification/stage-6/clean-install`: exit 0, **356 paket**. Instalasi utama tidak ditimpa. Audit vulnerability tidak diulang pada perintah ini; tidak mengklaim audit baru. |
| Lockfile/dependensi | Lockfile asli/salinan identik sebelum/sesudah instalasi; SHA-256 `d79f1ed17ff3dae4aa7b703b84428db26592900d0904e044768f8b3d00f54c17`. Tidak ada paket baru; package.json hanya menambah perintah release. |
| Tipe | Salinan bersih dan project utama: **72 berkas, 0 error, 0 warning, 0 hint**, exit 0. `.verification`/`.releases` dikecualikan agar sumber/artifak salinan tidak ikut pemeriksaan project utama. |
| Tes | `npm test`: **33 lolos, 0 gagal**. Tiga tambahan tes inventaris menilai stabilitas hash, isi berubah, berkas hilang/tambahan, dan kecocokan salinan. Tes konten/SEO/filter/pesan sebelumnya tetap lolos. |
| Build | Salinan bersih dan utama: exit 0, **9 HTML + robots.txt + sitemap.xml**, total **22 berkas**. Warning properti/proyek kosong tetap disengaja. Node 24.15.0, npm 12.0.2, Windows. |
| Reproducibility | Seluruh 22 path/hash byte output bersih sama dengan output utama dan snapshot. Tidak ada perbedaan input build yang dicatat. Digest `8143b9dcb9b03bd024a4860162f96e38c376e2abceaaf38d166807ed4f68c3db`. Hanya berlaku pada lingkungan/sumber yang diuji, bukan jaminan lintas OS/tool/tahun. |
| Snapshot | `npm run release:snapshot`: check → test → build exit 0, sumber input tidak berubah selama proses. Snapshot `2026-11-14T10-52-05-929Z-8143b9dcb9`, 22 berkas/212.949 byte. Status `local-review-only`, deploymentApproved=false; manifest di luar `site/`. |
| Verifikasi | `npm run release:verify -- .releases/2026-11-14T10-52-05-929Z-8143b9dcb9`: exit 0, verified=true, tidak ada perbedaan. Hash inventaris bukan tanda tangan atau persetujuan publikasi. |
| Readiness | `npm run release:check`: **exit 1 yang diharapkan**, status not-ready. Sepuluh indikator belum lengkap: domain, indexing, WhatsApp, area layanan, lima kategori layanan published, ketentuan kemitraan. Koleksi properti/proyek kosong bukan penghalang otomatis. Masih memerlukan pemeriksaan manual. |
| Rollback lokal | Pada salinan terisolasi port 4324, A merespons 200; HTML dimodifikasi dan satu berkas latihan B ditambahkan. Dua perubahan terdeteksi. Folder B dipertahankan terpisah, A dipulihkan ke dist baru; digest kembali cocok. Berkas tambahan B/preview/draft 404, homepage/kontak/properti/robots/sitemap 200. Tidak melakukan rollback host live. |
| Audit pemulihan | Audit build Tahap 5 dijalankan terhadap hasil pemulihan dengan lokasi laporan baru: **166 link internal, 10 aset 200, 13 draft/preview/tidak ada 404**, satu H1/lang=id/judul/deskripsi unik, tidak ada kebocoran DEMO/nomor referensi/harga uji/body draft. Laporan Tahap 5 dipertahankan. |
| Anggaran/tampilan | Artefak sama dengan UI Tahap 5. Batas atas beranda 94.739 byte, estimasi JS gzip 515 byte. Audit browser/axe/Lighthouse tidak diulang karena tidak ada perubahan UI; angka Tahap 5 tetap historis dan bukan hasil baru. |
| Dokumentasi | Seluruh tautan berkas lokal pada README dan tujuh dokumen root docs diperiksa; tidak ada tujuan hilang. Operasional konten, kontrak host, readiness, snapshot, dan pemulihan dihubungkan dari README. |
| Data/aset/dokumen | Lima layanan tetap draft; properti/proyek `[]`; whatsappConfirmed=false, siteUrl=null, indexingEnabled=false. Logo/ilustrasi tidak diubah. Hash PRD/DESIGN tetap sama. |

Bukti: [reproducibility](verification/stage-6/reproducibility.json), [ringkasan snapshot](verification/stage-6/snapshot.json), [readiness](verification/stage-6/readiness.json), [latihan rollback](verification/stage-6/rollback-drill.json), [audit output/HTTP](verification/stage-6/build-audit.json), dan [tautan dokumentasi](verification/stage-6/documentation-links.json).

## Serah terima checkpoint Tahap 6

- Dokumen utama: [CONTENT_GUIDE.md](CONTENT_GUIDE.md), [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md), [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md), README, serta laporan QA/progres yang dipertahankan.
- Perintah baru `release:check`, `release:snapshot`, `release:verify` bersifat lokal. Tidak ada credential, pendaftaran provider, DNS, CI/remote, layanan berbayar, atau perintah deployment yang dijalankan.
- Snapshot review tersimpan pada `.releases/2026-11-14T10-52-05-929Z-8143b9dcb9/`. Upload kelak hanya boleh mengambil isi `site/` dari versi yang diinstruksikan; bukan manifest/source/docs/installasi. Simpan sumber terkait melalui mekanisme backup/version control yang disepakati sebelum penyuntingan berikutnya.
- Instalasi/latihan sementara dibersihkan setelah preview dihentikan; laporan dan snapshot disimpan. Node_modules/dist/sumber utama tidak dihapus oleh cleanup.
- **Persiapan Tahap 6 selesai; peluncuran belum siap.** Data resmi, instruksi publikasi/aktivasi, domain/host, backup sumber, QA nyata/fisik/pembaca layar/zoom native, serta Lighthouse final/SEO ≥95 dan privasi hosting masih terbuka. Tidak membuat konten atau tanda persetujuan pengganti.
- **Berhenti pada checkpoint Tahap 6.** Langkah berikutnya mengikuti instruksi pengguna: melengkapi data/persetujuan dan keputusan hosting, lalu pemeriksaan prarilis pada versi konkret. Publikasi memerlukan instruksi tersendiri.

## Rujukan teknis

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/): koleksi build-time, loader Markdown/JSON, schema, reference, dan query.
- [Astro TypeScript](https://docs.astro.build/en/guides/typescript/): konfigurasi strict dan pemeriksaan Astro.
- [Astro instalasi](https://docs.astro.build/en/install-and-setup/): prasyarat runtime. Versi paket dan engines juga diperiksa langsung dari registry npm.
