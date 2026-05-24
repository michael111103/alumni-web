import Link from 'next/link'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import HeroSearch from '@/components/public/HeroSearch'
import { ShoppingBag, Image as ImageIcon, MessageCircle, Instagram, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TarkiPages — Direktori & UMKM Alumni',
  description: 'Temukan sesama alumni, dukung usaha UMKM teman, dan perluas jaringanmu.',
}

export const revalidate = 1800

// ── helpers ──
function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

const AVATAR_COLORS = [
  { bg: '#C0272D', text: '#fff' },
  { bg: '#3B3B3B', text: '#fff' },
  { bg: '#C0272D', text: '#fff' },
  { bg: '#3B3B3B', text: '#fff' },
  { bg: '#888',    text: '#fff' },
  { bg: '#C0272D', text: '#fff' },
]

// ── data fetchers ──
async function getStats() {
  try {
    const supabase = createClient()
    const [{ count: totalAlumni }, { count: totalUMKM }, { data: kotas }] = await Promise.all([
      supabase.from('alumni').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('umkm').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('master_kota').select('id'),
    ])
    return { totalAlumni: totalAlumni || 0, totalUMKM: totalUMKM || 0, totalKota: kotas?.length || 0 }
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
  } catch { return [] }
}

async function getFeaturedAlumni() {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('alumni')
      .select(`
        *,
        master_kota(id, nama),
        master_profesi(id, nama),
        umkm(
          *,
          master_kategori_usaha(id, nama),
          master_kota(id, nama),
          umkm_benefits(*, master_benefit(id, nama))
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    return data || null
  } catch { return null }
}

// ── page ──
export default async function HomePage() {
  const [stats, recentAlumni, featuredAlumni] = await Promise.all([
    getStats(), getRecentAlumni(), getFeaturedAlumni(),
  ])

  const hasUMKM = !!(featuredAlumni?.umkm && featuredAlumni.umkm.length > 0)
  const firstUMKM = hasUMKM ? (featuredAlumni!.umkm as any[])[0] : null
  const allBenefits = hasUMKM
    ? (featuredAlumni!.umkm as any[]).flatMap(u => u.umkm_benefits || [])
    : []

  return (
    <main className="min-h-screen" style={{ background: '#FAF8F4', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* ── PLAID STRIPE ── */}
      <div className="flex h-1 pt-14">
        <div className="flex-[3]" style={{ background: '#C0272D' }} />
        <div className="flex-[1]" style={{ background: '#2A2A2A' }} />
        <div className="flex-[2]" style={{ background: '#6B6B6B' }} />
        <div className="flex-[1]" style={{ background: '#C0272D' }} />
        <div className="flex-[3]" style={{ background: '#2A2A2A' }} />
      </div>

      {/* ── HERO ── */}
      <section style={{ background: '#2A2A2A' }} className="overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 pt-8 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
            <div className="pb-8">
              <div className="inline-flex items-center gap-1.5 border border-white/20 rounded-full px-3 py-1 text-white/70 text-xs tracking-widest uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-red-300" />
                Komunitas Alumni Tarakanita
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Satu ikatan,<br />
                <em className="not-italic" style={{ fontStyle: 'italic', color: '#E8857A' }}>seribu koneksi.</em>
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
            <div className="hidden md:grid grid-cols-2 gap-2 items-end pb-0">
              <div className="h-40 rounded-t-2xl relative flex items-center justify-center overflow-hidden"
                style={{ background: 'linear-gradient(135deg,#8B1A1E,#C0272D)' }}>
                <ImageIcon className="w-8 h-8 text-white/20" />
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5"
                  style={{ background: 'linear-gradient(transparent,rgba(0,0,0,0.55))' }}>
                  <span className="text-white/90 text-xs font-medium">Reuni 2024</span>
                </div>
              </div>
              <div className="h-28 rounded-t-2xl mt-12 relative flex items-center justify-center overflow-hidden"
                style={{ background: 'linear-gradient(135deg,#1A1A1A,#444)' }}>
                <ImageIcon className="w-6 h-6 text-white/20" />
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2"
                  style={{ background: 'linear-gradient(transparent,rgba(0,0,0,0.55))' }}>
                  <span className="text-white/90 text-xs font-medium">Workshop</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-8 rounded-t-[32px]" style={{ background: '#FAF8F4' }} />
      </section>

      {/* ── SEARCH ── */}
      <section className="bg-white border-b" style={{ borderColor: '#E0DDD8' }}>
        <div className="max-w-5xl mx-auto px-6 py-6">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#6B6B6B' }}>
            Cari Alumni atau Usaha
          </p>
          <HeroSearch dark />
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
      <div style={{ background: '#C0272D' }}>
        <div className="max-w-5xl mx-auto px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            UMKM Pilihan Minggu Ini — 19–25 Mei 2025
          </div>
          <span className="text-white/65 text-xs">Diperbarui setiap Senin</span>
        </div>
      </div>

      {/* ── SPOTLIGHT UMKM ── */}
      <section style={{ background: '#FAF8F4' }} className="px-6 py-6">
        <div className="max-w-5xl mx-auto">
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
              <div className="h-56 rounded-2xl bg-gray-200 animate-pulse" />
              <div className="flex flex-col gap-2.5">
                <div className="h-[105px] rounded-xl bg-gray-200 animate-pulse" />
                <div className="h-[105px] rounded-xl bg-gray-200 animate-pulse" />
              </div>
            </div>
          }>
            <ShowcaseSplitSection />
          </Suspense>
        </div>
      </section>

      {/* ── MOMEN BERSAMA ── */}
      <section className="px-6 pb-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif", color: '#1A1A1A' }}>
              Momen Bersama
            </h2>
            <span className="text-xs border-b pb-0.5 cursor-pointer" style={{ color: '#6B6B6B', borderColor: '#E0DDD8' }}>
              Lihat galeri →
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Reuni 2024', bg: '#DDD8D0' },
              { label: 'Seminar',    bg: '#E0CBCB' },
              { label: 'Workshop',   bg: '#DCDCDA' },
            ].map(item => (
              <div key={item.label}
                className="relative h-28 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition"
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
        </div>
      </section>

      {/* ── DIREKTORI ALUMNI ── */}
      <section className="bg-white border-t border-b" style={{ borderColor: '#E0DDD8' }}>
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-bold text-2xl" style={{ fontFamily: "'Playfair Display', serif", color: '#1A1A1A' }}>
              Direktori Alumni
            </h2>
            <Link href="/alumni" className="text-xs border-b pb-0.5 transition hover:opacity-70"
              style={{ color: '#6B6B6B', borderColor: '#E0DDD8' }}>
              Lihat semua →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {recentAlumni.length > 0
              ? recentAlumni.map((alumni, idx) => {
                  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length]
                  const hasUMKMFlag = alumni.umkm && alumni.umkm.length > 0
                  return (
                    <Link key={alumni.id} href={`/alumni/${alumni.id}`}>
                      <div className="border rounded-xl p-3.5 cursor-pointer transition-all hover:border-red-500 hover:shadow-sm h-full"
                        style={{ borderColor: '#E0DDD8' }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold mb-2.5 overflow-hidden"
                          style={{ background: color.bg, color: color.text }}>
                          {alumni.foto_url
                            ? <img src={alumni.foto_url} alt="" className="w-full h-full object-cover rounded-full" />
                            : getInitials(alumni.nama_lengkap)}
                        </div>
                        <div className="text-xs font-bold text-gray-900 leading-tight mb-0.5 truncate">
                          {alumni.nama_lengkap.split(' ')[0]} {alumni.nama_lengkap.split(' ')[1]?.[0]}.
                        </div>
                        <div className="text-xs mb-2 truncate" style={{ color: '#6B6B6B' }}>
                          {(alumni.master_profesi as any)?.nama || alumni.jabatan || '—'}
                        </div>
                        {hasUMKMFlag && (
                          <div className="flex flex-wrap gap-1 mb-1.5">
                            <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: '#EFEFED', color: '#6B6B6B' }}>
                              UMKM
                            </span>
                          </div>
                        )}
                        {(alumni.master_kota as any)?.nama && (
                          <div className="text-xs font-semibold mt-1" style={{ color: '#C0272D' }}>
                            {(alumni.master_kota as any).nama}
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })
              : Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-32 rounded-xl bg-gray-100 animate-pulse" />
                ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{ background: '#2A2A2A' }} className="text-center px-6 py-10">
        <h3 className="font-bold text-2xl text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Punya usaha UMKM?
        </h3>
        <p className="text-sm mb-5 max-w-sm mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Daftarkan dan tampil di spotlight minggu depan — gratis untuk alumni Tarakanita.
        </p>
        <Link href="/daftar"
          className="inline-block text-white text-sm font-semibold px-7 py-3 rounded-lg hover:opacity-90 transition mb-6"
          style={{ background: '#C0272D' }}>
          Daftarkan Sekarang
        </Link>
        <div className="flex justify-center gap-2 flex-wrap">
          {[
            { label: 'Direktori', href: '/alumni' },
            { label: 'UMKM',      href: '/umkm' },
            { label: 'Tentang',   href: '/tentang' },
            { label: 'Kontak',    href: '/kontak' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="text-xs font-medium px-4 py-1.5 rounded-full transition hover:opacity-80"
              style={{ background: '#C0272D', color: 'white' }}>
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ── PROFIL ALUMNI FEATURED (setelah CTA) ──
          ══════════════════════════════════════════ */}
      {featuredAlumni && (
        <>
          {/* ── TABS ── */}
          <div className="bg-white border-b" style={{ borderColor: '#E0DDD8' }}>
            <div className="max-w-2xl mx-auto flex">
              <div className="flex-1 py-3.5 text-sm font-semibold text-center relative"
                style={{ color: '#C0272D' }}>
                Profil Alumni
                <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#C0272D' }} />
              </div>
              <Link href={hasUMKM ? `/alumni/${featuredAlumni.id}` : '#'}
                className="flex-1 py-3.5 text-sm font-semibold text-center transition hover:opacity-70"
                style={{ color: '#6B6B6B' }}>
                Detail UMKM
              </Link>
            </div>
          </div>

          {/* ── BREADCRUMB ── */}
          <div className="max-w-2xl mx-auto px-4 pt-3 pb-1">
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9B9B9B' }}>
              <Link href="/" className="hover:opacity-70 transition">Beranda</Link>
              <span>/</span>
              <Link href="/alumni" className="hover:opacity-70 transition">Direktori</Link>
              <span>/</span>
              <span style={{ color: '#3A3A3A' }}>{featuredAlumni.nama_lengkap}</span>
            </div>
          </div>

          {/* ── PROFILE HEADER dark ── */}
          <div style={{ background: '#2A2A2A' }}>
            <div className="max-w-2xl mx-auto px-4 pt-5 pb-7">
              <div className="flex items-center gap-4">
                <div
                  className="w-[68px] h-[68px] rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 overflow-hidden"
                  style={{ background: '#C0272D', boxShadow: '0 0 0 3px rgba(192,39,45,0.3)' }}>
                  {featuredAlumni.foto_url
                    ? <img src={featuredAlumni.foto_url} alt={featuredAlumni.nama_lengkap} className="w-full h-full object-cover" />
                    : getInitials(featuredAlumni.nama_lengkap)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-black text-white leading-tight mb-0.5"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                    {featuredAlumni.nama_lengkap}
                  </h2>
                  <p className="text-xs mb-2.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {featuredAlumni.jabatan || (featuredAlumni.master_profesi as any)?.nama || ''}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {featuredAlumni.angkatan && (
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: 'rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.85)' }}>
                        Angkatan {featuredAlumni.angkatan}
                      </span>
                    )}
                    {(featuredAlumni.master_kota as any)?.nama && (
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: 'rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.85)' }}>
                        {(featuredAlumni.master_kota as any).nama}
                      </span>
                    )}
                    {hasUMKM && (
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: '#C0272D', color: 'white' }}>
                        Punya UMKM
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="h-6 rounded-t-[28px]" style={{ background: '#FAF8F4' }} />
          </div>

          {/* ── CONTENT SECTIONS ── */}
          <div className="max-w-2xl mx-auto px-4 pb-12 space-y-3" style={{ marginTop: '-4px' }}>

            {/* TENTANG */}
            {featuredAlumni.bio && (
              <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
                  <span className="w-1 h-3.5 rounded-full inline-block flex-shrink-0" style={{ background: '#C0272D' }} />
                  TENTANG
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#3A3A3A' }}>{featuredAlumni.bio}</p>
              </div>
            )}

            {/* DATA DIRI + STATUS */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
                  <span className="w-1 h-3.5 rounded-full inline-block flex-shrink-0" style={{ background: '#C0272D' }} />
                  DATA DIRI
                </p>
                <div className="space-y-2.5">
                  {[
                    { label: 'Angkatan', value: featuredAlumni.angkatan, bold: false },
                    { label: 'Jurusan',  value: featuredAlumni.jurusan,  bold: true  },
                    { label: 'Kota',     value: (featuredAlumni.master_kota as any)?.nama, bold: false },
                    { label: 'Profesi',  value: (featuredAlumni.master_profesi as any)?.nama || featuredAlumni.jabatan, bold: true },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-start gap-2">
                      <span className="text-xs flex-shrink-0" style={{ color: '#9B9B9B' }}>{row.label}</span>
                      <span className={`text-xs text-right ${row.bold ? 'font-semibold' : ''}`} style={{ color: '#1A1A1A' }}>
                        {row.value || '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
                  <span className="w-1 h-3.5 rounded-full inline-block flex-shrink-0" style={{ background: '#C0272D' }} />
                  STATUS
                </p>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs flex-shrink-0" style={{ color: '#9B9B9B' }}>Punya UMKM</span>
                    <span className="text-xs text-right" style={{ color: '#1A1A1A' }}>{hasUMKM ? 'Ya' : 'Tidak'}</span>
                  </div>
                  {firstUMKM && (
                    <>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs flex-shrink-0" style={{ color: '#9B9B9B' }}>Jangkauan</span>
                        <span className="text-xs font-semibold text-right capitalize" style={{ color: '#1A1A1A' }}>
                          {firstUMKM.jangkauan
                            ? firstUMKM.jangkauan.charAt(0).toUpperCase() + firstUMKM.jangkauan.slice(1)
                            : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs flex-shrink-0" style={{ color: '#9B9B9B' }}>Kolaborasi</span>
                        <span className="text-xs font-semibold text-right" style={{ color: '#1A1A1A' }}>
                          {firstUMKM.buka_kolaborasi ? 'Terbuka' : 'Tertutup'}
                        </span>
                      </div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs flex-shrink-0" style={{ color: '#9B9B9B' }}>Sejak</span>
                        <span className="text-xs text-right" style={{ color: '#1A1A1A' }}>
                          {firstUMKM.created_at
                            ? new Date(firstUMKM.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
                            : '—'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* BENEFIT */}
            {allBenefits.length > 0 && (
              <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
                  <span className="w-1 h-3.5 rounded-full inline-block flex-shrink-0" style={{ background: '#C0272D' }} />
                  BENEFIT UNTUK SESAMA ALUMNI
                </p>
                <div className="flex flex-wrap gap-2">
                  {allBenefits.map((b: any) => (
                    <span key={b.id}
                      className="text-xs px-2.5 py-1.5 rounded-full border flex items-center gap-1.5"
                      style={{ borderColor: '#E0DDD8', color: '#3A3A3A', background: '#FAFAFA' }}>
                      {b.master_benefit?.emoji && <span className="text-sm">{b.master_benefit.emoji}</span>}
                      {b.master_benefit?.nama}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* USAHA UMKM */}
            {hasUMKM && (
              <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
                  <span className="w-1 h-3.5 rounded-full inline-block flex-shrink-0" style={{ background: '#C0272D' }} />
                  USAHA UMKM
                </p>
                <div className="space-y-2">
                  {(featuredAlumni.umkm as any[]).map((umkm) => (
                    <Link key={umkm.id} href={`/alumni/${featuredAlumni.id}`}>
                      <div className="w-full rounded-xl px-4 py-3.5 flex items-center gap-3 hover:opacity-90 transition"
                        style={{ background: '#2A2A2A' }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden"
                          style={{ background: '#3D3D3D' }}>
                          {umkm.logo_url
                            ? <img src={umkm.logo_url} alt="logo" className="w-full h-full object-contain" />
                            : getInitials(umkm.nama_usaha || 'U')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-white leading-tight truncate">{umkm.nama_usaha}</div>
                          <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                            {(umkm.master_kategori_usaha as any)?.nama || '—'}
                            {(featuredAlumni.master_kota as any)?.nama ? ` · ${(featuredAlumni.master_kota as any).nama}` : ''}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* KONTAK */}
            {(featuredAlumni.whatsapp || featuredAlumni.instagram || featuredAlumni.email) && (
              <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
                  <span className="w-1 h-3.5 rounded-full inline-block flex-shrink-0" style={{ background: '#C0272D' }} />
                  KONTAK
                </p>
                <div className="space-y-3.5">
                  {featuredAlumni.whatsapp && (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F0EDEA' }}>
                          <MessageCircle className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs" style={{ color: '#9B9B9B' }}>WhatsApp</div>
                          <div className="text-sm font-medium truncate" style={{ color: '#1A1A1A' }}>{featuredAlumni.whatsapp}</div>
                        </div>
                      </div>
                      <a href={`https://wa.me/${featuredAlumni.whatsapp?.replace(/\D/g, '')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-xs font-semibold px-4 py-1.5 rounded-lg border flex-shrink-0 transition hover:opacity-80"
                        style={{ borderColor: '#E0DDD8', color: '#1A1A1A' }}>
                        Hubungi
                      </a>
                    </div>
                  )}
                  {featuredAlumni.instagram && (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F0EDEA' }}>
                          <Instagram className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs" style={{ color: '#9B9B9B' }}>Instagram</div>
                          <div className="text-sm font-medium truncate" style={{ color: '#1A1A1A' }}>{featuredAlumni.instagram}</div>
                        </div>
                      </div>
                      <a href={`https://instagram.com/${featuredAlumni.instagram?.replace('@', '')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-xs font-semibold px-4 py-1.5 rounded-lg border flex-shrink-0 transition hover:opacity-80"
                        style={{ borderColor: '#E0DDD8', color: '#1A1A1A' }}>
                        Buka
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  )
}

// ── Showcase split ──
async function ShowcaseSplitSection() {
  const supabase = createClient()
  let showcases: any[] = []
  try {
    const { data } = await supabase.from('showcase_aktif').select('*').limit(3)
    showcases = data || []
  } catch {}

  if (!showcases.length) return (
    <div className="text-center py-12 rounded-2xl border" style={{ borderColor: '#E0DDD8' }}>
      <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-20" />
      <p className="text-sm" style={{ color: '#6B6B6B' }}>Belum ada UMKM featured minggu ini</p>
    </div>
  )

  const main = showcases[0]
  const subs = showcases.slice(1)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Link href={`/alumni/${main.alumni_id || ''}`}>
        <div className="rounded-2xl p-5 relative overflow-hidden h-full min-h-[220px] flex flex-col justify-between cursor-pointer hover:opacity-95 transition"
          style={{ background: '#2A2A2A' }}>
          <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <div>
            <div className="flex items-center gap-1.5 text-xs mb-2.5 uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.5)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#C0272D' }} />
              Unggulan Minggu Ini
            </div>
            <h3 className="font-bold text-xl text-white leading-tight mb-1.5"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {main.nama_usaha}
            </h3>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {main.deskripsi_usaha?.slice(0, 90)}{main.deskripsi_usaha?.length > 90 ? '...' : ''}
            </p>
            {main.kategori_usaha && (
              <div className="flex gap-1.5 flex-wrap mb-3">
                {(main.kategori_usaha as string).split(',').map((k: string) => (
                  <span key={k} className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)' }}>
                    {k.trim()}
                  </span>
                ))}
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
                <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.35)' }}>· Angl. {main.angkatan}</span>
              </div>
            </div>
            <span className="text-white text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: '#C0272D' }}>
              Lihat →
            </span>
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-3">
        {subs.length > 0
          ? subs.map((item, i) => (
              <Link key={item.id} href={`/alumni/${item.alumni_id || ''}`}>
                <div className="bg-white rounded-xl p-4 border cursor-pointer hover:border-red-400 transition h-full"
                  style={{ borderColor: '#E0DDD8', borderLeft: `3px solid ${i === 0 ? '#C0272D' : '#2A2A2A'}` }}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: i === 0 ? '#C0272D' : '#444' }}>
                    {item.kategori_usaha || 'UMKM'}
                  </div>
                  <h4 className="text-sm font-semibold mb-1 leading-tight" style={{ color: '#1A1A1A' }}>{item.nama_usaha}</h4>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: '#6B6B6B' }}>
                    {item.deskripsi_usaha?.slice(0, 65)}{item.deskripsi_usaha?.length > 65 ? '...' : ''}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: '#6B6B6B' }}>{item.nama_alumni?.split(' ')[0]} · {item.angkatan}</span>
                    <span className="text-xs font-medium" style={{ color: '#6B6B6B' }}>Lihat →</span>
                  </div>
                </div>
              </Link>
            ))
          : [0, 1].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 border"
                style={{ borderColor: '#E0DDD8', borderLeft: `3px solid ${i === 0 ? '#C0272D' : '#2A2A2A'}` }}>
                <div className="h-3 w-16 rounded bg-gray-200 animate-pulse mb-2" />
                <div className="h-4 w-full rounded bg-gray-200 animate-pulse mb-1.5" />
                <div className="h-3 w-3/4 rounded bg-gray-200 animate-pulse" />
              </div>
            ))}
      </div>
    </div>
  )
}
