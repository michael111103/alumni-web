'use client'
// src/app/alumni/[id]/page.tsx
import { useAlumniById } from '@/hooks/useAlumni'
import { formatWhatsApp, formatInstagram, getInitials } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { use } from 'react'
import {
  MapPin, Briefcase, Building2, Phone, Mail,
  Instagram, Linkedin, ArrowLeft, ExternalLink
} from 'lucide-react'

export default function AlumniDetailPage({ params }: { params: { id: string } }) {
  const { data: alumni, isLoading } = useAlumniById(params.id)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-300">Memuat profil...</div>
      </div>
    )
  }

  if (!alumni) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-gray-500">Alumni tidak ditemukan</p>
          <Link href="/alumni" className="text-blue-600 hover:underline mt-2 inline-block">
            ← Kembali ke direktori
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/alumni" className="text-gray-400 hover:text-gray-600 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <a href="/" className="text-xl font-bold text-blue-600">AlumniNet</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0">
              {alumni.foto_url ? (
                <Image
                  src={alumni.foto_url}
                  alt={alumni.nama_lengkap}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-blue-600 font-bold text-2xl">
                  {getInitials(alumni.nama_lengkap)}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{alumni.nama_lengkap}</h1>
              {alumni.angkatan && (
                <p className="text-gray-400 text-sm mt-0.5">
                  Angkatan {alumni.angkatan}
                  {alumni.jurusan && ` · ${alumni.jurusan}`}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                {alumni.master_profesi && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {alumni.jabatan || alumni.master_profesi.nama}
                  </div>
                )}
                {alumni.perusahaan && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {alumni.perusahaan}
                  </div>
                )}
                {alumni.master_kota && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {alumni.master_kota.nama}
                  </div>
                )}
              </div>

              {/* Kontak */}
              <div className="flex flex-wrap gap-2 mt-4">
                {alumni.whatsapp && (
                  <a
                    href={formatWhatsApp(alumni.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full hover:bg-green-100 transition"
                  >
                    <Phone className="w-3 h-3" /> WhatsApp
                  </a>
                )}
                {alumni.email && (
                  <a
                    href={`mailto:${alumni.email}`}
                    className="flex items-center gap-1.5 text-sm bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full hover:bg-blue-100 transition"
                  >
                    <Mail className="w-3 h-3" /> Email
                  </a>
                )}
                {alumni.instagram && (
                  <a
                    href={formatInstagram(alumni.instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm bg-pink-50 text-pink-700 border border-pink-200 px-3 py-1.5 rounded-full hover:bg-pink-100 transition"
                  >
                    <Instagram className="w-3 h-3" /> Instagram
                  </a>
                )}
                {alumni.linkedin && (
                  <a
                    href={alumni.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full hover:bg-blue-100 transition"
                  >
                    <Linkedin className="w-3 h-3" /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          {alumni.bio && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Tentang</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{alumni.bio}</p>
            </div>
          )}
        </div>

        {/* UMKM Section */}
        {alumni.umkm && alumni.umkm.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">🏪 Usaha UMKM</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {alumni.umkm.map((umkm: any) => (
                <div key={umkm.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {umkm.logo_url ? (
                      <Image
                        src={umkm.logo_url}
                        alt="logo"
                        width={40}
                        height={40}
                        className="rounded-lg object-contain border border-gray-100"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-sm">
                        {umkm.nama_usaha[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{umkm.nama_usaha}</h3>
                      {umkm.master_kategori_usaha && (
                        <p className="text-xs text-gray-400">{umkm.master_kategori_usaha.nama}</p>
                      )}
                    </div>
                  </div>

                  {umkm.deskripsi && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{umkm.deskripsi}</p>
                  )}

                  {/* Benefits */}
                  {umkm.umkm_benefits?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-400 mb-1">Benefit untuk alumni:</p>
                      <div className="flex flex-wrap gap-1">
                        {umkm.umkm_benefits.map((b: any) => (
                          <span key={b.id} className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full">
                            {b.master_benefit?.nama}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-2 flex-wrap">
                    {umkm.whatsapp_bisnis && (
                      <a href={formatWhatsApp(umkm.whatsapp_bisnis)} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-green-700 hover:underline">💬 WA</a>
                    )}
                    {umkm.instagram_usaha && (
                      <a href={formatInstagram(umkm.instagram_usaha)} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-pink-700 hover:underline">📸 IG</a>
                    )}
                    {umkm.toko_online && (
                      <a href={umkm.toko_online} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-orange-700 hover:underline">🛒 Toko</a>
                    )}
                    {umkm.website && (
                      <a href={umkm.website} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-blue-700 hover:underline">🌐 Website</a>
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
