// src/components/public/AlumniCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Briefcase, Building2 } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { Alumni } from '@/types'

export default function AlumniCard({ alumni }: { alumni: Alumni }) {
  const hasUMKM = alumni.umkm && alumni.umkm.length > 0

  return (
    <Link href={`/alumni/${alumni.id}`}>
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer h-full">
        {/* Avatar */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0">
            {alumni.foto_url ? (
              <Image
                src={alumni.foto_url}
                alt={alumni.nama_lengkap}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-blue-600 font-bold text-sm">
                {getInitials(alumni.nama_lengkap)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{alumni.nama_lengkap}</h3>
            {alumni.angkatan && (
              <p className="text-xs text-gray-400">Angkatan {alumni.angkatan}</p>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          {alumni.master_profesi && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Briefcase className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{alumni.master_profesi.nama}</span>
            </div>
          )}
          {alumni.perusahaan && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Building2 className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{alumni.perusahaan}</span>
            </div>
          )}
          {alumni.master_kota && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{alumni.master_kota.nama}</span>
            </div>
          )}
        </div>

        {/* UMKM Badge */}
        {hasUMKM && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full">
              🏪 Punya UMKM
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
