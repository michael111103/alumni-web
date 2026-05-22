'use client'
// src/app/umkm/page.tsx
import { useState } from 'react'
import { useUMKM, useMasterKota, useMasterKategoriUsaha } from '@/hooks/useAlumni'
import { formatWhatsApp, formatInstagram } from '@/lib/utils'
import { Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Pagination from '@/components/public/Pagination'
import type { UMKMFilter } from '@/types'

export default function UMKMPage() {
  const [filter, setFilter] = useState<UMKMFilter>({})
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading } = useUMKM(filter, page)
  const { data: kotas } = useMasterKota()
  const { data: kategoris } = useMasterKategoriUsaha()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilter(f => ({ ...f, search: searchInput }))
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">AlumniNet</Link>
          <div className="flex gap-4">
            <Link href="/alumni" className="text-gray-600 hover:text-blue-600 font-medium text-sm">Direktori Alumni</Link>
            <Link href="/umkm" className="text-blue-600 font-semibold text-sm">UMKM Alumni</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">UMKM Alumni</h1>
          <p className="text-gray-400 mt-1">
            {data?.total ? `${data.total} usaha alumni` : 'Memuat...'}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap gap-3">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-48">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Cari nama usaha..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700 transition">
              Cari
            </button>
          </form>

          <select
            value={filter.kota_id || ''}
            onChange={e => { setFilter(f => ({ ...f, kota_id: e.target.value })); setPage(1) }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
          >
            <option value="">📍 Semua Kota</option>
            {kotas?.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </select>

          <select
            value={filter.kategori_id || ''}
            onChange={e => { setFilter(f => ({ ...f, kategori_id: e.target.value })); setPage(1) }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
          >
            <option value="">🏪 Semua Kategori</option>
            {kategoris?.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </select>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl h-56 border border-gray-100" />
            ))}
          </div>
        ) : !data?.data.length ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🏪</p>
            <p>Tidak ada UMKM ditemukan</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.data.map(umkm => (
                <div key={umkm.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
                  {/* Foto */}
                  <div className="h-40 bg-gray-100 relative">
                    {umkm.foto_produk_urls?.[0] ? (
                      <Image src={umkm.foto_produk_urls[0]} alt={umkm.nama_usaha} fill className="object-cover" />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-300 text-4xl">🏪</div>
                    )}
                    {(umkm.master_kategori_usaha as any)?.nama && (
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                        {(umkm.master_kategori_usaha as any).nama}
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{umkm.nama_usaha}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      oleh {(umkm.alumni as any)?.nama_lengkap} · {(umkm.master_kota as any)?.nama}
                    </p>

                    {umkm.deskripsi && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{umkm.deskripsi}</p>
                    )}

                    {/* Benefits */}
                    {(umkm.umkm_benefits as any)?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {(umkm.umkm_benefits as any).slice(0, 2).map((b: any) => (
                          <span key={b.id} className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full">
                            {b.master_benefit?.nama}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 mt-3">
                      {umkm.whatsapp_bisnis && (
                        <a href={formatWhatsApp(umkm.whatsapp_bisnis)} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-green-700 hover:underline">💬 WA</a>
                      )}
                      {umkm.instagram_usaha && (
                        <a href={formatInstagram(umkm.instagram_usaha)} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-pink-700 hover:underline">📸 IG</a>
                      )}
                      {umkm.toko_online && (
                        <a href={umkm.toko_online} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-orange-700 hover:underline">🛒 Toko</a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {data.totalPages > 1 && (
              <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
