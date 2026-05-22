// src/lib/validations.ts
import { z } from 'zod'

export const alumniSchema = z.object({
  nama_lengkap: z.string().min(2, 'Nama minimal 2 karakter').max(200),
  angkatan: z.number().min(1990).max(new Date().getFullYear()).optional().or(z.literal('')).transform(v => v === '' ? undefined : Number(v)),
  jurusan: z.string().max(200).optional(),
  kota_id: z.string().uuid().optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  profesi_id: z.string().uuid().optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  jabatan: z.string().max(200).optional(),
  perusahaan: z.string().max(200).optional(),
  whatsapp: z.string().regex(/^08\d{8,11}$/, 'Format WA tidak valid (08xxxxxxxxx)').optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  instagram: z.string().max(100).optional(),
  linkedin: z.string().url('URL LinkedIn tidak valid').optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  bio: z.string().max(1000).optional(),
  is_active: z.boolean().default(true),
})

export const umkmSchema = z.object({
  alumni_id: z.string().uuid('Alumni harus dipilih'),
  nama_usaha: z.string().min(2, 'Nama usaha minimal 2 karakter').max(200),
  kategori_usaha_id: z.string().uuid().optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  deskripsi: z.string().max(2000).optional(),
  skala_usaha: z.enum(['hobby', 'kecil', 'menengah', 'besar']).optional(),
  kota_domisili_id: z.string().uuid().optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  jangkauan: z.enum(['lokal', 'regional', 'nasional', 'internasional']).optional(),
  whatsapp_bisnis: z.string().optional(),
  instagram_usaha: z.string().max(100).optional(),
  toko_online: z.string().optional(),
  website: z.string().url('URL tidak valid').optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  benefit_ids: z.array(z.string().uuid()).default([]),
  is_active: z.boolean().default(true),
})

export const showcaseSchema = z.object({
  umkm_id: z.string().uuid('UMKM harus dipilih'),
  tanggal_mulai: z.string().min(1, 'Tanggal mulai harus diisi'),
  tanggal_selesai: z.string().min(1, 'Tanggal selesai harus diisi'),
  judul: z.string().max(200).optional(),
  deskripsi_showcase: z.string().max(1000).optional(),
  urutan: z.number().min(1).max(5).default(1),
  is_published: z.boolean().default(false),
}).refine(data => {
  return new Date(data.tanggal_selesai) >= new Date(data.tanggal_mulai)
}, {
  message: 'Tanggal selesai harus setelah tanggal mulai',
  path: ['tanggal_selesai'],
})

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export type AlumniFormValues = z.infer<typeof alumniSchema>
export type UMKMFormValues = z.infer<typeof umkmSchema>
export type ShowcaseFormValues = z.infer<typeof showcaseSchema>
export type LoginFormValues = z.infer<typeof loginSchema>
