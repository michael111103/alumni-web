import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 4) return [1,2,3,4,5,'...',totalPages]
    if (page >= totalPages - 3) return [1,'...',totalPages-4,totalPages-3,totalPages-2,totalPages-1,totalPages]
    return [1,'...',page-1,page,page+1,'...',totalPages]
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
        className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50 transition">
        <ChevronLeft className="w-4 h-4 text-gray-600" />
      </button>
      {getPages().map((p, i) =>
        p === '...'
          ? <span key={`dot-${i}`} className="px-2 text-gray-400 text-sm">···</span>
          : <button key={p} onClick={() => onPageChange(p as number)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition ${
                p === page ? 'bg-red-700 text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}>
              {p}
            </button>
      )}
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
        className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50 transition">
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  )
}
