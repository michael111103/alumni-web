'use client'
import { useState } from 'react'
import { useAlumni } from '@/hooks/useAlumni'
import AlumniCard from '@/components/public/AlumniCard'
import FilterSidebar from '@/components/public/FilterSidebar'
import Pagination from '@/components/public/Pagination'
import { useSearchParams } from 'next/navigation'
import type { AlumniFilter } from '@/types'
import { Search, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'

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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">AlumniNet</Link>
          <div className="flex gap-4">
            <Link href="/alumni" className="text-blue-600 font-semibold text-sm">Direktori Alumni</Link>
            <Link href="/umkm" className="text-gray-600 hover:text-blue-600 font-medium text-sm">UMKM Alumni</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Direktori Alumni</h1>
          <p className="text-gray-500 mt-1">
            {data?.total ? `${data.total.toLocaleString('id-ID')} alumni ditemukan` : 'Mencari alumni...'}
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Cari nama alumni..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium">
            Cari
          </button>
          <button
            type="button"
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition ${
              hasActiveFilter ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-600 bg-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
        </form>

        {showFilter && (
          <FilterSidebar filter={filter} onFilter={handleFilter} onClear={clearFilter} />
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl h-48 border border-gray-100" />
            ))}
          </div>
        ) : !data?.data?.length ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-medium">Alumni tidak ditemukan</p>
            {hasActiveFilter && (
              <button onClick={clearFilter} className="mt-4 text-blue-600 hover:underline text-sm">
                Reset filter
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data.data.map(alumni => (
                <AlumniCard key={alumni.id} alumni={alumni} />
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
