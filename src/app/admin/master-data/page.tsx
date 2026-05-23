'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useMasterKota, useMasterProfesi, useMasterKategoriUsaha, useMasterBenefit } from '@/hooks/useAlumni'
import { addMasterKota, addMasterProfesi, deleteMasterItem } from '@/lib/queries/master'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Database, MapPin, Briefcase, Tag, Gift } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function MasterDataPage() {
  const qc = useQueryClient()
  const router = useRouter()
  const supabase = createClient()
  const { data: kotas, refetch: refetchKota } = useMasterKota()
  const { data: profesis, refetch: refetchProfesi } = useMasterProfesi()
  const { data: kategoris } = useMasterKategoriUsaha()
  const { data: benefits } = useMasterBenefit()
  const [newKota, setNewKota] = useState('')
  const [newProfesi, setNewProfesi] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/admin-login')
    })
  }, [])

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
    if (!confirm('Yakin ingin menghapus? Pastikan tidak ada yang menggunakannya.')) return
    await deleteMasterItem(table, id)
    qc.invalidateQueries({ queryKey: [queryKey] })
  }

  return (
    <div className="flex w-full min-h-screen">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 w-full">

        {/* Header */}
        <div className="pt-14 md:pt-0 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Database className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Master Data</h1>
              <p className="text-gray-400 text-xs mt-0.5">Kelola data referensi website</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Kota */}
          <MasterSection
            title="Kota / Wilayah"
            icon={<MapPin className="w-4 h-4 text-blue-600" />}
            iconBg="bg-blue-100"
            items={kotas?.map(k => ({ id: k.id, nama: k.nama })) || []}
            newValue={newKota}
            onNewValueChange={setNewKota}
            onAdd={handleAddKota}
            onDelete={(id) => handleDelete('master_kota', id, 'master-kota')}
            placeholder="Tambah kota baru..."
          />

          {/* Profesi */}
          <MasterSection
            title="Profesi / Pekerjaan"
            icon={<Briefcase className="w-4 h-4 text-emerald-600" />}
            iconBg="bg-emerald-100"
            items={profesis?.map(p => ({ id: p.id, nama: p.nama })) || []}
            newValue={newProfesi}
            onNewValueChange={setNewProfesi}
            onAdd={handleAddProfesi}
            onDelete={(id) => handleDelete('master_profesi', id, 'master-profesi')}
            placeholder="Tambah profesi baru..."
          />

          {/* Kategori Usaha */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <h2 className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
              <span className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                <Tag className="w-4 h-4 text-orange-600" />
              </span>
              Kategori Usaha
            </h2>
            <div className="space-y-1 max-h-56 overflow-y-auto">
              {kategoris?.map(k => (
                <div key={k.id} className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-gray-50">
                  <span className="text-sm text-gray-700">{k.nama}</span>
                  <button onClick={() => handleDelete('master_kategori_usaha', k.id, 'master-kategori')}
                    className="p-1 text-gray-300 hover:text-red-500 transition">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Benefit */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <h2 className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
              <span className="w-7 h-7 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Gift className="w-4 h-4 text-yellow-600" />
              </span>
              Jenis Benefit
            </h2>
            <div className="space-y-1 max-h-56 overflow-y-auto">
              {benefits?.map(b => (
                <div key={b.id} className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-gray-50">
                  <span className="text-sm text-gray-700">{b.nama}</span>
                  <button onClick={() => handleDelete('master_benefit', b.id, 'master-benefit')}
                    className="p-1 text-gray-300 hover:text-red-500 transition">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function MasterSection({ title, icon, iconBg, items, newValue, onNewValueChange, onAdd, onDelete, placeholder }: {
  title: string
  icon: React.ReactNode
  iconBg: string
  items: { id: string; nama: string }[]
  newValue: string
  onNewValueChange: (v: string) => void
  onAdd: () => void
  onDelete: (id: string) => void
  placeholder: string
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4">
      <h2 className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
        <span className={`w-7 h-7 ${iconBg} rounded-lg flex items-center justify-center`}>{icon}</span>
        {title}
      </h2>
      <div className="flex gap-2 mb-3">
        <input type="text" value={newValue}
          onChange={e => onNewValueChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onAdd()}
          placeholder={placeholder}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-w-0" />
        <button onClick={onAdd}
          className="flex items-center justify-center w-9 h-9 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex-shrink-0">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-1 max-h-56 overflow-y-auto">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-gray-50">
            <span className="text-sm text-gray-700 truncate pr-2">{item.nama}</span>
            <button onClick={() => onDelete(item.id)}
              className="p-1 text-gray-300 hover:text-red-500 transition flex-shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-gray-400 text-center py-4">Belum ada data</p>}
      </div>
    </div>
  )
}
