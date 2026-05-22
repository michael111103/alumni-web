'use client'
// src/app/admin/master-data/page.tsx
import { useState } from 'react'
import { useMasterKota, useMasterProfesi, useMasterKategoriUsaha, useMasterBenefit } from '@/hooks/useAlumni'
import { addMasterKota, addMasterProfesi, deleteMasterItem } from '@/lib/queries/master'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'

export default function MasterDataPage() {
  const qc = useQueryClient()
  const { data: kotas, refetch: refetchKota } = useMasterKota()
  const { data: profesis, refetch: refetchProfesi } = useMasterProfesi()
  const { data: kategoris } = useMasterKategoriUsaha()
  const { data: benefits } = useMasterBenefit()

  const [newKota, setNewKota] = useState('')
  const [newProfesi, setNewProfesi] = useState('')

  const handleAddKota = async () => {
    if (!newKota.trim()) return
    await addMasterKota(newKota.trim())
    setNewKota('')
    refetchKota()
    qc.invalidateQueries({ queryKey: ['master-kota'] })
  }

  const handleAddProfesi = async () => {
    if (!newProfesi.trim()) return
    await addMasterProfesi(newProfesi.trim())
    setNewProfesi('')
    refetchProfesi()
    qc.invalidateQueries({ queryKey: ['master-profesi'] })
  }

  const handleDelete = async (table: string, id: string, queryKey: string) => {
    if (!confirm('Yakin ingin menghapus data ini? Pastikan tidak ada yang menggunakannya.')) return
    await deleteMasterItem(table, id)
    qc.invalidateQueries({ queryKey: [queryKey] })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Master Data</h1>
      <p className="text-gray-400 mb-8">Kelola data referensi: kota, profesi, kategori usaha, benefit</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kota */}
        <MasterSection
          title="🏙️ Kota / Wilayah"
          items={kotas?.map(k => ({ id: k.id, nama: k.nama })) || []}
          newValue={newKota}
          onNewValueChange={setNewKota}
          onAdd={handleAddKota}
          onDelete={(id) => handleDelete('master_kota', id, 'master-kota')}
          placeholder="Tambah kota baru..."
        />

        {/* Profesi */}
        <MasterSection
          title="💼 Profesi / Pekerjaan"
          items={profesis?.map(p => ({ id: p.id, nama: p.nama })) || []}
          newValue={newProfesi}
          onNewValueChange={setNewProfesi}
          onAdd={handleAddProfesi}
          onDelete={(id) => handleDelete('master_profesi', id, 'master-profesi')}
          placeholder="Tambah profesi baru..."
        />

        {/* Kategori Usaha - read only (seeded) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-semibold text-gray-800 mb-4">🏪 Kategori Usaha</h2>
          <div className="space-y-1">
            {kategoris?.map(k => (
              <div key={k.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50">
                <span className="text-sm text-gray-700">{k.nama}</span>
                <button
                  onClick={() => handleDelete('master_kategori_usaha', k.id, 'master-kategori')}
                  className="p-1 text-gray-300 hover:text-red-500 transition"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Benefit */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-semibold text-gray-800 mb-4">🎁 Jenis Benefit</h2>
          <div className="space-y-1">
            {benefits?.map(b => (
              <div key={b.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50">
                <span className="text-sm text-gray-700">{b.nama}</span>
                <button
                  onClick={() => handleDelete('master_benefit', b.id, 'master-benefit')}
                  className="p-1 text-gray-300 hover:text-red-500 transition"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MasterSection({
  title, items, newValue, onNewValueChange, onAdd, onDelete, placeholder
}: {
  title: string
  items: { id: string; nama: string }[]
  newValue: string
  onNewValueChange: (v: string) => void
  onAdd: () => void
  onDelete: (id: string) => void
  placeholder: string
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <h2 className="font-semibold text-gray-800 mb-4">{title}</h2>

      {/* Add */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newValue}
          onChange={e => onNewValueChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onAdd()}
          placeholder={placeholder}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={onAdd}
          className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* List */}
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50">
            <span className="text-sm text-gray-700">{item.nama}</span>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1 text-gray-300 hover:text-red-500 transition"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">Belum ada data</p>
        )}
      </div>
    </div>
  )
}
