import Link from 'next/link'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import ShowcaseSection from '@/components/public/ShowcaseSection'
import HeroSearch from '@/components/public/HeroSearch'
import { ArrowRight, Users, ShoppingBag, Image as ImageIcon } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TarkiPages — Direktori & UMKM Alumni',
  description: 'Temukan sesama alumni, dukung usaha UMKM teman, dan perluas jaringanmu.',
}

export const revalidate = 1800

async function getStats() {
  try {
    const supabase = createClient()
    const [{ count: totalAlumni }, { count: totalUMKM }, { data: kotas }] = await Promise.all([
      supabase.from('alumni').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('umkm').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('master_kota').select('id'),
    ])
    return {
      totalAlumni: totalAlumni || 0,
      totalUMKM: totalUMKM || 0,
      totalKota: kotas?.length || 0,
    }
  } catch {
    return { totalAlumni: 0, totalUMKM: 0, totalKota: 0 }
  }
}

async function getRecentAlumni() {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('alumni')
      .select('id, nama_lengkap, angkatan, jabatan, foto_url, master_kota(nama), master_profesi(nama), umkm(id)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(6)
    return data || []
  } catch {
    return []
  }
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

const AVATAR_COLORS = [
  { bg: 'bg-red-100', text: 'text-red-800' },
  { bg: 'bg-stone-200', text: 'text-stone-700' },
  { bg: 'bg-red-100', text: 'text-red-900' },
  { bg: 'bg-stone-300', text: 'text-stone-800' },
  { bg: 'bg-gray-200', text: 'text-gray-600' },
  { bg: 'bg-red-100', text: 'text-red-700' },
]

export default async function HomePage() {
  const [stats, recentAlumni] = await Promise.all([getStats(), getRecentAlumni()])

  return (
    <main className="min-h-screen" style={{ background: '#FAF8F4', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* ── PLAID STRIPE ── */}
      <div className="flex h-1.5 pt-16">
        <div className="flex-[3]" style={{ background: '#C0272D' }} />
        <div className="flex-[1]" style={{ background: '#2A2A2A' }} />
        <div className="flex-[2]" style={{ background: '#6B6B6B' }} />
        <div className="flex-[1]" style={{ background: '#C0272D' }} />
        <div className="flex-[3]" style={{ background: '#2A2A2A' }} />
      </div>

      {/* ── HERO ── */}
      <section style={{ background: '#2A2A2A' }} className="overflow-hidden">
        <div className="max-w-2xl mx-auto px-6 pt-8">
          <div className="grid grid-cols-2 gap-5 items-end">
            {/* Left */}
            <div className="pb-8 col-span-2 sm:col-span-1">
              {/* Pill */}
              <div className="inline-flex items-center gap-1.5 border border-white/20 rounded-full px-3 py-1 text-white/70 text-xs tracking-widest uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-red-300" />
                Komunitas Alumni
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Satu ikatan,<br />
                <em className="text-red-300 not-italic" style={{ fontStyle: 'italic' }}>seribu koneksi.</em>
              </h1>

              <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
                Temukan sesama alumni, dukung usaha UMKM teman, dan perluas jaringanmu.
              </p>

              <div className="flex gap-2 flex-wrap">
                <Link href="/alumni"
                  className="text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition hover:opacity-90"
                  style={{ background: '#C0272D' }}>
                  Cari Alumni
                </Link>
                <Link href="/umkm"
                  className="text-white text-sm px-5 py-2.5 rounded-lg border border-white/25 hover:border-white/40 transition">
                  Lihat UMKM
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-6 pt-5 border-t border-white/10">
                <div>
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {stats.totalAlumni.toLocaleString('id-ID')}
                  </div>
                  <div className="text-white/45 text-xs mt-0.5">Alumni</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {stats.totalUMKM.toLocaleString('id-ID')}
                  </div>
                  <div className="text-white/45 text-xs mt-0.5">UMKM aktif</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {stats.totalKota}
                  </div>
                  <div className="text-white/45 text-xs mt-0.5">Kota</div>
                </div>
              </div>
            </div>

            {/* Right — photo cards */}
            <div className="hidden sm:grid grid-cols-2 gap-1.5 items-end pb-0">
              <div className="h-36 rounded-t-xl relative flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#8B1A1E,#C0272D)' }}>
                <ImageIcon className="w-7 h-7 text-white/20" />
                <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2"
                  style={{ background: 'linear-gradient(transparent,rgba(0,0,0,0.5))' }}>
                  <span className="text-white/85 text-xs font-medium">Reuni 2024</span>
                </div>
              </div>
              <div className="h-28 rounded-t-xl mt-8 relative flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#1A1A1A,#444)' }}>
                <ImageIcon className="w-6 h-6 text-white/20" />
                <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2"
                  style={{ background: 'linear-gradient(transparent,rgba(0,0,0,0.5))' }}>
                  <span className="text-white/85 text-xs font-medium">Workshop</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="h-8 rounded-t-[32px]" style={{ background: '#FAF8F4' }} />
      </section>

      {/* ── SEARCH SECTION ── */}
      <section className="bg-white border-b" style={{ borderColor: '#E0DDD8' }}>
        <div className="max-w-2xl mx-auto px-6 py-6">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#6B6B6B' }}>
            Cari Alumni atau Usaha
          </p>
          <HeroSearch dark />

          {/* Filter chips */}
          <div className="flex gap-2 flex-wrap mt-3">
            {['Semua', 'Jakarta', 'Surabaya', 'Bandung'].map((chip, i) => (
              <Link key={chip}
                href={i === 0 ? '/alumni' : `/alumni?search=${chip}`}
                className="text-xs px-3 py-1.5 rounded-full border transition"
                style={{
                  borderColor: i === 0 ? '#2A2A2A' : '#E0DDD8',
                  background: i === 0 ? '#2A2A2A' : 'transparent',
                  color: i === 0 ? 'white' : '#6B6B6B',
                }}>
                {chip}
              </Link>
            ))}
            <Link href="/alumni?filter=umkm"
              className="text-xs px-3 py-1.5 rounded-full border transition"
              style={{ borderColor: '#EDCACA', background: '#F9ECEC', color: '#C0272D' }}>
              Punya UMKM
            </Link>
            <Link href="/alumni?filter=kolaborasi"
              className="text-xs px-3 py-1.5 rounded-full border transition"
              style={{ borderColor: '#E0DDD8', color: '#6B6B6B' }}>
              Buka kolaborasi
            </Link>
          </div>
        </div>
      </section>

      {/* ── WEEK BAND ── */}
      <div className="flex items-center justify-between px-6 py-2.5 max-w-2xl mx-auto"
        style={{ background: '#C0272D' }}>
        <div className="flex items-center gap-2 text-white text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
          UMKM Pilihan Minggu Ini
        </div>
        <span className="text-white/65 text-xs">Diperbarui setiap Senin</span>
      </div>

      {/* ── SPOTLIGHT UMKM ── */}
      <section style={{ background: '#FAF8F4' }} className="max-w-2xl mx-auto px-6 py-6">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-bold text-2xl" style={{ fontFamily: "'Playfair Display', serif", color: '#1A1A1A' }}>
            Spotlight UMKM
          </h2>
          <Link href="/umkm" className="text-xs border-b pb-0.5 transition hover:opacity-70"
            style={{ color: '#6B6B6B', borderColor: '#E0DDD8' }}>
            Lihat semua UMKM →
          </Link>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-2 gap-2.5">
            <div className="skeleton h-56 rounded-2xl" />
            <div className="flex flex-col gap-2.5">
              <div className="skeleton h-[105px] rounded-xl" />
              <div className="skeleton h-[105px] rounded-xl" />
            </div>
          </div>
        }>
          <ShowcaseSplitSection />
        </Suspense>
      </section>

      {/* ── MOMEN BERSAMA (foto placeholder) ── */}
      <section className="max-w-2xl mx-auto px-6 pb-6">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif", color: '#1A1A1A' }}>
            Momen Bersama
          </h2>
          <span className="text-xs border-b pb-0.5" style={{ color: '#6B6B6B', borderColor: '#E0DDD8' }}>
            Lihat galeri →
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Reuni 2024', bg: '#DDD8D0' },
            { label: 'Seminar', bg: '#E0CBCB' },
            { label: 'Workshop', bg: '#DCDCDA' },
          ].map(item => (
            <div key={item.label} className="relative h-28 rounded-xl flex items-center justify-center overflow-hidden"
              style={{ background: item.bg }}>
              <ImageIcon className="w-6 h-6 opacity-25" style={{ color: '#888' }} />
              <div className="absolute bottom-2 left-2.5">
                <span className="text-white/85 text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(0,0,0,0.35)' }}>
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-2" style={{ color: '#6B6B6B' }}>
          Placeholder — akan diisi foto kegiatan alumni yang sebenarnya
        </p>
      </section>

      {/* ── DIREKTORI ALUMNI (preview 6) ── */}
      <section className="bg-white border-t border-b" style={{ borderColor: '#E0DDD8' }}>
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-bold text-2xl" style={{ fontFamily: "'Playfair Display', serif", color: '#1A1A1A' }}>
              Direktori Alumni
            </h2>
            <Link href="/alumni" className="text-xs border-b pb-0.5 transition hover:opacity-70"
              style={{ color: '#6B6B6B', borderColor: '#E0DDD8' }}>
              Lihat semua →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {recentAlumni.length > 0 ? recentAlumni.map((alumni, idx) => {
              const color = AVATAR_COLORS[idx % AVATAR_COLORS.length]
              const hasUMKM = alumni.umkm && alumni.umkm.length > 0
              return (
                <Link key={alumni.id} href={`/alumni/${alumni.id}`}>
                  <div className="border rounded-xl p-3.5 cursor-pointer transition-all hover:border-red-600 hover:bg-red-50"
                    style={{ borderColor: '#E0DDD8' }}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold mb-2 ${color.bg} ${color.text}`}>
                      {alumni.foto_url
                        ? <img src={alumni.foto_url} alt="" className="w-full h-full object-cover rounded-full" />
                        : getInitials(alumni.nama_lengkap)
                      }
                    </div>
                    <div className="text-xs font-semibold text-gray-900 leading-tight mb-0.5 truncate">
                      {alumni.nama_lengkap.split(' ')[0]} {alumni.nama_lengkap.split(' ')[1]?.[0]}.
                    </div>
                    <div className="text-xs mb-1.5 truncate" style={{ color: '#6B6B6B' }}>
                      {(alumni.master_profesi as any)?.nama || alumni.jabatan || '—'}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {hasUMKM && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: '#EFEFED', color: '#6B6B6B' }}>
                          UMKM
                        </span>
                      )}
                    </div>
                    {(alumni.master_kota as any)?.nama && (
                      <div className="text-xs font-medium mt-1.5" style={{ color: '#C0272D' }}>
                        {(alumni.master_kota as any).nama}
                      </div>
                    )}
                  </div>
                </Link>
              )
            }) : (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-28 rounded-xl" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{ background: '#2A2A2A' }} className="text-center px-6 py-8">
        <h3 className="font-bold text-xl text-white mb-1.5" style={{ fontFamily: "'Playfair Display', serif" }}>
          Punya usaha UMKM?
        </h3>
        <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Daftarkan dan tampil di spotlight minggu depan — gratis untuk semua alumni.
        </p>
        <Link href="/daftar"
          className="inline-block text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition"
          style={{ background: '#C0272D' }}>
          Daftarkan Sekarang
        </Link>
        <div className="flex justify-center gap-4 mt-5 pt-4"
          style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
          {[
            { label: 'Direktori', href: '/alumni' },
            { label: 'UMKM', href: '/umkm' },
            { label: 'Daftar', href: '/daftar' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="text-xs transition hover:opacity-60"
              style={{ color: 'rgba(255,255,255,0.35)' }}>
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

// ── Showcase split layout (1 besar + 2 kecil) ──
async function ShowcaseSplitSection() {
  const supabase = createClient()
  let showcases: any[] = []
  try {
    const { data } = await supabase
      .from('showcase_aktif')
      .select('*')
      .limit(3)
    showcases = data || []
  } catch {}

  if (!showcases.length) return (
    <div className="text-center py-10 rounded-2xl border" style={{ borderColor: '#E0DDD8' }}>
      <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-20" />
      <p className="text-sm" style={{ color: '#6B6B6B' }}>Belum ada UMKM featured minggu ini</p>
    </div>
  )

  const main = showcases[0]
  const subs = showcases.slice(1)

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {/* Kartu besar — hitam arang */}
      <Link href={`/alumni/${main.alumni_id || ''}`}>
        <div className="rounded-2xl p-5 relative overflow-hidden h-full min-h-[220px] flex flex-col justify-between cursor-pointer hover:opacity-95 transition"
          style={{ background: '#2A2A2A' }}>
          {/* Decorative circle */}
          <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />

          <div>
            <div className="flex items-center gap-1.5 text-xs mb-2.5 uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.5)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#C0272D' }} />
              Unggulan Minggu Ini
            </div>
            <h3 className="font-bold text-lg text-white leading-tight mb-1.5"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {main.nama_usaha}
            </h3>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {main.deskripsi_usaha?.slice(0, 80)}{main.deskripsi_usaha?.length > 80 ? '...' : ''}
            </p>
            {main.kategori_usaha && (
              <div className="flex gap-1.5 flex-wrap mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)' }}>
                  {main.kategori_usaha}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                style={{ background: 'rgba(255,255,255,0.15)' }}>
                {getInitials(main.nama_alumni || 'A')}
              </div>
              <div>
                <span className="text-xs font-medium text-white/75">{main.nama_alumni?.split(' ')[0]}</span>
                <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.35)' }}>· {main.angkatan}</span>
              </div>
            </div>
            <span className="text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: '#C0272D' }}>
              Lihat →
            </span>
          </div>
        </div>
      </Link>

      {/* 2 kartu kecil */}
      <div className="flex flex-col gap-2.5">
        {subs.length > 0 ? subs.map((item, i) => (
          <Link key={item.id} href={`/alumni/${item.alumni_id || ''}`}>
            <div className="bg-white rounded-xl p-3.5 border cursor-pointer hover:border-red-400 transition h-full"
              style={{ borderColor: '#E0DDD8', borderLeft: `3px solid ${i === 0 ? '#C0272D' : '#2A2A2A'}` }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: i === 0 ? '#C0272D' : '#444' }}>
                {item.kategori_usaha || 'UMKM'}
              </div>
              <h4 className="text-sm font-semibold mb-1 leading-tight" style={{ color: '#1A1A1A' }}>
                {item.nama_usaha}
              </h4>
              <p className="text-xs leading-relaxed mb-2.5" style={{ color: '#6B6B6B' }}>
                {item.deskripsi_usaha?.slice(0, 55)}{item.deskripsi_usaha?.length > 55 ? '...' : ''}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#6B6B6B' }}>
                  {item.nama_alumni?.split(' ')[0]} · {item.angkatan}
                </span>
                <span className="text-xs font-medium" style={{ color: '#6B6B6B' }}>Lihat →</span>
              </div>
            </div>
          </Link>
        )) : (
          [0,1].map(i => (
            <div key={i} className="bg-white rounded-xl p-3.5 border" style={{ borderColor: '#E0DDD8', borderLeft: `3px solid ${i === 0 ? '#C0272D' : '#2A2A2A'}` }}>
              <div className="skeleton h-3 w-16 rounded mb-2" />
              <div className="skeleton h-4 w-full rounded mb-1.5" />
              <div className="skeleton h-3 w-3/4 rounded" />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
