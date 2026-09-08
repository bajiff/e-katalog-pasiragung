# Planning Homepage
## E-Katalog UMKM Pasiragung — Struktur, Komponen, & Responsive

Mengacu ke design token yang sudah ditetapkan di `Planning-Halaman-DesignSystem.md` (warna, `font-display`/`font-body` Space Grotesk, radius, breakpoints `xs:375px sm:768px md:1025px lg:1280px xl:1536px`).

---

## 1. Struktur Section (Urutan dari Atas ke Bawah)

```
<PublicLayout>
  <Navbar />               (sticky/fixed di atas Hero)
  <HeroSection />          (background foto perangkat desa)
  <AboutSection />         (tentang desa/katalog)
  <OwnersSection />        (carousel pemilik produk + search)
  <ProductsSection />      (grid produk + search)
  <MapSection />           (peta lokasi Desa Pasiragung)
  <Footer />
</PublicLayout>
```

Struktur folder yang disarankan:
```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   └── home/
│       ├── HeroSection.jsx
│       ├── AboutSection.jsx
│       ├── OwnersSection.jsx
│       ├── OwnerCard.jsx
│       ├── OwnersCarousel.jsx
│       ├── ProductsSection.jsx
│       ├── ProductCard.jsx
│       └── MapSection.jsx
└── pages/public/Home.jsx   (merangkai semua section di atas)
```

---

## 2. Navbar

### 2.1 Isi & Perilaku
- **Kiri:** Logo/Nama katalog ("Katalog Pasiragung")
- **Tengah/Kanan (desktop):** Link anchor scroll ke section — Beranda, Tentang, Pemilik Usaha, Produk, Lokasi
- **Kanan paling ujung:** Tombol "Masuk" (ke `/login`) — untuk admin, bukan untuk publik biasa jadi cukup 1 tombol kecil, tidak perlu menonjol di visual utama
- **Mobile (`<sm`):** Navbar menyusut jadi logo + hamburger icon (`lucide-react: Menu`), link-link masuk ke drawer/sheet yang muncul dari kanan

### 2.2 Perilaku Scroll
- Navbar `sticky top-0 z-50`, dengan transisi background: transparan di atas Hero (teks putih/kontras dengan foto), lalu berubah jadi `--color-background` solid + border bawah setelah discroll melewati Hero (dideteksi lewat `IntersectionObserver` atau scroll-listener sederhana)
- Transisi background pakai `--duration-base` (650ms) dan `--easing-brand` supaya konsisten dengan token motion yang sudah ditetapkan

### 2.3 Perbaikan dari Versi Sebelumnya (yang Anda bilang "berantakan")
- Pastikan tinggi navbar tetap (`h-16` atau `h-20`), jangan berubah tinggi saat state transparan → solid
- Link aktif (section yang sedang terlihat) diberi underline/warna `--color-primary` — pakai scroll-spy sederhana
- Z-index navbar harus di atas Hero image tapi di bawah modal/dropdown mobile menu

---

## 3. Hero Section

### 3.1 Konten
- Background: foto perangkat desa (`object-cover`, full-width, tinggi `min-h-screen` di desktop atau `min-h-[70vh]` di mobile supaya tidak terlalu memanjang di layar kecil)
- Overlay gelap semi-transparan di atas foto (`bg-black/40`) supaya teks tetap terbaca — ini penting karena warna teks Anda dominan gelap (`--color-text: #171719`), jadi di atas foto perlu override jadi putih
- Judul besar pakai `font-display` (skala token 84px di desktop, turun signifikan di mobile — lihat Bagian 8 responsive)
- Sub-judul/tagline pendek di bawah judul
- CTA button: "Lihat Produk Kami" → scroll ke `ProductsSection`

### 3.2 Implementasi
```jsx
<section className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center text-center">
  <img src={heroImage} alt="Perangkat Desa Pasiragung" className="absolute inset-0 w-full h-full object-cover" />
  <div className="absolute inset-0 bg-black/40" />
  <div className="relative z-10 px-4 text-white">
    <h1 className="font-display text-[40px] sm:text-[56px] md:text-[84px] leading-[0.87]">
      Katalog UMKM Desa Pasiragung
    </h1>
    <p className="font-body text-sm mt-4">Menghubungkan produk desa dengan dunia</p>
    <a href="#produk" className="inline-block mt-6 px-6 py-3 rounded-sm bg-primary text-on-primary font-body text-xs">
      Lihat Produk Kami
    </a>
  </div>
</section>
```
Catatan: foto perangkat desa perlu di-*compress* dulu (WebP, maks ~200-300KB) supaya tidak memperlambat LCP (Largest Contentful Paint) — ini elemen pertama yang dilihat user, jadi loading-nya paling krusial di seluruh halaman.

---

## 4. About Section

### 4.1 Konten
- Judul section pakai `font-heading` (32px)
- Paragraf singkat tentang tujuan katalog & desa (2-3 kalimat, bukan esai panjang)
- Opsional: 3 angka statistik kecil (misal: Jumlah UMKM Terdaftar, Jumlah Produk, dst) — data ini bisa fetch count dari Supabase (`select('*', { count: 'exact', head: true })` pada tabel `owners` dan `products`)

### 4.2 Layout
Dua kolom di desktop (teks kiri, ilustrasi/foto kanan), stack vertikal di mobile.

---

## 5. Owners Section (Pemilik Produk)

### 5.1 Fitur
- Search input di atas carousel: filter berdasarkan nama pemilik usaha
- Carousel horizontal berisi `OwnerCard` (foto/logo + nama + jumlah produk), data fetch dari tabel `owners`
- Klik card → ke `/owner/:id`

### 5.2 Data Fetching
```jsx
// OwnersSection.jsx
const [search, setSearch] = useState('')
const [owners, setOwners] = useState([])

useEffect(() => {
  const fetchOwners = async () => {
    let query = supabase.from('owners').select('*, products(count)')
    if (search) query = query.ilike('name', `%${search}%`)
    const { data, error } = await query.limit(20)
    if (!error) setOwners(data)
  }
  const debounce = setTimeout(fetchOwners, 300) // debounce supaya tidak fetch di setiap ketikan
  return () => clearTimeout(debounce)
}, [search])
```
`products(count)` memakai fitur *embedded relation count* Supabase — otomatis menghitung jumlah produk per owner dalam 1 query, tanpa perlu query terpisah per card.

### 5.3 Carousel
Untuk carousel ringan tanpa dependency besar, gunakan CSS scroll-snap (tidak perlu library seperti Swiper untuk kebutuhan sesederhana ini):
```jsx
<div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
  {owners.map(owner => (
    <div key={owner.id} className="snap-start shrink-0 w-40 sm:w-50">
      <OwnerCard owner={owner} />
    </div>
  ))}
</div>
```
Kalau ke depannya butuh tombol panah prev/next eksplisit (bukan hanya swipe/drag), tinggal tambah 2 tombol yang memanggil `scrollBy()` pada ref container — tidak perlu menambah library tambahan.

---

## 6. Products Section ("Produk Kami")

### 6.1 Fitur
- Search input untuk nama produk
- Filter kategori (dropdown, opsional tapi natural di sini karena data kategori sudah ada)
- Grid card produk (gambar, nama, kategori, harga) — **reuse `ProductCard` yang sama** dengan yang dipakai di `OwnerProfile.jsx` nanti, supaya konsisten
- Tombol "Lihat Semua Produk" jika ingin membatasi jumlah yang tampil di homepage (misal 8 produk terbaru saja) dan mengarahkan ke halaman katalog penuh — **opsional**, tergantung apakah Anda mau homepage jadi katalog penuh atau cuma preview. Saya asumsikan **preview 8 produk terbaru** dulu supaya homepage tidak terlalu panjang; beri tahu jika maksud Anda semua produk langsung tampil di sini.

### 6.2 Data Fetching
```jsx
const { data } = await supabase
  .from('products')
  .select('*, categories(name), owners(name)')
  .ilike('name', `%${search}%`)
  .eq(categoryFilter ? 'category_id' : undefined, categoryFilter || undefined)
  .order('created_at', { ascending: false })
  .limit(8)
```

### 6.3 Grid Responsive
```
grid-cols-2       (mobile, xs)
sm:grid-cols-2
md:grid-cols-3
lg:grid-cols-4
gap-3 sm:gap-4
```

---

## 7. Map Section

### 7.1 Opsi Implementasi
Karena tidak disebutkan sumber peta yang diinginkan, dua opsi realistis dan gratis:

| Opsi | Kelebihan | Kekurangan |
|---|---|---|
| **Google Maps Embed** (`<iframe>`) | Gratis tanpa API key untuk embed sederhana, akurat, familiar bagi user | Sedikit lebih berat (iframe pihak ketiga) |
| **OpenStreetMap + Leaflet.js** | Ringan, open-source, bisa dikustom stylingnya | Perlu install library tambahan (`leaflet`, `react-leaflet`) |

**Rekomendasi:** Google Maps Embed — paling cepat diimplementasi, tidak butuh API key untuk embed dasar, dan user Indonesia jauh lebih familiar dengan tampilannya.

```jsx
<section className="py-16 px-4">
  <h2 className="font-heading text-2xl mb-4">Lokasi Desa Pasiragung</h2>
  <div className="rounded-md overflow-hidden border border-border">
    <iframe
      src="https://www.google.com/maps/embed?pb=..." // ambil dari Google Maps > Share > Embed a map
      width="100%"
      height="400"
      style={{ border: 0 }}
      loading="lazy"
      title="Peta Desa Pasiragung"
    />
  </div>
</section>
```
Link embed didapat manual sekali dari Google Maps (cari lokasi desa → Share → Embed a map → copy src), bukan sesuatu yang perlu digenerate dinamis.

---

## 8. Footer

### 8.1 Konten
- Kolom 1: Logo/Nama katalog + deskripsi singkat
- Kolom 2: Navigasi cepat (link ke section yang sama seperti Navbar)
- Kolom 3: Kontak (nomor WA BUMDes/desa, alamat singkat)
- Baris bawah: copyright + kredit (misal "Dikembangkan sebagai bagian dari Program KKM")

### 8.2 Layout
`grid-cols-1` di mobile (stack), `grid-cols-3` di `md` ke atas.

---

## 9. Konvensi Struktur Kode (Arrow Function, Reusable, Barrel File)

Bagian ini murni perencanaan arsitektur kode — belum berupa implementasi — supaya saat masuk tahap coding, tidak ada keraguan soal pola yang dipakai.

### 9.1 Aturan Penulisan Komponen
- Semua komponen ditulis sebagai **arrow function dengan named export**, bukan `export default function`:
  ```
  export const NamaKomponen = (props) => { ... }
  ```
- Alasan memilih named export dibanding default export: named export memaksa nama komponen konsisten di setiap tempat ia diimpor (tidak bisa diimpor dengan nama sembarangan seperti default export), dan ini yang membuat barrel file (poin 9.3) bisa di-re-export secara eksplisit satu per satu.
- File komponen dan nama fungsi arrow-nya **harus sama persis** (`HeroSection.jsx` → `export const HeroSection`), supaya pencarian file dari nama komponen tetap intuitif meski sudah pakai barrel.

### 9.2 Prinsip Reusable per Komponen
Setiap komponen di homepage dirancang agar **tidak hanya dipakai di Home**, tapi bisa dipakai ulang di halaman publik lain (`ProductDetail`, `OwnerProfile`) tanpa modifikasi:

| Komponen | Reusable Untuk | Props yang Diterima (rencana) |
|---|---|---|
| `Navbar` | Semua halaman publik (lewat `PublicLayout`) | Tidak perlu props — state internal (scroll, mobile menu) |
| `Footer` | Semua halaman publik (lewat `PublicLayout`) | Tidak perlu props — statis |
| `SectionHeading` | Judul di About, Owners, Products, Map (styling judul section seragam) | `title`, `subtitle` (opsional) |
| `SearchInput` | Search di OwnersSection maupun ProductsSection (2 section beda, 1 komponen sama) | `value`, `onChange`, `placeholder` |
| `OwnerCard` | Dipakai di `OwnersCarousel` (Home) **dan** grid produk terkait di `OwnerProfile` page | `owner` (object: id, name, image, productCount) |
| `ProductCard` | Dipakai di `ProductsSection` (Home), `OwnerProfile` (produk milik owner), **dan** `ProductDetail` (bagian "Produk Terkait") | `product` (object: id, name, price, image, categoryName) |
| `Carousel` (wrapper generik) | Dipakai untuk `OwnersCarousel`, dan bisa dipakai ulang lagi kalau nanti ada carousel lain (misal testimoni) | `children`, `itemWidth` (opsional) |
| `MapEmbed` | Hanya dipakai di `MapSection`, tapi dipisah jadi komponen sendiri (bukan inline di section) supaya src embed mudah diganti dari satu tempat saja | `embedUrl`, `title` |

Prinsip pemisahannya: **komponen "atom" (Card, SearchInput, SectionHeading, Carousel) dipisah dari komponen "section"** (`OwnersSection`, `ProductsSection`). Section hanya bertugas fetch data dan menyusun layout, sedangkan tampilan detail per-item didelegasikan ke komponen atom. Ini yang membuat `ProductCard` bisa dipakai lagi nanti di halaman admin (`ProductsPage`) untuk preview, tanpa duplikasi kode.

### 9.3 Struktur Barrel File

Barrel file (`index.js`) dibuat **per folder**, mengekspor ulang semua komponen di folder tersebut, supaya import dari luar folder cukup 1 baris:

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── PublicLayout.jsx
│   │   └── index.js          → export { Navbar } from './Navbar'
│   │                            export { Footer } from './Footer'
│   │                            export { PublicLayout } from './PublicLayout'
│   │
│   ├── home/
│   │   ├── HeroSection.jsx
│   │   ├── AboutSection.jsx
│   │   ├── OwnersSection.jsx
│   │   ├── ProductsSection.jsx
│   │   ├── MapSection.jsx
│   │   └── index.js          → re-export seluruh section di atas
│   │
│   └── shared/                (komponen atom lintas halaman)
│       ├── SectionHeading.jsx
│       ├── SearchInput.jsx
│       ├── OwnerCard.jsx
│       ├── ProductCard.jsx
│       ├── Carousel.jsx
│       ├── MapEmbed.jsx
│       └── index.js          → re-export semua di atas
│
└── pages/public/Home.jsx     → import { HeroSection, AboutSection, ... } from '../../components/home'
                                 import { ProductCard } from '../../components/shared'
```

**Catatan penting soal circular import:** komponen di dalam folder yang sama (misal `PublicLayout.jsx` yang memakai `Navbar` dan `Footer`, satu folder dengannya) **mengimpor langsung dari file aslinya** (`./Navbar`, bukan `./index`), bukan lewat barrel folder sendiri. Barrel hanya dipakai oleh kode **di luar folder tersebut**. Ini mencegah kemungkinan circular reference saat build.

### 9.4 Barrel File Tingkat Lebih Tinggi (Opsional, untuk project yang tumbuh lebih besar)
Kalau nanti folder `components/` punya banyak sub-folder (`layout`, `home`, `shared`, `admin`, `table`), bisa dipertimbangkan 1 barrel tambahan di `components/index.js` yang me-re-export dari semua barrel sub-folder — tapi ini **opsional**, hanya diterapkan jika mulai terasa repetitif menulis banyak baris import dari path berbeda-beda di satu file yang sama.

---

| Section | `xs` (375px) | `sm` (768px) | `md` (1025px) | `lg`+ (1280px) |
|---|---|---|---|---|
| Navbar | Hamburger menu | Hamburger menu | Full link horizontal | Full link horizontal |
| Hero | `min-h-[70vh]`, judul 40px | judul 56px | judul 84px penuh | sama seperti md |
| About | Stack 1 kolom | Stack 1 kolom | 2 kolom | 2 kolom |
| Owners Carousel | Card 160px, scroll-snap | Card 200px | sama, lebih banyak terlihat sekaligus | sama |
| Products Grid | 2 kolom | 2 kolom | 3 kolom | 4 kolom |
| Map | Tinggi 250px | Tinggi 300px | Tinggi 400px | Tinggi 400px |
| Footer | Stack 1 kolom | Stack 1 kolom | 3 kolom | 3 kolom |

---

## 10. Urutan Pengerjaan Disarankan

1. **Navbar** dulu (dipakai di semua halaman publik lewat `PublicLayout`, bukan cuma Home)
2. **HeroSection** — statis dulu (belum butuh data Supabase)
3. **AboutSection** — statis + opsional count statistik
4. **ProductCard** (komponen kecil reusable) → baru **ProductsSection**
5. **OwnerCard** + **OwnersCarousel** → baru **OwnersSection**
6. **MapSection** — paling sederhana, cukup ambil embed link sekali dari Google Maps
7. **Footer**
8. Rangkai semua di `Home.jsx`, cek responsive di 4 breakpoint utama pakai DevTools

---

## Catatan & Asumsi yang Perlu Dikonfirmasi

1. **Products Section di homepage saya asumsikan preview 8 produk terbaru**, bukan seluruh katalog — beri tahu jika Anda ingin semua produk langsung tampil di homepage tanpa halaman katalog terpisah.
2. **Map pakai Google Maps Embed** — beri tahu jika Anda lebih suka Leaflet/OpenStreetMap (misal karena alasan performa atau tidak mau bergantung pada Google).
3. Foto hero "perangkat desa" perlu Anda siapkan sendiri filenya (foto asli, bukan stok foto generik) — taruh di `src/assets/` atau upload ke Supabase Storage bucket baru (misal `site-assets`) kalau ingin bisa diganti tanpa redeploy kode.