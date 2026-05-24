'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function HeroSearch({ dark }: { dark?: boolean }) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/alumni?search=${encodeURIComponent(query)}`)
    else router.push('/alumni')
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 border rounded-xl px-3.5 py-2"
      style={{
        borderWidth: '1.5px',
        borderColor: dark ? '#E0DDD8' : '#e2e8f0',
        background: dark ? '#FAF8F4' : 'white',
      }}>
      <Search className="w-4 h-4 flex-shrink-0" style={{ color: '#bbb' }} />
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Nama, profesi, kota, atau jenis usaha..."
        className="flex-1 bg-transparent outline-none text-sm"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1A1A1A' }}
      />
      <button type="submit"
        className="text-white text-xs font-semibold px-4 py-2 rounded-lg flex-shrink-0 hover:opacity-90 transition"
        style={{ background: '#C0272D' }}>
        Cari
      </button>
    </form>
  )
}
