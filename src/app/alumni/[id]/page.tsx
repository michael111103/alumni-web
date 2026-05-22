'use client'
import { useAlumniById } from '@/hooks/useAlumni'
import { formatWhatsApp, formatInstagram, getInitials } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import { MapPin, Briefcase, Building2, Mail, Instagram, Linkedin, ArrowLeft, ShoppingBag, MessageCircle, Globe, Tag, GraduationCap, Gift } from 'lucide-react'

export default function AlumniDetailPage({ params }: { params: { id: string } }) {
  const { data: alumni, isLoading } = useAlumniById(params.id)

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 max-w-3xl mx-auto px-4">
        <div className="skeleton rounded-3xl h-64 mb-4" />
        <div className="skeleton rounded-2xl h-40" />
      </div>
    </div>
  )

  if (!alumni) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">Alumni tidak ditemukan</p>
          <Link href="/alumni" className="text-blue-600 hover:underline mt-2 inline-block text-sm">← Kembali ke direktori</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        <Link href="/alumni" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition mb-5">
          <ArrowLeft className="w-4 h-4" /> Kembali ke direktori
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-4 shadow-sm">
          <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-800 relative">
            <div className="absolute inset-0 opacity-10"
              style={{backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px'}} />
          </div>
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-10 mb-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-4 border-white shadow-md flex-shrink-0">
                {alumni.foto_url ? (
                  <Image src={alumni.foto_url} alt={alumni.nama_lengkap} width={80} height={80} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-blue-700 font-bold text-xl">{getInitials(alumni.nama_lengkap)}</span>
                )}
              </div>
              {alumni.is_active && (
                <div className="pb-1">
                  <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-100 px-2.5 py-1 rounded-full font-medium">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Aktif
                  </span>
                </div>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-1">{alumni.nama_lengkap}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-4">
              {alumni.angkatan && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-gray-300" /> Angkatan {alumni.angkatan}
                </span>
              )}
              {alumni.jurusan && <><span className="text-gray-300">·</span><span>{alumni.jurusan}</span></>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
              {alumni.master_profesi && (
                <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2.5">
                  <Briefcase className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  <div><p className="text-xs text-gray-400">Profesi</p><p className="text-sm font-medium text-gray-700">{(alumni.master_profesi as any).nama}</p></div>
                </div>
              )}
              {alumni.jabatan && (
                <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2.5">
                  <Building2 className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  <div><p className="text-xs text-gray-400">Jabatan</p><p className="text-sm font-medium text-gray-700">{alumni.jabatan}</p></div>
                </div>
              )}
              {alumni.perusahaan && (
                <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2.5">
                  <Building2 className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  <div><p className="text-xs text-gray-400">Perusahaan</p><p className="text-sm font-medium text-gray-700">{alumni.perusahaan}</p></div>
                </div>
              )}
              {alumni.master_kota && (
                <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2.5">
                  <MapPin className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  <div><p className="text-xs text-gray-400">Domisili</p><p className="text-sm font-medium text-gray-700">{(alumni.master_kota as any).nama}</p></div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {alumni.whatsapp && (
                <a href={formatWhatsApp(alumni.whatsapp)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm bg-green-50 text-green-700 border border-green-100 px-4 py-2 rounded-xl hover:bg-green-100 transition font-medium">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              )}
              {alumni.email && (
                <a href={`mailto:${alumni.email}`}
                  className="flex items-center gap-1.5 text-sm bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-xl hover:bg-blue-100 transition font-medium">
                  <Mail className="w-4 h-4" /> Email
                </a>
              )}
              {alumni.instagram && (
                <a href={formatInstagram(alumni.instagram)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm bg-pink-50 text-pink-700 border border-pink-100 px-4 py-2 rounded-xl hover:bg-pink-100 transition font-medium">
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              )}
              {alumni.linkedin && (
                <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-xl hover:bg-blue-100 transition font-medium">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              )}
            </div>

            {alumni.bio && (
              <div className="mt-5 pt-5 border-t border-gray-50">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tentang</p>
                <p className="text-sm text-gray-600 leading-relaxed">{alumni.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* UMKM */}
        {alumni.umkm && alumni.umkm.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-500" /> Usaha UMKM
            </h2>
            <div className="space-y-3">
              {alumni.umkm.map((umkm: any) => (
                <div key={umkm.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    {umkm.logo_url ? (
                      <Image src={umkm.logo_url} alt="logo" width={44} height={44} className="rounded-xl object-contain border border-gray-100" />
                    ) : (
                      <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-orange-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900">{umkm.nama_usaha}</h3>
                      {umkm.master_kategori_usaha && (
                        <span className="inline-flex items-center gap-1 text-xs text-orange-700 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full mt-0.5">
                          <Tag className="w-3 h-3" /> {umkm.master_kategori_usaha.nama}
                        </span>
                      )}
                    </div>
                  </div>

                  {umkm.deskripsi && <p className="text-sm text-gray-600 mb-3 leading-relaxed">{umkm.deskripsi}</p>}

                  {umkm.umkm_benefits?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-400 flex items-center gap-1 mb-1.5">
                        <Gift className="w-3 h-3" /> Benefit untuk alumni
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {umkm.umkm_benefits.map((b: any) => (
                          <span key={b.id} className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-100 px-2.5 py-1 rounded-full">
                            {b.master_benefit?.nama}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 flex-wrap pt-3 border-t border-gray-50">
                    {umkm.whatsapp_bisnis && (
                      <a href={formatWhatsApp(umkm.whatsapp_bisnis)} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-green-700 hover:text-green-800 font-medium transition">
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </a>
                    )}
                    {umkm.instagram_usaha && (
                      <a href={formatInstagram(umkm.instagram_usaha)} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-pink-700 hover:text-pink-800 font-medium transition">
                        <Instagram className="w-4 h-4" /> Instagram
                      </a>
                    )}
                    {umkm.toko_online && (
                      <a href={umkm.toko_online} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-orange-700 hover:text-orange-800 font-medium transition">
                        <ShoppingBag className="w-4 h-4" /> Toko Online
                      </a>
                    )}
                    {umkm.website && (
                      <a href={umkm.website} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-blue-700 hover:text-blue-800 font-medium transition">
                        <Globe className="w-4 h-4" /> Website
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
