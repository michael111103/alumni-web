'use client'
// src/components/public/FilterSidebar.tsx
import { useMasterKota, useMasterProfesi, useMasterBenefit } from '@/hooks/useAlumni'
import type { AlumniFilter } from '@/types'

interface Props {
  filter: AlumniFilter
  onFilter: (filter: Partial<AlumniFilter>) => void
  onClear: () => void
}

export default function FilterSidebar({ filter, onFilter, onClear }: Props) {
  const { data: kotas } = useMasterKota()
  const { data: profesis } = useMasterProfesi()
  const { data: benefits } = useMasterBenefit()

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Kota */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
          📍 Kota / Wilayah
        </label>
        <select
          value={filter.kota_id || ''}
          onChange={e => onFilter({ kota_id: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Semua Kota</option>
          {kotas?.map(k => (
            <option key={k.id} value={k.id}>{k.nama}</option>
          ))}
        </select>
      </div>

      {/* Profesi */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
          💼 Profesi / Pekerjaan
        </label>
        <select
          value={filter.profesi_id || ''}
          onChange={e => onFilter({ profesi_id: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Semua Profesi</option>
          {profesis?.map(p => (
            <option key={p.id} value={p.id}>{p.nama}</option>
          ))}
        </select>
      </div>

      {/* Benefit */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
          🎁 Benefit Ditawarkan
        </label>
        <select
          value={filter.benefit_id || ''}
          onChange={e => onFilter({ benefit_id: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Semua Benefit</option>
          {benefits?.map(b => (
            <option key={b.id} value={b.id}>{b.nama}</option>
          ))}
        </select>
      </div>

      {/* Clear */}
      <div className="sm:col-span-3 flex justify-end">
        <button
          onClick={onClear}
          className="text-sm text-gray-500 hover:text-red-500 transition"
        >
          Reset semua filter ×
        </button>
      </div>
    </div>
  )
}
