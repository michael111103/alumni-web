'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAllShowcase, useDeleteShowcase, useUpdateShowcase } from '@/hooks/useAlumni'
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Calendar } from 'lucide-react'
import { formatTanggal, isShowcaseActive } from '@/lib/utils'
import ShowcaseFormModal from '@/components/admin/ShowcaseFormModal'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminUMKMPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/admin-login')
    })
  }, [])

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
    <div className="flex w-full min-h-screen">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 w-full">

        {/* Header */}
        <div className="pt-14 md:pt-0 mb-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Showcase UMKM</h1>
                <p className="text-gray-400 text-xs mt-0.5">Kelola UMKM di halaman utama</p>
              </div>
            </div>
            <button onClick={() => { setEditingId(null); setShowForm(true) }}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-blue-700 transition flex-shrink-0">
              <Plus className="w-3.5 h-3.5" />
              Tambah Showcase
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 text-xs sm:text-sm text-blue-700 flex items-start gap-2">
          <span className="flex-shrink-0">💡</span>
          <span>Showcase otomatis tampil/hilang berdasarkan jadwal. Maksimal 5 UMKM tampil bersamaan.</span>
        </div>

        {/* List */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-2xl h-20" />
            ))
          ) : !showcases?.length ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Star className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm font-medium">Belum ada showcase</p>
              <p className="text-gray-300 text-xs mt-1">Tambah showcase pertama!</p>
            </div>
          ) : showcases.map(showcase => {
            const active = isShowcaseActive(showcase.tanggal_mulai, showcase.tanggal_selesai)
            const umkm = showcase.umkm as any

            return (
              <div key={showcase.id}
                className={`bg-white border rounded-2xl p-4 ${
                  active && showcase.is_published ? 'border-green-200 bg-green-50/20' : 'border-gray-100'
                }`}>
                <div className="flex items-start gap-3">
                  {/* Urutan badge */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    active && showcase.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {showcase.urutan}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">{umkm?.nama_usaha || '-'}</p>
                      {active && showcase.is_published && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200 flex-shrink-0">
                          ● Aktif
                        </span>
                      )}
                      {!showcase.is_published && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex-shrink-0">Draft</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formatTanggal(showcase.tanggal_mulai)} — {formatTanggal(showcase.tanggal_selesai)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {umkm?.alumni?.[0]?.nama_lengkap || umkm?.alumni?.nama_lengkap || '-'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => togglePublish(showcase.id, showcase.is_published)}
                      className={`p-1.5 rounded-lg transition ${
                        showcase.is_published ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                      }`}>
                      {showcase.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => { setEditingId(showcase.id); setShowForm(true) }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(showcase.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
      </main>
    </div>
  )
}
