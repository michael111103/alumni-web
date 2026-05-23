import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Briefcase, Building2, ShoppingBag } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { Alumni } from '@/types'

export default function AlumniCard({ alumni }: { alumni: Alumni }) {
  const hasUMKM = alumni.umkm && alumni.umkm.length > 0

  return (
    <Link href={`/alumni/${alumni.id}`}>
      <div className="bg-white border border-gray-100 rounded-2xl p-4 card-hover cursor-pointer h-full flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-br from-red-100 to-gray-200 flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm">
            {alumni.foto_url ? (
              <Image src={alumni.foto_url} alt={alumni.nama_lengkap} width={44} height={44} className="object-cover w-full h-full" />
            ) : (
              <span className="text-red-800 font-bold text-sm">{getInitials(alumni.nama_lengkap)}</span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate leading-tight">{alumni.nama_lengkap}</h3>
            {alumni.angkatan && <span className="text-xs text-gray-400">Angkatan {alumni.angkatan}</span>}
          </div>
        </div>

        <div className="space-y-1.5 flex-1">
          {alumni.master_profesi && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Briefcase className="w-3 h-3 text-gray-300 flex-shrink-0" />
              <span className="truncate">{(alumni.master_profesi as any).nama}</span>
            </div>
          )}
          {alumni.perusahaan && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Building2 className="w-3 h-3 text-gray-300 flex-shrink-0" />
              <span className="truncate">{alumni.perusahaan}</span>
            </div>
          )}
          {alumni.master_kota && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="w-3 h-3 text-gray-300 flex-shrink-0" />
              <span className="truncate">{(alumni.master_kota as any).nama}</span>
            </div>
          )}
        </div>

        {hasUMKM && (
          <div className="mt-3 pt-3 border-t border-gray-50">
            <span className="inline-flex items-center gap-1.5 text-xs bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded-full font-medium">
              <ShoppingBag className="w-3 h-3" /> Punya UMKM
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
