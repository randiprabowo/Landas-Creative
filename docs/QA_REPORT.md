# Laporan QA Tahap 5 — Landas Creative

Tanggal: 14 November 2026 (Asia/Jakarta). Pemeriksaan lokal; website belum dipublikasikan. Lima layanan tetap draft, properti/proyek kosong, nomor belum terkonfirmasi, domain kosong, dan indexing nonaktif. PRD/DESIGN tidak diubah.

## Hasil dan bukti

| Pemeriksaan | Hasil aktual |
| --- | --- |
| Astro/TypeScript | 69 berkas; 0 error, 0 warning, 0 hint. |
| Unit/schema/SEO | 30 tes lolos. Schema yang diuji sama dengan schema loader; resolusi aset/referensi Astro memakai stub pada unit test. Build tetap memvalidasi aset nyata. |
| Build | 9 HTML statis + robots.txt + sitemap.xml; warning koleksi kosong disengaja. |
| Browser | Chrome 157.0.8103.51, headless, konteks terpisah dari profil pengguna; 22 kelompok interaksi lolos, tanpa error JavaScript. |
| Responsif | 9 halaman produksi (termasuk 404) dan 6 preview development × 360/768/1440 px = 45 kombinasi; tidak ada overflow horizontal, satu H1 per halaman. |
| Aksesibilitas otomatis | 32 audit axe: 0 violation, 0 incomplete pada state/viewport yang diuji. Termasuk form preview dan dialog galeri. Bukan sertifikasi WCAG atau pengganti pengujian pembaca layar. |
| Reflow | 9 halaman produksi pada 720 CSS px/DPR 2 sebagai simulasi reflow layar 1440 px pada 200%; tidak ada overflow. Zoom browser native secara manual belum diuji. |
| HTML/HTTP | 166 tautan/anchor internal valid, 10 URL aset 200, 13 URL draft/preview/tidak ada 404. Metadata judul/deskripsi unik; lang=id; tidak ada ID ganda. |
| Batas data | Output HTML/JS/JSON/SVG/XML bebas DEMO, URL preview, nomor referensi, harga uji tersembunyi, dan body draft. Tidak ada POST/isian form keluar dalam alur browser yang diuji; tidak ada field disimpan di localStorage/sessionStorage. |
| Anggaran beranda | Batas atas raw termasuk semua varian gambar: **94.739 byte**; estimasi gzip JavaScript aplikasi **515 byte**. Ini estimasi konservatif aset, bukan transfer produksi/field. Anggaran PRD: 1,5 MB dan 50 KB. |

Bukti mesin: [browser-audit.json](verification/stage-5/browser-audit.json), [build-audit.json](verification/stage-5/build-audit.json), dan [ringkasan Lighthouse](verification/stage-5/lighthouse/summary.json).

## Interaksi yang dituntaskan dari Tahap 4

- Pencarian trim/tidak peka kapital, gabungan AND, tiga status, rentang inklusif, harga kosong dikecualikan ketika rentang aktif, format/min > max error, keempat pengurutan, reset, jumlah dan hasil kosong.
- Filter mobile dapat dibuka/ditutup; ringkasan nilai aktif tetap terlihat saat panel tertutup.
- Galeri: thumbnail, panah/Home/End, fallback gambar sengaja gagal, dialog perbesaran, Tab/Shift+Tab, Escape, pengembalian fokus, denah portrait, dan tombol Tutup.
- Form: field wajib dan fokus error, pratinjau, konteks layanan/properti/proyek, nama/ID/URL properti, hapus referensi, pesan kemitraan, serta guard WhatsApp belum tersedia.
- Properti terjual hanya memiliki alternatif; menu mobile/Escape/fokus dan skip link diuji lewat keyboard.
- Tanpa JavaScript: seluruh empat kartu DEMO serta gambar statis tetap tersedia, navigasi mobile terlihat, filter/form interaktif tersembunyi sehingga tidak submit HTTP.

Temuan yang diperbaiki: nama aksesibel merek kini mengikuti teks terlihat; fokus Tab tetap pada satu-satunya kontrol dalam dialog; judul katalog mengikuti hierarki; link judul kartu memiliki tinggi minimal 44 px; nilai filter aktif tetap terbaca pada mobile; favicon resmi diperkecil utuh agar tidak menimbulkan request 404. Tidak menggambar ulang atau memotong logo.

## Lighthouse mobile — baseline saat ini

Lighthouse **13.6.0**, Chrome 157, Windows, localhost `astro preview`, cache sesi pengukuran terpisah. Emulasi mobile 412×823 px, DPR 1,75, throttling simulated: RTT 150 ms, throughput 1.638,4 Kbps, CPU 4×. Satu pengukuran terakhir per URL setelah favicon diperbaiki; bukan median atau pengukuran pengguna nyata.

| Halaman | Performance | Accessibility | Best Practices | SEO | LCP lab | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 100 | 100 | 100 | **66** | 1,05 dtk | 0 |
| `/properti` (kosong) | 100 | 100 | 100 | **66** | 0,76 dtk | 0 |
| `/kontak` | 100 | 100 | 100 | **66** | 0,76 dtk | 0 |

TBT ketiganya 0 ms. **SEO belum memenuhi target ≥95** karena `noindex` dan robots Disallow sengaja dipertahankan; audit `is-crawlable` gagal sesuai status persiapan. Tidak membuka indexing untuk menaikkan skor. Ada saran CSS render blocking/dependency tree, tetapi Performance sudah memenuhi target baseline; tidak menambah mekanisme CSS rumit untuk mengejar saran diagnostik ini.

Laporan HTML: [beranda](verification/stage-5/lighthouse/home.html), [properti](verification/stage-5/lighthouse/properties.html), [kontak](verification/stage-5/lighthouse/contact.html). Tidak ada detail produksi untuk diukur karena belum ada konten published. Katalog berisi data dan detail nyata harus diuji lagi setelah konten/aset final tersedia. INP dan Core Web Vitals persentil 75 belum dapat dinilai tanpa data lapangan.

## Status FR-01 sampai FR-14

| FR | Bukti teknis / batas penerimaan |
| --- | --- |
| 01 | Beranda/CTA dan kondisi featured kosong diperiksa; hanya published diambil. |
| 02 | Lima kategori dan lingkup pembangunan tersedia sebagai draft. **Kelengkapan penawaran publik belum terpenuhi** sampai konten disetujui. |
| 03 | Template/Markdown/harga tersembunyi/konteks pesan diuji dengan fixture; isi bisnis dan WhatsApp nyata masih menunggu. |
| 04–06 | Logika unit dan interaksi filter/pencarian/rentang/reset lolos pada empat fixture development. Tidak membuat listing produksi. |
| 07 | Template spesifikasi/lokasi/tanggal/ID/harga kosong/denah diperiksa lewat DEMO. CTA survei nyata menunggu nomor dan properti resmi. |
| 08 | Terjual tidak mempunyai CTA survei/pemesanan; alternatif diuji di browser. |
| 09 | Galeri/keyboard/fallback/modal lolos; dokumen/foto bisnis asli belum tersedia. |
| 10 | Label Visualisasi 3D dan izin/caption schema diperiksa; penerimaan dokumentasi nyata menunggu aset pemilik. |
| 11 | Form/pratinjau/validasi/guard kontak lolos; tidak mengklaim pengiriman. Alih ke WhatsApp nyata belum diuji. |
| 12 | Kemitraan dan pesan khusus tersedia tanpa janji komisi; syarat resmi masih null. |
| 13 | 45 kombinasi ukuran dan simulasi reflow lolos; zoom native/pembaca layar manual tetap diperlukan sebelum rilis. |
| 14 | Katalog kosong jujur, featured kosong disembunyikan, DEMO hanya dev; guard output diverifikasi. |

## SEO dan pekerjaan terbuka sebelum rilis

`Seo.astro` menyediakan judul/deskripsi, Open Graph, canonical, dan Organization berbasis konfigurasi resmi; Breadcrumb menyediakan JSON-LD. Canonical/URL sosial/Organization/Breadcrumb schema hanya diterbitkan ketika domain tersedia dan indexing disetujui. Sitemap hanya memakai rute publik tetap dan konten published. Saat ini sitemap kosong dan robots memblokir seluruh website. URL query/fragment, 404, dan preview tidak menjadi canonical.

- [ ] Konfirmasi domain, kontak, wilayah, harga/cakupan layanan, ketentuan kemitraan, serta media/konten nyata dan izin.
- [ ] Persetujuan indexing/publikasi; periksa canonical/OG/schema/sitemap pada domain resmi setelah diaktifkan dan build ulang.
- [ ] Ulangi Lighthouse pada beranda, katalog berisi data, dan satu detail nyata setelah aset final; target SEO ≥95 masih terbuka.
- [ ] Uji alih WhatsApp di HP/desktop setelah aktivasi diinstruksikan; jangan mengirim pesan otomatis.
- [ ] Pembaca layar, zoom browser native 200%, dan pemeriksaan visual pada perangkat fisik sebelum rilis.
- [ ] Instalasi bersih dari lockfile, tinjauan log hosting, prosedur deployment/rollback: Tahap 6.

## Menjalankan ulang

Gunakan Node 24 dan Chrome lokal. Alat QA adalah devDependency, tidak ikut bundle pengunjung. Skrip hanya menerima host lokal, menggunakan browser terpisah, dan tidak memerlukan pemasangan browser baru. Kasus fixture/guard mengikuti keadaan konten Tahap 5; setelah aktivasi bisnis sesuaikan ekspektasi guard dan lengkapi kasus rilis.

Terminal 1:

```powershell
$env:ASTRO_TELEMETRY_DISABLED = '1'
npm run dev -- --host 127.0.0.1 --port 4322
```

Terminal 2:

```powershell
$env:ASTRO_TELEMETRY_DISABLED = '1'
npm run build
npm run preview -- --host 127.0.0.1 --port 4323
```

Terminal 3, jalankan berurutan agar pengukuran performa tidak bersaing dengan audit browser:

```powershell
npm test
npm run qa:build
npm run qa:browser
npm run qa:lighthouse
```

`npm run check` juga wajib untuk perubahan aplikasi. URL QA dapat diatur melalui `QA_DEV_URL`/`QA_PRODUCTION_URL` (tetap localhost); browser QA memakai `QA_BROWSER_CHANNEL=chrome` secara default. Hasil ditulis ke `docs/verification/stage-5/`. Hentikan server QA setelah selesai.

Rujukan alat: [Astro static endpoints](https://docs.astro.build/en/guides/endpoints/), [konfigurasi site Astro](https://docs.astro.build/en/guides/configuring-astro/), [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing), [Lighthouse Node](https://github.com/GoogleChrome/lighthouse/blob/main/docs/readme.md).

## Kelanjutan Tahap 6

Hasil di atas merupakan catatan Tahap 5 dan tidak diganti dengan klaim pengujian UI baru. Tahap 6 menambahkan 3 tes integritas artefak (total saat ini 33), instalasi bersih `npm ci`, kecocokan 22 berkas build, snapshot review lokal, dan latihan rollback A → B → A. Audit output/HTTP setelah pemulihan disimpan terpisah pada `verification/stage-6/`; tampilan dan data bisnis tidak diubah.

Prosedur persiapan/host/rollback: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md). Bukti [reproducibility](verification/stage-6/reproducibility.json) dan [latihan rollback](verification/stage-6/rollback-drill.json). Rilis bisnis/domain/host, kontak aktif, uji manual, dan pengukuran Lighthouse final tetap mengikuti [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).
