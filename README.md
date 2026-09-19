# E-Katalog UMKM Desa Pasiragung

<div align="center">
  <img src="src/assets/logo.svg" alt="Logo E-Katalog Pasiragung" width="180" />
  
  <p><strong>Platform e-katalog digital untuk produk UMKM Desa Pasiragung, Kecamatan Hantara, Kabupaten Kuningan, Jawa Barat.</strong></p>

  ![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.3-06B6D4?logo=tailwindcss&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-2.x-3FCF8E?logo=supabase&logoColor=white)
  ![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel&logoColor=white)
</div>

## :ledger: Index

- [E-Katalog UMKM Desa Pasiragung](#e-katalog-umkm-desa-pasiragung)
  - [:ledger: Index](#ledger-index)
  - [:beginner: About](#beginner-about)
  - [:zap: Usage](#zap-usage)
    - [:electric\_plug: Installation](#electric_plug-installation)
    - [:package: Commands](#package-commands)
  - [:wrench: Development](#wrench-development)
    - [:notebook: Pre-Requisites](#notebook-pre-requisites)
    - [:nut\_and\_bolt: Development Environment](#nut_and_bolt-development-environment)
    - [:file\_folder: File Structure](#file_folder-file-structure)
    - [:hammer: Build](#hammer-build)
    - [:rocket: Deployment](#rocket-deployment)
  - [:cherry\_blossom: Community](#cherry_blossom-community)
    - [:fire: Contribution](#fire-contribution)
    - [:cactus: Branches](#cactus-branches)
    - [:exclamation: Guideline](#exclamation-guideline)
  - [:question: FAQ](#question-faq)
  - [:page\_facing\_up: Resources](#page_facing_up-resources)
  - [:camera: Gallery](#camera-gallery)
  - [:star2: Credit/Acknowledgment](#star2-creditacknowledgment)
  - [:lock: License](#lock-license)

## :beginner: About

**E-Katalog UMKM Desa Pasiragung** adalah platform web berbasis React yang berfungsi sebagai jembatan digital antara para pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) di Desa Pasiragung dengan pasar yang lebih luas. Program ini diprakarsai oleh Pemerintah Desa Pasiragung bersama tim Kuliah Kerja Mahasiswa (KKM).

### Fitur Utama

**🌐 Halaman Publik (Pengunjung)**
- **Landing Page** — Hero section, tentang desa, daftar pemilik usaha, katalog produk, dan peta lokasi
- **Katalog Produk** — Grid produk dengan filter kategori, pencarian, dan pagination
- **Detail Produk** — Informasi lengkap: harga, stok, varian rasa, komposisi, NIB, sertifikat halal
- **Profil Pemilik Usaha** — Halaman profil pemilik beserta semua produknya
- **Integrasi WhatsApp** — Tombol hubungi penjual dengan template pesan otomatis
- **Peta Lokasi** — Google Maps embed lokasi Desa Pasiragung

**🔐 Panel Admin**
- **Dashboard** — Statistik ringkasan (total produk, kategori, pemilik usaha, admin)
- **CRUD Produk** — Tambah, edit, hapus produk dengan upload gambar, varian rasa & komposisi
- **CRUD Kategori** — Manajemen kategori produk
- **CRUD Pemilik Usaha** — Manajemen data pemilik usaha UMKM
- **Manajemen Pengguna** — *(Super Admin only)* Approve/reject admin baru, reset password, hapus user
- **Export Data** — Export ke Excel (.xlsx), CSV, dan PDF di setiap halaman admin
- **Bulk Actions** — Seleksi dan hapus massal data
- **Approval-based Registration** — Admin baru harus disetujui oleh Super Admin

## :zap: Usage

Aplikasi ini memiliki dua sisi utama:

1. **Sisi Publik** — Dapat diakses oleh siapa saja untuk menelusuri katalog produk UMKM Desa Pasiragung, melihat detail produk, dan menghubungi penjual via WhatsApp.
2. **Sisi Admin** — Diakses melalui `/login` untuk mengelola data produk, kategori, pemilik usaha, dan (untuk super admin) manajemen pengguna.

### :electric_plug: Installation

1. **Clone repository:**

```bash
git clone https://github.com/bajiff/e-katalog-pasiragung.git
cd e-katalog-pasiragung
```

2. **Install dependencies:**

```bash
npm install
```

3. **Konfigurasi environment variables:**

Buat file `.env` di root project berdasarkan template `.env.example`:

```bash
cp .env.example .env
```

Isi dengan kredensial Supabase Anda:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. **Jalankan development server:**

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### :package: Commands

| Perintah | Deskripsi |
|----------|-----------|
| `npm run dev` | Menjalankan development server (Vite) |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview hasil build production |
| `npm run lint` | Menjalankan ESLint untuk pengecekan kode |

## :wrench: Development

### :notebook: Pre-Requisites

Pastikan sistem Anda telah terinstal:

- [Node.js](https://nodejs.org/) (v18 atau lebih baru)
- [npm](https://www.npmjs.com/) (biasanya sudah termasuk dengan Node.js)
- [Git](https://git-scm.com/)
- Akun [Supabase](https://supabase.com/) (untuk backend services)
- (Opsional) [Supabase CLI](https://supabase.com/docs/reference/cli) — untuk deploy Edge Functions

### :nut_and_bolt: Development Environment

1. **Clone dan install** — Ikuti langkah-langkah pada bagian [Installation](#electric_plug-installation)
2. **Setup Supabase Project:**
   - Buat project baru di [Supabase Dashboard](https://app.supabase.com/)
   - Buat tabel-tabel yang diperlukan: `products`, `categories`, `owners`, `profiles`
   - Buat storage bucket: `product-images` dan `owner-images` (set ke public)
   - Deploy Edge Function `manage-user` menggunakan Supabase CLI
3. **Konfigurasi environment variables** di file `.env`
4. **Jalankan `npm run dev`** untuk memulai development

### :file_folder: File Structure

```bash
.
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── logo_palasa.ico
├── src/
│   ├── assets/
│   │   ├── hero-1.webp
│   │   ├── hero-2.webp
│   │   ├── logo.svg
│   │   └── logo_palasa.ico
│   ├── components/
│   │   ├── home/
│   │   │   ├── AboutSection.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── MapSection.jsx
│   │   │   ├── OwnersSection.jsx
│   │   │   ├── ProductsSection.jsx
│   │   │   └── index.js
│   │   ├── layout/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PublicLayout.jsx
│   │   │   └── index.js
│   │   ├── shared/
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── ExportMenu.jsx
│   │   │   ├── ImageUpload.jsx
│   │   │   ├── LoadingOverlay.jsx
│   │   │   ├── MapEmbed.jsx
│   │   │   ├── OwnerCard.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── SearchInput.jsx
│   │   │   ├── SectionHeading.jsx
│   │   │   ├── TagsInput.jsx
│   │   │   └── index.js
│   │   └── table/
│   │       ├── BulkActionBar.jsx
│   │       ├── DataTable.jsx
│   │       ├── PageSizeSelect.jsx
│   │       ├── Pagination.jsx
│   │       ├── SelectAllCheckbox.jsx
│   │       ├── SortDropdown.jsx
│   │       ├── TableToolbar.jsx
│   │       └── index.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useTableQuery.js
│   ├── lib/
│   │   ├── index.js
│   │   ├── storage.js
│   │   └── supabase.js
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── CategoriesPage.jsx
│   │   │   ├── ChangePassword.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── OwnersPage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── UsersPage.jsx
│   │   │   └── index.js
│   │   ├── public/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── OwnerProfile.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Register.jsx
│   │   │   └── index.js
│   │   └── index.js
│   ├── routes/
│   │   ├── ProtectedRoute.jsx
│   │   ├── SuperAdminRoute.jsx
│   │   └── index.js
│   ├── utils/
│   │   └── exportUtils.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── supabase/
│   └── functions/
│       └── manage-user/
│           └── index.ts
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

| No | File / Folder | Deskripsi |
|----|---------------|-----------|
| 1 | `src/main.jsx` | Entry point aplikasi React |
| 2 | `src/App.jsx` | Root component dengan konfigurasi routing |
| 3 | `src/context/AuthContext.jsx` | Provider autentikasi (sign up, sign in, sign out, profil user) |
| 4 | `src/hooks/useTableQuery.js` | Custom hook untuk query data tabel (search, sort, pagination) |
| 5 | `src/lib/supabase.js` | Inisialisasi Supabase client |
| 6 | `src/lib/storage.js` | Utilitas upload & hapus gambar ke Supabase Storage |
| 7 | `src/utils/exportUtils.js` | Utilitas export data ke Excel, CSV, dan PDF |
| 8 | `src/routes/ProtectedRoute.jsx` | Guard route: login + status approved |
| 9 | `src/routes/SuperAdminRoute.jsx` | Guard route: khusus role super_admin |
| 10 | `supabase/functions/manage-user/index.ts` | Supabase Edge Function untuk manajemen user (approve, reject, delete) |

### :hammer: Build

Untuk membuat production build:

```bash
npm run build
```

Hasil build akan berada di folder `dist/`. Untuk preview:

```bash
npm run preview
```

### :rocket: Deployment

Aplikasi ini di-deploy menggunakan **Vercel**:

1. **Hubungkan repository** GitHub ke Vercel
2. **Set environment variables** di Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Build command**: `npm run build`
4. **Output directory**: `dist`
5. Vercel akan otomatis handle SPA routing berkat konfigurasi `vercel.json`

**Supabase Edge Functions** di-deploy terpisah menggunakan Supabase CLI:

```bash
supabase functions deploy manage-user
```

## :cherry_blossom: Community

### :fire: Contribution

Kontribusi Anda sangat diterima dan dihargai. Berikut cara Anda dapat berkontribusi:

1. **Laporkan Bug** <br>
   Jika Anda menemukan bug, silakan laporkan melalui [Issues](https://github.com/bajiff/e-katalog-pasiragung/issues) dan kami akan segera menanganinya.

2. **Request Fitur** <br>
   Anda juga dapat mengajukan permintaan fitur baru [di sini](https://github.com/bajiff/e-katalog-pasiragung/issues). Jika memungkinkan, fitur tersebut akan dimasukkan ke dalam pengembangan.

3. **Buat Pull Request** <br>
   Pull request Anda akan sangat dihargai oleh komunitas. Anda bisa memulai dengan mengambil issue yang terbuka [di sini](https://github.com/bajiff/e-katalog-pasiragung/issues) dan membuat pull request.

> Jika Anda baru mengenal open-source, pastikan untuk membaca lebih lanjut [di sini](https://www.digitalocean.com/community/tutorial_series/an-introduction-to-open-source) dan pelajari cara membuat pull request [di sini](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github).

### :cactus: Branches

1. **`main`** adalah branch production.

**Langkah bekerja dengan feature branch:**

1. Buat branch baru dengan prefix `feat` diikuti nama fitur (contoh: `feat-filter-produk`)
2. Setelah selesai, buat Pull Request ke branch `main`

**Langkah membuat Pull Request:**

1. Buat PR ke branch `main`
2. Pastikan mengikuti best practices dan guidelines
3. PR harus mendapat review positif sebelum di-merge

### :exclamation: Guideline

- Gunakan bahasa Indonesia untuk penamaan variabel dan komentar yang terkait domain bisnis
- Ikuti pattern komponen yang sudah ada (shared components, barrel exports via `index.js`)
- Pastikan setiap halaman admin memiliki fitur search, sort, pagination, dan export
- Gunakan `ConfirmModal` untuk setiap aksi destruktif (hapus, update, dll)
- Gunakan Tailwind CSS utility classes sesuai design token di `tailwind.config.js`
- Validasi file upload: hanya JPG, PNG, WEBP dengan ukuran maksimal 2MB

## :question: FAQ

**Q: Bagaimana cara mendaftar sebagai admin?**
> Buka halaman `/register`, isi form registrasi, lalu tunggu persetujuan dari Super Admin.

**Q: Apa perbedaan role admin dan super_admin?**
> `admin` dapat mengelola data produk, kategori, dan pemilik usaha. `super_admin` memiliki semua akses admin ditambah kemampuan untuk menyetujui/menolak pendaftaran admin baru dan mengelola pengguna.

**Q: Bagaimana cara setup Supabase untuk project ini?**
> Buat project di Supabase Dashboard, buat tabel `products`, `categories`, `owners`, `profiles` sesuai schema yang digunakan, buat storage bucket `product-images` dan `owner-images`, lalu isi environment variables.

**Q: Bagaimana pengunjung memesan produk?**
> Pengunjung dapat klik tombol "Hubungi Penjual" di halaman detail produk yang akan mengarahkan ke WhatsApp pemilik usaha dengan template pesan pemesanan otomatis.

## :page_facing_up: Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com/)
- [Lucide Icons](https://lucide.dev/)
- [jsPDF Documentation](https://artskydj.github.io/jsPDF/docs/)
- [SheetJS (xlsx) Documentation](https://docs.sheetjs.com/)
- [Vercel Documentation](https://vercel.com/docs)

## :camera: Gallery

### Teknologi yang Digunakan

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" /><br/>React</td>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" width="40" /><br/>Vite</td>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="40" /><br/>Tailwind</td>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" width="40" /><br/>Supabase</td>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg" width="40" /><br/>Vercel</td>
    </tr>
  </table>
</div>

## :star2: Credit/Acknowledgment

- **Pemerintah Desa Pasiragung** — Inisiator program e-katalog UMKM desa
- **Tim Kuliah Kerja Mahasiswa (KKM)** — Pengembangan dan implementasi platform
- **bajiff** — Developer utama ([GitHub](https://github.com/bajiff))
- **Pelaku UMKM Desa Pasiragung** — Penyedia produk dan data

## :lock: License

Proyek ini dikembangkan untuk kepentingan pemberdayaan UMKM Desa Pasiragung.

---

<div align="center">
  <sub>Built with ❤️ for Desa Pasiragung, Kec. Hantara, Kab. Kuningan, Jawa Barat</sub>
</div>
