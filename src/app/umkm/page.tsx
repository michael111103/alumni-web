'use client'
import { useState } from 'react'
import { useUMKM, useMasterKota, useMasterKategoriUsaha } from '@/hooks/useAlumni'
import { formatWhatsApp, formatInstagram } from '@/lib/utils'
import { Search, ShoppingBag, MessageCircle, Instagram, Globe, MapPin, Tag, User, ChevronDown, X } from 'lucide-react'
import Image from 'next/image'
import Pagination from '@/components/public/Pagination'
import Navbar from '@/components/public/Navbar'
import type { UMKMFilter } from '@/types'

function getInits(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

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

  const hasFilter = !!(filter.kota_id || filter.kategori_id || filter.search)

  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* Plaid stripe */}
      <div className="flex h-1 pt-14">
        <div className="flex-[3]" style={{ background: '#C0272D' }} />
        <div className="flex-[1]" style={{ background: '#2A2A2A' }} />
        <div className="flex-[2]" style={{ background: '#6B6B6B' }} />
        <div className="flex-[1]" style={{ background: '#C0272D' }} />
        <div className="flex-[3]" style={{ background: '#2A2A2A' }} />
      </div>

      {/* Header dark */}
      <div style={{ background: '#2A2A2A' }}>
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(192,39,45,0.3)' }}>
              <ShoppingBag className="w-5 h-5" style={{ color: '#E8857A' }} />
            </div>
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              UMKM Alumni
            </h1>
          </div>
          <p className="text-xs ml-12" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {data?.total ? `${data.total.toLocaleString('id-ID')} usaha alumni terdaftar` : 'Memuat...'}
          </p>
        </div>
        <div className="h-6 rounded-t-[28px]" style={{ background: '#FAF8F4' }} />
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-12" style={{ marginTop: '-4px' }}>

        {/* Search & Filter */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9B9B9B' }} />
            <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Cari nama usaha..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none border transition"
              style={{ background: 'white', borderColor: '#E0DDD8', color: '#1A1A1A' }} />
          </div>
          <button type="submit"
            className="text-white text-sm font-semibold px-5 py-3 rounded-xl transition hover:opacity-90 flex-shrink-0"
            style={{ background: '#C0272D' }}>
            Cari
          </button>
          {hasFilter && (
            <button type="button"
              onClick={() => { setFilter({}); setSearchInput('') }}
              className="p-3 rounded-xl border flex-shrink-0"
              style={{ borderColor: '#E0DDD8', background: 'white', color: '#9B9B9B' }}>
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Filter dropdowns */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <select value={filter.kota_id || ''}
              onChange={e => { setFilter(f => ({ ...f, kota_id: e.target.value })); setPage(1) }}
              className="w-full appearance-none border rounded-xl px-3 py-2.5 text-xs focus:outline-none pr-8"
              style={{ borderColor: '#E0DDD8', background: 'white', color: filter.kota_id ? '#1A1A1A' : '#9B9B9B' }}>
              <option value="">Semua Kota</option>
              {kotas?.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#9B9B9B' }} />
          </div>
          <div className="relative flex-1">
            <select value={filter.kategori_id || ''}
              onChange={e => { setFilter(f => ({ ...f, kategori_id: e.target.value })); setPage(1) }}
              className="w-full appearance-none border rounded-xl px-3 py-2.5 text-xs focus:outline-none pr-8"
              style={{ borderColor: '#E0DDD8', background: 'white', color: filter.kategori_id ? '#1A1A1A' : '#9B9B9B' }}>
              <option value="">Semua Kategori</option>
              {kategoris?.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#9B9B9B' }} />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : !data?.data.length ? (
          <div className="text-center py-16 bg-white rounded-2xl border" style={{ borderColor: '#E0DDD8' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: '#F0EDEA' }}>
              <ShoppingBag className="w-7 h-7" style={{ color: '#C0272D', opacity: 0.4 }} />
            </div>
            <p className="font-semibold mb-1" style={{ color: '#1A1A1A' }}>Tidak ada UMKM ditemukan</p>
            <p className="text-sm" style={{ color: '#9B9B9B' }}>Coba ubah filter atau kata kunci</p>
          </div>
        ) : (
          <>
            <p className="text-xs mb-3" style={{ color: '#9B9B9B' }}>
              Menampilkan <span className="font-semibold" style={{ color: '#1A1A1A' }}>{data.data.length}</span> dari{' '}
              <span className="font-semibold" style={{ color: '#1A1A1A' }}>{data.total.toLocaleString('id-ID')}</span> usaha
            </p>
            <div className="space-y-3">
              {data.data.map((umkm) => (
                <div key={umkm.id} className="bg-white border rounded-2xl overflow-hidden hover:shadow-sm transition"
                  style={{ borderColor: '#E0DDD8' }}>
                  {/* Cover foto */}
                  {umkm.foto_produk_urls?.[0] && (
                    <div className="h-40 relative overflow-hidden">
                      <Image src={umkm.foto_produk_urls[0]} alt={umkm.nama_usaha} fill className="object-cover" />
                      {(umkm.master_kategori_usaha as any)?.nama && (
                        <div className="absolute top-3 left-3">
                          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ background: 'rgba(42,42,42,0.85)', color: 'white' }}>
                            <Tag className="w-3 h-3" /> {(umkm.master_kategori_usaha as any).nama}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      {/* Logo */}
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden"
                        style={{ background: '#2A2A2A' }}>
                        {umkm.logo_url
                          ? <Image src={umkm.logo_url} alt="logo" width={44} height={44} className="object-contain w-full h-full" />
                          : getInits(umkm.nama_usaha)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm leading-tight mb-0.5 truncate" style={{ color: '#1A1A1A' }}>
                          {umkm.nama_usaha}
                        </h3>
                        <div className="flex items-center gap-1 text-xs flex-wrap" style={{ color: '#9B9B9B' }}>
                          <User className="w-3 h-3" />
                          <span className="truncate">{(umkm.alumni as any)?.nama_lengkap}</span>
                          {(umkm.master_kota as any)?.nama && (
                            <><span>·</span><MapPin className="w-3 h-3" /><span>{(umkm.master_kota as any).nama}</span></>
                          )}
                        </div>
                        {!(umkm.foto_produk_urls?.[0]) && (umkm.master_kategori_usaha as any)?.nama && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1"
                            style={{ background: '#F9ECEC', color: '#C0272D' }}>
                            <Tag className="w-3 h-3" /> {(umkm.master_kategori_usaha as any).nama}
                          </span>
                        )}
                      </div>
                    </div>

                    {umkm.deskripsi && (
                      <p className="text-xs leading-relaxed mb-3" style={{ color: '#6B6B6B' }}>
                        {umkm.deskripsi.slice(0, 100)}{umkm.deskripsi.length > 100 ? '...' : ''}
                      </p>
                    )}

                    {/* Benefits */}
                    {(umkm.umkm_benefits as any)?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {(umkm.umkm_benefits as any).slice(0, 3).map((b: any) => (
                          <span key={b.id} className="text-xs px-2 py-0.5 rounded-full border flex items-center gap-1"
                            style={{ borderColor: '#E0DDD8', color: '#3A3A3A', background: '#FAFAFA' }}>
                            {b.master_benefit?.emoji || '🎁'} {b.master_benefit?.nama}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Kontak links */}
                    <div className="flex gap-3 flex-wrap pt-3 border-t" style={{ borderColor: '#F0EDEA' }}>
                      {umkm.whatsapp_bisnis && (
                        <a href={formatWhatsApp(umkm.whatsapp_bisnis)} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition hover:opacity-80"
                          style={{ background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' }}>
                          <MessageCircle className="w-3 h-3" /> WhatsApp
                        </a>
                      )}
                      {umkm.instagram_usaha && (
                        <a href={formatInstagram(umkm.instagram_usaha)} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition hover:opacity-80"
                          style={{ background: '#FDF4FF', color: '#7E22CE', border: '1px solid #E9D5FF' }}>
                          <Instagram className="w-3 h-3" /> Instagram
                        </a>
                      )}
                      {umkm.toko_online && (
                        <a href={umkm.toko_online} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition hover:opacity-80"
                          style={{ background: '#F9ECEC', color: '#C0272D', border: '1px solid #EDCACA' }}>
                          <ShoppingBag className="w-3 h-3" /> Toko
                        </a>
                      )}
                      {umkm.website && (
                        <a href={umkm.website} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition hover:opacity-80"
                          style={{ background: '#FAFAFA', color: '#3A3A3A', border: '1px solid #E0DDD8' }}>
                          <Globe className="w-3 h-3" /> Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {data.totalPages > 1 && (
              <div className="mt-6">
                <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
