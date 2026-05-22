'use client'
import { useState } from 'react'
import { useAlumni } from '@/hooks/useAlumni'
import AlumniCard from '@/components/public/AlumniCard'
import FilterSidebar from '@/components/public/FilterSidebar'
import Pagination from '@/components/public/Pagination'
import Navbar from '@/components/public/Navbar'
import { useSearchParams } from 'next/navigation'
import type { AlumniFilter } from '@/types'
import { Search, SlidersHorizontal, Users, X } from 'lucide-react'

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
  const activeFilterCount = [filter.kota_id, filter.profesi_id, filter.benefit_id].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-white border-b border-gray-100 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Direktori Alumni</h1>
          </div>
          <p className="text-gray-400 text-sm ml-12">
            {data?.total ? `${data.total.toLocaleString('id-ID')} alumni terdaftar` : 'Memuat data alumni...'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Cari nama alumni..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm transition" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium text-sm">
            Cari
          </button>
          <button type="button" onClick={() => setShowFilter(!showFilter)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition ${
              showFilter || activeFilterCount > 0 ? 'border-blue-400 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
            }`}>
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
          {hasActiveFilter && (
            <button type="button" onClick={clearFilter}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 bg-white transition">
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {showFilter && (
          <div className="mb-4 animate-fade-up">
            <FilterSidebar filter={filter} onFilter={handleFilter} onClear={clearFilter} />
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {Array.from({ length: 15 }).map((_, i) => <div key={i} className="skeleton rounded-2xl h-44" />)}
          </div>
        ) : !data?.data?.length ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Search className="w-7 h-7 text-gray-300" />
            </div>
            <p className="font-medium text-gray-500">Alumni tidak ditemukan</p>
            <p className="text-sm text-gray-400 mt-1">Coba ubah kata kunci atau reset filter</p>
            {hasActiveFilter && (
              <button onClick={clearFilter} className="mt-4 text-sm text-blue-600 hover:underline font-medium">Reset filter</button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {data.data.map(alumni => <AlumniCard key={alumni.id} alumni={alumni} />)}
            </div>
            {data.totalPages > 1 && <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />}
          </>
        )}
      </div>
    </div>
  )
}
