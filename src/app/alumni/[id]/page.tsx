'use client'
import { useAlumniById } from '@/hooks/useAlumni'
import Navbar from '@/components/public/Navbar'
import FeaturedAlumniSection from '@/components/public/FeaturedAlumniSection'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export default function AlumniDetailPage({ params }: { params: { id: string } }) {
  const { data: alumni, isLoading } = useAlumniById(params.id)

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

  if (!alumni) return (
    <div className="min-h-screen" style={{ background: '#FAF8F4', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center px-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: '#F0EDEA' }}>
            <ShoppingBag className="w-6 h-6" style={{ color: '#C0272D' }} />
          </div>
          <p className="font-semibold mb-1" style={{ color: '#1A1A1A' }}>Alumni tidak ditemukan</p>
          <Link href="/alumni" className="text-sm" style={{ color: '#C0272D' }}>← Kembali ke direktori</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <div className="flex h-1 pt-14">
        <div className="flex-[3]" style={{ background: '#C0272D' }} />
        <div className="flex-[1]" style={{ background: '#2A2A2A' }} />
        <div className="flex-[2]" style={{ background: '#6B6B6B' }} />
        <div className="flex-[1]" style={{ background: '#C0272D' }} />
        <div className="flex-[3]" style={{ background: '#2A2A2A' }} />
      </div>
      <FeaturedAlumniSection alumni={alumni} />
    </div>
  )
}
