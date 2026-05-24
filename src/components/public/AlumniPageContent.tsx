'use client'
import { useState } from 'react'
import { useAlumni } from '@/hooks/useAlumni'
import { useMasterKota, useMasterProfesi } from '@/hooks/useAlumni'
import Navbar from '@/components/public/Navbar'
import Pagination from '@/components/public/Pagination'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { AlumniFilter } from '@/types'
import { Search, SlidersHorizontal, X, MapPin, Briefcase, ChevronDown, Users } from 'lucide-react'

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

const AVATAR_COLORS = [
  '#C0272D', '#3B3B3B', '#C0272D', '#3B3B3B', '#888',
  '#C0272D', '#3B3B3B', '#C0272D', '#888', '#3B3B3B',
]

export default function AlumniPageContent() {
  const searchParams = useSearchParams()
  const [page, setPage] = useState(1)
  const [showFilter, setShowFilter] = useState(false)
  const [filter, setFilter] = useState<AlumniFilter>({
    search: searchParams.get('search') || '',
    kota_id: searchParams.get('kota_id') || '',
    profesi_id: searchParams.get('profesi_id') || '',
    benefit_id: searchParams.get('benefit_id') || '',
  })
  const [searchInput, setSearchInput] = useState(filter.search || '')

  const { data, isLoading } = useAlumni(filter, page)
  const { data: kotas } = useMasterKota()
  const { data: profesis } = useMasterProfesi()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilter(f => ({ ...f, search: searchInput }))
    setPage(1)
  }

  const handleFilter = (newFilter: Partial<AlumniFilter>) => {
    setFilter(f => ({ ...f, ...newFilter }))
    setPage(1)
  }

  const clearFilter = () => {
    setFilter({ search: '', kota_id: '', profesi_id: '', benefit_id: '' })
    setSearchInput('')
    setPage(1)
  }

  const hasActiveFilter = !!(filter.kota_id || filter.profesi_id || filter.benefit_id || filter.search)
  const activeFilterCount = [filter.kota_id, filter.profesi_id, filter.benefit_id].filter(Boolean).length

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
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs mb-4">
            <Link href="/" className="hover:opacity-70 transition font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Beranda
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>/</span>
            <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>Direktori</span>
          </div>

          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(192,39,45,0.3)' }}>
              <Users className="w-5 h-5" style={{ color: '#E8857A' }} />
            </div>
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Direktori Alumni
            </h1>
          </div>
          <p className="text-xs ml-12" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {data?.total
              ? `${data.total.toLocaleString('id-ID')} alumni terdaftar`
              : 'Memuat data alumni...'}
          </p>
        </div>
        <div className="h-6 rounded-t-[28px]" style={{ background: '#FAF8F4' }} />
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pb-12" style={{ marginTop: '-4px' }}>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9B9B9B' }} />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Nama, profesi, atau kota..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none border transition"
              style={{
                background: 'white',
                borderColor: '#E0DDD8',
                color: '#1A1A1A',
              }}
            />
          </div>
          <button type="submit"
            className="text-white text-sm font-semibold px-5 py-3 rounded-xl transition hover:opacity-90 flex-shrink-0"
            style={{ background: '#C0272D' }}>
            Cari
          </button>
          <button type="button"
            onClick={() => setShowFilter(!showFilter)}
            className="relative flex items-center gap-1.5 px-3.5 py-3 rounded-xl border transition flex-shrink-0"
            style={{
              borderColor: showFilter || activeFilterCount > 0 ? '#C0272D' : '#E0DDD8',
              background: showFilter || activeFilterCount > 0 ? '#F9ECEC' : 'white',
              color: showFilter || activeFilterCount > 0 ? '#C0272D' : '#6B6B6B',
            }}>
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 text-white text-xs rounded-full flex items-center justify-center font-bold"
                style={{ background: '#C0272D' }}>
                {activeFilterCount}
              </span>
            )}
          </button>
          {hasActiveFilter && (
            <button type="button" onClick={clearFilter}
              className="p-3 rounded-xl border transition flex-shrink-0"
              style={{ borderColor: '#E0DDD8', background: 'white', color: '#9B9B9B' }}>
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Filter panel */}
        {showFilter && (
          <div className="bg-white rounded-2xl border p-4 mb-3 space-y-3" style={{ borderColor: '#E0DDD8' }}>
            <div className="grid grid-cols-2 gap-3">
              {/* Filter Kota */}
              <div>
                <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: '#C0272D' }}>
                  <MapPin className="w-3 h-3" /> Kota
                </label>
                <div className="relative">
                  <select
                    value={filter.kota_id || ''}
                    onChange={e => handleFilter({ kota_id: e.target.value })}
                    className="w-full appearance-none border rounded-xl px-3 py-2.5 text-xs focus:outline-none transition pr-8"
                    style={{ borderColor: '#E0DDD8', background: '#FAFAFA', color: '#1A1A1A' }}>
                    <option value="">Semua Kota</option>
                    {kotas?.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#9B9B9B' }} />
                </div>
              </div>

              {/* Filter Profesi */}
              <div>
                <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: '#C0272D' }}>
                  <Briefcase className="w-3 h-3" /> Profesi
                </label>
                <div className="relative">
                  <select
                    value={filter.profesi_id || ''}
                    onChange={e => handleFilter({ profesi_id: e.target.value })}
                    className="w-full appearance-none border rounded-xl px-3 py-2.5 text-xs focus:outline-none transition pr-8"
                    style={{ borderColor: '#E0DDD8', background: '#FAFAFA', color: '#1A1A1A' }}>
                    <option value="">Semua Profesi</option>
                    {profesis?.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#9B9B9B' }} />
                </div>
              </div>
            </div>

            {/* Filter chips cepat */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#C0272D' }}>Filter Cepat</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Punya UMKM', key: 'filter', value: 'umkm' },
                  { label: 'Buka Kolaborasi', key: 'filter', value: 'kolaborasi' },
                ].map(chip => (
                  <span key={chip.value}
                    className="text-xs px-3 py-1.5 rounded-full border cursor-pointer transition"
                    style={{ borderColor: '#EDCACA', background: '#F9ECEC', color: '#C0272D' }}>
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>

            <button onClick={clearFilter}
              className="flex items-center gap-1.5 text-xs font-medium transition hover:opacity-70"
              style={{ color: '#9B9B9B' }}>
              <X className="w-3.5 h-3.5" /> Reset semua filter
            </button>
          </div>
        )}

        {/* Active filter pills */}
        {hasActiveFilter && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {filter.search && (
              <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                style={{ background: '#F9ECEC', color: '#C0272D', border: '1px solid #EDCACA' }}>
                "{filter.search}"
                <button onClick={() => { setFilter(f => ({ ...f, search: '' })); setSearchInput('') }}>
                  <X className="w-3 h-3 ml-0.5" />
                </button>
              </div>
            )}
            {filter.kota_id && (
              <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                style={{ background: '#F9ECEC', color: '#C0272D', border: '1px solid #EDCACA' }}>
                {kotas?.find(k => k.id === filter.kota_id)?.nama}
                <button onClick={() => handleFilter({ kota_id: '' })}>
                  <X className="w-3 h-3 ml-0.5" />
                </button>
              </div>
            )}
            {filter.profesi_id && (
              <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                style={{ background: '#F9ECEC', color: '#C0272D', border: '1px solid #EDCACA' }}>
                {profesis?.find(p => p.id === filter.profesi_id)?.nama}
                <button onClick={() => handleFilter({ profesi_id: '' })}>
                  <X className="w-3 h-3 ml-0.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Grid alumni */}
        {isLoading ? (
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-36 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : !data?.data?.length ? (
          <div className="text-center py-16 bg-white rounded-2xl border" style={{ borderColor: '#E0DDD8' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: '#F0EDEA' }}>
              <Search className="w-6 h-6" style={{ color: '#C0272D', opacity: 0.4 }} />
            </div>
            <p className="font-semibold mb-1" style={{ color: '#1A1A1A' }}>Alumni tidak ditemukan</p>
            <p className="text-sm" style={{ color: '#9B9B9B' }}>Coba ubah kata kunci atau reset filter</p>
            {hasActiveFilter && (
              <button onClick={clearFilter}
                className="mt-4 text-sm font-semibold hover:opacity-70 transition"
                style={{ color: '#C0272D' }}>
                Reset filter
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Result count */}
            <p className="text-xs mb-3" style={{ color: '#9B9B9B' }}>
              Menampilkan <span className="font-semibold" style={{ color: '#1A1A1A' }}>{data.data.length}</span> dari{' '}
              <span className="font-semibold" style={{ color: '#1A1A1A' }}>{data.total.toLocaleString('id-ID')}</span> alumni
            </p>

            <div className="grid grid-cols-3 gap-3">
              {data.data.map((alumni, idx) => {
                const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length]
                const hasUMKM = alumni.umkm && alumni.umkm.length > 0
                return (
                  <Link key={alumni.id} href={`/alumni/${alumni.id}`}>
                    <div className="bg-white border rounded-xl p-3.5 cursor-pointer transition-all hover:border-red-400 hover:shadow-sm h-full"
                      style={{ borderColor: '#E0DDD8' }}>
                      {/* Avatar */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold mb-2.5 overflow-hidden flex-shrink-0"
                        style={{ background: avatarColor, color: 'white' }}>
                        {alumni.foto_url
                          ? <img src={alumni.foto_url} alt="" className="w-full h-full object-cover rounded-full" />
                          : getInitials(alumni.nama_lengkap)}
                      </div>

                      {/* Nama singkat */}
                      <div className="text-xs font-bold leading-tight mb-0.5 truncate" style={{ color: '#1A1A1A' }}>
                        {alumni.nama_lengkap.split(' ')[0]}{' '}
                        {alumni.nama_lengkap.split(' ')[1]?.[0] ? `${alumni.nama_lengkap.split(' ')[1][0]}.` : ''}
                      </div>

                      {/* Profesi */}
                      <div className="text-xs mb-2 truncate" style={{ color: '#6B6B6B' }}>
                        {(alumni.master_profesi as any)?.nama || alumni.jabatan || '—'}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {hasUMKM && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full"
                            style={{ background: '#EFEFED', color: '#6B6B6B' }}>
                            UMKM
                          </span>
                        )}
                      </div>

                      {/* Kota */}
                      {(alumni.master_kota as any)?.nama && (
                        <div className="text-xs font-semibold mt-1.5 truncate" style={{ color: '#C0272D' }}>
                          {(alumni.master_kota as any).nama}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="mt-6">
                <Pagination page={page} totalPages={data.totalPages} onPageChange={(p) => {
                  setPage(p)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
