import Link from 'next/link'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import ShowcaseSection from '@/components/public/ShowcaseSection'
import Navbar from '@/components/public/Navbar'
import HeroSearch from '@/components/public/HeroSearch'
import { Users, MapPin, Briefcase, Gift, ArrowRight, TrendingUp, Star, ShoppingBag } from 'lucide-react'

export const revalidate = 1800

async function getStats() {
  try {
    const supabase = createClient()
    const [{ count: totalAlumni }, { count: totalUMKM }] = await Promise.all([
      supabase.from('alumni').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('umkm').select('*', { count: 'exact', head: true }).eq('is_active', true),
    ])
    return { totalAlumni: totalAlumni || 0, totalUMKM: totalUMKM || 0 }
  } catch {
    return { totalAlumni: 0, totalUMKM: 0 }
  }
}

export default async function HomePage() {
  const stats = await getStats()

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900" />
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white" style={{clipPath: 'ellipse(55% 100% at 50% 100%)'}} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white/90 text-xs font-medium px-4 py-1.5 rounded-full mb-6 animate-fade-up border border-white/20">
            <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
            Platform Alumni Terpercaya
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight animate-fade-up-delay-1">
            Direktori Alumni &<br />
            <span className="text-blue-200">UMKM Komunitas</span>
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-up-delay-2">
            Temukan alumni berdasarkan kota, profesi, dan benefit. Dukung & terhubung dengan usaha sesama alumni.
          </p>

          <div className="animate-fade-up-delay-3">
            <HeroSearch />
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 animate-fade-up-delay-4">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-white">{stats.totalAlumni.toLocaleString('id-ID')}</div>
              <div className="text-blue-200 text-sm mt-0.5">Alumni</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-extrabold text-white">{stats.totalUMKM.toLocaleString('id-ID')}</div>
              <div className="text-blue-200 text-sm mt-0.5">UMKM</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Shortcuts */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Cari Berdasarkan Kebutuhan</h2>
          <p className="text-gray-500 mt-2">Filter alumni sesuai yang kamu butuhkan</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/alumni?filter=kota', icon: MapPin, title: 'Berdasarkan Kota', desc: 'Temukan alumni di kotamu', color: 'bg-blue-50 text-blue-600 border-blue-100', iconBg: 'bg-blue-100' },
            { href: '/alumni?filter=profesi', icon: Briefcase, title: 'Berdasarkan Profesi', desc: 'Cari berdasarkan bidang kerja', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', iconBg: 'bg-emerald-100' },
            { href: '/alumni?filter=benefit', icon: Gift, title: 'Berdasarkan Benefit', desc: 'Alumni yang menawarkan benefit', color: 'bg-orange-50 text-orange-600 border-orange-100', iconBg: 'bg-orange-100' },
          ].map((item, i) => (
            <Link key={i} href={item.href}>
              <div className={`border rounded-2xl p-5 card-hover cursor-pointer ${item.color}`}>
                <div className={`w-11 h-11 ${item.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-sm font-medium">
                  Jelajahi <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Showcase */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Featured</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">UMKM Pilihan Minggu Ini</h2>
              <p className="text-gray-500 mt-1">Usaha alumni yang sedang disorot</p>
            </div>
            <Link href="/umkm" className="hidden sm:flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition">
              Lihat semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3].map(i => <div key={i} className="skeleton rounded-2xl h-72" />)}
            </div>
          }>
            <ShowcaseSection />
          </Suspense>
          <div className="sm:hidden mt-6 text-center">
            <Link href="/umkm" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600">
              Lihat semua UMKM <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <Users className="w-10 h-10 text-blue-200 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Bergabung dengan Komunitas</h2>
          <p className="text-blue-100 mb-6 max-w-md mx-auto">Terhubung dengan ribuan alumni dan dukung usaha sesama.</p>
          <Link href="/alumni" className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition">
            <Users className="w-4 h-4" /> Jelajahi Alumni
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <Users className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-gray-700" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>
              Alumni<span className="text-blue-600">Net</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} AlumniNet. Platform komunitas alumni.</p>
          <div className="flex gap-4 text-sm text-gray-400">
            <Link href="/alumni" className="hover:text-gray-600 transition">Alumni</Link>
            <Link href="/umkm" className="hover:text-gray-600 transition">UMKM</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
