'use client'
import { useAlumniById } from '@/hooks/useAlumni'
import { formatWhatsApp, formatInstagram, getInitials } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import { MessageCircle, Instagram, ExternalLink, ShoppingBag, ChevronRight } from 'lucide-react'
import { useState } from 'react'

function getInitialsLocal(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

export default function AlumniDetailPage({ params }: { params: { id: string } }) {
  const { data: alumni, isLoading } = useAlumniById(params.id)
  const [activeTab, setActiveTab] = useState<'profil' | 'umkm'>('profil')

  if (isLoading) return (
    <div className="min-h-screen" style={{ background: '#FAF8F4', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <div className="pt-20 max-w-2xl mx-auto px-4">
        <div className="h-32 rounded-2xl bg-gray-200 animate-pulse mb-3" />
        <div className="h-48 rounded-2xl bg-gray-200 animate-pulse" />
      </div>
    </div>
  )

  if (!alumni) return (
    <div className="min-h-screen" style={{ background: '#FAF8F4', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 font-medium">Alumni tidak ditemukan</p>
          <Link href="/alumni" className="text-sm mt-2 inline-block" style={{ color: '#C0272D' }}>← Kembali ke direktori</Link>
        </div>
      </div>
    </div>
  )

  const hasUMKM = alumni.umkm && alumni.umkm.length > 0

  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* Plaid stripe */}
      <div className="flex h-1 pt-14">
        <div className="flex-[3]" style={{ background: '#C0272D' }} />
        <div className="flex-[1]" style={{ background: '#2A2A2A' }} />
        <div className="flex-[2]" style={{ background: '#6B6B6B' }} />
        <div className="flex-[1]" style={{ background: '#C0272D' }} />
        <div className="flex-[3]" style={{ background: '#2A2A2A' }} />
      </div>

      {/* Tabs */}
      <div className="bg-white border-b" style={{ borderColor: '#E0DDD8' }}>
        <div className="max-w-2xl mx-auto flex">
          <button
            onClick={() => setActiveTab('profil')}
            className="flex-1 py-3.5 text-sm font-semibold text-center border-b-2 transition"
            style={{
              borderColor: activeTab === 'profil' ? '#C0272D' : 'transparent',
              color: activeTab === 'profil' ? '#C0272D' : '#6B6B6B',
            }}
          >
            Profil Alumni
          </button>
          <button
            onClick={() => setActiveTab('umkm')}
            className="flex-1 py-3.5 text-sm font-semibold text-center border-b-2 transition"
            style={{
              borderColor: activeTab === 'umkm' ? '#C0272D' : 'transparent',
              color: activeTab === 'umkm' ? '#C0272D' : '#6B6B6B',
            }}
          >
            Detail UMKM
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-2xl mx-auto px-4 py-2.5">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#6B6B6B' }}>
          <Link href="/" className="hover:opacity-70 transition">Beranda</Link>
          <span>/</span>
          <Link href="/alumni" className="hover:opacity-70 transition">Direktori</Link>
          <span>/</span>
          <span style={{ color: '#1A1A1A' }}>{alumni.nama_lengkap}</span>
        </div>
      </div>

      {/* Profile Header — dark */}
      <div style={{ background: '#2A2A2A' }}>
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0 overflow-hidden"
              style={{ background: '#C0272D' }}
            >
              {alumni.foto_url ? (
                <Image src={alumni.foto_url} alt={alumni.nama_lengkap} width={64} height={64} className="object-cover w-full h-full" />
              ) : (
                getInitialsLocal(alumni.nama_lengkap)
              )}
            </div>
            {/* Name & subtitle */}
            <div>
              <h1 className="text-xl font-bold text-white mb-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>
                {alumni.nama_lengkap}
              </h1>
              <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {alumni.jabatan || (alumni.master_profesi as any)?.nama || ''}
              </p>
              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                {alumni.angkatan && (
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}
                  >
                    Angkatan {alumni.angkatan}
                  </span>
                )}
                {(alumni.master_kota as any)?.nama && (
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}
                  >
                    {(alumni.master_kota as any).nama}
                  </span>
                )}
                {hasUMKM && (
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: 'rgba(192,39,45,0.75)', color: 'white' }}
                  >
                    Punya UMKM
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Wave bottom */}
        <div className="h-6 rounded-t-3xl" style={{ background: '#FAF8F4' }} />
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pb-12 space-y-3" style={{ marginTop: '-8px' }}>

        {/* TENTANG */}
        {alumni.bio && (
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3 rounded-full inline-block" style={{ background: '#C0272D' }} />
              TENTANG
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#3A3A3A' }}>
              {alumni.bio}
            </p>
          </div>
        )}

        {/* DATA DIRI + STATUS */}
        <div className="grid grid-cols-2 gap-3">
          {/* Data Diri */}
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3 rounded-full inline-block" style={{ background: '#C0272D' }} />
              DATA DIRI
            </p>
            <div className="space-y-2.5">
              <div className="flex justify-between items-start">
                <span className="text-xs" style={{ color: '#6B6B6B' }}>Angkatan</span>
                <span className="text-xs text-right" style={{ color: '#1A1A1A' }}>{alumni.angkatan || '—'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs" style={{ color: '#6B6B6B' }}>Jurusan</span>
                <span className="text-xs font-semibold text-right" style={{ color: '#1A1A1A' }}>{alumni.jurusan || '—'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs" style={{ color: '#6B6B6B' }}>Kota</span>
                <span className="text-xs text-right" style={{ color: '#1A1A1A' }}>{(alumni.master_kota as any)?.nama || '—'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs" style={{ color: '#6B6B6B' }}>Profesi</span>
                <span className="text-xs font-semibold text-right" style={{ color: '#1A1A1A' }}>{(alumni.master_profesi as any)?.nama || alumni.jabatan || '—'}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3 rounded-full inline-block" style={{ background: '#C0272D' }} />
              STATUS
            </p>
            <div className="space-y-2.5">
              <div className="flex justify-between items-start">
                <span className="text-xs" style={{ color: '#6B6B6B' }}>Punya UMKM</span>
                <span className="text-xs text-right" style={{ color: '#1A1A1A' }}>{hasUMKM ? 'Ya' : 'Tidak'}</span>
              </div>
              {hasUMKM && alumni.umkm[0] && (
                <>
                  <div className="flex justify-between items-start">
                    <span className="text-xs" style={{ color: '#6B6B6B' }}>Jangkauan</span>
                    <span className="text-xs font-semibold text-right" style={{ color: '#1A1A1A' }}>{(alumni.umkm[0] as any).jangkauan || '—'}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs" style={{ color: '#6B6B6B' }}>Kolaborasi</span>
                    <span className="text-xs font-semibold text-right" style={{ color: '#1A1A1A' }}>{(alumni.umkm[0] as any).buka_kolaborasi ? 'Terbuka' : 'Tertutup'}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs" style={{ color: '#6B6B6B' }}>Sejak</span>
                    <span className="text-xs text-right" style={{ color: '#1A1A1A' }}>
                      {(alumni.umkm[0] as any).created_at
                        ? new Date((alumni.umkm[0] as any).created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
                        : '—'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* BENEFIT UNTUK SESAMA ALUMNI */}
        {hasUMKM && alumni.umkm.some((u: any) => u.umkm_benefits?.length > 0) && (
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3 rounded-full inline-block" style={{ background: '#C0272D' }} />
              BENEFIT UNTUK SESAMA ALUMNI
            </p>
            <div className="flex flex-wrap gap-2">
              {alumni.umkm.flatMap((u: any) =>
                (u.umkm_benefits || []).map((b: any) => (
                  <span
                    key={b.id}
                    className="text-xs px-2.5 py-1 rounded-full border flex items-center gap-1"
                    style={{ borderColor: '#E0DDD8', color: '#3A3A3A', background: '#FAFAFA' }}
                  >
                    {b.master_benefit?.emoji && <span>{b.master_benefit.emoji}</span>}
                    {b.master_benefit?.nama}
                  </span>
                ))
              )}
            </div>
          </div>
        )}

        {/* USAHA UMKM */}
        {hasUMKM && (
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3 rounded-full inline-block" style={{ background: '#C0272D' }} />
              USAHA UMKM
            </p>
            <div className="space-y-2">
              {alumni.umkm.map((umkm: any) => (
                <button
                  key={umkm.id}
                  className="w-full rounded-xl p-3.5 flex items-center gap-3 text-left cursor-pointer hover:opacity-90 transition"
                  style={{ background: '#2A2A2A' }}
                  onClick={() => setActiveTab('umkm')}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: '#444' }}
                  >
                    {umkm.logo_url ? (
                      <Image src={umkm.logo_url} alt="logo" width={40} height={40} className="rounded-xl object-contain" />
                    ) : (
                      getInitialsLocal(umkm.nama_usaha || 'U')
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{umkm.nama_usaha}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {(umkm.master_kategori_usaha as any)?.nama || umkm.kategori} · {(alumni.master_kota as any)?.nama || ''}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* KONTAK */}
        {(alumni.whatsapp || alumni.instagram || alumni.email) && (
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3 rounded-full inline-block" style={{ background: '#C0272D' }} />
              KONTAK
            </p>
            <div className="space-y-3">
              {alumni.whatsapp && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#6B6B6B' }} />
                    <div>
                      <div className="text-xs" style={{ color: '#6B6B6B' }}>WhatsApp</div>
                      <div className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{alumni.whatsapp}</div>
                    </div>
                  </div>
                  <a
                    href={formatWhatsApp(alumni.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold px-3.5 py-1.5 rounded-lg border transition hover:opacity-80"
                    style={{ borderColor: '#E0DDD8', color: '#1A1A1A' }}
                  >
                    Hubungi
                  </a>
                </div>
              )}
              {alumni.instagram && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Instagram className="w-4 h-4 flex-shrink-0" style={{ color: '#6B6B6B' }} />
                    <div>
                      <div className="text-xs" style={{ color: '#6B6B6B' }}>Instagram</div>
                      <div className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{alumni.instagram}</div>
                    </div>
                  </div>
                  <a
                    href={formatInstagram(alumni.instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold px-3.5 py-1.5 rounded-lg border transition hover:opacity-80"
                    style={{ borderColor: '#E0DDD8', color: '#1A1A1A' }}
                  >
                    Buka
                  </a>
                </div>
              )}
              {alumni.email && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ExternalLink className="w-4 h-4 flex-shrink-0" style={{ color: '#6B6B6B' }} />
                    <div>
                      <div className="text-xs" style={{ color: '#6B6B6B' }}>Email</div>
                      <div className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{alumni.email}</div>
                    </div>
                  </div>
                  <a
                    href={`mailto:${alumni.email}`}
                    className="text-xs font-semibold px-3.5 py-1.5 rounded-lg border transition hover:opacity-80"
                    style={{ borderColor: '#E0DDD8', color: '#1A1A1A' }}
                  >
                    Kirim
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
