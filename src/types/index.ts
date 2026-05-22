// src/types/index.ts

export interface MasterKota {
  id: string
  nama: string
  provinsi?: string
  created_at: string
}

export interface MasterProfesi {
  id: string
  nama: string
  kategori?: string
  created_at: string
}

export interface MasterKategoriUsaha {
  id: string
  nama: string
  created_at: string
}

export interface MasterBenefit {
  id: string
  nama: string
  created_at: string
}

export interface Alumni {
  id: string
  nama_lengkap: string
  angkatan?: number
  jurusan?: string
  kota_id?: string
  profesi_id?: string
  jabatan?: string
  perusahaan?: string
  whatsapp?: string
  email?: string
  instagram?: string
  linkedin?: string
  foto_url?: string
  bio?: string
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined
  master_kota?: MasterKota
  master_profesi?: MasterProfesi
  umkm?: UMKM[]
}

export interface UMKM {
  id: string
  alumni_id: string
  nama_usaha: string
  kategori_usaha_id?: string
  deskripsi?: string
  skala_usaha?: 'hobby' | 'kecil' | 'menengah' | 'besar'
  kota_domisili_id?: string
  jangkauan?: 'lokal' | 'regional' | 'nasional' | 'internasional'
  whatsapp_bisnis?: string
  instagram_usaha?: string
  toko_online?: string
  website?: string
  foto_produk_urls?: string[]
  logo_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined
  alumni?: Alumni
  master_kategori_usaha?: MasterKategoriUsaha
  master_kota?: MasterKota
  umkm_benefits?: UMKMBenefit[]
}

export interface UMKMBenefit {
  id: string
  umkm_id: string
  benefit_id: string
  detail_benefit?: string
  master_benefit?: MasterBenefit
}

export interface ShowcaseUMKM {
  id: string
  umkm_id: string
  tanggal_mulai: string
  tanggal_selesai: string
  judul?: string
  deskripsi_showcase?: string
  foto_showcase_url?: string
  is_published: boolean
  urutan: number
  created_at: string
  updated_at: string
  // Joined
  umkm?: UMKM
}

export interface ShowcaseAktif {
  id: string
  umkm_id: string
  tanggal_mulai: string
  tanggal_selesai: string
  judul?: string
  deskripsi_showcase?: string
  foto_showcase_url?: string
  urutan: number
  nama_usaha: string
  deskripsi_usaha?: string
  foto_produk_urls?: string[]
  logo_url?: string
  instagram_usaha?: string
  whatsapp_bisnis?: string
  toko_online?: string
  nama_alumni: string
  angkatan?: number
  foto_alumni?: string
  kategori_usaha?: string
}

// Filter types
export interface AlumniFilter {
  kota_id?: string
  profesi_id?: string
  benefit_id?: string
  search?: string
  angkatan?: number
}

export interface UMKMFilter {
  kota_id?: string
  kategori_id?: string
  benefit_id?: string
  search?: string
}

// Form types
export interface AlumniFormData {
  nama_lengkap: string
  angkatan?: number
  jurusan?: string
  kota_id?: string
  profesi_id?: string
  jabatan?: string
  perusahaan?: string
  whatsapp?: string
  email?: string
  instagram?: string
  linkedin?: string
  bio?: string
  is_active: boolean
}

export interface UMKMFormData {
  alumni_id: string
  nama_usaha: string
  kategori_usaha_id?: string
  deskripsi?: string
  skala_usaha?: string
  kota_domisili_id?: string
  jangkauan?: string
  whatsapp_bisnis?: string
  instagram_usaha?: string
  toko_online?: string
  website?: string
  benefit_ids?: string[]
  detail_benefit?: string
  is_active: boolean
}

export interface ShowcaseFormData {
  umkm_id: string
  tanggal_mulai: string
  tanggal_selesai: string
  judul?: string
  deskripsi_showcase?: string
  urutan: number
  is_published: boolean
}

// Pagination
export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Stats
export interface DashboardStats {
  totalAlumni: number
  totalUMKM: number
  totalShowcase: number
  alumniPerKota: { kota: string; count: number }[]
  alumniPerProfesi: { profesi: string; count: number }[]
}
