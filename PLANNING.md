# Planning Teknis — Setup & Deployment
## E-Katalog UMKM Pasiragung (React + Vite + Tailwind + Supabase + Vercel)

Dokumen ini adalah panduan langkah demi langkah dari instalasi project kosong sampai aplikasi bisa diakses publik. Ikuti urutan ini — setiap tahap bergantung pada tahap sebelumnya.

---

## TAHAP 1 — Instalasi Project React (Vite)

### 1.1 Prasyarat
Pastikan sudah terpasang di komputer:
- **Node.js** versi 18 ke atas (cek dengan `node -v`)
- **npm** (otomatis ikut terpasang bersama Node.js, cek dengan `npm -v`)
- **Git** (cek dengan `git -v`)
- Akun **GitHub**, **Supabase**, dan **Vercel** (semua gratis, bisa daftar pakai akun GitHub yang sama)

### 1.2 Membuat project baru
```bash
npm create vite@latest e-katalog-pasiragung -- --template react
cd e-katalog-pasiragung
npm install
```
Pilihan `react` (bukan `react-ts`) dipakai kecuali Anda memang ingin TypeScript. Kalau ingin TypeScript, ganti template jadi `react-ts` — seluruh langkah berikutnya tetap sama, hanya ekstensi file `.jsx` menjadi `.tsx`.

### 1.3 Jalankan dulu untuk memastikan project kosong berjalan
```bash
npm run dev
```
Buka `http://localhost:5173` — kalau muncul halaman default Vite+React, berarti instalasi dasar berhasil. Matikan dulu (`Ctrl+C`) sebelum lanjut ke tahap berikutnya.

### 1.4 Inisialisasi Git & hubungkan ke GitHub
```bash
git init
git add .
git commit -m "chore: initial vite react setup"
```
Buat repository baru bernama `e-katalog-pasiragung` di GitHub (jangan centang "Add README", karena sudah ada file lokal), lalu:
```bash
git remote add origin https://github.com/USERNAME/e-katalog-pasiragung.git
git branch -M main
git push -u origin main
```

---

## TAHAP 2 — Instalasi & Konfigurasi TailwindCSS

### 2.1 Install dependency
Untuk Vite versi terbaru, Tailwind v4 pakai plugin khusus Vite (lebih simpel dari versi lama):
```bash
npm install tailwindcss @tailwindcss/vite
```

### 2.2 Daftarkan plugin di Vite config
Edit `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### 2.3 Import Tailwind di CSS utama
Buka `src/index.css`, hapus isinya, ganti dengan:
```css
@import "tailwindcss";
```

### 2.4 Tes Tailwind berjalan
Di `src/App.jsx`, ganti sementara isinya jadi:
```jsx
function App() {
  return <h1 className="text-3xl font-bold text-blue-600">Tailwind aktif</h1>
}
export default App
```
Jalankan `npm run dev` lagi — kalau teksnya tampil besar, tebal, dan biru, berarti Tailwind sudah terpasang dengan benar.

---

## TAHAP 3 — Setup Project Supabase

### 3.1 Buat project di dashboard Supabase
1. Masuk ke [supabase.com](https://supabase.com), login pakai GitHub
2. Klik **New Project**
3. Isi nama project (misal `e-katalog-pasiragung`), buat password database (simpan baik-baik, ini bukan password login aplikasi, tapi password akses langsung ke PostgreSQL)
4. Pilih region terdekat (Singapore biasanya paling dekat untuk Indonesia)
5. Tunggu beberapa menit sampai project selesai di-provision

### 3.2 Jalankan schema.sql yang sudah dibuat
1. Di dashboard project, buka menu **SQL Editor**
2. Klik **New query**
3. Paste seluruh isi file `schema.sql` yang sudah kita buat sebelumnya
4. Klik **Run** — pastikan tidak ada error di panel hasil eksekusi

### 3.3 Ambil kredensial API
1. Buka menu **Settings > API**
2. Catat dua nilai ini:
   - **Project URL** (format: `https://xxxxx.supabase.co`)
   - **anon / public key** (string panjang, ini aman ditaruh di frontend karena aksesnya dibatasi RLS)

### 3.4 Buat Super Admin pertama
1. Jalankan aplikasi (nanti setelah Tahap 5), atau gunakan dashboard **Authentication > Add User** untuk membuat 1 akun manual
2. Setelah akun dibuat, kembali ke **SQL Editor**, jalankan:
```sql
update public.profiles
set role = 'super_admin', status = 'approved'
where id = 'UUID_USER_TERSEBUT';
```
UUID bisa dilihat di menu **Authentication > Users**.

---

## TAHAP 4 — Environment Variables

### 4.1 Buat file `.env` di root project
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=isi_dengan_anon_key_anda
```
Prefix `VITE_` **wajib** — Vite hanya mengekspos environment variable ke kode frontend jika diawali `VITE_`.

### 4.2 Tambahkan ke `.gitignore`
Pastikan baris ini ada di `.gitignore` (biasanya sudah otomatis ada dari template Vite):
```
.env
```
Ini mencegah kredensial ter-push ke GitHub secara tidak sengaja — meskipun anon key aman untuk publik, tetap sebaiknya dikelola lewat environment variable per environment (local vs production).

### 4.3 Buat file `.env.example` (opsional tapi direkomendasikan)
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```
Ini yang di-push ke GitHub sebagai referensi, tanpa isi kredensial asli.

---

## TAHAP 5 — Integrasi Supabase Client di React

### 5.1 Install SDK
```bash
npm install @supabase/supabase-js
```

### 5.2 Buat file client
Buat `src/lib/supabase.js`:
```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 5.3 Buat Auth Context
Buat `src/context/AuthContext.jsx` — ini pusat pengelolaan status login dan profil user di seluruh aplikasi:
```jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signUp = (email, password, name) =>
    supabase.auth.signUp({ email, password, options: { data: { name } } })

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

### 5.4 Bungkus aplikasi dengan Provider
Edit `src/main.jsx`:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
```

### 5.5 Tes koneksi
Sementara di `App.jsx`, coba query sederhana untuk memastikan koneksi ke Supabase berhasil:
```jsx
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data, error }) => {
      if (error) console.error(error)
      else setCategories(data)
    })
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Test koneksi Supabase</h1>
      <p>Jumlah kategori: {categories.length}</p>
    </div>
  )
}
export default App
```
Kalau tidak muncul error di console dan angka jumlah kategori tampil (0 jika belum ada data, tapi bukan error), berarti koneksi berhasil.

---

## TAHAP 6 — Routing

### 6.1 Install React Router
```bash
npm install react-router-dom
```

### 6.2 Struktur folder yang disarankan
```
src/
├── components/       # komponen reusable (Navbar, Card, Modal, dll)
├── context/          # AuthContext, dll
├── lib/              # supabase.js
├── pages/
│   ├── public/       # Home, ProductDetail, OwnerProfile, Login, Register
│   └── admin/        # Dashboard, Products, Categories, Owners, Users, Profile
├── routes/           # ProtectedRoute.jsx, AdminRoute.jsx
├── App.jsx
└── main.jsx
```

### 6.3 Buat komponen proteksi route
`src/routes/ProtectedRoute.jsx` — untuk halaman yang butuh login (admin approved):
```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }) {
  const { user, profile, loading } = useAuth()
  if (loading) return <p>Loading...</p>
  if (!user || profile?.status !== 'approved') return <Navigate to="/login" replace />
  return children
}
```

`src/routes/SuperAdminRoute.jsx` — khusus halaman manajemen pengguna:
```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function SuperAdminRoute({ children }) {
  const { profile, loading } = useAuth()
  if (loading) return <p>Loading...</p>
  if (profile?.role !== 'super_admin') return <Navigate to="/admin/products" replace />
  return children
}
```

### 6.4 Susun routing di `App.jsx`
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import semua halaman & komponen proteksi

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Publik */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/owner/:id" element={<OwnerProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin & Super Admin */}
        <Route path="/admin/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
        <Route path="/admin/owners" element={<ProtectedRoute><OwnersPage /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Khusus Super Admin */}
        <Route path="/admin/users" element={<SuperAdminRoute><UsersPage /></SuperAdminRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
```

---

## TAHAP 7 — Fitur Upload Gambar ke Supabase Storage

Contoh fungsi upload yang dipakai di form Produk/Owner:
```js
async function uploadImage(file, bucket) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${fileExt}`

  const { error } = await supabase.storage.from(bucket).upload(fileName, file)
  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
  return data.publicUrl
}

// Pemakaian:
// const imageUrl = await uploadImage(file, 'product-images')
// lalu simpan imageUrl ke kolom image_path saat insert/update produk
```
Validasi ukuran (maks 2MB) dan tipe file (`jpeg`, `png`, `jpg`, `webp`) sebaiknya dicek di sisi form sebelum memanggil fungsi ini, agar user langsung dapat feedback tanpa menunggu proses upload gagal.

---

## TAHAP 8 — Build & Testing Lokal Sebelum Deploy

### 8.1 Jalankan production build secara lokal
```bash
npm run build
npm run preview
```
`build` mengecek apakah ada error saat kompilasi production (kadang beda dengan mode development). `preview` menjalankan hasil build tersebut secara lokal di `http://localhost:4173` untuk dites.

### 8.2 Checklist sebelum deploy
- [ ] Semua halaman publik bisa diakses tanpa login
- [ ] Register → status pending → tidak bisa login sebelum di-approve
- [ ] Super Admin bisa approve/reject dari dashboard
- [ ] CRUD Produk/Kategori/Owner berjalan dan tersimpan di Supabase
- [ ] Upload gambar berhasil dan URL tersimpan benar
- [ ] Kategori/Owner yang punya produk tidak bisa dihapus (RLS + FK bekerja)
- [ ] Tidak ada kredensial Supabase yang ter-hardcode (semua lewat `.env`)

---

## TAHAP 9 — Deploy ke Vercel

### 9.1 Push kode terbaru ke GitHub
```bash
git add .
git commit -m "feat: initial working version"
git push
```

### 9.2 Import project ke Vercel
1. Masuk ke [vercel.com](https://vercel.com), login pakai GitHub
2. Klik **Add New > Project**
3. Pilih repository `e-katalog-pasiragung`
4. Vercel otomatis mendeteksi framework Vite — biarkan default:
   - **Build Command:** `npm run build` atau `vite build`
   - **Output Directory:** `dist`

### 9.3 Set Environment Variables di Vercel
Sebelum klik Deploy, buka bagian **Environment Variables**, tambahkan:
| Key | Value |
|---|---|
| `VITE_SUPABASE_URL` | isi dari Supabase Settings > API |
| `VITE_SUPABASE_ANON_KEY` | isi dari Supabase Settings > API |

Ini wajib — tanpa ini, aplikasi di production tidak akan bisa konek ke Supabase meskipun kode di GitHub sudah benar, karena file `.env` lokal sengaja tidak ikut ter-push.

### 9.4 Klik Deploy
Tunggu proses build selesai (biasanya 1-3 menit). Setelah selesai, Vercel memberi URL publik (format `nama-project.vercel.app`).

### 9.5 Auto-deploy untuk perubahan selanjutnya
Setiap kali Anda `git push` ke branch `main`, Vercel otomatis build ulang dan deploy versi terbaru tanpa perlu langkah manual apa pun.

---

## TAHAP 10 — Verifikasi Akhir di Production

1. Buka URL production, ulangi checklist di Tahap 8.2 langsung di lingkungan production (bukan hanya localhost)
2. Cek khusus: apakah gambar yang diupload dari production bisa tampil (ini titik yang dulu gagal di InfinityFree — pastikan tidak terulang di sini)
3. Cek RLS: coba akses langsung endpoint Supabase tanpa login (misal lewat Postman) untuk memastikan publik tidak bisa insert/update/delete data
4. Jika semua aman, project siap untuk tahap dokumentasi handover ke perangkat desa

---

## Catatan Tambahan

- **Domain custom** (jika desa punya domain sendiri, misal `pasiragung.id`) bisa dihubungkan nanti lewat menu **Settings > Domains** di Vercel — tidak menghambat proses deploy awal, bisa ditambahkan kapan saja.
- **Supabase free tier auto-pause** setelah 7 hari tanpa aktivitas — pastikan ada yang mengakses dashboard admin secara berkala, atau siapkan reminder untuk membuka project Supabase minimal seminggu sekali selama masa observasi awal.
- Urutan pengerjaan fitur CRUD disarankan mengikuti dependency data: **Owner → Kategori → Produk**, karena form Produk membutuhkan data dari dua tabel tersebut sudah tersedia lebih dulu.