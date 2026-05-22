'use client'
// src/app/admin/alumni/page.tsx
import { useState } from 'react'
import { useAlumni, useDeleteAlumni } from '@/hooks/useAlumni'
import { Plus, Search, Edit, Trash2, Download, Upload } from 'lucide-react'
import { exportAlumniToExcel } from '@/lib/export'
import { getAllAlumniForExport } from '@/lib/queries/alumni'
import AlumniFormModal from '@/components/admin/AlumniFormModal'
import { getInitials } from '@/lib/utils'
import Image from 'next/image'

export default function AdminAlumniPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

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
    } catch (e) {
      alert('Gagal export data')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Alumni</h1>
          <p className="text-gray-400 mt-0.5">
            {data?.total ? `${data.total} alumni terdaftar` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={() => { setEditingId(null); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" /> Tambah Alumni
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Cari nama alumni..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
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
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="animate-pulse h-4 bg-gray-100 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
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
                <td className="px-4 py-3 text-gray-600">
                  {(alumni.master_profesi as any)?.nama || '-'}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {(alumni.master_kota as any)?.nama || '-'}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    alumni.is_active
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {alumni.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => { setEditingId(alumni.id); setShowForm(true) }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(alumni.id, alumni.nama_lengkap)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && !data?.data.length && (
          <div className="text-center py-12 text-gray-400">
            <p>Tidak ada alumni ditemukan</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex gap-2 justify-center mt-4">
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                p === page ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:border-blue-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <AlumniFormModal
          alumniId={editingId}
          onClose={() => { setShowForm(false); setEditingId(null) }}
          onSuccess={() => { setShowForm(false); setEditingId(null); refetch() }}
        />
      )}
    </div>
  )
}
