'use client'
// src/app/admin/umkm/page.tsx
import { useState } from 'react'
import { useAllShowcase, useDeleteShowcase, useUpdateShowcase } from '@/hooks/useAlumni'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { formatTanggal, isShowcaseActive } from '@/lib/utils'
import ShowcaseFormModal from '@/components/admin/ShowcaseFormModal'

export default function AdminUMKMPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data: showcases, isLoading, refetch } = useAllShowcase()
  const deleteMutation = useDeleteShowcase()
  const updateMutation = useUpdateShowcase()

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus showcase ini?')) return
    await deleteMutation.mutateAsync(id)
  }

  const togglePublish = async (id: string, current: boolean) => {
    await updateMutation.mutateAsync({ id, data: { is_published: !current } })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Showcase UMKM</h1>
          <p className="text-gray-400 mt-0.5">Kelola UMKM yang ditampilkan di halaman utama</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" /> Tambah Showcase
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-700">
        💡 Showcase akan otomatis tampil/hilang berdasarkan jadwal yang diset. Maksimal 5 UMKM tampil bersamaan.
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white border border-gray-200 rounded-xl h-20" />
          ))
        ) : !showcases?.length ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-3xl mb-3">📭</p>
            <p>Belum ada showcase. Tambah showcase pertama!</p>
          </div>
        ) : showcases.map(showcase => {
          const active = isShowcaseActive(showcase.tanggal_mulai, showcase.tanggal_selesai)
          const umkm = showcase.umkm as any

          return (
            <div
              key={showcase.id}
              className={`bg-white border rounded-xl p-4 flex items-center gap-4 ${
                active && showcase.is_published ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
              }`}
            >
              {/* Urutan */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                active && showcase.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {showcase.urutan}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {umkm?.nama_usaha || '-'}
                  </p>
                  {active && showcase.is_published && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                      ● Tampil sekarang
                    </span>
                  )}
                  {!showcase.is_published && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  by {umkm?.alumni?.[0]?.nama_lengkap || '-'} · 
                  {formatTanggal(showcase.tanggal_mulai)} — {formatTanggal(showcase.tanggal_selesai)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => togglePublish(showcase.id, showcase.is_published)}
                  className={`p-1.5 rounded-lg transition ${
                    showcase.is_published
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                  title={showcase.is_published ? 'Sembunyikan' : 'Publish'}
                >
                  {showcase.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => { setEditingId(showcase.id); setShowForm(true) }}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(showcase.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {showForm && (
        <ShowcaseFormModal
          showcaseId={editingId}
          onClose={() => { setShowForm(false); setEditingId(null) }}
          onSuccess={() => { setShowForm(false); setEditingId(null); refetch() }}
        />
      )}
    </div>
  )
}
