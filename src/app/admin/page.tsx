'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useDashboardStats } from '@/hooks/useAlumni'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Users, Store, Star, TrendingUp, LayoutDashboard } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const { data: stats, isLoading } = useDashboardStats()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/admin-login')
    })
  }, [])

  return (
    <div className="flex w-full min-h-screen">
      <AdminSidebar />

      {/* Main - ada padding left untuk sidebar di desktop, full width di mobile */}
      <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 w-full">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pt-14 md:pt-0">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <LayoutDashboard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">Dashboard</h1>
            <p className="text-gray-400 text-xs sm:text-sm">Selamat datang di CMS AlumniNet</p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          <StatCard
            icon={<Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
            label="Alumni"
            value={stats?.totalAlumni}
            isLoading={isLoading}
            color="blue"
          />
          <StatCard
            icon={<Store className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />}
            label="UMKM"
            value={stats?.totalUMKM}
            isLoading={isLoading}
            color="orange"
          />
          <StatCard
            icon={<Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />}
            label="Showcase"
            value={stats?.totalShowcase}
            isLoading={isLoading}
            color="yellow"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Per Kota */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
              <TrendingUp className="w-4 h-4 text-blue-500 flex-shrink-0" />
              Alumni per Kota
              <span className="text-xs text-gray-400 font-normal">(Top 10)</span>
            </h2>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse h-6 bg-gray-100 rounded" />
                ))}
              </div>
            ) : stats?.alumniPerKota.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Belum ada data</p>
            ) : (
              <div className="space-y-2.5">
                {stats?.alumniPerKota.map((item, i) => (
                  <div key={item.kota} className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs text-gray-400 w-4 flex-shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs sm:text-sm font-medium text-gray-700 truncate pr-2">{item.kota}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">{item.count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${Math.round((item.count / (stats?.alumniPerKota[0]?.count || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Per Profesi */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
              <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
              Alumni per Profesi
              <span className="text-xs text-gray-400 font-normal">(Top 10)</span>
            </h2>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse h-6 bg-gray-100 rounded" />
                ))}
              </div>
            ) : stats?.alumniPerProfesi.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Belum ada data</p>
            ) : (
              <div className="space-y-2.5">
                {stats?.alumniPerProfesi.map((item, i) => (
                  <div key={item.profesi} className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs text-gray-400 w-4 flex-shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs sm:text-sm font-medium text-gray-700 truncate pr-2">{item.profesi}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">{item.count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{ width: `${Math.round((item.count / (stats?.alumniPerProfesi[0]?.count || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon, label, value, isLoading, color }: {
  icon: React.ReactNode
  label: string
  value?: number
  isLoading: boolean
  color: 'blue' | 'orange' | 'yellow'
}) {
  const colors = {
    blue: 'bg-blue-50',
    orange: 'bg-orange-50',
    yellow: 'bg-yellow-50',
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-5">
      <div className={`w-8 h-8 sm:w-10 sm:h-10 ${colors[color]} rounded-xl flex items-center justify-center mb-2 sm:mb-3`}>
        {icon}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-gray-900">
        {isLoading ? (
          <div className="animate-pulse h-7 w-12 bg-gray-100 rounded" />
        ) : (
          (value || 0).toLocaleString('id-ID')
        )}
      </div>
      <div className="text-xs sm:text-sm text-gray-400 mt-0.5 leading-tight">{label}</div>
    </div>
  )
}
