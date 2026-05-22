# 🎓 Alumni Web + CMS

Website direktori alumni dengan UMKM showcase mingguan. Dibangun dengan Next.js 14, Supabase, Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form + Zod, dan SheetJS.

---

## 🚀 CARA SETUP DARI NOL

### 1. Setup Supabase

1. Buka [supabase.com](https://supabase.com) → **New Project**
2. Catat `Project URL` dan `anon key` dari **Settings > API**
3. Buka **SQL Editor** → paste semua isi file `supabase/schema.sql` → **Run**
4. Buka **Storage** → buat 3 bucket:
   - `alumni-photos` (Public: ✅)
   - `umkm-photos` (Public: ✅)
   - `logos` (Public: ✅)
5. Buka **Authentication > Settings** → aktifkan **Email Auth**

### 2. Buat Admin User

Di Supabase Dashboard → **Authentication > Users** → **Invite user** atau:
```sql
-- Di SQL Editor, setelah user dibuat via dashboard:
INSERT INTO admin_profiles (id, nama, role)
VALUES ('uuid-dari-user', 'Nama Admin', 'superadmin');
```

Atau lewat Supabase Dashboard → Authentication → Users → Add User Manual.

### 3. Setup Project

```bash
# Clone / download project ini
cd alumni-web

# Install dependencies
npm install

# Copy .env
cp .env.example .env.local
```

### 4. Isi .env.local

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

Semua key ada di Supabase → Settings → API.

### 5. Jalankan Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### 6. Deploy ke Vercel

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy
vercel
```

Atau:
1. Push ke GitHub
2. Buka [vercel.com](https://vercel.com) → Import repository
3. Tambah Environment Variables (sama seperti .env.local)
4. Deploy!

---

## 📁 STRUKTUR FILE

```
src/
├── app/
│   ├── page.tsx                    # Halaman utama (showcase + search)
│   ├── alumni/
│   │   ├── page.tsx                # Direktori alumni + filter
│   │   └── [id]/page.tsx           # Detail profil alumni
│   ├── umkm/
│   │   └── page.tsx                # Daftar semua UMKM
│   └── admin/
│       ├── layout.tsx              # Layout admin (proteksi auth)
│       ├── page.tsx                # Dashboard statistik
│       ├── login/page.tsx          # Halaman login admin
│       ├── alumni/page.tsx         # CRUD alumni
│       ├── umkm/page.tsx           # Manajemen showcase UMKM
│       ├── master-data/page.tsx    # Kelola kota, profesi, dll
│       └── export/page.tsx         # Export/Import Excel
├── components/
│   ├── public/
│   │   ├── ShowcaseSection.tsx     # Widget showcase UMKM minggu ini
│   │   ├── AlumniCard.tsx          # Kartu alumni di grid
│   │   ├── FilterSidebar.tsx       # Filter kota/profesi/benefit
│   │   ├── SearchBar.tsx           # Search bar
│   │   ├── StatsBar.tsx            # Statistik total alumni/umkm
│   │   └── Pagination.tsx          # Komponen pagination
│   ├── admin/
│   │   ├── AdminSidebar.tsx        # Sidebar navigasi admin
│   │   ├── AlumniFormModal.tsx     # Form tambah/edit alumni
│   │   └── ShowcaseFormModal.tsx   # Form jadwal showcase
│   └── providers.tsx               # TanStack Query provider
├── hooks/
│   └── useAlumni.ts               # Semua custom hooks TanStack Query
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Supabase client (browser)
│   │   └── server.ts              # Supabase client (server)
│   ├── queries/
│   │   ├── alumni.ts              # Query functions alumni
│   │   ├── umkm.ts                # Query functions UMKM & showcase
│   │   └── master.ts              # Query functions master data + stats
│   ├── validations.ts             # Zod schemas
│   ├── export.ts                  # Export/import Excel (SheetJS)
│   ├── upload.ts                  # Upload foto ke Supabase Storage
│   └── utils.ts                   # Helper functions
├── middleware.ts                   # Auth protection untuk /admin
└── types/index.ts                 # TypeScript types
supabase/
└── schema.sql                     # SQL lengkap untuk Supabase
```

---

## ✨ FITUR LENGKAP

### Website Publik
- ✅ Landing page dengan showcase UMKM mingguan (auto-publish berdasarkan jadwal)
- ✅ Statistik total alumni & UMKM
- ✅ Direktori alumni dengan search & filter (kota, profesi, benefit)
- ✅ Pagination untuk navigasi data banyak
- ✅ Halaman profil alumni lengkap (foto, kontak, bio, daftar UMKM)
- ✅ Halaman UMKM dengan filter kota & kategori
- ✅ Link langsung ke WA, Instagram, Toko Online

### CMS Admin
- ✅ Login admin (Supabase Auth)
- ✅ Dashboard statistik (total alumni, UMKM, top kota, top profesi)
- ✅ CRUD alumni (tambah, edit, hapus/nonaktif, upload foto)
- ✅ Manajemen showcase UMKM (jadwal tayang, publish/unpublish, urutan)
- ✅ Master data (tambah/hapus kota, profesi, kategori, benefit)
- ✅ Export data alumni ke Excel
- ✅ Import alumni massal dari Excel/CSV
- ✅ Download template import

---

## 🗄️ DATABASE TABLES

| Tabel | Fungsi |
|-------|--------|
| `alumni` | Data profil alumni |
| `umkm` | Data usaha UMKM alumni |
| `umkm_benefits` | Relasi UMKM ↔ benefit (many-to-many) |
| `showcase_umkm` | Jadwal showcase mingguan |
| `master_kota` | Daftar kota/wilayah |
| `master_profesi` | Daftar profesi/pekerjaan |
| `master_kategori_usaha` | Kategori jenis usaha |
| `master_benefit` | Jenis benefit yang ditawarkan |
| `admin_profiles` | Profil admin (extend Supabase Auth) |

---

## 🔐 KEAMANAN

- Row Level Security (RLS) aktif di semua tabel
- Publik hanya bisa **baca** data aktif
- Admin (authenticated) bisa **tulis** semua data
- Route `/admin/*` diproteksi middleware
- Validasi form dengan Zod di frontend

---

## 🛠️ TECH STACK

| Teknologi | Fungsi |
|-----------|--------|
| Next.js 14 (App Router) | Framework utama, SSR, routing |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Supabase | Database, Auth, Storage |
| TanStack Query | Data fetching & caching |
| React Hook Form | Form management |
| Zod | Validasi schema |
| SheetJS (xlsx) | Export/import Excel |

---

## 📞 BUTUH BANTUAN?

Jika ada error, cek:
1. Apakah `.env.local` sudah diisi dengan benar
2. Apakah SQL schema sudah dijalankan di Supabase
3. Apakah Storage bucket sudah dibuat dan public
4. Apakah admin user sudah dibuat di Supabase Auth
