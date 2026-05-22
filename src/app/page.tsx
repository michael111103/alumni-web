// src/app/page.tsx
import Link from 'next/link'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import ShowcaseSection from '@/components/public/ShowcaseSection'
import SearchBar from '@/components/public/SearchBar'
import StatsBar from '@/components/public/StatsBar'

export const revalidate = 1800 // revalidate tiap 30 menit

async function getStats() {
  const supabase = createClient()
  const [{ count: totalAlumni }, { count: totalUMKM }] = await Promise.all([
    supabase.from('alumni').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('umkm').select('*', { count: 'exact', head: true }).eq('is_active', true),
  ])
  return { totalAlumni: totalAlumni || 0, totalUMKM: totalUMKM || 0 }
}

export default async function HomePage() {
  const stats = await getStats()

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            AlumniNet
          </Link>
          <div className="flex gap-4">
            <Link href="/alumni" className="text-gray-600 hover:text-blue-600 font-medium text-sm">
              Direktori Alumni
            </Link>
            <Link href="/umkm" className="text-gray-600 hover:text-blue-600 font-medium text-sm">
              UMKM Alumni
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Direktori Alumni & UMKM
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Temukan alumni berdasarkan kota, profesi, dan benefit. 
            Dukung usaha sesama alumni!
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Stats */}
      <StatsBar totalAlumni={stats.totalAlumni} totalUMKM={stats.totalUMKM} />

      {/* Showcase UMKM Mingguan */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">🌟 UMKM Pilihan Minggu Ini</h2>
            <p className="text-gray-500 mt-1">Usaha alumni yang sedang featured</p>
          </div>
          <Link
            href="/umkm"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Lihat semua UMKM →
          </Link>
        </div>
        <Suspense fallback={<ShowcaseSkeleton />}>
          <ShowcaseSection />
        </Suspense>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Cari Alumni Berdasarkan Kebutuhan
          </h2>
          <p className="text-gray-600 mb-8">
            Filter berdasarkan kota, profesi, atau benefit yang ditawarkan
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/alumni?filter=kota"
              className="bg-white border border-gray-200 rounded-full px-5 py-2 text-sm font-medium hover:border-blue-400 hover:text-blue-600 transition"
            >
              📍 Berdasarkan Kota
            </Link>
            <Link
              href="/alumni?filter=profesi"
              className="bg-white border border-gray-200 rounded-full px-5 py-2 text-sm font-medium hover:border-blue-400 hover:text-blue-600 transition"
            >
              💼 Berdasarkan Profesi
            </Link>
            <Link
              href="/alumni?filter=benefit"
              className="bg-white border border-gray-200 rounded-full px-5 py-2 text-sm font-medium hover:border-blue-400 hover:text-blue-600 transition"
            >
              🎁 Berdasarkan Benefit
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-4 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} AlumniNet. Platform komunitas alumni.</p>
      </footer>
    </main>
  )
}

function ShowcaseSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-64" />
      ))}
    </div>
  )
}
