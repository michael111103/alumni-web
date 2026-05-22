'use client'
import { useState } from 'react'
import { useUMKM, useMasterKota, useMasterKategoriUsaha } from '@/hooks/useAlumni'
import { formatWhatsApp, formatInstagram } from '@/lib/utils'
import { Search, ShoppingBag, MessageCircle, Instagram, Globe, MapPin, Tag, User } from 'lucide-react'
import Image from 'next/image'
import Pagination from '@/components/public/Pagination'
import Navbar from '@/components/public/Navbar'
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
      <Navbar />
      <div className="bg-white border-b border-gray-100 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">UMKM Alumni</h1>
          </div>
          <p className="text-gray-400 text-sm ml-12">
            {data?.total ? `${data.total.toLocaleString('id-ID')} usaha alumni` : 'Memuat...'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-3 mb-5 flex flex-wrap gap-2">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-48">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
                placeholder="Cari nama usaha..."
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition" />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
              Cari
            </button>
          </form>
          <select value={filter.kota_id || ''} onChange={e => { setFilter(f => ({ ...f, kota_id: e.target.value })); setPage(1) }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-gray-600">
            <option value="">Semua Kota</option>
            {kotas?.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </select>
          <select value={filter.kategori_id || ''} onChange={e => { setFilter(f => ({ ...f, kategori_id: e.target.value })); setPage(1) }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-gray-600">
            <option value="">Semua Kategori</option>
            {kategoris?.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => <div key={i} className="skeleton rounded-2xl h-64" />)}
          </div>
        ) : !data?.data.length ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-7 h-7 text-gray-300" />
            </div>
            <p className="font-medium text-gray-500">Tidak ada UMKM ditemukan</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.data.map((umkm, idx) => (
                <div key={umkm.id} className={`bg-white border border-gray-100 rounded-2xl overflow-hidden card-hover animate-fade-up-delay-${Math.min(idx%3+1,3)}`}>
                  <div className="h-44 bg-gradient-to-br from-orange-50 to-orange-100 relative overflow-hidden">
                    {umkm.foto_produk_urls?.[0] ? (
                      <Image src={umkm.foto_produk_urls[0]} alt={umkm.nama_usaha} fill className="object-cover" />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-orange-200" />
                      </div>
                    )}
                    {(umkm.master_kategori_usaha as any)?.nama && (
                      <div className="absolute top-3 left-3">
                        <span className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                          <Tag className="w-3 h-3" /> {(umkm.master_kategori_usaha as any).nama}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-2">
                      {umkm.logo_url ? (
                        <Image src={umkm.logo_url} alt="logo" width={36} height={36} className="rounded-lg object-contain border border-gray-100 flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ShoppingBag className="w-4 h-4 text-orange-600" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">{umkm.nama_usaha}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5 flex-wrap">
                          <User className="w-3 h-3" />
                          <span className="truncate">{(umkm.alumni as any)?.nama_lengkap}</span>
                          {(umkm.master_kota as any)?.nama && (
                            <><span>·</span><MapPin className="w-3 h-3" /><span>{(umkm.master_kota as any).nama}</span></>
                          )}
                        </div>
                      </div>
                    </div>
                    {umkm.deskripsi && <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{umkm.deskripsi}</p>}
                    {(umkm.umkm_benefits as any)?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {(umkm.umkm_benefits as any).slice(0,2).map((b: any) => (
                          <span key={b.id} className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-100 px-2 py-0.5 rounded-full">
                            {b.master_benefit?.nama}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3 flex-wrap pt-2 border-t border-gray-50">
                      {umkm.whatsapp_bisnis && (
                        <a href={formatWhatsApp(umkm.whatsapp_bisnis)} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-green-700 hover:text-green-800 font-medium transition">
                          <MessageCircle className="w-3 h-3" /> WA
                        </a>
                      )}
                      {umkm.instagram_usaha && (
                        <a href={formatInstagram(umkm.instagram_usaha)} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-pink-700 hover:text-pink-800 font-medium transition">
                          <Instagram className="w-3 h-3" /> IG
                        </a>
                      )}
                      {umkm.toko_online && (
                        <a href={umkm.toko_online} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-orange-700 hover:text-orange-800 font-medium transition">
                          <ShoppingBag className="w-3 h-3" /> Toko
                        </a>
                      )}
                      {umkm.website && (
                        <a href={umkm.website} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-800 font-medium transition">
                          <Globe className="w-3 h-3" /> Web
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {data.totalPages > 1 && <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />}
          </>
        )}
      </div>
    </div>
  )
}
