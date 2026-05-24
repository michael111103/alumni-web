'use client'
import Image from 'next/image'
import Link from 'next/link'
import {
  MessageCircle, Instagram, Mail, ChevronRight,
  ShoppingBag, Globe, ArrowLeft, MapPin, Star,
  Handshake, Search, SlidersHorizontal, X, ChevronDown,
  Users, Heart,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAlumni, useAlumniById, useMasterKota, useMasterProfesi } from '@/hooks/useAlumni'
import Pagination from '@/components/public/Pagination'
import type { AlumniFilter } from '@/types'

function getInits(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

const AVATAR_COLORS = [
  '#C0272D', '#3B3B3B', '#C0272D', '#3B3B3B', '#888',
  '#C0272D', '#3B3B3B', '#C0272D', '#888', '#3B3B3B',
]

type View = 'beranda' | 'direktori' | 'profil'

// ── Sub-component: Profil Alumni ──
function ProfilView({ alumni, onBackBeranda, onBackDirektori }: {
  alumni: any
  onBackBeranda: () => void
  onBackDirektori: () => void
}) {
  const [activeTab, setActiveTab] = useState<'profil' | 'umkm'>('profil')
  const [selectedUMKM, setSelectedUMKM] = useState(0)

  const hasUMKM = !!(alumni?.umkm && alumni.umkm.length > 0)
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
            <h3 className="text-lg font-black text-white leading-tight mb-1.5" style={{ fontFamily: "'Playfair Display', serif" }}>
              {currentUMKM.nama_usaha}
            </h3>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(currentUMKM.master_kategori_usaha as any)?.nama && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(192,39,45,0.7)', color: 'white' }}>
                  {(currentUMKM.master_kategori_usaha as any).nama}
                </span>
              )}
              {currentUMKM.jangkauan && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)' }}>
                  {currentUMKM.jangkauan.charAt(0).toUpperCase() + currentUMKM.jangkauan.slice(1)}
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              {[
                { val: currentUMKM.skala_usaha ? currentUMKM.skala_usaha.charAt(0).toUpperCase() + currentUMKM.skala_usaha.slice(1) : '—', label: 'Skala' },
                { val: currentUMKM.umkm_benefits?.length || 0, label: 'Benefit' },
                { val: currentUMKM.created_at ? new Date(currentUMKM.created_at).getFullYear() : '—', label: 'Bergabung' },
              ].map((s, i) => (
                <div key={i} className={`text-center ${i === 1 ? 'border-x' : ''}`} style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="text-xs font-bold text-white">{s.val}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {currentUMKM.deskripsi && (
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} /> TENTANG USAHA
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#3A3A3A' }}>{currentUMKM.deskripsi}</p>
          </div>
        )}

        {currentUMKM.umkm_benefits?.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} /> BENEFIT UNTUK ALUMNI
            </p>
            <div className="space-y-2">
              {currentUMKM.umkm_benefits.map((b: any) => (
                <div key={b.id} className="flex items-center gap-3 p-2.5 rounded-xl border"
                  style={{ background: '#FAFAFA', borderColor: '#E0DDD8' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0" style={{ background: '#F0EDEA' }}>
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

        {(currentUMKM.whatsapp_bisnis || currentUMKM.instagram_usaha || currentUMKM.toko_online || currentUMKM.website) && (
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} /> HUBUNGI USAHA INI
            </p>
            <div className="space-y-3">
              {[
                { key: 'whatsapp_bisnis', label: 'WhatsApp Bisnis', icon: <MessageCircle className="w-4 h-4" style={{ color: '#6B6B6B' }} />, href: (v: string) => `https://wa.me/${v.replace(/\D/g, '')}`, btn: 'Hubungi' },
                { key: 'instagram_usaha', label: 'Instagram', icon: <Instagram className="w-4 h-4" style={{ color: '#6B6B6B' }} />, href: (v: string) => `https://instagram.com/${v.replace('@', '')}`, btn: 'Buka' },
                { key: 'toko_online', label: 'Toko Online', icon: <ShoppingBag className="w-4 h-4" style={{ color: '#6B6B6B' }} />, href: (v: string) => v, btn: 'Kunjungi' },
                { key: 'website', label: 'Website', icon: <Globe className="w-4 h-4" style={{ color: '#6B6B6B' }} />, href: (v: string) => v, btn: 'Buka' },
              ].filter(item => currentUMKM[item.key]).map(item => (
                <div key={item.key} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F0EDEA' }}>{item.icon}</div>
                    <div className="min-w-0">
                      <div className="text-xs" style={{ color: '#9B9B9B' }}>{item.label}</div>
                      <div className="text-sm font-medium truncate max-w-[160px]" style={{ color: '#1A1A1A' }}>{currentUMKM[item.key]}</div>
                    </div>
                  </div>
                  <a href={item.href(currentUMKM[item.key])} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-semibold px-4 py-1.5 rounded-lg border flex-shrink-0 hover:opacity-80 transition"
                    style={{ borderColor: '#E0DDD8', color: '#1A1A1A' }}>
                    {item.btn}
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
            <button onClick={onBackBeranda}
              className="px-2 py-1 rounded-lg hover:bg-gray-100 transition font-medium"
              style={{ color: '#9B9B9B' }}>
              Beranda
            </button>
            <span style={{ color: '#D0CCC8' }}>/</span>
            <button onClick={onBackDirektori}
              className="px-2 py-1 rounded-lg hover:bg-gray-100 transition font-medium"
              style={{ color: '#9B9B9B' }}>
              Direktori
            </button>
            <span style={{ color: '#D0CCC8' }}>/</span>
            <span className="px-2 py-1 font-semibold truncate max-w-[140px]" style={{ color: '#1A1A1A' }}>
              {alumni.nama_lengkap}
            </span>
          </div>
        </div>
      </div>

      {/* PROFILE HEADER */}
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
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.85)' }}>
                    Angkatan {alumni.angkatan}
                  </span>
                )}
                {alumni.master_kota?.nama && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.85)' }}>
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
                <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} /> TENTANG
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#3A3A3A' }}>{alumni.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
                <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} /> DATA DIRI
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
                <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} /> STATUS
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
                <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} /> BENEFIT UNTUK SESAMA ALUMNI
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
                <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} /> USAHA UMKM
              </p>
              <div className="space-y-2">
                {umkmList.map((umkm: any, i: number) => (
                  <button key={umkm.id} onClick={() => { setSelectedUMKM(i); setActiveTab('umkm') }}
                    className="w-full rounded-xl px-4 py-3.5 flex items-center gap-3 text-left hover:opacity-90 transition"
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
                <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} /> KONTAK
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
                    <a href={`https://wa.me/${alumni.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
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
                    <a href={`https://instagram.com/${alumni.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
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

// ── Sub-component: Direktori ──
function DirektoriView({ onSelectAlumni, onBack }: {
  onSelectAlumni: (id: string) => void
  onBack: () => void
}) {
  const [page, setPage] = useState(1)
  const [showFilter, setShowFilter] = useState(false)
  const [filter, setFilter] = useState<AlumniFilter>({ search: '', kota_id: '', profesi_id: '' })
  const [searchInput, setSearchInput] = useState('')
  const { data: alumniData, isLoading } = useAlumni(filter, page)
  const { data: kotas } = useMasterKota()
  const { data: profesis } = useMasterProfesi()

  const hasActiveFilter = !!(filter.kota_id || filter.profesi_id || filter.search)
  const activeFilterCount = [filter.kota_id, filter.profesi_id].filter(Boolean).length

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilter(f => ({ ...f, search: searchInput }))
    setPage(1)
  }

  const handleFilter = (newFilter: Partial<AlumniFilter>) => {
    setFilter(f => ({ ...f, ...newFilter }))
    setPage(1)
  }

  const clearFilter = () => {
    setFilter({ search: '', kota_id: '', profesi_id: '' })
    setSearchInput('')
    setPage(1)
  }

  return (
    <>
      <div className="bg-white border-b" style={{ borderColor: '#E0DDD8' }}>
        <div className="max-w-2xl mx-auto flex">
          <div className="flex-1 py-3.5 text-sm font-semibold text-center" style={{ color: '#6B6B6B' }}>Profil Alumni</div>
          <div className="flex-1 py-3.5 text-sm font-semibold text-center" style={{ color: '#6B6B6B' }}>Detail UMKM</div>
        </div>
      </div>

      <div className="bg-white border-b" style={{ borderColor: '#F0EDEA' }}>
        <div className="max-w-2xl mx-auto px-4 py-2.5">
          <div className="flex items-center gap-1 text-xs">
            <button onClick={onBack}
              className="px-2 py-1 rounded-lg hover:bg-gray-100 transition font-medium"
              style={{ color: '#9B9B9B' }}>
              Beranda
            </button>
            <span style={{ color: '#D0CCC8' }}>/</span>
            <span className="px-2 py-1 font-semibold" style={{ color: '#1A1A1A' }}>Direktori</span>
          </div>
        </div>
      </div>

      <div style={{ background: '#2A2A2A' }}>
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-7">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(192,39,45,0.3)' }}>
              <Users className="w-5 h-5" style={{ color: '#E8857A' }} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                Direktori Alumni
              </h2>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {alumniData?.total ? `${alumniData.total.toLocaleString('id-ID')} alumni terdaftar` : 'Memuat...'}
              </p>
            </div>
          </div>
        </div>
        <div className="h-6 rounded-t-[28px]" style={{ background: '#FAF8F4' }} />
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-12" style={{ marginTop: '-4px' }}>
        <form onSubmit={handleSearch} className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9B9B9B' }} />
            <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Nama, profesi, atau kota..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none border transition"
              style={{ background: 'white', borderColor: '#E0DDD8', color: '#1A1A1A' }} />
          </div>
          <button type="submit"
            className="text-white text-sm font-semibold px-5 py-3 rounded-xl transition hover:opacity-90 flex-shrink-0"
            style={{ background: '#C0272D' }}>
            Cari
          </button>
          <button type="button" onClick={() => setShowFilter(!showFilter)}
            className="relative flex items-center px-3.5 py-3 rounded-xl border transition flex-shrink-0"
            style={{
              borderColor: showFilter || activeFilterCount > 0 ? '#C0272D' : '#E0DDD8',
              background: showFilter || activeFilterCount > 0 ? '#F9ECEC' : 'white',
              color: showFilter || activeFilterCount > 0 ? '#C0272D' : '#6B6B6B',
            }}>
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 text-white text-xs rounded-full flex items-center justify-center font-bold"
                style={{ background: '#C0272D' }}>
                {activeFilterCount}
              </span>
            )}
          </button>
          {hasActiveFilter && (
            <button type="button" onClick={clearFilter}
              className="p-3 rounded-xl border flex-shrink-0"
              style={{ borderColor: '#E0DDD8', background: 'white', color: '#9B9B9B' }}>
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {showFilter && (
          <div className="bg-white rounded-2xl border p-4 mb-3 space-y-3" style={{ borderColor: '#E0DDD8' }}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#C0272D' }}>
                  <MapPin className="w-3 h-3" /> Kota
                </label>
                <div className="relative">
                  <select value={filter.kota_id || ''} onChange={e => handleFilter({ kota_id: e.target.value })}
                    className="w-full appearance-none border rounded-xl px-3 py-2.5 text-xs focus:outline-none pr-8"
                    style={{ borderColor: '#E0DDD8', background: '#FAFAFA', color: '#1A1A1A' }}>
                    <option value="">Semua Kota</option>
                    {kotas?.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#9B9B9B' }} />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#C0272D' }}>
                  <Users className="w-3 h-3" /> Profesi
                </label>
                <div className="relative">
                  <select value={filter.profesi_id || ''} onChange={e => handleFilter({ profesi_id: e.target.value })}
                    className="w-full appearance-none border rounded-xl px-3 py-2.5 text-xs focus:outline-none pr-8"
                    style={{ borderColor: '#E0DDD8', background: '#FAFAFA', color: '#1A1A1A' }}>
                    <option value="">Semua Profesi</option>
                    {profesis?.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#9B9B9B' }} />
                </div>
              </div>
            </div>
            <button onClick={clearFilter}
              className="flex items-center gap-1.5 text-xs font-medium transition hover:opacity-70"
              style={{ color: '#9B9B9B' }}>
              <X className="w-3.5 h-3.5" /> Reset filter
            </button>
          </div>
        )}

        {hasActiveFilter && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {filter.search && (
              <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                style={{ background: '#F9ECEC', color: '#C0272D', border: '1px solid #EDCACA' }}>
                "{filter.search}"
                <button onClick={() => { setFilter(f => ({ ...f, search: '' })); setSearchInput('') }}>
                  <X className="w-3 h-3 ml-0.5" />
                </button>
              </div>
            )}
            {filter.kota_id && (
              <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                style={{ background: '#F9ECEC', color: '#C0272D', border: '1px solid #EDCACA' }}>
                {kotas?.find(k => k.id === filter.kota_id)?.nama}
                <button onClick={() => handleFilter({ kota_id: '' })}><X className="w-3 h-3 ml-0.5" /></button>
              </div>
            )}
            {filter.profesi_id && (
              <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                style={{ background: '#F9ECEC', color: '#C0272D', border: '1px solid #EDCACA' }}>
                {profesis?.find(p => p.id === filter.profesi_id)?.nama}
                <button onClick={() => handleFilter({ profesi_id: '' })}><X className="w-3 h-3 ml-0.5" /></button>
              </div>
            )}
          </div>
        )}

        {!isLoading && alumniData?.data?.length > 0 && (
          <p className="text-xs mb-3" style={{ color: '#9B9B9B' }}>
            Menampilkan <span className="font-semibold" style={{ color: '#1A1A1A' }}>{alumniData.data.length}</span> dari{' '}
            <span className="font-semibold" style={{ color: '#1A1A1A' }}>{alumniData.total.toLocaleString('id-ID')}</span> alumni
          </p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-36 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : !alumniData?.data?.length ? (
          <div className="text-center py-16 bg-white rounded-2xl border" style={{ borderColor: '#E0DDD8' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: '#F0EDEA' }}>
              <Search className="w-6 h-6" style={{ color: '#C0272D', opacity: 0.4 }} />
            </div>
            <p className="font-semibold mb-1" style={{ color: '#1A1A1A' }}>Alumni tidak ditemukan</p>
            <p className="text-sm" style={{ color: '#9B9B9B' }}>Coba ubah kata kunci atau reset filter</p>
            {hasActiveFilter && (
              <button onClick={clearFilter} className="mt-4 text-sm font-semibold hover:opacity-70" style={{ color: '#C0272D' }}>
                Reset filter
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              {alumniData.data.map((a: any, idx: number) => {
                const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length]
                const hasUMKMFlag = a.umkm && a.umkm.length > 0
                return (
                  <button key={a.id} onClick={() => onSelectAlumni(a.id)}
                    className="bg-white border rounded-xl p-3.5 cursor-pointer transition-all hover:border-red-400 hover:shadow-sm text-left w-full"
                    style={{ borderColor: '#E0DDD8' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold mb-2.5 overflow-hidden"
                      style={{ background: avatarColor, color: 'white' }}>
                      {a.foto_url
                        ? <img src={a.foto_url} alt="" className="w-full h-full object-cover rounded-full" />
                        : getInits(a.nama_lengkap)}
                    </div>
                    <div className="text-xs font-bold leading-tight mb-0.5 truncate" style={{ color: '#1A1A1A' }}>
                      {a.nama_lengkap.split(' ')[0]}{' '}
                      {a.nama_lengkap.split(' ')[1]?.[0] ? `${a.nama_lengkap.split(' ')[1][0]}.` : ''}
                    </div>
                    <div className="text-xs mb-1.5 truncate" style={{ color: '#6B6B6B' }}>
                      {(a.master_profesi as any)?.nama || a.jabatan || '—'}
                    </div>
                    {hasUMKMFlag && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: '#EFEFED', color: '#6B6B6B' }}>
                        UMKM
                      </span>
                    )}
                    {(a.master_kota as any)?.nama && (
                      <div className="text-xs font-semibold mt-1 truncate" style={{ color: '#C0272D' }}>
                        {(a.master_kota as any).nama}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            {alumniData.totalPages > 1 && (
              <div className="mt-6">
                <Pagination page={page} totalPages={alumniData.totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

// ── MAIN COMPONENT ──
export default function FeaturedAlumniSection({ alumni: defaultAlumni }: { alumni: any }) {
  const [view, setView] = useState<View>('beranda')
  const [selectedAlumniId, setSelectedAlumniId] = useState<string | null>(null)

  const { data: fetchedAlumni, isLoading: loadingAlumni } = useAlumniById(selectedAlumniId || '')
  const displayAlumni = selectedAlumniId ? fetchedAlumni : defaultAlumni

  // ── Listen event dari HomeSearchWrapper ──
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail?.id
      if (id) {
        setSelectedAlumniId(id)
        setView('profil')
      }
    }
    window.addEventListener('alumni-select', handler)
    return () => window.removeEventListener('alumni-select', handler)
  }, [])

  const goToBeranda = () => { setView('beranda'); setSelectedAlumniId(null) }
  const goToDirektori = () => setView('direktori')
  const selectAlumni = (id: string) => { setSelectedAlumniId(id); setView('profil') }

  /* ══════════ VIEW: BERANDA ══════════ */
  if (view === 'beranda') {
    return (
      <div id="featured-alumni-section">
        <div className="bg-white border-b" style={{ borderColor: '#E0DDD8' }}>
          <div className="max-w-2xl mx-auto flex">
            <div className="flex-1 py-3.5 text-sm font-semibold text-center relative" style={{ color: '#C0272D' }}>
              Profil Alumni
              <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#C0272D' }} />
            </div>
            <div className="flex-1 py-3.5 text-sm font-semibold text-center" style={{ color: '#6B6B6B' }}>Detail UMKM</div>
          </div>
        </div>

        <div className="bg-white border-b" style={{ borderColor: '#F0EDEA' }}>
          <div className="max-w-2xl mx-auto px-4 py-2.5">
            <span className="px-2 py-1 text-xs font-semibold" style={{ color: '#1A1A1A' }}>Beranda</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 pb-12 pt-4 space-y-4">
          {/* Welcome card */}
          <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: '#2A2A2A' }}>
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full" style={{ background: 'rgba(192,39,45,0.15)' }} />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
            <div className="relative">
              <div className="inline-flex items-center gap-1.5 border border-white/20 rounded-full px-3 py-1 text-white/60 text-xs tracking-widest uppercase mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-300" />
                Komunitas Alumni Tarakanita
              </div>
              <h2 className="text-2xl font-black text-white leading-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Satu ikatan,<br />
                <em style={{ fontStyle: 'italic', color: '#E8857A' }}>seribu koneksi.</em>
              </h2>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Temukan sesama alumni, dukung usaha UMKM teman, dan perluas jaringanmu.
              </p>
              <div className="flex gap-2">
                <button onClick={goToDirektori}
                  className="text-white text-xs font-semibold px-4 py-2 rounded-lg transition hover:opacity-90"
                  style={{ background: '#C0272D' }}>
                  Cari Alumni
                </button>
                <button onClick={() => { setSelectedAlumniId(null); setView('profil') }}
                  className="text-white text-xs px-4 py-2 rounded-lg border border-white/25 hover:border-white/40 transition">
                  Lihat Profil
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <Users className="w-4 h-4" />, label: 'Alumni', color: '#C0272D' },
              { icon: <ShoppingBag className="w-4 h-4" />, label: 'UMKM Aktif', color: '#2A2A2A' },
              { icon: <MapPin className="w-4 h-4" />, label: 'Kota', color: '#888' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-3.5 border text-center" style={{ borderColor: '#E0DDD8' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2 text-white" style={{ background: item.color }}>
                  {item.icon}
                </div>
                <div className="text-xs" style={{ color: '#9B9B9B' }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Fitur */}
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} />
              APA YANG BISA KAMU LAKUKAN
            </p>
            <div className="space-y-3">
              {[
                { icon: <Users className="w-4 h-4" />, title: 'Temukan Alumni', desc: 'Cari sesama alumni berdasarkan kota, profesi, atau angkatan', action: goToDirektori, btnLabel: 'Cari Sekarang', color: '#C0272D', href: null },
                { icon: <ShoppingBag className="w-4 h-4" />, title: 'Dukung UMKM', desc: 'Temukan dan dukung usaha dari alumni Tarakanita', action: null, btnLabel: 'Lihat UMKM', color: '#2A2A2A', href: '/umkm' },
                { icon: <Handshake className="w-4 h-4" />, title: 'Buka Kolaborasi', desc: 'Temukan alumni yang terbuka untuk berkolaborasi', action: goToDirektori, btnLabel: 'Jelajahi', color: '#888', href: null },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#FAFAFA', border: '1px solid #E0DDD8' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: item.color }}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold mb-0.5" style={{ color: '#1A1A1A' }}>{item.title}</div>
                    <div className="text-xs" style={{ color: '#9B9B9B' }}>{item.desc}</div>
                  </div>
                  {item.href ? (
                    <Link href={item.href}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 transition hover:opacity-80"
                      style={{ background: item.color, color: 'white' }}>
                      {item.btnLabel}
                    </Link>
                  ) : (
                    <button onClick={item.action!}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 transition hover:opacity-80"
                      style={{ background: item.color, color: 'white' }}>
                      {item.btnLabel}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Alumni featured */}
          <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E0DDD8' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#C0272D' }}>
              <span className="w-1 h-3.5 rounded-full inline-block" style={{ background: '#C0272D' }} />
              ALUMNI FEATURED
            </p>
            <button onClick={() => { setSelectedAlumniId(null); setView('profil') }}
              className="w-full flex items-center gap-3 p-3 rounded-xl transition hover:opacity-90"
              style={{ background: '#2A2A2A' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ background: '#C0272D' }}>
                {defaultAlumni.foto_url
                  ? <img src={defaultAlumni.foto_url} alt="" className="w-full h-full object-cover rounded-full" />
                  : getInits(defaultAlumni.nama_lengkap)}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-bold text-white truncate">{defaultAlumni.nama_lengkap}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {defaultAlumni.jabatan || defaultAlumni.master_profesi?.nama || '—'}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
            </button>
          </div>

          {/* CTA */}
          <div className="rounded-2xl p-4 text-center" style={{ background: '#C0272D' }}>
            <Heart className="w-6 h-6 text-white/60 mx-auto mb-2" />
            <p className="text-sm font-bold text-white mb-1">Punya usaha UMKM?</p>
            <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Tampil di spotlight minggu depan — gratis untuk alumni.
            </p>
            <Link href="/daftar"
              className="inline-block text-xs font-bold px-5 py-2 rounded-lg transition hover:opacity-90"
              style={{ background: 'white', color: '#C0272D' }}>
              Daftarkan Sekarang
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ══════════ VIEW: DIREKTORI ══════════ */
  if (view === 'direktori') {
    return (
      <div id="featured-alumni-section">
        <DirektoriView onSelectAlumni={selectAlumni} onBack={goToBeranda} />
      </div>
    )
  }

  /* ══════════ VIEW: PROFIL ══════════ */
  if (loadingAlumni && selectedAlumniId) {
    return (
      <div id="featured-alumni-section" className="max-w-2xl mx-auto px-4 pt-6 space-y-3">
        <div className="h-5 w-52 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-28 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="h-44 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="h-36 rounded-2xl bg-gray-200 animate-pulse" />
      </div>
    )
  }

  return (
    <div id="featured-alumni-section">
      <ProfilView
        alumni={displayAlumni || defaultAlumni}
        onBackBeranda={goToBeranda}
        onBackDirektori={goToDirektori}
      />
    </div>
  )
}
