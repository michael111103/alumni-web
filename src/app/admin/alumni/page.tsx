'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAlumni, useDeleteAlumni } from '@/hooks/useAlumni'
import { Plus, Search, Edit, Trash2, Download, Users } from 'lucide-react'
import { exportAlumniToExcel } from '@/lib/export'
import { getAllAlumniForExport } from '@/lib/queries/alumni'
import AlumniFormModal from '@/components/admin/AlumniFormModal'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { getInitials } from '@/lib/utils'
import Image from 'next/image'

export default function AdminAlumniPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/admin-login')
    })
  }, [])

  const { data, isLoading, refetch } = useAlumni({ search }, page, 20)
  const deleteMutation = useDeleteAlumni()

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Yakin ingin menonaktifkan alumni "${nama}"?`)) return
    await deleteMutation.mutateAsync(id)
  }

  const handleExport = async () => {
    try {
      const data = await getAllAlumniForExport()
      exportAlumniToExcel(data as any)
    } catch { alert('Gagal export data') }
  }

  return (
    <div className="flex w-full min-h-screen">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 w-full">

        {/* Header */}
        <div className="pt-14 md:pt-0 mb-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Manajemen Alumni</h1>
                <p className="text-gray-400 text-xs mt-0.5">
                  {data?.total ? `${data.total} alumni terdaftar` : ''}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button onClick={() => { setEditingId(null); setShowForm(true) }}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-blue-700 transition">
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Alumni</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Cari nama alumni..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm" />
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-2xl h-24" />
            ))
          ) : !data?.data.length ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <Users className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Tidak ada alumni ditemukan</p>
            </div>
          ) : data.data.map(alumni => (
            <div key={alumni.id} className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {alumni.foto_url ? (
                    <Image src={alumni.foto_url} alt="" width={40} height={40} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-blue-600 text-xs font-bold">{getInitials(alumni.nama_lengkap)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{alumni.nama_lengkap}</p>
                  <p className="text-xs text-gray-400">
                    {alumni.angkatan && `Angkatan ${alumni.angkatan}`}
                    {alumni.angkatan && (alumni.master_profesi as any)?.nama && ' · '}
                    {(alumni.master_profesi as any)?.nama}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                  alumni.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {alumni.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">{(alumni.master_kota as any)?.nama || '-'}</p>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingId(alumni.id); setShowForm(true) }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(alumni.id, alumni.nama_lengkap)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Alumni</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Angkatan</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Profesi</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Kota</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="animate-pulse h-4 bg-gray-100 rounded w-3/4" /></td>
                  ))}</tr>
                ))
              ) : data?.data.map(alumni => (
                <tr key={alumni.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {alumni.foto_url ? (
                          <Image src={alumni.foto_url} alt="" width={32} height={32} className="object-cover w-full h-full" />
                        ) : (
                          <span className="text-blue-600 text-xs font-bold">{getInitials(alumni.nama_lengkap)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{alumni.nama_lengkap}</p>
                        {alumni.email && <p className="text-xs text-gray-400">{alumni.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{alumni.angkatan || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{(alumni.master_profesi as any)?.nama || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{(alumni.master_kota as any)?.nama || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      alumni.is_active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {alumni.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => { setEditingId(alumni.id); setShowForm(true) }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(alumni.id, alumni.nama_lengkap)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && !data?.data.length && (
            <div className="text-center py-12 text-gray-400 text-sm">Tidak ada alumni ditemukan</div>
          )}
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex gap-1.5 justify-center mt-4 flex-wrap">
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                  p === page ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:border-blue-300'
                }`}>
                {p}
              </button>
            ))}
          </div>
        )}

        {showForm && (
          <AlumniFormModal
            alumniId={editingId}
            onClose={() => { setShowForm(false); setEditingId(null) }}
            onSuccess={() => { setShowForm(false); setEditingId(null); refetch() }}
          />
        )}
      </main>
    </div>
  )
}
