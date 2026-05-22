'use client'
// src/app/admin/page.tsx
import { useDashboardStats } from '@/hooks/useAlumni'
import { Users, Store, Star, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const { data: stats, isLoading } = useDashboardStats()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-400 mb-8">Selamat datang di CMS AlumniNet</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<Users className="w-5 h-5 text-blue-600" />}
          label="Total Alumni"
          value={stats?.totalAlumni}
          isLoading={isLoading}
          color="blue"
        />
        <StatCard
          icon={<Store className="w-5 h-5 text-orange-600" />}
          label="Total UMKM"
          value={stats?.totalUMKM}
          isLoading={isLoading}
          color="orange"
        />
        <StatCard
          icon={<Star className="w-5 h-5 text-yellow-600" />}
          label="Showcase Aktif"
          value={stats?.totalShowcase}
          isLoading={isLoading}
          color="yellow"
        />
      </div>

      {/* Top Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Per Kota */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Alumni per Kota (Top 10)
          </h2>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse h-6 bg-gray-100 rounded" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {stats?.alumniPerKota.map((item, i) => (
                <div key={item.kota} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-medium text-gray-700">{item.kota}</span>
                      <span className="text-xs text-gray-500">{item.count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${Math.round((item.count / (stats?.alumniPerKota[0]?.count || 1)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Per Profesi */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Alumni per Profesi (Top 10)
          </h2>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse h-6 bg-gray-100 rounded" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {stats?.alumniPerProfesi.map((item, i) => (
                <div key={item.profesi} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-medium text-gray-700">{item.profesi}</span>
                      <span className="text-xs text-gray-500">{item.count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width: `${Math.round((item.count / (stats?.alumniPerProfesi[0]?.count || 1)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon, label, value, isLoading, color
}: {
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
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className={`w-10 h-10 ${colors[color]} rounded-xl flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {isLoading ? (
          <div className="animate-pulse h-8 w-16 bg-gray-100 rounded" />
        ) : (
          (value || 0).toLocaleString('id-ID')
        )}
      </div>
      <div className="text-sm text-gray-400 mt-0.5">{label}</div>
    </div>
  )
}
