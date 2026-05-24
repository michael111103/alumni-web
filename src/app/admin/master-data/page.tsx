'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useMasterProfesi, useMasterKategoriUsaha, useMasterBenefit } from '@/hooks/useAlumni'
import { addMasterProfesi, deleteMasterItem } from '@/lib/queries/master'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Database, Briefcase, Tag, Gift, Pencil, Check, X } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function MasterDataPage() {
  const qc = useQueryClient()
  const router = useRouter()
  const supabase = createClient()
  const { data: profesis, refetch: refetchProfesi } = useMasterProfesi()
  const { data: kategoris, refetch: refetchKategori } = useMasterKategoriUsaha()
  const { data: benefits, refetch: refetchBenefit } = useMasterBenefit()
  const [newProfesi, setNewProfesi] = useState('')
  const [newKategori, setNewKategori] = useState('')
  const [newBenefit, setNewBenefit] = useState('')
  const [newBenefitEmoji, setNewBenefitEmoji] = useState('🎁')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/admin-login')
    })
  }, [])

  const handleAddProfesi = async () => {
    if (!newProfesi.trim()) return
    await addMasterProfesi(newProfesi.trim())
    setNewProfesi('')
    refetchProfesi()
    qc.invalidateQueries({ queryKey: ['master-profesi'] })
  }

  const handleAddKategori = async () => {
    if (!newKategori.trim()) return
    await supabase.from('master_kategori_usaha').insert({ nama: newKategori.trim() })
    setNewKategori('')
    refetchKategori()
    qc.invalidateQueries({ queryKey: ['master-kategori'] })
  }

  const handleAddBenefit = async () => {
    if (!newBenefit.trim()) return
    await supabase.from('master_benefit').insert({ nama: newBenefit.trim(), emoji: newBenefitEmoji })
    setNewBenefit('')
    setNewBenefitEmoji('🎁')
    refetchBenefit()
    qc.invalidateQueries({ queryKey: ['master-benefit'] })
  }

  const handleDelete = async (table: string, id: string, queryKey: string, refetch: () => void) => {
    if (!confirm('Yakin ingin menghapus?')) return
    await deleteMasterItem(table, id)
    refetch()
    qc.invalidateQueries({ queryKey: [queryKey] })
  }

  const handleEditKategori = async (id: string, nama: string) => {
    await supabase.from('master_kategori_usaha').update({ nama }).eq('id', id)
    refetchKategori()
    qc.invalidateQueries({ queryKey: ['master-kategori'] })
  }

  const handleEditBenefit = async (id: string, nama: string, emoji: string) => {
    await supabase.from('master_benefit').update({ nama, emoji }).eq('id', id)
    refetchBenefit()
    qc.invalidateQueries({ queryKey: ['master-benefit'] })
  }

  const handleEditProfesi = async (id: string, nama: string) => {
    await supabase.from('master_profesi').update({ nama }).eq('id', id)
    refetchProfesi()
    qc.invalidateQueries({ queryKey: ['master-profesi'] })
  }

  return (
    <div className="flex w-full min-h-screen">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 w-full">
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

          {/* Profesi — dengan edit */}
          <EditableMasterSection
            title="Profesi / Pekerjaan"
            icon={<Briefcase className="w-4 h-4 text-emerald-600" />}
            iconBg="bg-emerald-100"
            items={profesis?.map(p => ({ id: p.id, nama: p.nama, emoji: '' })) || []}
            newValue={newProfesi}
            onNewValueChange={setNewProfesi}
            onAdd={handleAddProfesi}
            onDelete={(id) => handleDelete('master_profesi', id, 'master-profesi', refetchProfesi)}
            onEdit={(id, nama) => handleEditProfesi(id, nama)}
            placeholder="Tambah profesi baru..."
            showEmoji={false}
          />

          {/* Kategori Usaha — dengan edit */}
          <EditableMasterSection
            title="Kategori Usaha"
            icon={<Tag className="w-4 h-4 text-orange-600" />}
            iconBg="bg-orange-100"
            items={kategoris?.map(k => ({ id: k.id, nama: k.nama, emoji: '' })) || []}
            newValue={newKategori}
            onNewValueChange={setNewKategori}
            onAdd={handleAddKategori}
            onDelete={(id) => handleDelete('master_kategori_usaha', id, 'master-kategori', refetchKategori)}
            onEdit={(id, nama) => handleEditKategori(id, nama)}
            placeholder="Tambah kategori baru..."
            showEmoji={false}
          />

          {/* Benefit — dengan edit + emoji */}
          <EditableMasterSection
            title="Jenis Benefit"
            icon={<Gift className="w-4 h-4 text-yellow-600" />}
            iconBg="bg-yellow-100"
            items={benefits?.map(b => ({ id: b.id, nama: b.nama, emoji: (b as any).emoji || '🎁' })) || []}
            newValue={newBenefit}
            onNewValueChange={setNewBenefit}
            onAdd={handleAddBenefit}
            onDelete={(id) => handleDelete('master_benefit', id, 'master-benefit', refetchBenefit)}
            onEdit={(id, nama, emoji) => handleEditBenefit(id, nama, emoji || '🎁')}
            placeholder="Tambah benefit baru..."
            showEmoji={true}
            newEmoji={newBenefitEmoji}
            onNewEmojiChange={setNewBenefitEmoji}
          />
        </div>
      </main>
    </div>
  )
}

function EditableMasterSection({ title, icon, iconBg, items, newValue, onNewValueChange, onAdd, onDelete, onEdit, placeholder, showEmoji, newEmoji, onNewEmojiChange }: {
  title: string
  icon: React.ReactNode
  iconBg: string
  items: { id: string; nama: string; emoji: string }[]
  newValue: string
  onNewValueChange: (v: string) => void
  onAdd: () => void
  onDelete: (id: string) => void
  onEdit: (id: string, nama: string, emoji?: string) => void
  placeholder: string
  showEmoji: boolean
  newEmoji?: string
  onNewEmojiChange?: (v: string) => void
}) {
  const [editId, setEditId] = useState<string | null>(null)
  const [editNama, setEditNama] = useState('')
  const [editEmoji, setEditEmoji] = useState('')

  const startEdit = (item: { id: string; nama: string; emoji: string }) => {
    setEditId(item.id)
    setEditNama(item.nama)
    setEditEmoji(item.emoji)
  }

  const saveEdit = () => {
    if (editId) {
      onEdit(editId, editNama, editEmoji)
      setEditId(null)
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4">
      <h2 className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
        <span className={`w-7 h-7 ${iconBg} rounded-lg flex items-center justify-center`}>{icon}</span>
        {title}
      </h2>

      {/* Add new */}
      <div className="flex gap-2 mb-3">
        {showEmoji && onNewEmojiChange && (
          <input type="text" value={newEmoji} onChange={e => onNewEmojiChange(e.target.value)}
            className="w-12 border border-gray-200 rounded-xl px-2 py-2 text-sm text-center focus:outline-none"
            placeholder="🎁" />
        )}
        <input type="text" value={newValue}
          onChange={e => onNewValueChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onAdd()}
          placeholder={placeholder}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 min-w-0" />
        <button onClick={onAdd}
          className="flex items-center justify-center w-9 h-9 text-white rounded-xl transition flex-shrink-0"
          style={{ background: '#C0272D' }}>
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1 max-h-64 overflow-y-auto">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-2 py-1.5 px-2 rounded-xl hover:bg-gray-50">
            {editId === item.id ? (
              <>
                {showEmoji && (
                  <input type="text" value={editEmoji} onChange={e => setEditEmoji(e.target.value)}
                    className="w-10 border border-gray-200 rounded-lg px-1 py-1 text-sm text-center focus:outline-none" />
                )}
                <input type="text" value={editNama} onChange={e => setEditNama(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveEdit()}
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none min-w-0"
                  autoFocus />
                <button onClick={saveEdit} className="p-1 text-green-600 hover:text-green-700 transition flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setEditId(null)} className="p-1 text-gray-400 hover:text-gray-600 transition flex-shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                {showEmoji && <span className="text-base flex-shrink-0">{item.emoji}</span>}
                <span className="text-sm text-gray-700 truncate flex-1">{item.nama}</span>
                <button onClick={() => startEdit(item)} className="p-1 text-gray-300 hover:text-blue-500 transition flex-shrink-0">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onDelete(item.id)} className="p-1 text-gray-300 hover:text-red-500 transition flex-shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-gray-400 text-center py-4">Belum ada data</p>}
      </div>
    </div>
  )
}
