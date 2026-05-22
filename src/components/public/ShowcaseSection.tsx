'use client'
import { useShowcaseAktif } from '@/hooks/useAlumni'
import { formatWhatsApp, formatInstagram } from '@/lib/utils'
import Image from 'next/image'
import { MessageCircle, Instagram, ShoppingBag, Tag, User } from 'lucide-react'

export default function ShowcaseSection() {
  const { data: showcases, isLoading } = useShowcaseAktif()

  if (isLoading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1,2,3].map(i => <div key={i} className="skeleton rounded-2xl h-72" />)}
    </div>
  )

  if (!showcases?.length) return (
    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <ShoppingBag className="w-7 h-7 text-gray-300" />
      </div>
      <p className="text-gray-400 font-medium">Belum ada UMKM featured minggu ini</p>
    </div>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {showcases.map((item, idx) => (
        <div key={item.id} className={`bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover animate-fade-up-delay-${Math.min(idx+1,4)}`}>
          <div className="h-44 bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
            {item.foto_produk_urls?.[0] ? (
              <Image src={item.foto_produk_urls[0]} alt={item.nama_usaha} fill className="object-cover" />
            ) : (
              <div className="h-full flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-blue-200" />
              </div>
            )}
            {item.kategori_usaha && (
              <div className="absolute top-3 left-3">
                <span className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                  <Tag className="w-3 h-3" /> {item.kategori_usaha}
                </span>
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-start gap-3 mb-3">
              {item.logo_url ? (
                <Image src={item.logo_url} alt="logo" width={40} height={40}
                  className="rounded-xl object-contain border border-gray-100 flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 leading-tight truncate">{item.nama_usaha}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                  <User className="w-3 h-3" />
                  <span className="truncate">{item.nama_alumni} · {item.angkatan}</span>
                </div>
              </div>
            </div>
            {item.deskripsi_usaha && (
              <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">{item.deskripsi_usaha}</p>
            )}
            <div className="flex gap-2 flex-wrap">
              {item.whatsapp_bisnis && (
                <a href={formatWhatsApp(item.whatsapp_bisnis)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700 border border-green-100 px-3 py-1.5 rounded-xl hover:bg-green-100 transition font-medium">
                  <MessageCircle className="w-3 h-3" /> WhatsApp
                </a>
              )}
              {item.instagram_usaha && (
                <a href={formatInstagram(item.instagram_usaha)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs bg-pink-50 text-pink-700 border border-pink-100 px-3 py-1.5 rounded-xl hover:bg-pink-100 transition font-medium">
                  <Instagram className="w-3 h-3" /> Instagram
                </a>
              )}
              {item.toko_online && (
                <a href={item.toko_online} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1.5 rounded-xl hover:bg-orange-100 transition font-medium">
                  <ShoppingBag className="w-3 h-3" /> Toko
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
