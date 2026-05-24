'use client'
import Link from 'next/link'
import Image from 'next/image'
import {
  MessageCircle, Instagram, Mail, ChevronRight,
  ShoppingBag, Globe, ArrowLeft, MapPin, Star, Handshake,
} from 'lucide-react'
import { useState } from 'react'

function getInits(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

export default function FeaturedAlumniSection({ alumni }: { alumni: any }) {
  const [activeTab, setActiveTab] = useState<'profil' | 'umkm'>('profil')
  const [selectedUMKM, setSelectedUMKM] = useState(0)

  if (!alumni) return null

  const hasUMKM = !!(alumni.umkm && alumni.umkm.length > 0)
  const umkmList = hasUMKM ? alumni.umkm : []
  const currentUMKM = umkmList[selectedUMKM] || null
  const allBenefits = hasUMKM ? umkmList.flatMap((u: any) => u.umkm_benefits || []) : []

  const renderUMKMTab = () => {
    if (!hasUMKM) return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#F0EDEA' }}>
          <ShoppingBag className="w-7 h-7" style={{ color: '#C0272D', opacity: 0.4 }} />
        </div>
        <p className="font-semibold mb-1" style={{ color: '#1A1A1A' }}>Belum ada UMKM</p>
        <p className="text-sm mb-4" style={{ color: '#9B9B9B' }}>Alumni ini belum mendaftarkan usahanya.</p>
        <button onClick={() => setActiveTab('profil')}
          className="text-xs font-semibold px-4 py-2 rounded-lg transition hover:opacity-80"
          style={{ background: '#C0272D', color: 'white' }}>
          ← Lihat Profil
        </button>
      </div>
    )

    return (
      <div className="max-w-2xl mx-auto px-4 pb-12 pt-4 space-y-3">
        {umkmList.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {umkmList.map((u: any, i: number) => (
              <button key={u.id} onClick={() => setSelectedUMKM(i)}
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

        {/* Header UMKM card */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#2A2A2A' }}>
          <div className="h-20 w-full relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #3D0A0C 0%, #8B1A1E 50%, #C0272D 100%)' }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          </div>
          <div className="px-4 pb-5" style={{ marginTop: '-20px' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-sm font-bold mb-3 border-2 border-white/10 overflow-hidden"
              style={{ background: '#444' }}>
              {currentUMKM.logo_url
                ? <Image src={currentUMKM.logo_url} alt="logo" width={56} height={56} className="object-contain w-full h-full" />
                : getInits(currentUMKM.nama_usaha || 'U')}
            </div>
            <h3 className="text-lg font-black text-white leading-tight mb-1.5"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {currentUMKM.nama_usaha}
            </h3>
            <div className="flex flex-wrap gap-1.5 mb-3">
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
                <div className="text-xs font-bold text-white">{currentUMKM.umkm_benefits?.length || 0}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Benefit</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-white">
                  {currentUMKM.created_at ? new Date(currentUMKM.created_at).getFullYear() : '—'}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Bergabung</div>
              </div>
            </div>
          </div>
        </div>

        {currentUMKM.deskripsi && (
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} />
              TENTANG USAHA
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#3A3A3A' }}>{currentUMKM.deskripsi}</p>
          </div>
        )}

        {((currentUMKM.master_kota as any)?.nama || currentUMKM.jangkauan) && (
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} />
              JANGKAUAN
            </p>
            <div className="flex flex-wrap gap-2">
              {(currentUMKM.master_kota as any)?.nama && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ borderColor: '#E0DDD8', background: '#FAFAFA' }}>
                  <MapPin className="w-3.5 h-3.5" style={{ color: '#C0272D' }} />
                  <span className="text-xs font-medium" style={{ color: '#1A1A1A' }}>{(currentUMKM.master_kota as any).nama}</span>
                </div>
              )}
              {currentUMKM.jangkauan && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ borderColor: '#E0DDD8', background: '#FAFAFA' }}>
                  <Globe className="w-3.5 h-3.5" style={{ color: '#C0272D' }} />
                  <span className="text-xs font-medium capitalize" style={{ color: '#1A1A1A' }}>{currentUMKM.jangkauan}</span>
                </div>
              )}
              {currentUMKM.buka_kolaborasi && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ borderColor: '#E0DDD8', background: '#FAFAFA' }}>
                  <Handshake className="w-3.5 h-3.5" style={{ color: '#C0272D' }} />
                  <span className="text-xs font-medium" style={{ color: '#1A1A1A' }}>Terbuka kolaborasi</span>
                </div>
              )}
            </div>
          </div>
        )}

        {currentUMKM.umkm_benefits?.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} />
              BENEFIT UNTUK ALUMNI
            </p>
            <div className="space-y-2">
              {currentUMKM.umkm_benefits.map((b: any) => (
                <div key={b.id} className="flex items-center gap-3 p-2.5 rounded-xl border"
                  style={{ background: '#FAFAFA', borderColor: '#E0DDD8' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: '#F0EDEA' }}>
                    {b.master_benefit?.emoji || '🎁'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold" style={{ color: '#1A1A1A' }}>{b.master_benefit?.nama}</div>
                    {b.detail_benefit && <div className="text-xs mt-0.5" style={{ color: '#9B9B9B' }}>{b.detail_benefit}</div>}
                  </div>
                  <Star className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#C0272D' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {currentUMKM.foto_produk_urls?.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} />
              FOTO PRODUK
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {(currentUMKM.foto_produk_urls as string[]).slice(0, 6).map((url: string, i: number) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <Image src={url} alt={`produk ${i + 1}`} width={120} height={120} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {(currentUMKM.whatsapp_bisnis || currentUMKM.instagram_usaha || currentUMKM.toko_online || currentUMKM.website) && (
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} />
              HUBUNGI USAHA INI
            </p>
            <div className="space-y-3">
              {[
                { key: 'whatsapp_bisnis', label: 'WhatsApp Bisnis', icon: <MessageCircle className="w-4 h-4" style={{ color: '#6B6B6B' }} />, href: (v: string) => `https://wa.me/${v.replace(/\D/g,'')}`, btnLabel: 'Hubungi' },
                { key: 'instagram_usaha', label: 'Instagram', icon: <Instagram className="w-4 h-4" style={{ color: '#6B6B6B' }} />, href: (v: string) => `https://instagram.com/${v.replace('@','')}`, btnLabel: 'Buka' },
                { key: 'toko_online', label: 'Toko Online', icon: <ShoppingBag className="w-4 h-4" style={{ color: '#6B6B6B' }} />, href: (v: string) => v, btnLabel: 'Kunjungi' },
                { key: 'website', label: 'Website', icon: <Globe className="w-4 h-4" style={{ color: '#6B6B6B' }} />, href: (v: string) => v, btnLabel: 'Buka' },
              ].filter(item => currentUMKM[item.key]).map(item => (
                <div key={item.key} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F0EDEA' }}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs" style={{ color: '#9B9B9B' }}>{item.label}</div>
                      <div className="text-sm font-medium truncate max-w-[160px]" style={{ color: '#1A1A1A' }}>{currentUMKM[item.key]}</div>
                    </div>
                  </div>
                  <a href={item.href(currentUMKM[item.key])} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-semibold px-4 py-1.5 rounded-lg border flex-shrink-0 hover:opacity-80 transition"
                    style={{ borderColor: '#E0DDD8', color: '#1A1A1A' }}>
                    {item.btnLabel}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => setActiveTab('profil')}
          className="w-full py-3 rounded-2xl text-sm font-semibold border transition hover:opacity-80 flex items-center justify-center gap-2"
          style={{ borderColor: '#E0DDD8', color: '#6B6B6B', background: 'white' }}>
          <ArrowLeft className="w-4 h-4" /> Kembali ke Profil
        </button>
      </div>
    )
  }

  return (
    <>
      {/* TABS */}
      <div className="bg-white border-b" style={{ borderColor: '#E0DDD8' }}>
        <div className="max-w-2xl mx-auto flex">
          <button onClick={() => setActiveTab('profil')}
            className="flex-1 py-3.5 text-sm font-semibold text-center transition relative"
            style={{ color: activeTab === 'profil' ? '#C0272D' : '#6B6B6B' }}>
            Profil Alumni
            {activeTab === 'profil' && <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#C0272D' }} />}
          </button>
          <button onClick={() => { setActiveTab('umkm'); setSelectedUMKM(0) }}
            className="flex-1 py-3.5 text-sm font-semibold text-center transition relative"
            style={{ color: activeTab === 'umkm' ? '#C0272D' : '#6B6B6B' }}>
            Detail UMKM
            {hasUMKM && activeTab !== 'umkm' && (
              <span className="absolute top-2.5 right-[calc(50%-28px)] w-1.5 h-1.5 rounded-full" style={{ background: '#C0272D' }} />
            )}
            {activeTab === 'umkm' && <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#C0272D' }} />}
          </button>
        </div>
      </div>

      {/* BREADCRUMB */}
      <div className="bg-white border-b" style={{ borderColor: '#F0EDEA' }}>
        <div className="max-w-2xl mx-auto px-4 py-2.5">
          <div className="flex items-center gap-1 text-xs">
            <Link href="/" className="px-2 py-1 rounded-lg hover:bg-gray-100 transition font-medium" style={{ color: '#9B9B9B' }}>
              Beranda
            </Link>
            <span style={{ color: '#D0CCC8' }}>/</span>
            <Link href="/alumni" className="px-2 py-1 rounded-lg hover:bg-gray-100 transition font-medium" style={{ color: '#9B9B9B' }}>
              Direktori
            </Link>
            <span style={{ color: '#D0CCC8' }}>/</span>
            <span className="px-2 py-1 font-semibold truncate max-w-[140px]" style={{ color: '#1A1A1A' }}>
              {alumni.nama_lengkap}
            </span>
          </div>
        </div>
      </div>

      {/* PROFILE HEADER dark */}
      <div style={{ background: '#2A2A2A' }}>
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-7">
          <div className="flex items-center gap-4">
            <div className="w-[68px] h-[68px] rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 overflow-hidden"
              style={{ background: '#C0272D', boxShadow: '0 0 0 3px rgba(192,39,45,0.25)' }}>
              {alumni.foto_url
                ? <img src={alumni.foto_url} alt={alumni.nama_lengkap} className="w-full h-full object-cover" />
                : getInits(alumni.nama_lengkap)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-black text-white leading-tight mb-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>
                {alumni.nama_lengkap}
              </h2>
              <p className="text-xs mb-2.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {alumni.jabatan || alumni.master_profesi?.nama || ''}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {alumni.angkatan && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: 'rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.85)' }}>
                    Angkatan {alumni.angkatan}
                  </span>
                )}
                {alumni.master_kota?.nama && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: 'rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.85)' }}>
                    {alumni.master_kota.nama}
                  </span>
                )}
                {hasUMKM && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#C0272D', color: 'white' }}>
                    Punya UMKM
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="h-6 rounded-t-[28px]" style={{ background: '#FAF8F4' }} />
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'umkm' ? renderUMKMTab() : (
        <div className="max-w-2xl mx-auto px-4 pb-12 space-y-3" style={{ marginTop: '-4px' }}>

          {alumni.bio && (
            <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
                <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} />
                TENTANG
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#3A3A3A' }}>{alumni.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
                <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} />
                DATA DIRI
              </p>
              <div className="space-y-2.5">
                {[
                  { label: 'Angkatan', value: alumni.angkatan, bold: false },
                  { label: 'Jurusan', value: alumni.jurusan, bold: true },
                  { label: 'Kota', value: alumni.master_kota?.nama, bold: false },
                  { label: 'Profesi', value: alumni.master_profesi?.nama || alumni.jabatan, bold: true },
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
                <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} />
                STATUS
              </p>
              <div className="space-y-2.5">
                <div className="flex justify-between gap-2">
                  <span className="text-xs flex-shrink-0" style={{ color: '#9B9B9B' }}>Punya UMKM</span>
                  <span className="text-xs" style={{ color: '#1A1A1A' }}>{hasUMKM ? 'Ya' : 'Tidak'}</span>
                </div>
                {currentUMKM && (
                  <>
                    <div className="flex justify-between gap-2">
                      <span className="text-xs flex-shrink-0" style={{ color: '#9B9B9B' }}>Jangkauan</span>
                      <span className="text-xs font-semibold capitalize" style={{ color: '#1A1A1A' }}>
                        {currentUMKM.jangkauan ? currentUMKM.jangkauan.charAt(0).toUpperCase() + currentUMKM.jangkauan.slice(1) : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-xs flex-shrink-0" style={{ color: '#9B9B9B' }}>Kolaborasi</span>
                      <span className="text-xs font-semibold" style={{ color: '#1A1A1A' }}>
                        {currentUMKM.buka_kolaborasi ? 'Terbuka' : 'Tertutup'}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-xs flex-shrink-0" style={{ color: '#9B9B9B' }}>Sejak</span>
                      <span className="text-xs" style={{ color: '#1A1A1A' }}>
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

          {allBenefits.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
                <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} />
                BENEFIT UNTUK SESAMA ALUMNI
              </p>
              <div className="flex flex-wrap gap-2">
                {allBenefits.map((b: any) => (
                  <span key={b.id} className="text-xs px-2.5 py-1.5 rounded-full border flex items-center gap-1.5"
                    style={{ borderColor: '#E0DDD8', color: '#3A3A3A', background: '#FAFAFA' }}>
                    {b.master_benefit?.emoji && <span className="text-sm">{b.master_benefit.emoji}</span>}
                    {b.master_benefit?.nama}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hasUMKM && (
            <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
                <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} />
                USAHA UMKM
              </p>
              <div className="space-y-2">
                {umkmList.map((umkm: any, i: number) => (
                  <button key={umkm.id}
                    onClick={() => { setSelectedUMKM(i); setActiveTab('umkm') }}
                    className="w-full rounded-xl px-4 py-3.5 flex items-center gap-3 text-left hover:opacity-90 active:scale-[0.99] transition"
                    style={{ background: '#2A2A2A' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden"
                      style={{ background: '#3D3D3D' }}>
                      {umkm.logo_url
                        ? <img src={umkm.logo_url} alt="logo" className="w-full h-full object-contain" />
                        : getInits(umkm.nama_usaha || 'U')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{umkm.nama_usaha}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {umkm.master_kategori_usaha?.nama || '—'}
                        {alumni.master_kota?.nama ? ` · ${alumni.master_kota.nama}` : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Detail</span>
                      <ChevronRight className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(alumni.whatsapp || alumni.instagram || alumni.email) && (
            <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
                <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} />
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
                      className="text-xs font-semibold px-4 py-1.5 rounded-lg border flex-shrink-0 hover:opacity-80 transition"
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
                      className="text-xs font-semibold px-4 py-1.5 rounded-lg border flex-shrink-0 hover:opacity-80 transition"
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
                      className="text-xs font-semibold px-4 py-1.5 rounded-lg border flex-shrink-0 hover:opacity-80 transition"
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
    </>
  )
}
