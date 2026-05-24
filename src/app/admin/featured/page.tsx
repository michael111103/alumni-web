'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { UserCheck, Search, Star, Trash2, CheckCircle } from 'lucide-react'

interface Alumni {
  id: string
  nama_lengkap: string
  angkatan: number | null
  jabatan: string | null
  foto_url: string | null
  master_profesi: { nama: string } | null
  umkm: { id: string }[]
}

interface FeaturedAlumni {
  id: string
  alumni_id: string
  is_active: boolean
  alumni: Alumni
}

function getInits(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

export default function AdminFeaturedPage() {
  const router = useRouter()
  const supabase = createClient()
  const [featured, setFeatured] = useState<FeaturedAlumni[]>([])
  const [allAlumni, setAllAlumni] = useState<Alumni[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/admin-login')
      else { fetchFeatured(); fetchAlumni() }
    })
  }, [])

  const fetchFeatured = async () => {
    const { data } = await supabase
      .from('featured_alumni')
      .select('*, alumni(id, nama_lengkap, angkatan, jabatan, foto_url, master_profesi(nama), umkm(id))')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    setFeatured((data || []) as any)
    setLoading(false)
  }

  const fetchAlumni = async () => {
    const { data } = await supabase
      .from('alumni')
      .select('id, nama_lengkap, angkatan, jabatan, foto_url, master_profesi(nama), umkm(id)')
      .eq('is_active', true)
      .order('nama_lengkap')
    setAllAlumni((data || []) as any)
  }

  const setAsFeatured = async (alumniId: string) => {
    setSavingId(alumniId)
    try {
      const { error: updateError } = await supabase.from('featured_alumni').update({ is_active: false }).eq('is_active', true)
      if (updateError) console.error('Update error:', updateError)
      const { error: insertError } = await supabase.from('featured_alumni').insert({ alumni_id: alumniId, is_active: true })
      if (insertError) console.error('Insert error:', insertError)
      await fetchFeatured()
    } finally {
      setSavingId(null)
    }
  }

  const removeFeatured = async (id: string) => {
    if (!confirm('Hapus alumni ini dari featured?')) return
    await supabase.from('featured_alumni').update({ is_active: false }).eq('id', id)
    await fetchFeatured()
  }

  const currentFeaturedAlumniId = featured[0]?.alumni_id

  const filteredAlumni = allAlumni.filter(a =>
    a.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
    (a.jabatan || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex w-full min-h-screen">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 w-full">
        <div className="pt-14 md:pt-0 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Alumni Featured</h1>
              <p className="text-gray-400 text-xs mt-0.5">Pilih alumni yang tampil di section beranda homepage</p>
            </div>
          </div>
        </div>

        {/* Current featured */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-5">
          <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            Alumni Featured Saat Ini
          </h2>
          {loading ? (
            <div className="h-16 rounded-xl bg-gray-100 animate-pulse" />
          ) : featured.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-400">Belum ada alumni featured — pilih dari daftar di bawah</p>
            </div>
          ) : (
            <div className="space-y-2">
              {featured.slice(0, 1).map(f => (
                <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: '#F9ECEC', border: '1px solid #EDCACA' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 overflow-hidden"
                    style={{ background: '#C0272D' }}>
                    {f.alumni?.foto_url
                      ? <img src={f.alumni.foto_url} alt="" className="w-full h-full object-cover" />
                      : getInits(f.alumni?.nama_lengkap || 'A')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate" style={{ color: '#1A1A1A' }}>{f.alumni?.nama_lengkap}</div>
                    <div className="text-xs" style={{ color: '#9B9B9B' }}>
                      {f.alumni?.jabatan || (f.alumni?.master_profesi as any)?.nama || '—'}
                      {f.alumni?.angkatan ? ` · Angkatan ${f.alumni.angkatan}` : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{ background: '#C0272D', color: 'white' }}>
                      ● Aktif
                    </span>
                    <button onClick={() => removeFeatured(f.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search & pilih alumni */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <h2 className="text-sm font-bold text-gray-700 mb-3">Pilih Alumni Baru</h2>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama atau profesi..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none" />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredAlumni.map(a => {
              const isCurrent = a.id === currentFeaturedAlumniId
              return (
                <div key={a.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition ${isCurrent ? 'border-red-200 bg-red-50/30' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden"
                    style={{ background: isCurrent ? '#C0272D' : '#3B3B3B' }}>
                    {a.foto_url
                      ? <img src={a.foto_url} alt="" className="w-full h-full object-cover" />
                      : getInits(a.nama_lengkap)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: '#1A1A1A' }}>{a.nama_lengkap}</div>
                    <div className="text-xs" style={{ color: '#9B9B9B' }}>
                      {a.jabatan || (a.master_profesi as any)?.nama || '—'}
                      {a.angkatan ? ` · ${a.angkatan}` : ''}
                      {a.umkm?.length > 0 ? ' · Punya UMKM' : ''}
                    </div>
                  </div>
                  {isCurrent ? (
                    <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ background: '#C0272D', color: 'white' }}>
                      <CheckCircle className="w-3 h-3" /> Featured
                    </span>
                  ) : (
                    <button onClick={() => setAsFeatured(a.id)} disabled={savingId === a.id}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition hover:opacity-80 flex-shrink-0 disabled:opacity-50"
                      style={{ borderColor: '#C0272D', color: '#C0272D' }}>
                      {savingId === a.id ? 'Menyimpan...' : 'Jadikan Featured'}
                    </button>
                  )}
                </div>
              )
            })}
            {filteredAlumni.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">Tidak ada alumni ditemukan</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
