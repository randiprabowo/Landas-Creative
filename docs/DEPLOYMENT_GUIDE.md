# Panduan rilis dan rollback — Landas Creative

Status: persiapan lokal Tahap 6. **Belum ada hosting/domain yang dipilih, akun dibuat, DNS diubah, biaya dipasang, atau website dipublikasikan.** Build dan snapshot lokal bukan persetujuan publikasi.

## Kontrak hosting statis

### Akses editor setelah MVP

Untuk alur satu pengelola, gunakan CMS lokal, periksa hasil build, lalu unggah isi `dist/` sendiri. Konfigurasi awal menghasilkan website publik tanpa rute editor. Anda dapat menggunakan hosting statis dan memasang domain secara terpisah dari penyimpanan konten.

Jika editor perlu login dari perangkat lain, tersedia integrasi **GitLab.com OAuth dengan PKCE**. Aktifkan ketika repository dan domain sudah Anda miliki.

1. Siapkan repository GitLab privat berisi sumber website. Batasi hak tulis pada pengelola yang dipercaya. Perubahan dari CMS akan tersimpan sebagai commit pada branch tujuan. Siapkan branch yang mengizinkan editor menulis dan gunakan alur upload manual yang Anda pilih.
2. Daftarkan aplikasi OAuth di GitLab. Isi redirect URI persis sesuai alamat editor HTTPS yang akan dibuka, termasuk path `/admin/index.html`. Hapus centang **Confidential**, pilih scope **api** yang dibutuhkan Sveltia, lalu salin **Application ID** publik. Gunakan URL lengkap yang sama untuk masuk. [Petunjuk OAuth GitLab di Sveltia](https://sveltiacms.app/en/docs/backends/gitlab)
3. Isi `repository` dengan path grup/pemilik dan nama project, `applicationId` dengan Application ID, dan `branch` dengan nama branch di `src/cms/access.json`. Hanya pengenal publik yang diperlukan. Simpan token pribadi dan client secret di luar repository dan hasil build.
4. Jalankan check, test, dan build. Setelah Anda mengunggah hasilnya, uji login editor berizin dan penolakan akses tulis bagi akun tanpa hak. Domain, DNS dan hosting tetap dikelola pemilik. HTTPS diperlukan untuk fitur browser dan alur OAuth.
5. Setelah perubahan disimpan secara daring, ambil revisi branch terbaru ke komputer build, tinjau perubahannya, bangun ulang, lalu unggah manual. Untuk menutup editor daring, kosongkan kedua pengenal, bangun ulang, dan ganti seluruh folder versi di hosting agar berkas admin lama ikut hilang. Untuk mencabut akses editor, cabut izin di GitLab.

Panel admin memuat aplikasi Sveltia tersendiri. Bundle utama, font ikon dan modul editor berasal dari paket yang dikunci di lockfile. Fitur tambahan atau bahasa antarmuka CMS dapat meminta aset dari CDN. Panel tidak masuk sitemap. Build dengan konfigurasi awal hanya menyertakan halaman pengunjung.

Website dibangun oleh Astro menjadi berkas statis. Hosting menjalankan `npm ci` dengan devDependencies, lalu pemeriksaan/build; direktori yang disajikan kepada pengunjung hanya **isi `dist/`**, atau isi folder `site/` pada snapshot yang telah disetujui. Tidak ada adapter/server, database, rahasia frontend, atau environment runtime aplikasi.

| Pengaturan | Kebutuhan project |
| --- | --- |
| Runtime build | Node 24.15.0 dan npm 12.0.2 dipakai saat pengujian. `.node-version` dan engines ada di repository. Gunakan versi yang sama untuk mereproduksi hasil saat ini. |
| Instalasi | `npm ci` dari lockfile, termasuk devDependencies untuk alat check/build. Jangan memakai `npm install` untuk rilis rutin atau `--omit=dev` sebelum build. |
| Build | `npm run check`, `npm test`, `npm run build`; atau `npm run release:snapshot` yang menjalankan ketiganya. Set `ASTRO_TELEMETRY_DISABLED=1` pada lingkungan build terbatas. |
| Publish directory | `dist` pada build hosting, atau **isi** `.releases/ID/site` untuk upload artefak yang disetujui. Jangan meng-upload root project atau folder `.releases` seluruhnya. |
| Domain | Origin HTTPS pada root domain, tanpa subpath. Domain disimpan di `src/data/site.json`. Hosting berbasis subfolder memerlukan penyesuaian terpisah karena URL aplikasi saat ini berawal `/`. |
| URL halaman | `/layanan` harus menyajikan `/layanan/index.html`; sama untuk katalog, kontak, dan detail. `trailingSlash: never` menjadi acuan normalisasi. Periksa perilaku pretty URL host yang dipilih sebelum rilis. |
| Halaman tidak ada | Status HTTP **404** dengan isi `404.html`. Jangan memakai fallback SPA ke `index.html` dengan status 200 untuk URL tidak dikenal atau draft. |
| Aset | `/_astro/*` disajikan sebagai berkas statis dengan MIME yang tepat; tidak membutuhkan image optimizer/server saat runtime. |
| Model 3D | Sajikan `/media/model-3d/*.glb` sebagai berkas statis dengan tipe `model/gltf-binary` bila diatur di host. Pakai nama baru jika file diganti dan host menyimpan cache terlalu lama. |
| Endpoint | `robots.txt` dan `sitemap.xml` sudah menjadi berkas saat build; tidak memerlukan fungsi server. |
| HTTPS/cache | HTTPS dan satu hostname utama. Usulan cache: HTML/robots/sitemap direvalidasi; aset bernama hash dapat immutable. Cocokkan header/redirect dengan kemampuan host, lalu uji setelah konfigurasi. Belum ada konfigurasi provider yang dipasang. |
| Preview privat | Bila diunggah ke staging, gunakan kontrol akses hosting yang disetujui dan noindex. Noindex sendiri tidak membuat staging privat. |
| Pemulihan versi | Host harus mendukung pergantian ke deployment/artefak sebelumnya secara utuh dan peninjauan log kegagalan. |

Pilihan provider, pemilik akun, anggaran, domain/registrar, DNS, kebijakan log akses/retensi, dan pengaturan cache/redirect tetap belum ditetapkan. Tidak ada rekomendasi paket berbayar atau jaminan fitur provider dalam dokumen ini. Setelah host ditentukan, cocokkan kontrak di atas dengan dokumentasi resminya dan catat konfigurasi sebenarnya.

Rujukan: [deployment statis Astro](https://docs.astro.build/en/guides/deploy/) dan [npm ci](https://docs.npmjs.com/cli/v12/commands/npm-ci/). `npm ci` digunakan untuk mengikuti lockfile; pengujian instalasi bersih Tahap 6 dilakukan pada salinan terpisah agar instalasi kerja tidak ditimpa.

## Tiga jenis hasil kerja

1. **Development**: `npm run dev`; memiliki route DEMO. Hanya untuk pengerjaan lokal, tidak menjadi materi upload.
2. **Build review**: `npm run build`/snapshot; berisi konten published saja, saat ini noindex, katalog kosong, dan kontak nonaktif. Boleh ditinjau lokal; status ini tidak menyatakan MVP bisnis siap diluncurkan.
3. **Rilis disetujui**: hasil build yang sama persis dengan versi yang diperiksa setelah data/domain/kanal resmi dan instruksi publikasi tersedia. Tidak dibuat atau dipublikasikan secara otomatis oleh skrip.

Git lokal sudah diinisialisasi untuk editor. Commit, remote dan CI/CD belum disiapkan. Simpan cadangan sumber dan bukti persetujuan sebelum perubahan besar.

## Persiapan konten dan data

Ikuti [CONTENT_GUIDE.md](CONTENT_GUIDE.md) untuk pengisian/pembaruan. Tidak mengubah `publishStatus`, `whatsappConfirmed`, atau `indexingEnabled` tanpa instruksi yang sesuai.

- Pengisian `siteUrl` saja tidak mengaktifkan canonical/indexing. Setelah domain dan indexing diinstruksikan, konfigurasi yang sama membangun canonical, URL OG, schema, robots, dan sitemap.
- Kontak masih nonaktif; nomor referensi tidak menjadi kontak final. Uji alih WhatsApp HP/desktop setelah konfirmasi/aktivasi diinstruksikan, tanpa menganggap tautan terbuka berarti pesan terkirim.
- Harga boleh tidak tersedia; jangan mengisi nol atau menyalin nilai brosur yang belum disetujui.
- Properti/proyek kosong diperbolehkan dengan empty state sesuai PRD. Kelengkapan lima layanan dan ketentuan kemitraan masih tercatat untuk penerimaan lingkup bisnis.
- Foto final, logo resmi transparan, izin lokasi/gambar, serta informasi legal/bisnis tidak boleh diasumsikan dari ilustrasi atau DEMO.

## Pemeriksaan prarilis

```powershell
npm run release:check
```

Perintah ini hanya membaca data, menulis `docs/verification/stage-6/readiness.json`, dan menampilkan kekurangan yang dapat dideteksi dari konfigurasi/konten. **Exit 1 pada kondisi sekarang memang diharapkan**: domain, indexing, WhatsApp, area, layanan published, dan ketentuan kemitraan belum lengkap. Ini bukan error build dan tidak menghalangi snapshot review lokal.

Pemeriksa memakai metadata frontmatter inline biasa (termasuk kutip/comment), bukan pengganti parser/schema Astro. `check`/build tetap memvalidasi konten sebenarnya. Bila seluruh indikator otomatis terisi, status hanya `manual-review-required`, tidak pernah menyetujui deployment. Selesaikan [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) beserta pemeriksaan bisnis/aksesibilitas sebelum peluncuran.

## Membuat snapshot untuk ditinjau

Pastikan penyuntingan berhenti selama perintah berikut berjalan:

```powershell
npm run release:snapshot
```

Skrip menjalankan `check` → `test` → `build`, lalu membandingkan inventaris input build sebelum/sesudah untuk mendeteksi perubahan sumber selama proses. Bila salah satu gagal, snapshot tidak diterbitkan sebagai hasil sukses. Tidak menjalankan deployment atau membuka WhatsApp.

Output baru memiliki ID timestamp/digest:

```text
.releases/ID/
  site/            # Hanya berkas hasil build yang boleh menjadi isi web root
  manifest.json    # Metadata lokal di luar web root
```

Manifest mencatat Node, hash SHA-256/path/ukuran setiap berkas, digest keseluruhan build, inventaris `src`/`public`/konfigurasi/lockfile, dan status kesiapan saat snapshot. Dokumen dan instalasi node_modules bukan input digest tersebut. Snapshot **selalu** bertanda `local-review-only` dan `deploymentApproved: false`; skrip tidak menganggap konfigurasi sebagai persetujuan.

`.releases/` dan `.verification/` diabaikan Git dan pemeriksaan tipe. Simpan salinan snapshot serta sumber terkait pada backup yang disepakati; direktori lokal bukan backup di perangkat lain. Jangan mengedit snapshot setelah dibuat. Untuk revisi baru, perbarui sumber dan buat ID baru.

```powershell
npm run release:verify -- .releases/ID
```

Ganti `ID` dengan nilai hasil perintah, bukan mengetik kata ID secara literal. Verifikasi menolak perubahan, berkas hilang, tambahan, dan digest manifest yang tidak cocok. Ia memeriksa integritas lokal, bukan autentikasi/tanda tangan kriptografis. Hanya snapshot di `.releases/` project ini yang diterima. Verifikasi ulang sesudah memindahkan/menyalin artefak ke lokasi peninjauan yang sesuai.

## Meninjau hasil

```powershell
$env:ASTRO_TELEMETRY_DISABLED = '1'
npm run preview -- --host 127.0.0.1 --port 4323
```

Ini menyajikan `dist/` terakhir. Untuk meninjau snapshot lama, gunakan salinan project terpisah, pulihkan **seluruh** `site/` ke `dist/` kosong pada salinan tersebut, lalu jalankan preview di sana. Jangan menimpa `dist/` kerja atau sumber utama saat membandingkan versi.

Periksa homepage/katalog/kontak/kemitraan, semua detail published, aset, robots/sitemap, dan URL tidak dikenal. `/_preview/*` serta URL draft harus 404 pada hasil build. Jangan memakai `astro preview` sebagai layanan hosting produksi.

QA lanjut: ikuti [QA_REPORT.md](QA_REPORT.md). Jalankan audit yang relevan terhadap perubahan; ulangi Lighthouse setelah aset/katalog/detail final. Audit browser Tahap 5 mencakup fixture dan status kontak belum aktif; setelah data/aktivasi berubah, perbarui kasus prarilis agar mencakup kondisi nyata. Jangan mengabaikan kegagalan tes atau membuka indexing sekadar menaikkan skor.

## Pelaksanaan deployment setelah instruksi pemilik

Bagian ini prosedur untuk nanti, bukan tindakan yang sudah dilakukan.

1. Catat snapshot/commit sumber, domain, target hosting, perubahan, bukti QA, serta instruksi publikasi yang berlaku. Periksa data pemilik, [checklist rilis](RELEASE_CHECKLIST.md), dan privasi/log layanan aktual.
2. Simpan deployment/artefak live sebelumnya. Untuk rilis pertama, catat bahwa belum ada versi live untuk dipulihkan dan sepakati penanganan bila gagal.
3. Unggah/pilih hanya artefak yang diperiksa; jika hosting membangun ulang dari sumber, gunakan sumber/lockfile/runtime yang sama, kemudian bandingkan hasil dan lakukan QA sebelum promosi.
4. Setelah staging/host/domain yang benar diperiksa, lakukan perpindahan deployment sesuai mekanisme provider. Jangan menggabungkan isi rilis baru ke folder lama yang menyisakan HTML/aset usang.
5. Periksa HTTPS/redirect/hostname, `/`, katalog/kontak/kemitraan/detail, MIME/aset, unknown route berstatus 404, draft/preview berstatus 404, canonical/OG/schema/robots/sitemap, dan kanal WhatsApp yang disetujui. Jangan mengirim pesan otomatis.
6. Catat ID deployment, ID snapshot/digest, waktu, penanggung jawab, hasil smoke test, dan versi rollback. Jika gagal, pulihkan versi sebelumnya; jangan memperbaiki isi dist live tanpa memperbarui sumber.

DNS, credential, file `.env`, dan token hosting tidak boleh disalin ke konten atau disimpan di dokumen publik. Aplikasi statis ini tidak memerlukan secret runtime. Pengaturan host tetap ditinjau ketika provider dipilih.

## Rollback

Pemicu operasional: halaman/aset hilang, status/kontak salah, konten belum disetujui terbit, atau regresi interaksi penting. Utamakan artefak/deployment terakhir yang diketahui baik; tidak perlu menunggu build kode baru untuk mengembalikan versi yang sudah tersimpan.

1. Identifikasi versi sebelumnya, sumber/digest, domain, serta dampak data. Pastikan versi lama tidak mengiklankan ulang properti terjual atau harga/kontak yang sudah ditarik; pilih artefak aman yang disetujui bila versi lama tidak lagi tepat secara bisnis.
2. Verifikasi salinan artefak sebelum dipakai. Pulihkan deployment/folder versi secara utuh melalui mekanisme provider, bukan copy di atas isi versi baru. Perubahan DNS bukan mekanisme rollback rutin untuk konten.
3. Revalidasi cache HTML/robots/sitemap sesuai host; aset hash milik versi yang dipakai harus tetap tersedia. Jalankan smoke test dan status 404 kembali.
4. Catat versi yang gagal dan penyebab; perbaiki sumber secara terpisah dan ulangi pemeriksaan sebelum rilis berikutnya. Tidak mengubah snapshot lama untuk menyembunyikan masalah.

Latihan Tahap 6 dilakukan pada salinan lokal: versi A → modifikasi HTML + satu berkas tambahan B → pulihkan A ke folder baru. Verifikasi mendeteksi dua perubahan, pemulihan menghasilkan digest A kembali, dan berkas tambahan B menjadi 404. Ini membuktikan prosedur berkas lokal; **rollback provider/DNS live belum dilakukan**.

## Bukti Tahap 6

- [Instalasi bersih dan perbandingan build](verification/stage-6/reproducibility.json).
- [Latihan rollback lokal](verification/stage-6/rollback-drill.json).
- [Status prarilis saat ini](verification/stage-6/readiness.json).
- Snapshot review lokal: `.releases/2026-11-14T10-52-05-929Z-8143b9dcb9/` (tidak masuk versi/source repo).
- Digest build: `8143b9dcb9b03bd024a4860162f96e38c376e2abceaaf38d166807ed4f68c3db`.

Build identik pada Node/npm/OS dan sumber yang diuji saat ini. Tidak mengklaim kesamaan byte pada OS, versi tool, tahun/tanggal dinamis, atau konten yang berbeda.
