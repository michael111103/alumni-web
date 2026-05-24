'use client'
import { useAlumniById } from '@/hooks/useAlumni'
import { formatWhatsApp, formatInstagram } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/public/Navbar'
import {
  MessageCircle,
  Instagram,
  Mail,
  ChevronRight,
  ShoppingBag,
  Globe,
  ArrowLeft,
  ExternalLink,
  MapPin,
  Phone,
  Star,
  Package,
  Users,
  Handshake,
} from 'lucide-react'
import { useState } from 'react'

function getInits(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

export default function AlumniDetailPage({ params }: { params: { id: string } }) {
  const { data: alumni, isLoading } = useAlumniById(params.id)
  const [activeTab, setActiveTab] = useState<'profil' | 'umkm'>('profil')
  const [selectedUMKM, setSelectedUMKM] = useState<number>(0)
  const router = useRouter()

  /* ── LOADING ── */
  if (isLoading) return (
    <div className="min-h-screen" style={{ background: '#FAF8F4', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <div className="flex h-1 pt-14">
        <div className="flex-[3]" style={{ background: '#C0272D' }} />
        <div className="flex-[1]" style={{ background: '#2A2A2A' }} />
        <div className="flex-[2]" style={{ background: '#6B6B6B' }} />
        <div className="flex-[1]" style={{ background: '#C0272D' }} />
        <div className="flex-[3]" style={{ background: '#2A2A2A' }} />
      </div>
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-3">
        <div className="h-5 w-52 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-28 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="h-44 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="h-36 rounded-2xl bg-gray-200 animate-pulse" />
      </div>
    </div>
  )

  /* ── NOT FOUND ── */
  if (!alumni) return (
    <div className="min-h-screen" style={{ background: '#FAF8F4', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center px-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#F0EDEA' }}>
            <ShoppingBag className="w-6 h-6" style={{ color: '#C0272D' }} />
          </div>
          <p className="font-semibold mb-1" style={{ color: '#1A1A1A' }}>Alumni tidak ditemukan</p>
          <Link href="/alumni" className="text-sm" style={{ color: '#C0272D' }}>← Kembali ke direktori</Link>
        </div>
      </div>
    </div>
  )

  const hasUMKM = !!(alumni.umkm && alumni.umkm.length > 0)
  const umkmList = hasUMKM ? (alumni.umkm as any[]) : []
  const currentUMKM = umkmList[selectedUMKM] || null
  const allBenefits = hasUMKM ? umkmList.flatMap(u => u.umkm_benefits || []) : []

  /* ── TAB: DETAIL UMKM ── */
  const renderUMKMTab = () => {
    if (!hasUMKM) return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: '#F0EDEA' }}>
          <ShoppingBag className="w-7 h-7" style={{ color: '#C0272D', opacity: 0.4 }} />
        </div>
        <p className="font-semibold mb-1" style={{ color: '#1A1A1A' }}>Belum ada UMKM</p>
        <p className="text-sm" style={{ color: '#9B9B9B' }}>Alumni ini belum mendaftarkan usahanya.</p>
        <button
          onClick={() => setActiveTab('profil')}
          className="mt-4 text-xs font-semibold px-4 py-2 rounded-lg transition hover:opacity-80"
          style={{ background: '#C0272D', color: 'white' }}>
          ← Lihat Profil
        </button>
      </div>
    )

    return (
      <div className="max-w-2xl mx-auto px-4 pb-12 pt-4 space-y-3">

        {/* Jika lebih dari 1 UMKM — selector pill */}
        {umkmList.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {umkmList.map((u, i) => (
              <button key={u.id}
                onClick={() => setSelectedUMKM(i)}
                className="flex-shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition"
                style={{
                  background: selectedUMKM === i ? '#2A2A2A' : 'white',
                  color: selectedUMKM === i ? 'white' : '#6B6B6B',
                  borderColor: selectedUMKM === i ? '#2A2A2A' : '#E0DDD8',
                }}>
                {u.nama_usaha}
              </button>
            ))}
          </div>
        )}

        {/* Header card UMKM — dark */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#2A2A2A' }}>
          {/* cover gradient */}
          <div className="h-20 w-full relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #3D0A0C 0%, #8B1A1E 50%, #C0272D 100%)' }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          </div>

          <div className="px-4 pb-5" style={{ marginTop: '-20px' }}>
            {/* Logo */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-sm font-bold mb-3 border-2 border-white/10 overflow-hidden"
              style={{ background: '#444' }}>
              {currentUMKM.logo_url
                ? <Image src={currentUMKM.logo_url} alt="logo" width={56} height={56} className="object-contain w-full h-full" />
                : getInits(currentUMKM.nama_usaha || 'U')}
            </div>

            <h3 className="text-lg font-black text-white leading-tight mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {currentUMKM.nama_usaha}
            </h3>

            <div className="flex items-center gap-1.5 mb-3">
              {(currentUMKM.master_kategori_usaha as any)?.nama && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(192,39,45,0.7)', color: 'white' }}>
                  {(currentUMKM.master_kategori_usaha as any).nama}
                </span>
              )}
              {currentUMKM.jangkauan && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)' }}>
                  {currentUMKM.jangkauan.charAt(0).toUpperCase() + currentUMKM.jangkauan.slice(1)}
                </span>
              )}
              {currentUMKM.buka_kolaborasi && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
                  style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)' }}>
                  <Handshake className="w-3 h-3" /> Kolaborasi
                </span>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="text-center">
                <div className="text-xs font-bold text-white">
                  {currentUMKM.skala_usaha
                    ? currentUMKM.skala_usaha.charAt(0).toUpperCase() + currentUMKM.skala_usaha.slice(1)
                    : '—'}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Skala</div>
              </div>
              <div className="text-center" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-xs font-bold text-white">
                  {currentUMKM.umkm_benefits?.length || 0}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Benefit</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-white">
                  {currentUMKM.created_at
                    ? new Date(currentUMKM.created_at).getFullYear()
                    : '—'}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Bergabung</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tentang usaha */}
        {currentUMKM.deskripsi && (
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} />
              TENTANG USAHA
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#3A3A3A' }}>{currentUMKM.deskripsi}</p>
          </div>
        )}

        {/* Lokasi & jangkauan */}
        {((currentUMKM.master_kota as any)?.nama || currentUMKM.jangkauan) && (
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} />
              JANGKAUAN
            </p>
            <div className="flex flex-wrap gap-2">
              {(currentUMKM.master_kota as any)?.nama && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                  style={{ borderColor: '#E0DDD8', background: '#FAFAFA' }}>
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#C0272D' }} />
                  <span className="text-xs font-medium" style={{ color: '#1A1A1A' }}>
                    {(currentUMKM.master_kota as any).nama}
                  </span>
                </div>
              )}
              {currentUMKM.jangkauan && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                  style={{ borderColor: '#E0DDD8', background: '#FAFAFA' }}>
                  <Globe className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#C0272D' }} />
                  <span className="text-xs font-medium capitalize" style={{ color: '#1A1A1A' }}>
                    {currentUMKM.jangkauan}
                  </span>
                </div>
              )}
              {currentUMKM.buka_kolaborasi && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                  style={{ borderColor: '#E0DDD8', background: '#FAFAFA' }}>
                  <Handshake className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#C0272D' }} />
                  <span className="text-xs font-medium" style={{ color: '#1A1A1A' }}>Terbuka kolaborasi</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Benefit untuk alumni */}
        {currentUMKM.umkm_benefits?.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} />
              BENEFIT UNTUK ALUMNI
            </p>
            <div className="space-y-2">
              {currentUMKM.umkm_benefits.map((b: any) => (
                <div key={b.id} className="flex items-center gap-3 p-2.5 rounded-xl"
                  style={{ background: '#FAFAFA', border: '1px solid #E0DDD8' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: '#F0EDEA' }}>
                    {b.master_benefit?.emoji || '🎁'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold" style={{ color: '#1A1A1A' }}>{b.master_benefit?.nama}</div>
                    {b.detail_benefit && (
                      <div className="text-xs mt-0.5" style={{ color: '#9B9B9B' }}>{b.detail_benefit}</div>
                    )}
                  </div>
                  <Star className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#C0272D' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Foto produk */}
        {currentUMKM.foto_produk_urls?.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} />
              FOTO PRODUK
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {(currentUMKM.foto_produk_urls as string[]).slice(0, 6).map((url, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <Image src={url} alt={`produk ${i + 1}`} width={120} height={120} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kontak usaha */}
        {(currentUMKM.whatsapp_bisnis || currentUMKM.instagram_usaha || currentUMKM.toko_online || currentUMKM.website) && (
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} />
              HUBUNGI USAHA INI
            </p>
            <div className="space-y-3">
              {currentUMKM.whatsapp_bisnis && (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F0EDEA' }}>
                      <MessageCircle className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs" style={{ color: '#9B9B9B' }}>WhatsApp Bisnis</div>
                      <div className="text-sm font-medium truncate" style={{ color: '#1A1A1A' }}>{currentUMKM.whatsapp_bisnis}</div>
                    </div>
                  </div>
                  <a href={`https://wa.me/${currentUMKM.whatsapp_bisnis.replace(/\D/g, '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs font-semibold px-4 py-1.5 rounded-lg border flex-shrink-0 hover:opacity-80 transition"
                    style={{ borderColor: '#E0DDD8', color: '#1A1A1A' }}>
                    Hubungi
                  </a>
                </div>
              )}
              {currentUMKM.instagram_usaha && (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F0EDEA' }}>
                      <Instagram className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs" style={{ color: '#9B9B9B' }}>Instagram</div>
                      <div className="text-sm font-medium truncate" style={{ color: '#1A1A1A' }}>{currentUMKM.instagram_usaha}</div>
                    </div>
                  </div>
                  <a href={`https://instagram.com/${currentUMKM.instagram_usaha.replace('@', '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs font-semibold px-4 py-1.5 rounded-lg border flex-shrink-0 hover:opacity-80 transition"
                    style={{ borderColor: '#E0DDD8', color: '#1A1A1A' }}>
                    Buka
                  </a>
                </div>
              )}
              {currentUMKM.toko_online && (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F0EDEA' }}>
                      <ShoppingBag className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs" style={{ color: '#9B9B9B' }}>Toko Online</div>
                      <div className="text-sm font-medium truncate max-w-[160px]" style={{ color: '#1A1A1A' }}>{currentUMKM.toko_online}</div>
                    </div>
                  </div>
                  <a href={currentUMKM.toko_online} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-semibold px-4 py-1.5 rounded-lg border flex-shrink-0 hover:opacity-80 transition"
                    style={{ borderColor: '#E0DDD8', color: '#1A1A1A' }}>
                    Kunjungi
                  </a>
                </div>
              )}
              {currentUMKM.website && (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F0EDEA' }}>
                      <Globe className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs" style={{ color: '#9B9B9B' }}>Website</div>
                      <div className="text-sm font-medium truncate max-w-[160px]" style={{ color: '#1A1A1A' }}>{currentUMKM.website}</div>
                    </div>
                  </div>
                  <a href={currentUMKM.website} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-semibold px-4 py-1.5 rounded-lg border flex-shrink-0 hover:opacity-80 transition"
                    style={{ borderColor: '#E0DDD8', color: '#1A1A1A' }}>
                    Buka
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Back to profil CTA */}
        <button onClick={() => setActiveTab('profil')}
          className="w-full py-3 rounded-2xl text-sm font-semibold border transition hover:opacity-80 flex items-center justify-center gap-2"
          style={{ borderColor: '#E0DDD8', color: '#6B6B6B', background: 'white' }}>
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Profil
        </button>
      </div>
    )
  }

  /* ── MAIN RENDER ── */
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

      {/* ── TABS — sticky ── */}
      <div className="bg-white border-b sticky top-14 z-40" style={{ borderColor: '#E0DDD8' }}>
        <div className="max-w-2xl mx-auto flex">
          <button
            onClick={() => setActiveTab('profil')}
            className="flex-1 py-3.5 text-sm font-semibold text-center transition relative"
            style={{ color: activeTab === 'profil' ? '#C0272D' : '#6B6B6B' }}>
            Profil Alumni
            {activeTab === 'profil' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#C0272D' }} />
            )}
          </button>
          <button
            onClick={() => { setActiveTab('umkm'); setSelectedUMKM(0) }}
            className="flex-1 py-3.5 text-sm font-semibold text-center transition relative"
            style={{ color: activeTab === 'umkm' ? '#C0272D' : '#6B6B6B' }}>
            Detail UMKM
            {hasUMKM && activeTab !== 'umkm' && (
              <span className="absolute top-2.5 right-[calc(50%-28px)] w-1.5 h-1.5 rounded-full" style={{ background: '#C0272D' }} />
            )}
            {activeTab === 'umkm' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#C0272D' }} />
            )}
          </button>
        </div>
      </div>

      {/* ── BREADCRUMB — clickable ── */}
      <div className="bg-white border-b" style={{ borderColor: '#F0EDEA' }}>
        <div className="max-w-2xl mx-auto px-4 py-2.5">
          <div className="flex items-center gap-1 text-xs">
            {/* Beranda */}
            <Link href="/"
              className="flex items-center gap-1 px-2 py-1 rounded-lg transition hover:bg-gray-100 font-medium"
              style={{ color: '#9B9B9B' }}>
              Beranda
            </Link>
            <span style={{ color: '#D0CCC8' }}>/</span>
            {/* Direktori */}
            <Link href="/alumni"
              className="flex items-center gap-1 px-2 py-1 rounded-lg transition hover:bg-gray-100 font-medium"
              style={{ color: '#9B9B9B' }}>
              Direktori
            </Link>
            <span style={{ color: '#D0CCC8' }}>/</span>
            {/* Nama — current, tidak bisa diklik */}
            <span className="px-2 py-1 font-semibold truncate max-w-[140px]" style={{ color: '#1A1A1A' }}>
              {alumni.nama_lengkap}
            </span>
          </div>
        </div>
      </div>

      {/* ── PROFILE HEADER dark ── */}
      <div style={{ background: '#2A2A2A' }}>
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-7">
          <div className="flex items-center gap-4">
            <div
              className="w-[68px] h-[68px] rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 overflow-hidden"
              style={{ background: '#C0272D', boxShadow: '0 0 0 3px rgba(192,39,45,0.25)' }}>
              {alumni.foto_url
                ? <Image src={alumni.foto_url} alt={alumni.nama_lengkap} width={68} height={68} className="object-cover w-full h-full" />
                : getInits(alumni.nama_lengkap)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-white leading-tight mb-0.5"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                {alumni.nama_lengkap}
              </h1>
              <p className="text-xs mb-2.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {alumni.jabatan || (alumni.master_profesi as any)?.nama || ''}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {alumni.angkatan && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: 'rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.85)' }}>
                    Angkatan {alumni.angkatan}
                  </span>
                )}
                {(alumni.master_kota as any)?.nama && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: 'rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.85)' }}>
                    {(alumni.master_kota as any).nama}
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

      {/* ── TAB CONTENT ── */}
      {activeTab === 'umkm' ? renderUMKMTab() : (

        /* ── PROFIL TAB ── */
        <div className="max-w-2xl mx-auto px-4 pb-12 space-y-3" style={{ marginTop: '-4px' }}>

          {/* TENTANG */}
          {alumni.bio && (
            <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
                <span className="w-1 h-3.5 rounded-full inline-block flex-shrink-0" style={{ background: '#C0272D' }} />
                TENTANG
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#3A3A3A' }}>{alumni.bio}</p>
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
                  { label: 'Angkatan', value: alumni.angkatan, bold: false },
                  { label: 'Jurusan',  value: alumni.jurusan,  bold: true  },
                  { label: 'Kota',     value: (alumni.master_kota as any)?.nama, bold: false },
                  { label: 'Profesi',  value: (alumni.master_profesi as any)?.nama || alumni.jabatan, bold: true },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-start gap-2">
                    <span className="text-xs flex-shrink-0" style={{ color: '#9B9B9B' }}>{row.label}</span>
                    <span className={`text-xs text-right leading-tight ${row.bold ? 'font-semibold' : ''}`} style={{ color: '#1A1A1A' }}>
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
                {currentUMKM && (
                  <>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs flex-shrink-0" style={{ color: '#9B9B9B' }}>Jangkauan</span>
                      <span className="text-xs font-semibold text-right capitalize" style={{ color: '#1A1A1A' }}>
                        {currentUMKM.jangkauan
                          ? currentUMKM.jangkauan.charAt(0).toUpperCase() + currentUMKM.jangkauan.slice(1)
                          : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs flex-shrink-0" style={{ color: '#9B9B9B' }}>Kolaborasi</span>
                      <span className="text-xs font-semibold text-right" style={{ color: '#1A1A1A' }}>
                        {currentUMKM.buka_kolaborasi ? 'Terbuka' : 'Tertutup'}
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs flex-shrink-0" style={{ color: '#9B9B9B' }}>Sejak</span>
                      <span className="text-xs text-right" style={{ color: '#1A1A1A' }}>
                        {currentUMKM.created_at
                          ? new Date(currentUMKM.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
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

          {/* USAHA UMKM — klik → buka tab UMKM */}
          {hasUMKM && (
            <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
                <span className="w-1 h-3.5 rounded-full inline-block flex-shrink-0" style={{ background: '#C0272D' }} />
                USAHA UMKM
              </p>
              <div className="space-y-2">
                {umkmList.map((umkm, i) => (
                  <button key={umkm.id}
                    onClick={() => { setSelectedUMKM(i); setActiveTab('umkm') }}
                    className="w-full rounded-xl px-4 py-3.5 flex items-center gap-3 text-left hover:opacity-90 active:scale-[0.99] transition"
                    style={{ background: '#2A2A2A' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden"
                      style={{ background: '#3D3D3D' }}>
                      {umkm.logo_url
                        ? <Image src={umkm.logo_url} alt="logo" width={40} height={40} className="object-contain w-full h-full" />
                        : getInits(umkm.nama_usaha || 'U')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white leading-tight truncate">{umkm.nama_usaha}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {(umkm.master_kategori_usaha as any)?.nama || '—'}
                        {(alumni.master_kota as any)?.nama ? ` · ${(alumni.master_kota as any).nama}` : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Detail</span>
                      <ChevronRight className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* KONTAK */}
          {(alumni.whatsapp || alumni.instagram || alumni.email) && (
            <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
                <span className="w-1 h-3.5 rounded-full inline-block flex-shrink-0" style={{ background: '#C0272D' }} />
                KONTAK
              </p>
              <div className="space-y-3.5">
                {alumni.whatsapp && (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F0EDEA' }}>
                        <MessageCircle className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs" style={{ color: '#9B9B9B' }}>WhatsApp</div>
                        <div className="text-sm font-medium truncate" style={{ color: '#1A1A1A' }}>{alumni.whatsapp}</div>
                      </div>
                    </div>
                    <a href={`https://wa.me/${alumni.whatsapp.replace(/\D/g, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-xs font-semibold px-4 py-1.5 rounded-lg border flex-shrink-0 transition hover:opacity-80"
                      style={{ borderColor: '#E0DDD8', color: '#1A1A1A' }}>
                      Hubungi
                    </a>
                  </div>
                )}
                {alumni.instagram && (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F0EDEA' }}>
                        <Instagram className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs" style={{ color: '#9B9B9B' }}>Instagram</div>
                        <div className="text-sm font-medium truncate" style={{ color: '#1A1A1A' }}>{alumni.instagram}</div>
                      </div>
                    </div>
                    <a href={`https://instagram.com/${alumni.instagram.replace('@', '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-xs font-semibold px-4 py-1.5 rounded-lg border flex-shrink-0 transition hover:opacity-80"
                      style={{ borderColor: '#E0DDD8', color: '#1A1A1A' }}>
                      Buka
                    </a>
                  </div>
                )}
                {alumni.email && (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F0EDEA' }}>
                        <Mail className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs" style={{ color: '#9B9B9B' }}>Email</div>
                        <div className="text-sm font-medium truncate" style={{ color: '#1A1A1A' }}>{alumni.email}</div>
                      </div>
                    </div>
                    <a href={`mailto:${alumni.email}`}
                      className="text-xs font-semibold px-4 py-1.5 rounded-lg border flex-shrink-0 transition hover:opacity-80"
                      style={{ borderColor: '#E0DDD8', color: '#1A1A1A' }}>
                      Kirim
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
