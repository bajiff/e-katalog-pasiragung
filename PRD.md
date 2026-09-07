# Product Requirements Document (PRD)
## E-Katalog Produk UMKM Desa Pasiragung

| | |
|---|---|
| **Nama Project** | E-Katalog UMKM Pasiragung |
| **Jenis** | Individual Project Based Learning (PjBL) — Program Kerja KKM |
| **Versi Dokumen** | 1.0 |
| **Status** | Draft awal |

---

## 1. Latar Belakang

Desa Pasiragung memiliki sejumlah pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) yang memproduksi berbagai produk (makanan, kerajinan, dan lainnya), namun produk-produk tersebut belum memiliki media promosi digital yang terpusat. Informasi produk masih tersebar secara offline atau melalui komunikasi personal (mulut ke mulut, grup WhatsApp pribadi), sehingga jangkauan pasar UMKM desa terbatas hanya pada lingkup lokal.

Sebagai bagian dari Program Kerja (Proker) individu KKM, dibutuhkan sebuah platform katalog digital yang memungkinkan produk-produk UMKM desa dapat diakses secara publik melalui internet, dengan pengelolaan data yang mudah dilakukan oleh perangkat desa maupun pengelola BUMDes tanpa memerlukan keahlian teknis pemrograman.

## 2. Tujuan Produk

1. Mendigitalisasi katalog produk UMKM Desa Pasiragung agar dapat diakses publik secara luas, tanpa dibatasi wilayah geografis.
2. Menyediakan sarana kontak langsung antara calon pembeli dengan pelaku usaha melalui WhatsApp.
3. Memberikan sistem pengelolaan data (CRUD) yang sederhana bagi admin desa/BUMDes untuk memperbarui data produk, kategori, dan profil pelaku usaha.
4. Menghasilkan produk digital yang dapat diserahterimakan (*handover*) kepada perangkat desa untuk dikelola secara mandiri setelah masa KKM berakhir.
5. Menjadi bagian dari portofolio teknis pengembang.

## 3. Target Pengguna

| Peran | Deskripsi |
|---|---|
| **Pengunjung Publik (Guest)** | Masyarakat umum/calon pembeli yang mencari dan melihat produk UMKM desa, tanpa perlu login. |
| **Admin** | Pengelola operasional katalog (kemungkinan perangkat desa atau pengurus BUMDes) yang bertugas menginput dan memperbarui data produk, kategori, dan pemilik usaha. |
| **Super Admin** | Pemegang kendali tertinggi sistem, bertanggung jawab menyetujui/menolak pendaftaran Admin baru dan mengelola akses pengguna. |

## 4. Lingkup Produk (Scope)

### 4.1 Termasuk dalam Lingkup (In-Scope)
- Katalog produk publik dengan pencarian dan filter kategori
- Halaman detail produk dan profil pemilik usaha
- Kontak pembelian melalui link WhatsApp (`wa.me`)
- Autentikasi admin (register, login, logout)
- Alur approval admin oleh Super Admin (tanpa verifikasi email/OTP)
- CRUD Produk, Kategori, dan Pemilik Usaha (Owner) oleh Admin/Super Admin
- Manajemen pengguna (approve, reject, hapus, edit) khusus Super Admin
- Upload gambar produk dan logo/foto pemilik usaha
- Ekspor data (Excel, CSV, PDF) untuk Produk, Kategori, Pemilik, dan Pengguna

### 4.2 Di Luar Lingkup (Out-of-Scope)
- Transaksi pembayaran online (checkout, payment gateway) — pembelian hanya diarahkan ke kontak WhatsApp
- Verifikasi email / OTP saat registrasi maupun approval admin
- Sistem ulasan/rating produk oleh pembeli
- Aplikasi mobile native (hanya web, responsive)
- Multi-bahasa (hanya Bahasa Indonesia)

## 5. Peran & Hak Akses (Role Matrix)

| Fitur | Publik | Admin (Approved) | Super Admin |
|---|:---:|:---:|:---:|
| Lihat katalog & detail produk | ✅ | ✅ | ✅ |
| Kontak via WhatsApp | ✅ | ✅ | ✅ |
| Registrasi akun admin | ✅ | — | — |
| CRUD Produk | ❌ | ✅ | ✅ |
| CRUD Kategori | ❌ | ✅ | ✅ |
| CRUD Pemilik Usaha | ❌ | ✅ | ✅ |
| Ekspor data (Produk/Kategori/Owner) | ❌ | ✅ | ✅ |
| Kelola profil sendiri | ❌ | ✅ | ✅ |
| Lihat & kelola daftar pengguna | ❌ | ❌ | ✅ |
| Approve / Reject admin baru | ❌ | ❌ | ✅ |
| Reset password admin lain | ❌ | ❌ | ✅ |
| Hapus akun pengguna lain | ❌ | ❌ | ✅ (kecuali diri sendiri & sesama super_admin) |
| Ekspor data pengguna | ❌ | ❌ | ✅ |

Catatan: Detail lengkap Do's & Don'ts serta proteksi integritas data ada di dokumen turunan SRS.

## 6. Alur Pengguna Utama (User Flow)

### 6.1 Alur Pengunjung Publik
1. Membuka halaman utama → melihat daftar produk (dengan filter kategori & pencarian)
2. Klik salah satu produk → melihat detail produk & produk terkait
3. Klik tombol WhatsApp → diarahkan ke `wa.me` dengan pesan otomatis berisi nama produk

### 6.2 Alur Registrasi & Approval Admin
1. Calon admin mengisi form registrasi (nama, email, password)
2. Akun tersimpan dengan status `pending`
3. Super Admin meninjau daftar pengguna berstatus `pending`
4. Super Admin melakukan **Approve** atau **Reject**
5. Jika disetujui, admin dapat langsung login — **tanpa proses verifikasi tambahan**

### 6.3 Alur Pengelolaan Data oleh Admin
1. Login → diarahkan ke dashboard produk
2. Melengkapi data master terlebih dahulu: Pemilik Usaha → Kategori
3. Input data Produk (memilih pemilik & kategori yang sudah tersedia)
4. Upload gambar produk (divalidasi ukuran & format)
5. Data langsung tampil di katalog publik

## 7. Kebutuhan Fungsional (Functional Requirements)

| ID | Kebutuhan |
|---|---|
| FR-01 | Sistem dapat menampilkan katalog produk publik dengan paginasi, pencarian, dan filter kategori |
| FR-02 | Sistem dapat menampilkan halaman detail produk beserta produk terkait |
| FR-03 | Sistem dapat menampilkan profil pemilik usaha beserta seluruh produknya |
| FR-04 | Sistem menyediakan registrasi dan login admin |
| FR-05 | Sistem menyimpan admin baru dengan status default `pending` |
| FR-06 | Super Admin dapat menyetujui/menolak pendaftaran admin |
| FR-07 | Admin (approved) dapat melakukan CRUD Produk, Kategori, dan Pemilik Usaha |
| FR-08 | Sistem mencegah penghapusan Kategori/Pemilik Usaha yang masih memiliki produk terkait |
| FR-09 | Super Admin dapat mengelola seluruh data pengguna (edit, approve, reject, reset password, hapus) |
| FR-10 | Sistem mencegah Super Admin menghapus akunnya sendiri atau sesama Super Admin |
| FR-11 | Sistem dapat mengekspor data (Produk, Kategori, Pemilik, Pengguna) ke format Excel/CSV/PDF |
| FR-12 | Sistem memvalidasi format khusus pada field NIB (13 digit), Sertifikat Halal (17 digit), dan Nomor WhatsApp |
| FR-13 | Sistem menyediakan pengaturan profil mandiri (nama, avatar, password) untuk Admin dan Super Admin |

## 8. Kebutuhan Non-Fungsional (Non-Functional Requirements)

| ID | Kebutuhan |
|---|---|
| NFR-01 | Aplikasi harus dapat diakses dari perangkat mobile maupun desktop (responsive) |
| NFR-02 | Proses deployment harus menggunakan platform gratis dan mudah dikonfigurasi |
| NFR-03 | Penyimpanan gambar harus stabil dan tidak bergantung pada filesystem server (menghindari isu symlink seperti pengalaman sebelumnya) |
| NFR-04 | Keamanan data diatur melalui Row Level Security di level database, bukan hanya validasi di sisi frontend |
| NFR-05 | Sistem harus tetap dapat digunakan oleh perangkat desa tanpa keahlian teknis pemrograman setelah handover |

## 9. Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | ReactJS + Vite + TailwindCSS |
| Backend/Database | Supabase (PostgreSQL, Supabase Auth, Storage, Row Level Security) |
| Hosting Frontend | Vercel (gratis) |
| Hosting Backend | Tidak ada server terpisah — ditangani sepenuhnya oleh Supabase |

## 10. Riwayat Keputusan Teknis (Ringkas)

Project ini telah melalui beberapa iterasi pemilihan stack sebelum ditetapkan menjadi React + Supabase:

1. **Percobaan 1:** React (FE) + Express.js (BE) + PostgreSQL + Prisma, deploy FE ke Vercel dan BE ke Railway — gagal karena error deployment BE yang tidak teridentifikasi.
2. **Percobaan 2:** Migrasi ke Laravel, deploy ke InfinityFree — gagal karena gambar produk tidak dapat diakses (diduga akibat pembatasan symbolic link pada hosting gratis tersebut).
3. **Stack Final:** React + Vite + TailwindCSS dengan Supabase sebagai backend — dipilih karena menghilangkan kebutuhan server backend custom dan menggunakan object storage terkelola untuk gambar.

## 11. Metodologi Pengembangan

Project dikembangkan menggunakan pendekatan **Agile/Scrum**, mencakup tiga pilar utama:
- **Scrum Roles** — Product Owner, Developer (dirangkap individu dalam konteks PjBL)
- **Scrum Artifacts** — Product Backlog, Sprint Backlog
- **Scrum Events** — Sprint Planning, Daily check-in mandiri, Sprint Review, Sprint Retrospective

Detail lebih lanjut mengenai pembagian sprint dan backlog akan disusun dalam dokumen SDLC terpisah.

## 12. Kriteria Keberhasilan (Success Metrics)

1. Seluruh fitur CRUD (Produk, Kategori, Owner, User Management) berfungsi sesuai role matrix pada Bagian 5
2. Aplikasi berhasil di-deploy dan dapat diakses publik tanpa error
3. Gambar produk dapat diunggah dan tampil dengan benar di lingkungan production
4. Dokumen serah terima (handover) dan panduan penggunaan dashboard admin selesai disusun untuk perangkat desa
5. Project dapat ditampilkan sebagai bagian dari portofolio teknis

## 13. Dokumen Terkait (Referensi Turunan)

- **SRS (System Requirements Specification)** — spesifikasi teknis detail: skema database, validasi field, business rules integritas data *(disusun berdasarkan dokumen blueprint migrasi yang sudah ada)*
- **SDLC / Sprint Planning** — pembagian tahapan kerja berbasis Scrum
- **schema.sql** — implementasi skema database dan Row Level Security di Supabase *(sudah selesai disusun)*

---

*Dokumen ini adalah versi awal (Tahap 0) dan akan diperbarui seiring perkembangan pengerjaan project.*