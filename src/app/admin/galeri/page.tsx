'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Image, Plus, Trash2, Upload, X } from 'lucide-react'

type Kategori = 'reuni' | 'seminar' | 'workshop'

interface GaleriItem {
  id: string
  kategori: Kategori
  foto_url: string
  keterangan: string | null
  urutan: number
  created_at: string
}

const KATEGORI_LABELS: Record<Kategori, string> = {
  reuni: 'Reuni 2024',
  seminar: 'Seminar',
  workshop: 'Workshop',
}

const KATEGORI_COLORS: Record<Kategori, string> = {
  reuni: '#C0272D',
  seminar: '#2A2A2A',
  workshop: '#6B6B6B',
}

export default function AdminGaleriPage() {
  const router = useRouter()
  const supabase = createClient()
  const [items, setItems] = useState<GaleriItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Kategori>('reuni')
  const [uploading, setUploading] = useState(false)
  const [keterangan, setKeterangan] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/admin-login')
      else fetchGaleri()
    })
  }, [])

  const fetchGaleri = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('galeri_momen')
      .select('*')
      .order('urutan', { ascending: true })
      .order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}.${ext}`
      const path = `galeri/${activeTab}/${fileName}`

      const { error: uploadErr } = await supabase.storage
        .from('galeri')
        .upload(path, file, { upsert: true })

      if (uploadErr) throw uploadErr

      const { data: { publicUrl } } = supabase.storage
        .from('galeri')
        .getPublicUrl(path)

      // Tentukan urutan (setelah item terakhir di kategori ini)
      const existing = items.filter(i => i.kategori === activeTab)
      const nextUrutan = existing.length > 0
        ? Math.max(...existing.map(i => i.urutan)) + 1
        : 1

      await supabase.from('galeri_momen').insert({
        kategori: activeTab,
        foto_url: publicUrl,
        keterangan: keterangan || null,
        urutan: nextUrutan,
      })

      setKeterangan('')
      await fetchGaleri()
    } catch (err: any) {
      alert('Upload gagal: ' + err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (item: GaleriItem) => {
    if (!confirm('Hapus foto ini?')) return
    await supabase.from('galeri_momen').delete().eq('id', item.id)
    // Hapus dari storage juga
    const path = item.foto_url.split('/galeri/')[1]
    if (path) await supabase.storage.from('galeri').remove([`galeri/${path}`])
    await fetchGaleri()
  }

  const filtered = items.filter(i => i.kategori === activeTab)

  return (
    <div className="flex w-full min-h-screen">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 w-full">
        <div className="pt-14 md:pt-0 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Image className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Galeri Momen Bersama</h1>
              <p className="text-gray-400 text-xs mt-0.5">Kelola foto untuk Reuni, Seminar, dan Workshop</p>
            </div>
          </div>
        </div>

        {/* Tab kategori */}
        <div className="flex gap-2 mb-5">
          {(Object.keys(KATEGORI_LABELS) as Kategori[]).map(kat => (
            <button key={kat} onClick={() => setActiveTab(kat)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition"
              style={{
                background: activeTab === kat ? KATEGORI_COLORS[kat] : '#F0EDEA',
                color: activeTab === kat ? 'white' : '#6B6B6B',
              }}>
              {KATEGORI_LABELS[kat]}
              <span className="ml-1.5 text-xs opacity-70">
                ({items.filter(i => i.kategori === kat).length})
              </span>
            </button>
          ))}
        </div>

        {/* Upload area */}
        <div className="bg-white border border-dashed rounded-2xl p-5 mb-5"
          style={{ borderColor: '#E0DDD8' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: '#1A1A1A' }}>
            Upload Foto untuk {KATEGORI_LABELS[activeTab]}
          </p>
          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-48">
              <label className="text-xs mb-1.5 block" style={{ color: '#6B6B6B' }}>Keterangan (opsional)</label>
              <input type="text" value={keterangan} onChange={e => setKeterangan(e.target.value)}
                placeholder="cth: Reuni Angkatan 2015"
                className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                style={{ borderColor: '#E0DDD8' }} />
            </div>
            <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition hover:opacity-90 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
              style={{ background: '#C0272D' }}>
              {uploading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengupload...</>
              ) : (
                <><Upload className="w-4 h-4" /> Pilih & Upload Foto</>
              )}
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
          <p className="text-xs mt-2" style={{ color: '#9B9B9B' }}>Format JPG/PNG/WebP, maks. 5MB. Foto terbaru muncul di halaman depan.</p>
        </div>

        {/* Grid foto */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border" style={{ borderColor: '#E0DDD8' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: '#F0EDEA' }}>
              <Image className="w-7 h-7" style={{ color: '#C0272D', opacity: 0.4 }} />
            </div>
            <p className="font-semibold mb-1" style={{ color: '#1A1A1A' }}>Belum ada foto</p>
            <p className="text-sm" style={{ color: '#9B9B9B' }}>Upload foto {KATEGORI_LABELS[activeTab]} di atas</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filtered.map(item => (
              <div key={item.id} className="relative group rounded-2xl overflow-hidden aspect-square bg-gray-100">
                <img src={item.foto_url} alt={item.keterangan || ''} className="w-full h-full object-cover" />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  {item.keterangan && (
                    <p className="text-white text-xs text-center px-3">{item.keterangan}</p>
                  )}
                  <button onClick={() => handleDelete(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition hover:opacity-80"
                    style={{ background: '#C0272D' }}>
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>
                {/* Badge kategori */}
                <div className="absolute top-2 left-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                    style={{ background: KATEGORI_COLORS[item.kategori] }}>
                    #{item.urutan}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
