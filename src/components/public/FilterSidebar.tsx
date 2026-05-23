'use client'
import { useMasterKota, useMasterProfesi, useMasterBenefit } from '@/hooks/useAlumni'
import type { AlumniFilter } from '@/types'
import { MapPin, Briefcase, Gift, X } from 'lucide-react'

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
    <div className="bg-white border border-gray-100 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          <MapPin className="w-3.5 h-3.5" /> Kota / Wilayah
        </label>
        <select value={filter.kota_id || ''} onChange={e => onFilter({ kota_id: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition bg-white">
          <option value="">Semua Kota</option>
          {kotas?.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
        </select>
      </div>
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          <Briefcase className="w-3.5 h-3.5" /> Profesi
        </label>
        <select value={filter.profesi_id || ''} onChange={e => onFilter({ profesi_id: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition bg-white">
          <option value="">Semua Profesi</option>
          {profesis?.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
        </select>
      </div>
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          <Gift className="w-3.5 h-3.5" /> Benefit
        </label>
        <select value={filter.benefit_id || ''} onChange={e => onFilter({ benefit_id: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition bg-white">
          <option value="">Semua Benefit</option>
          {benefits?.map(b => <option key={b.id} value={b.id}>{b.nama}</option>)}
        </select>
      </div>
      <div className="sm:col-span-3 flex justify-end">
        <button onClick={onClear} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition font-medium">
          <X className="w-3.5 h-3.5" /> Reset semua filter
        </button>
      </div>
    </div>
  )
}
