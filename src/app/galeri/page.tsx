import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import Link from 'next/link'
import { Image as ImageIcon } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Galeri Momen — Alumni Tarakanita',
  description: 'Foto-foto kegiatan dan momen bersama alumni Tarakanita.',
}

export const revalidate = 1800

const KATEGORI = [
  { key: 'reuni',    label: 'Reuni 2024', bg: '#DDD8D0' },
  { key: 'seminar',  label: 'Seminar',    bg: '#E0CBCB' },
  { key: 'workshop', label: 'Workshop',   bg: '#DCDCDA' },
]

export default async function GaleriPage() {
  const supabase = createClient()
  const { data: fotos } = await supabase
    .from('galeri_momen')
    .select('*')
    .order('urutan', { ascending: true })
    .order('created_at', { ascending: false })

  const allFotos = fotos || []

  return (
    <div className="min-h-screen" style={{ background: '#F5F2EE' }}>
      <Navbar />
      <main className="max-w-lg mx-auto px-4 pt-20 pb-12">
        <div className="mb-6">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition">← Kembali</Link>
          <h1 className="text-2xl font-bold mt-2" style={{ color: '#1A1A1A' }}>Galeri Momen</h1>
          <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>Foto kegiatan dan momen bersama alumni Tarakanita</p>
        </div>

        {KATEGORI.map(kat => {
          const items = allFotos.filter(f => f.kategori === kat.key)
          return (
            <div key={kat.key} className="mb-8">
              <h2 className="text-base font-bold mb-3" style={{ color: '#1A1A1A' }}>{kat.label}</h2>
              {items.length === 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {[0,1,2].map(i => (
                    <div key={i} className="relative h-28 rounded-xl flex items-center justify-center overflow-hidden"
                      style={{ background: kat.bg }}>
                      <ImageIcon className="w-6 h-6 opacity-25" style={{ color: '#888' }} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {items.map(foto => (
                    <div key={foto.id} className="relative h-28 rounded-xl overflow-hidden">
                      <img src={foto.foto_url} alt={foto.keterangan || ''} className="w-full h-full object-cover" />
                      {foto.keterangan && (
                        <div className="absolute bottom-2 left-2.5">
                          <span className="text-white/85 text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(0,0,0,0.45)' }}>
                            {foto.keterangan}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </main>
    </div>
  )
}
