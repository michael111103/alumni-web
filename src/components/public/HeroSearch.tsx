'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, User, ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface SearchResult {
  id: string
  nama_lengkap: string
  jabatan?: string
  angkatan?: number
  type: 'alumni'
  umkm?: { nama_usaha: string }[]
}

interface Props {
  dark?: boolean
  onSelectAlumni?: (id: string) => void
}

export default function HeroSearch({ dark, onSelectAlumni }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Live search — debounced 300ms
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([])
      setOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const { data } = await supabase
          .from('alumni')
          .select('id, nama_lengkap, jabatan, angkatan, umkm(nama_usaha)')
          .eq('is_active', true)
          .or(`nama_lengkap.ilike.%${query}%,jabatan.ilike.%${query}%`)
          .limit(6)
        setResults(data || [])
        setOpen(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = (result: SearchResult) => {
    setQuery('')
    setOpen(false)
    setResults([])
    if (onSelectAlumni) {
      // Scroll ke bawah dulu, lalu tampil profil
      const section = document.getElementById('featured-alumni-section')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
        // Delay sedikit biar scroll selesai dulu
        setTimeout(() => onSelectAlumni(result.id), 400)
      } else {
        onSelectAlumni(result.id)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (results.length > 0) handleSelect(results[0])
  }

  return (
    <div ref={ref} className="relative">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: '#9B9B9B' }}
            />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setOpen(true)}
              placeholder="Nama, profesi, kota, atau jenis usaha..."
              className="w-full pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none border transition"
              style={{
                background: dark ? 'rgba(255,255,255,0.08)' : 'white',
                borderColor: dark ? 'rgba(255,255,255,0.15)' : '#E0DDD8',
                color: dark ? 'white' : '#1A1A1A',
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setResults([]); setOpen(false) }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#9B9B9B' }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="text-white text-sm font-semibold px-5 py-3 rounded-xl transition hover:opacity-90 flex-shrink-0"
            style={{ background: '#C0272D' }}
          >
            Cari
          </button>
        </div>
      </form>

      {/* Dropdown hasil */}
      {open && (
        <div
          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border shadow-lg overflow-hidden z-50"
          style={{ borderColor: '#E0DDD8', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
        >
          {loading ? (
            <div className="px-4 py-3 flex items-center gap-2" style={{ color: '#9B9B9B' }}>
              <div className="w-4 h-4 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin flex-shrink-0" />
              <span className="text-sm">Mencari...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-center" style={{ color: '#9B9B9B' }}>
              Tidak ada hasil untuk "{query}"
            </div>
          ) : (
            <div>
              <div className="px-3 pt-2.5 pb-1">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#C0272D' }}>
                  Alumni
                </span>
              </div>
              {results.map((result, idx) => {
                const hasUMKM = result.umkm && result.umkm.length > 0
                const initials = result.nama_lengkap.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
                return (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition text-left"
                    style={{ borderTop: idx > 0 ? '1px solid #F0EDEA' : 'none' }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: idx % 2 === 0 ? '#C0272D' : '#3B3B3B' }}
                    >
                      {initials}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate" style={{ color: '#1A1A1A' }}>
                        {result.nama_lengkap}
                      </div>
                      <div className="text-xs truncate" style={{ color: '#9B9B9B' }}>
                        {result.jabatan || 'Alumni Tarakanita'}
                        {result.angkatan ? ` · ${result.angkatan}` : ''}
                      </div>
                    </div>
                    {/* Badge UMKM */}
                    {hasUMKM && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1"
                        style={{ background: '#F9ECEC', color: '#C0272D' }}
                      >
                        <ShoppingBag className="w-3 h-3" />
                        UMKM
                      </span>
                    )}
                  </button>
                )
              })}
              {/* Footer hint */}
              <div
                className="px-3 py-2 border-t text-xs text-center"
                style={{ borderColor: '#F0EDEA', color: '#9B9B9B', background: '#FAFAFA' }}
              >
                Klik nama untuk melihat profil lengkap
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
