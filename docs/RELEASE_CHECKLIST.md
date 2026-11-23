# Checklist rilis — Landas Creative

Catatan internal. Tahap 6 menyiapkan prosedur, bukan menginstruksikan publikasi. Checklist harus dikaitkan dengan snapshot yang benar dan bukti konfirmasi pemilik; checkbox teknis tidak mengonfirmasi informasi bisnis.

## Versi yang sedang ditinjau

Snapshot lokal 22 November 2026 mencakup layout footer dan breadcrumb terbaru. CMS tersedia melalui server development. Konfigurasi akses daring menunggu repository dan aplikasi OAuth pemilik.

- [x] Alur simpan CMS telah diuji lokal dengan salinan data. Build dengan konfigurasi awal mengeluarkan situs pengunjung saja.
- [ ] Bila mengaktifkan editor daring, uji login GitLab dengan akun editor, penolakan akses akun tanpa izin, commit ke branch yang dipilih, serta build dari revisi tersebut.

- Snapshot lokal terbaru `2026-11-21T23-41-50-855Z-07e1b3ec41`. Verifikasi 22 berkas menghasilkan 0 perbedaan.
- Status: **local-review-only / not-ready**, `deploymentApproved: false`.
- Domain/target hosting/ID deployment: belum ditetapkan; belum ada versi live.
- Snapshot Tahap 6 `2026-11-14T10-52-05-929Z-8143b9dcb9` tersimpan sebagai versi sebelumnya. Setelah menyunting data untuk peluncuran, buat snapshot dari versi yang sudah Anda setujui.

## Data dan instruksi pemilik

- [ ] Domain resmi, target hosting, pemilik akun, serta biaya bila ada sudah ditetapkan sesuai instruksi.
- [ ] Kanal WhatsApp dikonfirmasi dan aktivasi diinstruksikan; nomor referensi belum dianggap final.
- [ ] Area layanan/alamat bila ditampilkan benar. Email, media sosial, visi/misi boleh tetap kosong bila belum tersedia.
- [ ] Lingkup, proses, pengecualian, gambar, serta instruksi publikasi lima layanan lengkap; tidak mempromosikan draft sendiri.
- [ ] Harga yang ditampilkan terkonfirmasi; bila belum tersedia, gunakan pesan informasi harga tanpa Rp0. Status properti dan peran pemasaran akurat.
- [ ] Foto/proyek nyata, jenis render/foto, caption, alt, izin lokasi/gambar, dan logo yang dipakai benar.
- [ ] Ketentuan kemitraan sesuai informasi resmi, tanpa janji komisi yang dibuat sendiri.
- [x] Katalog properti/proyek boleh tetap kosong dengan empty state sesuai instruksi/PRD; tidak membutuhkan listing fiktif.
- [ ] Instruksi indexing/publikasi untuk versi/domain yang ditinjau tersedia. Tahap 6 ini bukan instruksi tersebut.

## Pemeriksaan teknis

- [x] Fondasi Astro statis/TS/CSS tokens dipertahankan; tidak ada backend/akun/pembayaran.
- [x] Instalasi bersih `npm ci` dari lockfile pada folder terpisah berhasil.
- [x] Pemeriksaan tipe dan 33 tes lolos; build bersih 22 berkas identik dengan build utama/snapshot pada lingkungan yang diuji.
- [x] Snapshot lokal ber-hash tersedia dan lolos verifikasi; dokumen/manifest/sumber berada di luar web root artefak.
- [x] Latihan rollback lokal berhasil, termasuk pembersihan berkas versi baru dengan pemulihan ke folder baru.
- [x] QA Tahap 5: interaksi, 360/768/1440 px, axe, dan mode tanpa JavaScript lolos. Baseline Lighthouse tercatat, bukan klaim rilis final.
- [ ] QA ulang perubahan konten/aset/kanal nyata, detail published, perangkat fisik, pembaca layar, dan zoom browser native 200%.
- [ ] Lighthouse beranda/katalog berisi data/detail nyata setelah aset final; SEO target ≥95 setelah indexing/domain disetujui. Saat ini SEO 66 karena noindex.
- [ ] Canonical/OG/schema/sitemap pada domain resmi benar; 404/preview/draft tidak terindeks.
- [ ] Uji alih pesan WhatsApp pada HP/desktop setelah aktivasi diinstruksikan; pembukaan tautan bukan bukti pengiriman.
- [ ] Konfigurasi host memenuhi HTTPS, MIME, cache, URL tanpa slash, custom 404, dan version rollback; tidak ada fallback SPA 200 untuk URL hilang.
- [ ] Privasi/log akses/retensi layanan hosting aktual ditinjau sebelum situs digunakan publik.

## Saat peluncuran diinstruksikan

- [ ] Catat target, ID snapshot/commit sumber, digest, pelaksana, bukti QA, dan instruksi pemilik yang berlaku.
- [ ] Simpan versi sebelumnya yang aman atau prosedur pembatalan rilis pertama; verifikasi artefak.
- [ ] Deploy versi yang sama dengan hasil peninjauan; jangan unggah folder source, docs, node_modules, src/dev, manifest, atau .releases seluruhnya.
- [ ] Smoke test domain resmi setelah deploy: halaman/aset, pesan/kanal, robots/sitemap/canonical, status 404 dan draft/preview 404.
- [ ] Catat ID deployment/waktu/hasil; monitor masalah yang muncul dan pulihkan versi aman bila perlu.

Lihat [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md), [CONTENT_GUIDE.md](CONTENT_GUIDE.md), dan [QA_REPORT.md](QA_REPORT.md). Pemeriksa otomatis `release:check` hanya melaporkan sebagian indikator; ia tidak mengisi checkbox bisnis/manual atau memberikan persetujuan deployment.
