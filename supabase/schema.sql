-- ============================================
-- WEBSITE ALUMNI + CMS - SUPABASE SQL SCHEMA
-- Jalankan ini di Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- MASTER DATA TABLES
-- ============================================

-- Tabel kota/wilayah
CREATE TABLE IF NOT EXISTS master_kota (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(100) NOT NULL UNIQUE,
  provinsi VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel profesi/pekerjaan
CREATE TABLE IF NOT EXISTS master_profesi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(100) NOT NULL UNIQUE,
  kategori VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel kategori usaha
CREATE TABLE IF NOT EXISTS master_kategori_usaha (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel benefit/penawaran
CREATE TABLE IF NOT EXISTS master_benefit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ALUMNI TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS alumni (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identitas
  nama_lengkap VARCHAR(200) NOT NULL,
  angkatan INTEGER,
  jurusan VARCHAR(200),
  kota_id UUID REFERENCES master_kota(id),
  
  -- Profesi
  profesi_id UUID REFERENCES master_profesi(id),
  jabatan VARCHAR(200),
  perusahaan VARCHAR(200),
  
  -- Kontak
  whatsapp VARCHAR(20),
  email VARCHAR(200),
  instagram VARCHAR(100),
  linkedin VARCHAR(200),
  
  -- Profil
  foto_url TEXT,
  bio TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- UMKM TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS umkm (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alumni_id UUID NOT NULL REFERENCES alumni(id) ON DELETE CASCADE,
  
  -- Info Usaha
  nama_usaha VARCHAR(200) NOT NULL,
  kategori_usaha_id UUID REFERENCES master_kategori_usaha(id),
  deskripsi TEXT,
  skala_usaha VARCHAR(50), -- 'hobby', 'kecil', 'menengah', 'besar'
  
  -- Lokasi
  kota_domisili_id UUID REFERENCES master_kota(id),
  jangkauan VARCHAR(50), -- 'lokal', 'regional', 'nasional', 'internasional'
  
  -- Kontak Usaha
  whatsapp_bisnis VARCHAR(20),
  instagram_usaha VARCHAR(100),
  toko_online TEXT,
  website TEXT,
  
  -- Visual
  foto_produk_urls TEXT[], -- array URLs
  logo_url TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- UMKM BENEFITS (many-to-many)
-- ============================================

CREATE TABLE IF NOT EXISTS umkm_benefits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  umkm_id UUID NOT NULL REFERENCES umkm(id) ON DELETE CASCADE,
  benefit_id UUID NOT NULL REFERENCES master_benefit(id),
  detail_benefit TEXT,
  UNIQUE(umkm_id, benefit_id)
);

-- ============================================
-- SHOWCASE UMKM MINGGUAN
-- ============================================

CREATE TABLE IF NOT EXISTS showcase_umkm (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  umkm_id UUID NOT NULL REFERENCES umkm(id) ON DELETE CASCADE,
  
  -- Jadwal
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  
  -- Konten showcase
  judul VARCHAR(200),
  deskripsi_showcase TEXT,
  foto_showcase_url TEXT,
  
  -- Status
  is_published BOOLEAN DEFAULT FALSE,
  urutan INTEGER DEFAULT 1, -- urutan tampil (1-5)
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADMIN USERS (handled by Supabase Auth)
-- Tabel tambahan untuk data admin
-- ============================================

CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nama VARCHAR(200),
  role VARCHAR(50) DEFAULT 'admin', -- 'superadmin', 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES untuk performa search
-- ============================================

CREATE INDEX IF NOT EXISTS idx_alumni_kota ON alumni(kota_id);
CREATE INDEX IF NOT EXISTS idx_alumni_profesi ON alumni(profesi_id);
CREATE INDEX IF NOT EXISTS idx_alumni_angkatan ON alumni(angkatan);
CREATE INDEX IF NOT EXISTS idx_alumni_active ON alumni(is_active);
CREATE INDEX IF NOT EXISTS idx_umkm_alumni ON umkm(alumni_id);
CREATE INDEX IF NOT EXISTS idx_umkm_kategori ON umkm(kategori_usaha_id);
CREATE INDEX IF NOT EXISTS idx_umkm_kota ON umkm(kota_domisili_id);
CREATE INDEX IF NOT EXISTS idx_showcase_tanggal ON showcase_umkm(tanggal_mulai, tanggal_selesai);
CREATE INDEX IF NOT EXISTS idx_showcase_published ON showcase_umkm(is_published);

-- Full text search untuk alumni
CREATE INDEX IF NOT EXISTS idx_alumni_nama_fts ON alumni USING gin(to_tsvector('indonesian', nama_lengkap));

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Alumni: publik bisa baca, hanya admin yang bisa write
ALTER TABLE alumni ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alumni readable by everyone" ON alumni
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Alumni writable by admin only" ON alumni
  FOR ALL USING (auth.role() = 'authenticated');

-- UMKM: sama seperti alumni
ALTER TABLE umkm ENABLE ROW LEVEL SECURITY;

CREATE POLICY "UMKM readable by everyone" ON umkm
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "UMKM writable by admin only" ON umkm
  FOR ALL USING (auth.role() = 'authenticated');

-- Showcase: publik bisa baca yang published
ALTER TABLE showcase_umkm ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Showcase readable if published" ON showcase_umkm
  FOR SELECT USING (
    is_published = TRUE 
    AND tanggal_mulai <= CURRENT_DATE 
    AND tanggal_selesai >= CURRENT_DATE
  );

CREATE POLICY "Showcase writable by admin only" ON showcase_umkm
  FOR ALL USING (auth.role() = 'authenticated');

-- Master data: publik bisa baca
ALTER TABLE master_kota ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_profesi ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_kategori_usaha ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_benefit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master kota public read" ON master_kota FOR SELECT USING (TRUE);
CREATE POLICY "Master kota admin write" ON master_kota FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Master profesi public read" ON master_profesi FOR SELECT USING (TRUE);
CREATE POLICY "Master profesi admin write" ON master_profesi FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Master kategori public read" ON master_kategori_usaha FOR SELECT USING (TRUE);
CREATE POLICY "Master kategori admin write" ON master_kategori_usaha FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Master benefit public read" ON master_benefit FOR SELECT USING (TRUE);
CREATE POLICY "Master benefit admin write" ON master_benefit FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- SEED DATA - Master Data Awal
-- ============================================

INSERT INTO master_kota (nama, provinsi) VALUES
  ('Jakarta', 'DKI Jakarta'),
  ('Surabaya', 'Jawa Timur'),
  ('Bandung', 'Jawa Barat'),
  ('Medan', 'Sumatera Utara'),
  ('Semarang', 'Jawa Tengah'),
  ('Makassar', 'Sulawesi Selatan'),
  ('Yogyakarta', 'DI Yogyakarta'),
  ('Palembang', 'Sumatera Selatan'),
  ('Tangerang', 'Banten'),
  ('Depok', 'Jawa Barat'),
  ('Bekasi', 'Jawa Barat'),
  ('Malang', 'Jawa Timur'),
  ('Bogor', 'Jawa Barat'),
  ('Bali/Denpasar', 'Bali'),
  ('Balikpapan', 'Kalimantan Timur')
ON CONFLICT (nama) DO NOTHING;

INSERT INTO master_profesi (nama, kategori) VALUES
  ('Software Engineer', 'Teknologi'),
  ('Product Manager', 'Teknologi'),
  ('Data Scientist', 'Teknologi'),
  ('UI/UX Designer', 'Desain'),
  ('Marketing Manager', 'Bisnis'),
  ('Business Analyst', 'Bisnis'),
  ('Entrepreneur / Wirausaha', 'Bisnis'),
  ('Dokter', 'Kesehatan'),
  ('Guru / Pengajar', 'Pendidikan'),
  ('Konsultan', 'Profesional'),
  ('Akuntan', 'Keuangan'),
  ('Arsitek', 'Teknik'),
  ('Insinyur', 'Teknik'),
  ('Jurnalis', 'Media'),
  ('PNS / ASN', 'Pemerintahan'),
  ('Freelancer', 'Independen'),
  ('Lainnya', 'Lainnya')
ON CONFLICT (nama) DO NOTHING;

INSERT INTO master_kategori_usaha (nama) VALUES
  ('Kuliner & Makanan'),
  ('Fashion & Pakaian'),
  ('Kerajinan & Handicraft'),
  ('Kecantikan & Perawatan'),
  ('Digital & Teknologi'),
  ('Pendidikan & Pelatihan'),
  ('Jasa & Konsultasi'),
  ('Pertanian & Peternakan'),
  ('Kesehatan & Wellness'),
  ('Lainnya')
ON CONFLICT (nama) DO NOTHING;

INSERT INTO master_benefit (nama) VALUES
  ('Diskon khusus alumni'),
  ('Harga grosir / reseller'),
  ('Konsultasi gratis'),
  ('Prioritas layanan / pengiriman'),
  ('Program afiliasi / komisi'),
  ('Kolaborasi / kemitraan usaha'),
  ('Pelatihan / workshop'),
  ('Tidak ada benefit khusus')
ON CONFLICT (nama) DO NOTHING;

-- ============================================
-- FUNGSI AUTO-UPDATE updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_alumni_updated_at BEFORE UPDATE ON alumni
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_umkm_updated_at BEFORE UPDATE ON umkm
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_showcase_updated_at BEFORE UPDATE ON showcase_umkm
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEW untuk showcase yang sedang aktif
-- ============================================

CREATE OR REPLACE VIEW showcase_aktif AS
SELECT 
  s.*,
  u.nama_usaha,
  u.deskripsi as deskripsi_usaha,
  u.foto_produk_urls,
  u.logo_url,
  u.instagram_usaha,
  u.whatsapp_bisnis,
  u.toko_online,
  a.nama_lengkap as nama_alumni,
  a.angkatan,
  a.foto_url as foto_alumni,
  mk.nama as kategori_usaha
FROM showcase_umkm s
JOIN umkm u ON s.umkm_id = u.id
JOIN alumni a ON u.alumni_id = a.id
LEFT JOIN master_kategori_usaha mk ON u.kategori_usaha_id = mk.id
WHERE s.is_published = TRUE
  AND s.tanggal_mulai <= CURRENT_DATE
  AND s.tanggal_selesai >= CURRENT_DATE
ORDER BY s.urutan ASC;

-- ============================================
-- STORAGE BUCKETS (jalankan di dashboard Supabase)
-- Atau uncomment jika pakai Supabase CLI
-- ============================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('alumni-photos', 'alumni-photos', TRUE);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('umkm-photos', 'umkm-photos', TRUE);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', TRUE);
