'use client'
// src/components/public/ShowcaseSection.tsx
import { useShowcaseAktif } from '@/hooks/useAlumni'
import { formatWhatsApp, formatInstagram } from '@/lib/utils'
import Image from 'next/image'

export default function ShowcaseSection() {
  const { data: showcases, isLoading, error } = useShowcaseAktif()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-64" />
        ))}
      </div>
    )
  }

  if (error || !showcases?.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg">Belum ada UMKM featured minggu ini</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {showcases.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
        >
          {/* Foto */}
          <div className="h-48 bg-gray-100 relative overflow-hidden">
            {item.foto_produk_urls?.[0] ? (
              <Image
                src={item.foto_produk_urls[0]}
                alt={item.nama_usaha}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-300">
                <span className="text-4xl">🏪</span>
              </div>
            )}
            {item.kategori_usaha && (
              <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {item.kategori_usaha}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start gap-3 mb-3">
              {item.logo_url ? (
                <Image
                  src={item.logo_url}
                  alt="logo"
                  width={40}
                  height={40}
                  className="rounded-lg object-contain border border-gray-100"
                />
              ) : null}
              <div>
                <h3 className="font-bold text-gray-900 leading-tight">{item.nama_usaha}</h3>
                <p className="text-xs text-gray-400">oleh {item.nama_alumni} ({item.angkatan})</p>
              </div>
            </div>

            {item.deskripsi_usaha && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {item.deskripsi_usaha}
              </p>
            )}

            {/* Links */}
            <div className="flex gap-2 flex-wrap">
              {item.whatsapp_bisnis && (
                <a
                  href={formatWhatsApp(item.whatsapp_bisnis)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full hover:bg-green-100 transition"
                >
                  💬 WhatsApp
                </a>
              )}
              {item.instagram_usaha && (
                <a
                  href={formatInstagram(item.instagram_usaha)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-pink-50 text-pink-700 border border-pink-200 px-3 py-1 rounded-full hover:bg-pink-100 transition"
                >
                  📸 Instagram
                </a>
              )}
              {item.toko_online && (
                <a
                  href={item.toko_online}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-full hover:bg-orange-100 transition"
                >
                  🛒 Toko Online
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
