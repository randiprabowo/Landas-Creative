# Panduan konten — Landas Creative

## Mengelola website dari halaman admin

1. Dari folder project jalankan `npm ci` saat instalasi pertama, lalu `npm run dev`. Buka `http://localhost:4321/admin` di Chrome atau Edge **desktop**. Sesuaikan port bila terminal menampilkan alamat berbeda.
2. Pilih **Work with Local Repository**, pilih folder **Landas-Creative** yang berisi `package.json`, lalu izinkan akses baca dan tulis pada folder itu. Komputer ini sudah memiliki repository Git lokal. Pada salinan yang kehilangan folder tersembunyi `.git`, jalankan `git init` satu kali. Akses lokal mengikuti akun komputer dan izin folder dari browser.
3. Di **Halaman dan data bisnis**, buka **Identitas, kontak dan SEO** untuk memperbarui WhatsApp, email, alamat, wilayah layanan, media sosial, domain, deskripsi pencarian, atau logo resmi. Nama dan tagline mengikuti identitas dalam DESIGN. Biarkan nomor yang menunggu verifikasi dalam keadaan nonaktif. Saat mengganti nomor aktif, periksa kembali persetujuan aktivasi untuk nomor pengganti.
4. Gunakan **Beranda dan footer**, **Katalog, profil, privasi dan 404**, atau **Halaman kontak, kemitraan dan formulir** untuk menyunting teks. Buka bagian yang diinginkan, ubah kolomnya, lalu klik **Save**. Kolom opsional yang dikosongkan dapat dihapus oleh CMS dari JSON. Website menampilkan kondisi kosong yang sesuai.
5. Di **Layanan**, **Properti**, atau **Portofolio proyek**, buka entri untuk mengubahnya, atau pilih **New**. Entri baru berawal sebagai `draft`. Pertahankan ID dan tautan lama saat memperbarui. Untuk menarik entri dari tampilan publik, ubah ke `draft`, lalu build dan unggah versi baru. Sebelum menghapus permanen, periksa rujukan layanan dan proyek.
6. Gunakan pemilih gambar pada sampul, galeri, hero, atau denah untuk mengunggah aset. Isi deskripsi aksesibel, jenis gambar, keterangan, dan izin. Periksa kembali urutan gambar karena gambar pertama dipakai sebagai sampul katalog. Keterangan wajib untuk dokumentasi proyek terbit. Simpan hanya media dan lokasi yang pemiliknya izinkan.
7. Tinjau perubahan di tab website. Daftar dan detail publik mengikuti status `published`. Simpan entri sebagai draft selama data belum lengkap. Jalankan `npm run check`, `npm test`, dan `npm run build` sebelum upload. Build yang gagal perlu diperbaiki pada kolom yang disebut di terminal. Perubahan situs live mengikuti versi yang Anda unggah manual. [Panduan deployment dan login GitLab](DEPLOYMENT_GUIDE.md)

CMS menulis berkas yang sama dengan alur penyuntingan manual di bawah. Definisi formulir berada di `src/cms/settings.ts` dan `src/cms/collections.ts`. Teks editorial dikelola melalui panel. Komponen, label kontrol sistem dan perilaku formulir dikelola di kode. Teks antarmuka bawaan CMS mengikuti bahasa yang tersedia, dan nama bagian serta kolom project menggunakan bahasa Indonesia. Rincian pemilihan folder ada di [panduan lokal Sveltia](https://sveltiacms.app/en/docs/workflows/local).

## Lokasi data

| Isi yang ingin diubah | Berkas | Catatan |
| --- | --- | --- |
| Nama, tagline, logo, kontak, wilayah, media sosial, domain | `src/data/site.json` | Isi hanya data yang sudah disetujui. Nomor referensi masih `whatsappConfirmed: false`. |
| Seluruh copy beranda | `src/data/home.json` | Hero, pengantar, tiga komitmen, judul section, lima langkah, kemitraan, CTA, pesan kosong, deskripsi footer. |
| Copy katalog, profil Tentang, dan pesan detail | `src/data/pages.json` | Pengantar/empty state tiga katalog, profil, visi/misi opsional, dan catatan biaya/kontak. |
| Copy kontak, kemitraan, ketentuan opsional, dan penjelasan form | `src/data/contact.json` | `partnership.terms` tetap null sampai teks resmi disetujui. Validasi di `contact.ts`. |
| Foto hero dan status izin | `hero.media` dalam `src/data/home.json` | Aset lokal dan izin wajib; foto tidak disetujui tidak ditampilkan. |
| Layanan | `src/content/services/*.md` | Lima berkas awal tetap **draft**. ID berasal dari nama berkas. |
| Properti | `src/content/properties.json` | Masih `[]`; setiap objek nyata nantinya mempunyai `id` dan `slug` unik. |
| Proyek/portofolio | `src/content/projects.json` | Masih `[]`; bukan salinan brosur yang belum diverifikasi. |
| Foto/aset produksi | `src/assets/` | Logo: `brand/logo.jpeg`. Foto asli dapat diletakkan pada subfolder `photos/`. |
| Rute navigasi | `src/data/navigation.ts`, Header/Footer, halaman beranda | Katalog/Tentang menuju rute masing-masing; konsultasi `/kontak`, kemitraan `/kemitraan`, privasi `/privasi`. |
| Bentuk data yang diterima | `src/schemas/content.ts`, `src/content.config.ts`, `src/data/home.ts`, `src/data/site.ts` | Schema memvalidasi saat check/build; schema konten yang sama juga dipakai unit test. |
| Data DEMO khusus development | `src/dev/fixtures.ts`, `src/dev/detail-fixtures.ts`, `src/dev/search-fixtures.ts` | Jangan salin ke koleksi/data produksi. Harga sintetis hanya untuk memeriksa filter/pengurutan. |
| Persetujuan dan data yang belum lengkap | `docs/IMPLEMENTATION_PLAN.md` | Checklist internal; jangan mengisi pesan pengunjung dengan catatan teknis internal. |

## Mengubah teks beranda

1. Buka `src/data/home.json` dan ubah nilai teks yang sesuai. Pertahankan tanda kutip, koma, serta struktur JSON. Jangan memasukkan tag HTML; teks dirender sebagai teks biasa.
2. `hero.title` adalah frasa navy, `hero.accent` frasa teal. Usahakan panjang serupa agar hierarki tetap nyaman pada HP.
3. `introduction.commitments` berisi tepat tiga komitmen sesuai DESIGN. Ini arah kerja perusahaan, bukan sertifikasi atau klaim hasil yang telah diukur.
4. `workflow.steps` berisi tepat lima langkah sesuai DESIGN. Ubah penjelasan hanya bila prosesnya benar; jangan menjanjikan waktu, biaya, atau garansi yang belum disetujui.
5. `availability` menyimpan pesan singkat bagi pengunjung ketika kontak/katalog belum tersedia. Pesan ini berbeda dari checklist kelengkapan internal.
6. Label tombol dapat diubah melalui JSON. Tujuannya tetap ditentukan dalam template beranda. Jangan mengklaim pengiriman pesan atau aktivasi kontak yang belum dikonfirmasi.

Tombol utama hero dan CTA penutup membuka `/kontak#pesan`. Tombol Jelajahi Properti menuju `/properti`, termasuk ketika katalog kosong. Tombol kemitraan membuka `/kemitraan`. Form menjelaskan status kontak dan dapat menampilkan pratinjau tanpa mengirim pesan.

## Mengisi identitas dan kontak

- Nama perusahaan tetap **Landas Creative**, identitas logo **LNDS**, tagline **Foundations & Growth**.
- Nomor pada PRD adalah referensi **belum dikonfirmasi**, bukan kontak final. Pertahankan `whatsappConfirmed: false` sampai pengguna mengonfirmasi nomor serta meminta aktivasi. Format nantinya internasional tanpa `+` atau spasi, diawali `62`.
- Tahap 4 menyediakan `src/utils/whatsapp.ts` dan `MessageForm.astro`. Hanya `verifiedWhatsappNumber` diteruskan ke browser. Bila belum dikonfirmasi, nomor referensi tidak dimasukkan ke HTML/JS produksi dan tombol **Lanjut ke WhatsApp** disabled dengan penjelasan; **Pratinjau Pesan** tetap dapat dipakai. Setelah pemilik mengonfirmasi nomor dan menginstruksikan aktivasi, perbarui nomor/flag, check/build ulang, lalu uji alih ke WhatsApp secara manual pada HP/desktop. Belum ada pengujian alih eksternal pada tahap ini.
- `email`, `publicAddress`, `serviceAreas`, dan `socialLinks` yang diisi dapat muncul di footer. Karena itu isi hanya setelah disetujui pemilik. Pertahankan `null`/`[]` bila belum tersedia. Tautan sosial harus HTTPS.
- `site.logo` adalah path aset lokal, saat ini `src/assets/brand/logo.jpeg`. Mengganti path akan memperbarui logo footer. Jangan menggambar ulang logo LNDS. Header sementara memakai teks nama perusahaan karena JPEG lengkap tidak cocok diperkecil; logo transparan/SVG resmi masih dibutuhkan.
- Jangan aktifkan indexing hanya karena domain diisi. Tahap 5 sudah menyiapkan SEO yang mengikuti konfigurasi sama; persetujuan bisnis/peluncuran tetap diperlukan. Website belum dipublikasikan.

## Mengganti ilustrasi hero dengan foto asli

Saat ini hero memakai SVG konseptual buatan lokal. Label **Ilustrasi** dan “Bukan dokumentasi proyek” terlihat; gambar tersebut tidak menjadi bukti pekerjaan.

1. Pilih foto asli dengan izin pemilik dan konteks yang benar. Jangan memakai foto brosur untuk mengklaim proyek Landas Creative tanpa konfirmasi.
2. Letakkan foto yang sudah diperkecil/dioptimasi di `src/assets/photos/`. Nama berkas gunakan huruf kecil dan tanda hubung. Jangan menaruh dokumen tanah, identitas pemilik, atau foto sensitif dalam repo.
3. Isi `hero.media.src` dengan path seperti `/src/assets/photos/NAMA-BERKAS-ASLI.webp` (ganti dengan berkas yang benar-benar ada). Format yang didukung resolver: PNG/JPG/JPEG/WebP/AVIF/SVG.
4. Isi `alt` untuk menjelaskan isi gambar dan `caption` untuk konteks yang benar. Pilih `kind`: `foto-proyek`, `visualisasi-3d`, atau `ilustrasi`. Render tidak boleh dilabeli sebagai foto pekerjaan nyata.
5. Setelah izin penggunaan dan informasi gambar dikonfirmasi, set `permissionConfirmed: true`. Bila false atau `src: null`, ilustrasi bawaan tetap digunakan. Path disetujui yang tidak ditemukan membuat build gagal agar kesalahan tidak tersembunyi.
6. Hero memakai rasio 4:3. Foto dipotong secara visual dengan `object-fit: cover`; periksa agar subjek utama tidak terpotong. Logo dan denah tidak menggunakan cropping seperti ini. Label/caption tampil di dekat gambar.

Astro menghasilkan aset lokal dan ukuran gambar yang sesuai. `ContentImage` memuat hero lebih dahulu, gambar bawah secara lazy, menyediakan dimensi, dan mengganti gambar gagal dengan pesan “Gambar belum tersedia”. Nama/teks konten tetap dapat dibaca.

## Menambahkan video YouTube dan model 3D

Di `/admin`, buka **Halaman dan data bisnis → Beranda dan footer → Pembuka beranda**, atau buka satu entri pada **Layanan** atau **Properti**. Foto pembuka, sampul layanan, dan galeri properti dikelola di kolom gambar. Tombol media tambahan muncul di bawah gambar jika ada media yang sudah disetujui. Centang **Add** dan buka grup dengan ikon panah untuk mengisi kolom media opsional.

1. Aktifkan grup **Video YouTube** lalu isi judul dan tautan video. Salin tautan dari tombol **Bagikan** pada video dari akun YouTube Anda. Video publik atau tidak publik dapat digunakan jika penyematan diizinkan. ID video juga diterima. Pengunjung membuka pemutar dengan memilih **Video YouTube**. Mereka juga dapat membuka video di YouTube melalui tautan di dalam pemutar. [Panduan penyematan YouTube](https://support.google.com/youtube/answer/171780)
2. Aktifkan grup **Model 3D interaktif**, klik **Browse → Upload**, pilih file `.glb`, lalu klik **Insert**. Isi judul dan keterangan model. Gunakan nama berkas tanpa spasi serta ekspor GLB 2.0 dengan tekstur tertanam. Pilih ekspor tanpa Draco, Meshopt atau KTX2. Pengunjung dapat memutar dan memperbesar model. [Dokumentasi penampil GLB](https://modelviewer.dev/docs/)
3. Centang persetujuan media setelah izin penggunaan dan keterangan dikonfirmasi, lalu simpan. Untuk katalog, detail tampil pada entri `published`. Gunakan gambar berizin pada sampul atau galeri sesuai schema publikasi.
4. Jalankan build dan lihat hasilnya melalui preview sebelum mengunggah versi baru. Periksa video dari akun Anda dan coba model di perangkat yang digunakan pengunjung.

Untuk penyuntingan berkas, hero memakai `hero.video` dan `hero.model` di `src/data/home.json`. Layanan memakai `video` dan `model` di frontmatter Markdown. Properti memakai kedua field tersebut pada item di `src/content/properties.json`. Field video berisi `url`, `title`, `caption` opsional dan `permissionConfirmed`. Model berisi `src`, `title`, `caption` dan `permissionConfirmed`. CMS menyimpan file GLB di `src/assets/models/`. Untuk penyuntingan manual, gunakan `src/assets/models/NAMA-FILE.glb` sebagai nilai `src`.

Tombol chat di halaman pengunjung membuka formulir konsultasi. Saat dibuka dari detail layanan atau properti, formulir membawa referensi item. Setelah nomor resmi diaktifkan, **Lanjut ke WhatsApp** membuka pesan yang sudah disusun untuk diperiksa dan dikirim oleh pengunjung.

## Layanan: simpan draft sampai ada instruksi publikasi

Jangan mengubah `publishStatus` menjadi `published` tanpa instruksi pengguna. Semua berkas awal tetap draft; hanya ringkasan umum dalam hero yang mengikuti copy DESIGN. Kartu penawaran draft tidak ditampilkan di beranda.

Data layanan yang perlu dilengkapi:

- `title`, `slug`, `category`, `summary`, body Markdown yang sudah disetujui.
- `scope`, `exclusions`, `steps`: lingkup, batas, proses sebenarnya. Pembangunan harus menjelaskan rumah pribadi, komersial, dan subsidi sesuai FR-02.
- `coverImage`: `src`, `alt`, `caption` bila perlu, `kind`, `permissionConfirmed`.
- `startingPrice` opsional, `priceUnit`, `priceNote`, `priceConfirmed`. Angka rupiah harus integer positif dan aman (maksimal Number.MAX_SAFE_INTEGER). Jangan menyalin harga referensi ke penawaran terbit. Jika belum disetujui, hilangkan harga; jangan mengisi nol.
- `relatedProjectIds`: ID proyek yang benar-benar ada; `createdAt`/`updatedAt` berbentuk string ISO 8601 dengan zona waktu. Perbarui `updatedAt` saat informasi berubah.

Untuk gambar di koleksi, `src` berupa path **relatif terhadap berkas konten**, misalnya dari Markdown layanan menuju aset aktual dalam `src/assets`. Ini berbeda dari path absolut project pada konfigurasi hero.

Schema mensyaratkan ringkasan, lingkup dan langkah layanan, gambar utama berizin untuk published, serta harga positif/terkonfirmasi bila diisi. Uraian body layanan/proyek published juga wajib terisi. Pemenuhan schema bukan persetujuan bisnis. Periksa konten, cakupan, referensi, dan hak gambar sebelum meminta persetujuan publikasi.

Body layanan memakai Markdown. Tulis paragraf, daftar, penekanan, dan heading mulai `##`; H1 sudah disediakan template. HTML mentah tidak diperbolehkan pada layanan published, dan akan menghentikan build. Gunakan `[teks tautan](https://alamat-resmi)` alih-alih tag HTML atau bentuk autolink `<alamat>`. Foto utama/dokumentasi sebaiknya tetap pada field gambar terstruktur agar izin, alt, dan labelnya dapat diperiksa.

Mulai Tahap 5, gambar Markdown langsung/referensi dan tujuan link dengan protokol javascript/vbscript/data ditolak pada body layanan published. Gunakan field gambar terstruktur untuk menjaga izin, alt, dan label; gunakan tautan web yang wajar. Teks biasa seperti “Data: lingkup pekerjaan” tetap diperbolehkan. Teks wajib serta isi daftar di-trim; whitespace saja tidak dianggap terisi. Ini penguatan validasi, bukan perubahan PRD/DESIGN atau persetujuan publikasi.

Body proyek dan deskripsi properti pada JSON adalah teks biasa; pisahkan paragraf dengan `\n\n`. Tag HTML dirender sebagai teks, bukan dijalankan. Informasi yang bersifat sensitif tetap tidak boleh disimpan di repo.

## Properti dan proyek nyata

Pertahankan array kosong bila belum ada data. Jangan membuat contoh produksi hanya untuk mengisi section.

| Entitas | Data yang harus disiapkan |
| --- | --- |
| Keduanya | `id`, `slug`, `title`, `publishStatus`, `featured`, `summary`, `createdAt`, `updatedAt`; gambar utama berizin. |
| Properti | Tipe `rumah-komersial`/`rumah-subsidi`/`ruko`, deskripsi, wilayah/lokasi publik, luas tanah/bangunan, kamar/lantai sesuai data, fasilitas, peran pemasaran. |
| Harga properti | Angka rupiah positif dan `priceConfirmed: true` hanya setelah disetujui; bila tidak tersedia hilangkan `price`, bukan Rp0. |
| Status properti | `tersedia`, `dipesan`, `terjual`. Jangan mengiklankan survei/pemesanan untuk properti terjual. |
| Proyek | Kategori layanan, body, lokasi yang boleh ditampilkan, tahun bila diketahui, `projectStatus` (`berjalan`/`selesai`), lingkup, dan `relatedServiceIds`. |
| Gambar proyek | Setiap gambar mempunyai alt, caption, jenis foto/render, izin. Label Visualisasi 3D, Proses Pengerjaan, atau Hasil Selesai mengikuti data. |

Beranda hanya membaca published. Untuk properti/proyek, `featured: true` juga diperlukan; maksimal tiga item masing-masing. Jika hasilnya kosong, **section pilihan tidak dirender**. Katalog menampilkan empty state yang jelas; tidak membuat listing atau portofolio semu. Layanan published ditampilkan melalui kartu; saat semuanya draft, satu empty state ditampilkan.

Template detail sudah tersedia. Pada build, hanya entri published yang menghasilkan URL `/layanan/[slug]`, `/properti/[slug]`, `/portofolio/[slug]`. Karena saat ini seluruh layanan masih draft dan properti/proyek kosong, belum ada halaman detail produksi yang dihasilkan. URL draft tetap 404; ini kondisi yang disengaja.

Kartu published menautkan detail sesuai slug. Referensi terkait hanya menampilkan target yang juga published; target draft tetap tidak terlihat. Properti terkait menghindari item yang terjual. Harga yang tidak tersedia tetap berupa pesan, bukan Rp0. Properti terjual menampilkan **Cari Properti Lain**, tanpa CTA survei/pemesanan. Detail lain mengarah ke penyusun pesan dengan referensi item. Saat kontak belum terkonfirmasi, labelnya **Siapkan Pertanyaan**. Setelah diaktifkan, layanan memakai **Minta Penawaran** dan properti belum terjual memakai **Jadwalkan Survei**; keduanya tetap melalui form untuk ditinjau pengguna.

Semua tanggal ditampilkan menurut zona Asia/Jakarta. `floorPlan` memakai rasio asli dan `object-fit: contain`, tanpa cropping. Galeri menyaring gambar tanpa izin; foto/render/ilustrasi diberi label serta caption. Dengan JavaScript, thumbnail memilih gambar, panah kiri/kanan dan Home/End memindahkan pilihan. **Perbesar gambar** membuka native dialog; Escape/Tutup menutup dan mengembalikan fokus. Tab tetap pada kontrol Tutup. Denah juga dapat diperbesar. Tanpa JavaScript dokumentasi tetap tersedia sebagai gambar statis; kontrol interaktif disembunyikan. Perilaku ini sudah diuji melalui QA browser pada Tahap 5.

## Pencarian dan filter properti

- Kontrol muncul bila ada properti published. Katalog produksi yang kosong tetap menampilkan pesan persiapan dan tautan ke kontak, tanpa kontrol yang tidak berguna.
- Data dicari dari `title`, `region`, dan `publicLocation`; pencarian trim dan tidak peka kapital. Tipe, wilayah, status, serta minimum/maksimum harga digabung dengan **AND**.
- Harga di JSON tetap angka rupiah. Input filter memakai angka utuh tanpa titik/koma, minimal nol; minimum tidak boleh melebihi maksimum. Input yang tidak valid menampilkan pesan dan mempertahankan hasil terakhir yang valid.
- Properti tanpa harga terkonfirmasi dikecualikan saat rentang aktif. Harga kosong selalu terakhir pada urutan harga terendah maupun tertinggi. Default unggulan, kemudian terbaru menurut `updatedAt` dan ID untuk urutan yang konsisten.
- **Reset Pencarian & Filter** mengembalikan semua hasil dan urutan unggulan. Jumlah hasil diumumkan melalui status aksesibel. Hasil kosong menyediakan penjelasan dan tautan konsultasi.
- Ringkasan nilai filter aktif tetap tampil saat panel filter mobile ditutup.
- Dengan JavaScript dinonaktifkan, seluruh daftar published dan link detail tetap ada dalam HTML, dengan urutan unggulan. Filter tidak mengirim permintaan ke server dan tidak memakai database.

## Kontak, pesan item, dan kemitraan

Ubah judul, penjelasan form, serta pesan kontak belum tersedia dalam `src/data/contact.json`. Field `partnership.terms` boleh diisi hanya dengan teks resmi yang disetujui; jika null, halaman memakai penjelasan bahwa ketentuan sedang disiapkan. Jangan menambahkan janji komisi, kelulusan, atau keuntungan.

Form meminta nama, minat, lokasi umum, dan kebutuhan/perkenalan. Semua wajib; batas nama 80, lokasi 160, pesan 1.200 karakter. **Pratinjau Pesan** hanya menyusun teks di browser. **Lanjut ke WhatsApp** hanya aktif untuk nomor yang terkonfirmasi; pesan harus ditinjau dan dikirim sendiri oleh pengguna di WhatsApp. Isian tidak ditaruh pada localStorage, analytics, atau endpoint website. Form disembunyikan sampai handler JavaScript terpasang agar tidak mengirim isian melalui submit HTTP tanpa sengaja.

CTA detail membawa parameter slug ke `/kontak?layanan=...#pesan`, `?properti=...`, atau `?proyek=...`. Form hanya menerima referensi yang cocok dengan daftar konten published saat build, bukan judul/URL bebas dari parameter. Referensi properti menyertakan nama, ID, URL halaman, serta pertanyaan ketersediaan/survei; status terjual menghasilkan pertanyaan alternatif tanpa survei. Layanan menyertakan nama layanan, lokasi, dan kebutuhan. **Hapus Referensi** mengembalikan pilihan minat umum. Form kemitraan memakai perkenalan khusus agen pemasaran.

Di CMS, buka **Katalog, profil, privasi dan 404 → Kebijakan privasi** untuk mengubah bagian yang ditayangkan oleh `src/pages/privasi.astro`. Teksnya tersimpan di `src/data/pages.json`. Tinjau penjelasan pemrosesan browser, WhatsApp, cookie dan log akses ketika layanan yang digunakan berubah.

## Validasi ID, slug, dan referensi

- ID harus unik di dalam setiap koleksi. JSON wajib berupa array dengan field `id` teks tidak kosong dan tanpa spasi tepi; ID duplikat ditolak **sebelum** loader dapat menimpa item.
- ID layanan ditetapkan secara eksplisit dari nama berkas tanpa `.md` melalui `generateId` loader, sehingga mengubah slug tidak mengubah ID referensinya. Hindari mengganti nama berkas yang sudah direferensikan. Lima ID awal tetap sama.
- Slug unik di seluruh entri koleksi tersebut, termasuk benturan draft dengan published. Gunakan huruf kecil, angka, dan tanda hubung.
- `relatedProjectIds` pada layanan mengacu pada ID proyek; `relatedServiceIds` pada proyek mengacu pada ID berkas layanan. Semua target harus ada, meskipun masih draft. Referensi hilang menghentikan build.
- Query bersama memeriksa integritas ini sebelum memilih published. Jangan menggantinya dengan query mentah untuk membuat daftar atau `getStaticPaths`.
- Jalankan `npm run test:content` untuk tes regresi ID/slug/referensi/body. Tes memakai runner bawaan Node, tanpa dependensi tambahan.

## Mengisi halaman Tentang

Edit `about` dalam `src/data/pages.json`. Profil awal dan komitmen berasal dari PRD/DESIGN serta copy beranda. `vision` tetap `null` dan `mission` tetap `[]` sampai pemilik memberikan teks yang disetujui; kedua bagian disembunyikan saat kosong. Jangan mengarang tahun berdiri, tim, legalitas, sertifikasi, atau sejarah perusahaan untuk mengisi halaman.

## Preview kartu DEMO yang aman

```sh
npm run dev
```

Buka alamat server lokal yang dicetak Astro, lalu path **`/_preview/kartu`**. Contoh jika port standar dipakai: `http://localhost:4321/_preview/kartu`.

- Banner dan setiap kartu ditandai **DEMO**. Data buatan hanya untuk meninjau lima kartu layanan, judul properti panjang, harga/gambar kosong, status terjual, label visualisasi, serta fallback gambar gagal.
- Fixture ada di `src/dev/fixtures.ts`, halaman di `src/dev/preview.astro`, di luar `src/pages`. Route diinjeksi oleh `astro.config.mjs` **hanya ketika command `dev`**.
- Jangan menautkan preview dari navigasi publik. Jangan mengimpor fixture dari beranda/koleksi. Komponen kartu juga menolak draft pada mode produksi, termasuk jika prop demo keliru diteruskan.
- `npm run build` tidak menghasilkan route ini atau data DEMO. `npm run preview` menyajikan hasil produksi, sehingga `/_preview/kartu` harus 404.
- Bagian gambar gagal sengaja meminta aset tidak tersedia. Kegagalan gambar pada route DEMO ini adalah fixture pengujian, bukan foto penawaran yang rusak.
- Dari halaman kartu, buka tautan detail DEMO atau path `/_preview/detail/layanan`, `/_preview/detail/properti`, `/_preview/detail/properti-terjual`, `/_preview/detail/proyek`.
- Keempat detail memakai layout/komponen yang sama dengan template publik, dengan banner DEMO dan guard development. Fixture mencakup harga belum disetujui (harus tidak terlihat), denah portrait buatan, label ilustrasi/render, properti terjual, dan Markdown layanan. Hanya kartu layanan pertama yang menautkan contoh detail layanan; kartu lain tetap menunjukkan informasi pending.
- File tambahan: `src/dev/detail.astro`, `detail-fixtures.ts`, `service-copy.md`, `floor-plan.svg`. Semuanya di luar koleksi/halaman produksi. Jangan mengubah fixture menjadi published untuk mengisi katalog.
- Tahap 4 menambahkan **`/_preview/interaksi`**, `src/dev/interactions.astro`, dan `search-fixtures.ts`: empat properti DEMO untuk pencarian, filter gabungan, reset, hasil kosong, tiga status, harga sintetis, serta harga kosong. Form preview tetap tidak memiliki kontak aktif. Tautan detail DEMO membawa konteks ke form preview ini; tidak ke daftar referensi produksi.
- Galeri detail properti DEMO berisi dua ilustrasi dan satu URL sengaja gagal, serta denah portrait. Gunakan untuk memeriksa thumbnail, fallback, perbesaran, Escape, dan pengembalian fokus. Tidak ada foto baru yang diklaim sebagai pekerjaan nyata.
- Preview development berisi fixture dan **tidak untuk dipublikasikan**. Pilih server hasil build untuk peninjauan versi yang akan diproduksi.

## Alur setelah mengubah konten

```sh
npm run check
npm run test:content
npm test
npm run build
npm run preview
```

Periksa beranda dan perubahan pada 360, 768, 1440 px; baca caption/label, cek tautan, keyboard, dan informasi yang belum disetujui. Instruksi telemetry untuk lingkungan terbatas ada di README. Warning koleksi kosong saat datanya memang belum tersedia tidak diatasi dengan menambahkan data fiktif.

`npm test` saat Tahap 6 menjalankan 33 tes konten/schema/filter/pengurutan/pesan/SEO/integritas artefak dengan runner bawaan Node (Node 24 dipakai saat implementasi). Untuk QA browser/axe, HTTP/metadata, dan Lighthouse, ikuti `QA_REPORT.md`. Ulangi pemeriksaan yang relevan saat data nyata atau aset berubah.

## Domain, SEO, dan indexing

- `src/data/site.json`: `siteUrl` harus domain resmi HTTPS pada root, tanpa query/fragment/path. Pertahankan null sampai disetujui. `indexingEnabled` tetap false sampai ada instruksi aktivasi indexing.
- `src/components/Seo.astro`: judul/deskripsi/Open Graph, favicon dari logo utuh melalui BaseLayout, canonical dan Organization berbasis data terkonfirmasi. Detail memakai gambar utama berizin; halaman lain memakai logo resmi sebagai fallback gambar sosial ketika domain/indexing siap.
- `src/components/Breadcrumb.astro`: JSON-LD Breadcrumb ketika URL resmi siap. `src/utils/seo.ts` menghapus query/fragment canonical, menolak domain luar, dan mengamankan serialisasi JSON-LD.
- `src/pages/robots.txt.ts` dan `sitemap.xml.ts`: endpoint statis saat build, bukan backend runtime. Robots Disallow dan sitemap kosong ketika indexing nonaktif. Setelah diaktifkan sesuai instruksi, sitemap mencakup rute di `publicPagePaths` (`utils/seo.ts`) dan detail published. Tambahkan rute publik baru ke daftar tersebut bila membuat halaman di kemudian hari.
- 404 dan preview development tidak memiliki canonical atau entri sitemap. Tidak menebak domain/nomor/alamat untuk schema.
- Jangan mengedit dist atau robots secara manual; ganti konfigurasi yang disetujui, check/build ulang, lalu verifikasi hasil pada domain resmi sebelum rilis. Saat ini SEO Lighthouse **66** karena blokir indexing yang disengaja, sehingga target ≥95 belum ditutup.

Perubahan lokal tidak otomatis menjadi website live. Deployment tetap memerlukan instruksi pengguna pada tahap kesiapan rilis. Catat data yang belum lengkap pada checklist internal, bukan sebagai klaim atau catatan teknis bagi pengunjung.

## Checklist internal pengisian awal

- [ ] Logo transparan/SVG resmi untuk header.
- [ ] Foto hero asli berizin, alt, caption, dan jenis media.
- [ ] Cakupan/pengecualian/proses, gambar berizin, serta instruksi publikasi lima layanan.
- [ ] Konfirmasi nomor WhatsApp dan kanal kontak lain.
- [ ] Alamat/area layanan serta domain yang disetujui.
- [ ] Harga dan syarat paket yang boleh ditampilkan; jangan menganggap harga brosur final.
- [ ] Properti nyata beserta status terbaru dan peran pemasaran.
- [ ] Proyek nyata, izin lokasi/foto, caption, dan referensi layanan.
- [ ] Detail kemitraan tanpa menjanjikan komisi yang belum disepakati.
- [x] Rute katalog dan template detail selesai; navigasi katalog/Tentang sudah dipindahkan pada Tahap 3.
- [ ] Isi profil tambahan/visi/misi resmi bila ingin ditampilkan.
- [x] Rute kontak/kemitraan/privasi dan pemindahan CTA selesai pada Tahap 4.
- [x] Verifikasi browser Tahap 4 dituntaskan pada Tahap 5: filter/reset/error, form, galeri/Escape/fokus, 360/768/1440 px, mode tanpa JavaScript. Screenshot dan laporan ada di `docs/verification/stage-5/`.
- [ ] Pengukuran Lighthouse ulang setelah aset final dan detail nyata tersedia; SEO/domain resmi setelah persetujuan indexing.
- [ ] Pemeriksaan pembaca layar, zoom browser native 200%, dan perangkat fisik sebelum rilis.
- [ ] Uji alih WhatsApp di HP/desktop setelah nomor resmi dikonfirmasi dan aktivasi diinstruksikan.
- [x] Panduan penambahan/pembaruan/penarikan konten, persiapan foto, dan pemulihan versi disiapkan pada Tahap 6.
- [x] Instalasi bersih dari lockfile, kecocokan build, snapshot, dan latihan rollback lokal diuji; lihat `DEPLOYMENT_GUIDE.md`.

## Alur editorial sehari-hari

1. **Siapkan sumber resmi**: catat informasi yang diberikan pemilik, lingkup yang disetujui, serta izin foto/lokasi. Simpan bukti persetujuan di tempat internal yang disepakati, bukan menempelkan dokumen pribadi di repo atau halaman publik.
2. **Simpan versi sebelumnya** dengan mencadangkan sumber, lockfile dan aset yang akan diubah. Git sudah diinisialisasi untuk akses editor lokal. Riwayat commit dan remote baru tersedia setelah Anda menyiapkannya. Snapshot hasil build membantu pemulihan website.
3. **Ubah satu kelompok konten**: ikuti tabel lokasi data. Pakai draft untuk entri baru; lengkapi field wajib sebelum meminta pemeriksaan konten. Jangan mengubah flag publikasi/kontak/indexing hanya agar kartu atau CTA terlihat pada preview.
4. **Validasi dan preview**: jalankan check/test/build; preview produksi hanya menampilkan published. Untuk meninjau draft baru sebelum persetujuan, gunakan fixture di `src/dev` yang jelas berlabel DEMO; jangan mengimpor data tersebut ke koleksi publik. Preview bawaan hanya menampilkan fixture yang sudah dibuat, bukan seluruh draft secara otomatis.
5. **Periksa informasi dan tampilan**: alt/caption/jenis gambar, spesifikasi/harga/status, lokasi yang boleh dibagikan, ID/slug, tanggal, rujukan layanan/proyek, kondisi mobile, dan pesan WhatsApp. Koreksi konten pada sumber, bukan pada `dist/`.
6. **Setelah instruksi yang sesuai**: ubah publishStatus/aktivasi yang disetujui, jalankan pemeriksaan lagi, buat snapshot baru, lalu ikuti proses rilis. Perubahan file lokal tidak langsung mengubah situs live.
7. **Catat perubahan**: jenis perubahan, ID item, tanggal, sumber konfirmasi, pemeriksa, serta ID snapshot/deployment bila benar-benar dirilis. Jangan membuat tanggal/persetujuan atas nama pemilik.

## Menambah layanan, properti, atau proyek

| Tindakan | Cara yang benar |
| --- | --- |
| Melengkapi layanan awal | Edit berkas Markdown yang sudah ada di `src/content/services/`; pertahankan nama berkas sebagai ID. Lengkapi frontmatter/body sesuai schema. Jangan menambah kategori layanan baru tanpa menyesuaikan schema/label/ikon dan lingkup yang disepakati. |
| Menambah properti | Tambahkan satu objek nyata pada array `src/content/properties.json`, `publishStatus: "draft"`. Isi ID/slug unik, metadata/tanggal, deskripsi/wilayah/lokasi, tipe/status, luas, peran pemasaran, gambar berizin, serta field opsional yang memang diketahui. Jangan menyalin fixture DEMO. |
| Menambah proyek | Tambahkan objek nyata pada `src/content/projects.json` sebagai draft. Isi kategori/status, lingkup/body, lokasi publik, gambar dan caption, serta ID layanan terkait yang ada. Tahun boleh dihilangkan bila belum diketahui. |
| Menghubungkan konten | Gunakan ID yang ada pada koleksi tujuan, bukan label judul atau URL. Layanan mereferensikan proyek; proyek mereferensikan layanan. Target draft valid sebagai referensi internal tetapi tidak muncul sebagai konten terkait publik. |
| Menjadikan pilihan beranda | `featured: true` hanya berguna untuk properti/proyek yang sudah published; maksimal tiga ditampilkan. Mengisi featured pada draft tidak menerbitkannya. |

File JSON harus tetap array valid; tanda kutip ganda, koma antarobjek, angka sebagai angka. Jangan menambahkan komentar `//` pada JSON. Markdown layanan menggunakan frontmatter YAML di antara `---`; simpan field sederhana inline/daftar sesuai berkas awal. Teks body proyek/deskripsi properti adalah string; gunakan `\n\n` untuk paragraf.

Tidak disediakan listing produksi contoh dengan nilai buatan. Gunakan daftar field/schema sebagai formulir pengisian data nyata. Hilangkan field opsional yang belum diketahui; untuk field wajib, selesaikan data sebelum memasukkannya ke koleksi. `null` atau string kosong bukan pengganti angka wajib seperti luas tanah/bangunan.

## Mengubah status, harga, atau menarik konten

- **Harga berubah**: masukkan angka rupiah utuh yang disetujui dan perbarui `updatedAt`. Jika angka sebelumnya ditarik tanpa pengganti, hilangkan field harga, bukan mengisi nol. Kartu/detail akan memakai pesan informasi harga.
- **Properti dipesan/terjual**: ubah `availability` sesuai konfirmasi dan `updatedAt`. Pertahankan ID/slug untuk tautan lama. Status terjual meniadakan CTA survei; bila item tidak lagi dipilih untuk beranda, sesuaikan featured berdasarkan keputusan konten yang sebenarnya.
- **Menarik dari publik**: setelah instruksi penarikan, set `publishStatus: "draft"`, build ulang, dan rilis pembaruan yang disetujui. Detail menjadi 404; tidak ada mekanisme redirect otomatis. Periksa apakah penarikan memang memerlukan 404 atau nanti perlu redirect provider.
- **Mengganti slug**: ID tetap sama. URL lama tidak otomatis dialihkan. Catat URL lama/baru, perbaiki tautan yang dimiliki, dan siapkan redirect pada host setelah provider ditentukan. Untuk perubahan judul saja, pertahankan slug bila tidak perlu mengganti URL.
- **Menghapus entri**: periksa referensi dari semua entri termasuk draft. Penghapusan target tanpa mengubah referensi akan menggagalkan build. Pertahankan salinan sumber untuk pemulihan; jangan menghapus aset yang masih dipakai hero/entri lain.

Gunakan tanggal ISO dengan zona waktu. PowerShell `(Get-Date).ToString('o')` dapat membantu memperoleh waktu penyuntingan sebenarnya; pastikan zona waktu mesin benar. `updatedAt` tidak boleh sebelum `createdAt`. Jangan mengganti tanggal hanya untuk membuat item terlihat lebih baru bila informasinya tidak berubah.

## Persiapan dan pemeriksaan foto

1. Simpan foto asli pada arsip internal terpisah. Tentukan izin pemilik, lokasi yang boleh ditampilkan, serta apakah gambar merupakan foto nyata, visualisasi 3D, atau ilustrasi.
2. Periksa orientasi dan detail yang perlu terlihat. Untuk web, titik awal sisi panjang sekitar 1.600–2.400 px dapat dipakai sesuai subjek; ini panduan pengisian, bukan syarat mutu yang sudah diuji pada foto bisnis. Denah perlu menjaga tulisan/ukuran tetap terbaca dan boleh mempertahankan detail lebih tinggi.
3. Ekspor JPEG/WebP/AVIF sesuai isi gambar; hindari menaikkan resolusi foto kecil. Bersihkan metadata/lokasi yang tidak boleh dibagikan sebelum aset masuk repo. Jangan mengolah foto untuk menyembunyikan kondisi properti atau mengklaim pekerjaan yang berbeda.
4. Gunakan nama berkas huruf kecil dengan tanda hubung, tanpa data pribadi. Taruh versi web di `src/assets/photos/`; jangan menaruh dokumen pemilik di `public/`. Semua aset dalam situs statis berpotensi dapat diakses pengunjung walau tidak ditautkan.
5. Path cover layanan dari `src/content/services/*.md` menuju folder foto menggunakan `../../assets/photos/NAMA-FOTO-YANG-SUDAH-ADA.webp`; properti/proyek JSON dalam `src/content/` memakai `../assets/photos/NAMA-FOTO-YANG-SUDAH-ADA.webp`. Nama tersebut petunjuk path, bukan berkas contoh yang sudah disediakan. Cocokkan huruf besar/kecil agar build Linux juga menemukan aset.
6. Isi alt yang menjelaskan subjek, caption yang memberi konteks, kind yang benar, dan izin hanya setelah dikonfirmasi. Foto proyek terbit memerlukan caption per gambar. Logo resmi dipertahankan utuh; jangan membuat ulang logo atau memotong tagline agar muat.
7. Jalankan build dan lihat hasil optimasi Astro. Periksa pemotongan foto 4:3/3:2, visualisasi berlabel, modal resolusi penuh, denah portrait tanpa crop, serta fallback jika path salah. Astro memproses gambar lokal saat build; hosting statis menyajikan hasilnya tanpa server optimizer.
8. Audit ulang ukuran/performa setelah foto final dimasukkan. Anggaran beranda tetap ≤1,5 MB dan JS aplikasi gzip ≤50 KB; baseline ringan pada katalog kosong tidak menjamin nilai yang sama setelah foto/konten bertambah.

## Saat validasi gagal

| Pesan/gejala | Tindakan |
| --- | --- |
| JSON tidak valid | Periksa koma/kutip/array pada berkas yang disebut; jangan mengganti file dengan fixture. |
| ID/slug duplikat | Gunakan nilai unik, termasuk terhadap entri draft; jangan mengganti ID yang sudah direferensikan tanpa pembaruan rujukan. |
| Referensi tidak ditemukan | Periksa ID/nama berkas target dan entri yang menunjuknya. |
| Gambar/path tidak ditemukan | Periksa path relatif, ekstensi, case nama, serta keberadaan berkas lokal. Jangan mengonfirmasi izin untuk menutupi path salah. |
| Harga/izin/lingkup/tanggal invalid | Lengkapi informasi yang benar atau hilangkan field opsional; jangan menonaktifkan schema atau mengarang data untuk meloloskan build. |
| Halaman tidak ada saat preview produksi | Pastikan build terbaru, status published memang sudah diinstruksikan, dan slug benar. Route DEMO hanya pada dev; draft 404 merupakan perilaku yang disengaja. |
| Warning koleksi kosong | Dapat diterima bila data memang belum tersedia; tidak perlu membuat listing palsu. |
| `release:check` exit 1 | Baca daftar data/persetujuan yang masih kurang; tidak sama dengan error tipe/build. Snapshot review tetap dapat dibuat. |

Jika build gagal, jangan mengganti versi live dengan hasil parsial. Kembalikan sumber yang aman atau perbaiki penyebab, lalu ulangi pemeriksaan. Cara membuat snapshot, menyimpan versi, dan rollback ada di [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

Catatan teknis preview: pola `command` dan `injectRoute` mengikuti [Astro Integration API](https://docs.astro.build/en/reference/integrations-reference/).
