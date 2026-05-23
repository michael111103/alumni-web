import { createClient } from '@/lib/supabase/client'
import type { AlumniFilter, PaginatedResult, Alumni } from '@/types'

const supabase = createClient()

export async function getAlumni(
  filter: AlumniFilter = {},
  page = 1,
  limit = 12,
  includeInactive = false
): Promise<PaginatedResult<Alumni>> {
  let query = supabase
    .from('alumni')
    .select(`
      *,
      master_kota(id, nama, provinsi),
      master_profesi(id, nama, kategori),
      umkm(id, nama_usaha, logo_url, is_active)
    `, { count: 'exact' })

  if (!includeInactive) {
    query = query.eq('is_active', true)
  }

  if (filter.kota_id) query = query.eq('kota_id', filter.kota_id)
  if (filter.profesi_id) query = query.eq('profesi_id', filter.profesi_id)
  if (filter.angkatan) query = query.eq('angkatan', filter.angkatan)
  if (filter.search) {
    query = query.ilike('nama_lengkap', `%${filter.search}%`)
  }

  if (filter.benefit_id) {
    const { data: umkmIds } = await supabase
      .from('umkm_benefits')
      .select('umkm_id')
      .eq('benefit_id', filter.benefit_id)

    if (umkmIds && umkmIds.length > 0) {
      const { data: alumniIds } = await supabase
        .from('umkm')
        .select('alumni_id')
        .in('id', umkmIds.map(u => u.umkm_id))

      if (alumniIds) {
        query = query.in('id', alumniIds.map(a => a.alumni_id))
      }
    }
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    data: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

export async function getAlumniById(id: string): Promise<Alumni | null> {
  const { data, error } = await supabase
    .from('alumni')
    .select(`
      *,
      master_kota(id, nama, provinsi),
      master_profesi(id, nama, kategori),
      umkm(
        *,
        master_kategori_usaha(id, nama),
        master_kota(id, nama),
        umkm_benefits(
          *,
          master_benefit(id, nama)
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function createAlumni(data: Omit<Alumni, 'id' | 'created_at' | 'updated_at'>) {
  const { data: result, error } = await supabase
    .from('alumni')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return result
}

export async function updateAlumni(id: string, data: Partial<Alumni>) {
  const { data: result, error } = await supabase
    .from('alumni')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return result
}

export async function deleteAlumni(id: string) {
  const { error } = await supabase
    .from('alumni')
    .update({ is_active: false })
    .eq('id', id)

  if (error) throw error
}

export async function deleteAlumniPermanent(id: string) {
  const { error } = await supabase
    .from('alumni')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getAllAlumniForExport() {
  const { data, error } = await supabase
    .from('alumni')
    .select(`
      *,
      master_kota(nama),
      master_profesi(nama),
      umkm(nama_usaha)
    `)
    .order('nama_lengkap')

  if (error) throw error
  return data || []
}
