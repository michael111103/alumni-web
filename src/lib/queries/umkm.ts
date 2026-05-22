// src/lib/queries/umkm.ts
import { createClient } from '@/lib/supabase/client'
import type { UMKM, ShowcaseAktif, ShowcaseUMKM, UMKMFilter, PaginatedResult } from '@/types'

const supabase = createClient()

export async function getUMKM(
  filter: UMKMFilter = {},
  page = 1,
  limit = 12
): Promise<PaginatedResult<UMKM>> {
  let query = supabase
    .from('umkm')
    .select(`
      *,
      alumni(id, nama_lengkap, foto_url, angkatan),
      master_kategori_usaha(id, nama),
      master_kota(id, nama),
      umkm_benefits(*, master_benefit(id, nama))
    `, { count: 'exact' })
    .eq('is_active', true)

  if (filter.kota_id) query = query.eq('kota_domisili_id', filter.kota_id)
  if (filter.kategori_id) query = query.eq('kategori_usaha_id', filter.kategori_id)
  if (filter.search) query = query.ilike('nama_usaha', `%${filter.search}%`)

  if (filter.benefit_id) {
    const { data: umkmIds } = await supabase
      .from('umkm_benefits')
      .select('umkm_id')
      .eq('benefit_id', filter.benefit_id)

    if (umkmIds) {
      query = query.in('id', umkmIds.map(u => u.umkm_id))
    }
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await query
    .order('nama_usaha', { ascending: true })
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

export async function getShowcaseAktif(): Promise<ShowcaseAktif[]> {
  const { data, error } = await supabase
    .from('showcase_aktif')
    .select('*')
    .order('urutan', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getAllShowcase(): Promise<ShowcaseUMKM[]> {
  const { data, error } = await supabase
    .from('showcase_umkm')
    .select(`
      *,
      umkm(
        id, nama_usaha, logo_url,
        alumni(nama_lengkap)
      )
    `)
    .order('tanggal_mulai', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createShowcase(data: Omit<ShowcaseUMKM, 'id' | 'created_at' | 'updated_at'>) {
  const { data: result, error } = await supabase
    .from('showcase_umkm')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return result
}

export async function updateShowcase(id: string, data: Partial<ShowcaseUMKM>) {
  const { data: result, error } = await supabase
    .from('showcase_umkm')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return result
}

export async function deleteShowcase(id: string) {
  const { error } = await supabase
    .from('showcase_umkm')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function createUMKM(
  data: Omit<UMKM, 'id' | 'created_at' | 'updated_at'>,
  benefitIds: string[]
) {
  const { data: result, error } = await supabase
    .from('umkm')
    .insert(data)
    .select()
    .single()

  if (error) throw error

  if (benefitIds.length > 0) {
    const benefits = benefitIds.map(bid => ({
      umkm_id: result.id,
      benefit_id: bid,
    }))
    await supabase.from('umkm_benefits').insert(benefits)
  }

  return result
}

export async function updateUMKM(
  id: string,
  data: Partial<UMKM>,
  benefitIds?: string[]
) {
  const { data: result, error } = await supabase
    .from('umkm')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  if (benefitIds !== undefined) {
    await supabase.from('umkm_benefits').delete().eq('umkm_id', id)
    if (benefitIds.length > 0) {
      const benefits = benefitIds.map(bid => ({
        umkm_id: id,
        benefit_id: bid,
      }))
      await supabase.from('umkm_benefits').insert(benefits)
    }
  }

  return result
}
