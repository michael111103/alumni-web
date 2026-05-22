// src/lib/queries/master.ts
import { createClient } from '@/lib/supabase/client'
import type { MasterKota, MasterProfesi, MasterKategoriUsaha, MasterBenefit, DashboardStats } from '@/types'

const supabase = createClient()

export async function getMasterKota(): Promise<MasterKota[]> {
  const { data, error } = await supabase
    .from('master_kota')
    .select('*')
    .order('nama')
  if (error) throw error
  return data || []
}

export async function getMasterProfesi(): Promise<MasterProfesi[]> {
  const { data, error } = await supabase
    .from('master_profesi')
    .select('*')
    .order('nama')
  if (error) throw error
  return data || []
}

export async function getMasterKategoriUsaha(): Promise<MasterKategoriUsaha[]> {
  const { data, error } = await supabase
    .from('master_kategori_usaha')
    .select('*')
    .order('nama')
  if (error) throw error
  return data || []
}

export async function getMasterBenefit(): Promise<MasterBenefit[]> {
  const { data, error } = await supabase
    .from('master_benefit')
    .select('*')
    .order('nama')
  if (error) throw error
  return data || []
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    { count: totalAlumni },
    { count: totalUMKM },
    { count: totalShowcase },
    { data: alumniPerKota },
    { data: alumniPerProfesi },
  ] = await Promise.all([
    supabase.from('alumni').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('umkm').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('showcase_umkm').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('alumni').select('master_kota(nama)').eq('is_active', true),
    supabase.from('alumni').select('master_profesi(nama)').eq('is_active', true),
  ])

  // Group by kota
  const kotaCount: Record<string, number> = {}
  alumniPerKota?.forEach((a: any) => {
    const nama = a.master_kota?.nama || 'Tidak diketahui'
    kotaCount[nama] = (kotaCount[nama] || 0) + 1
  })

  // Group by profesi
  const profesiCount: Record<string, number> = {}
  alumniPerProfesi?.forEach((a: any) => {
    const nama = a.master_profesi?.nama || 'Tidak diketahui'
    profesiCount[nama] = (profesiCount[nama] || 0) + 1
  })

  return {
    totalAlumni: totalAlumni || 0,
    totalUMKM: totalUMKM || 0,
    totalShowcase: totalShowcase || 0,
    alumniPerKota: Object.entries(kotaCount)
      .map(([kota, count]) => ({ kota, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    alumniPerProfesi: Object.entries(profesiCount)
      .map(([profesi, count]) => ({ profesi, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
  }
}

// CRUD Master Data
export async function addMasterKota(nama: string, provinsi?: string) {
  const { data, error } = await supabase
    .from('master_kota')
    .insert({ nama, provinsi })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function addMasterProfesi(nama: string, kategori?: string) {
  const { data, error } = await supabase
    .from('master_profesi')
    .insert({ nama, kategori })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteMasterItem(table: string, id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
}
