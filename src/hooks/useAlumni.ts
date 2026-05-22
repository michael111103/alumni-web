// src/hooks/useAlumni.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAlumni, getAlumniById, createAlumni, updateAlumni, deleteAlumni } from '@/lib/queries/alumni'
import { getShowcaseAktif, getUMKM, getAllShowcase, createShowcase, updateShowcase, deleteShowcase, createUMKM, updateUMKM } from '@/lib/queries/umkm'
import { getMasterKota, getMasterProfesi, getMasterKategoriUsaha, getMasterBenefit, getDashboardStats } from '@/lib/queries/master'
import type { AlumniFilter, UMKMFilter } from '@/types'

// ===== ALUMNI HOOKS =====

export function useAlumni(filter: AlumniFilter = {}, page = 1, limit = 12) {
  return useQuery({
    queryKey: ['alumni', filter, page, limit],
    queryFn: () => getAlumni(filter, page, limit),
    staleTime: 1000 * 60 * 5, // 5 menit
  })
}

export function useAlumniById(id: string) {
  return useQuery({
    queryKey: ['alumni', id],
    queryFn: () => getAlumniById(id),
    enabled: !!id,
  })
}

export function useCreateAlumni() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createAlumni,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alumni'] }),
  })
}

export function useUpdateAlumni() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAlumni(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alumni'] }),
  })
}

export function useDeleteAlumni() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteAlumni,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alumni'] }),
  })
}

// ===== UMKM HOOKS =====

export function useUMKM(filter: UMKMFilter = {}, page = 1, limit = 12) {
  return useQuery({
    queryKey: ['umkm', filter, page, limit],
    queryFn: () => getUMKM(filter, page, limit),
    staleTime: 1000 * 60 * 5,
  })
}

export function useShowcaseAktif() {
  return useQuery({
    queryKey: ['showcase-aktif'],
    queryFn: getShowcaseAktif,
    staleTime: 1000 * 60 * 10, // 10 menit
    refetchInterval: 1000 * 60 * 30, // refresh tiap 30 menit
  })
}

export function useAllShowcase() {
  return useQuery({
    queryKey: ['showcase-all'],
    queryFn: getAllShowcase,
  })
}

export function useCreateShowcase() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createShowcase,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['showcase-aktif'] })
      qc.invalidateQueries({ queryKey: ['showcase-all'] })
    },
  })
}

export function useUpdateShowcase() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateShowcase(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['showcase-aktif'] })
      qc.invalidateQueries({ queryKey: ['showcase-all'] })
    },
  })
}

export function useDeleteShowcase() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteShowcase,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['showcase-aktif'] })
      qc.invalidateQueries({ queryKey: ['showcase-all'] })
    },
  })
}

export function useCreateUMKM() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, benefitIds }: { data: any; benefitIds: string[] }) =>
      createUMKM(data, benefitIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['umkm'] }),
  })
}

export function useUpdateUMKM() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data, benefitIds }: { id: string; data: any; benefitIds?: string[] }) =>
      updateUMKM(id, data, benefitIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['umkm'] }),
  })
}

// ===== MASTER DATA HOOKS =====

export function useMasterKota() {
  return useQuery({
    queryKey: ['master-kota'],
    queryFn: getMasterKota,
    staleTime: 1000 * 60 * 60, // 1 jam
  })
}

export function useMasterProfesi() {
  return useQuery({
    queryKey: ['master-profesi'],
    queryFn: getMasterProfesi,
    staleTime: 1000 * 60 * 60,
  })
}

export function useMasterKategoriUsaha() {
  return useQuery({
    queryKey: ['master-kategori'],
    queryFn: getMasterKategoriUsaha,
    staleTime: 1000 * 60 * 60,
  })
}

export function useMasterBenefit() {
  return useQuery({
    queryKey: ['master-benefit'],
    queryFn: getMasterBenefit,
    staleTime: 1000 * 60 * 60,
  })
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 5,
  })
}
