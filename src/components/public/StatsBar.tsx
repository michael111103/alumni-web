// src/components/public/StatsBar.tsx
export default function StatsBar({
  totalAlumni,
  totalUMKM,
}: {
  totalAlumni: number
  totalUMKM: number
}) {
  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-center gap-12">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalAlumni.toLocaleString('id-ID')}</div>
          <div className="text-xs text-gray-500 mt-0.5">Alumni Terdaftar</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalUMKM.toLocaleString('id-ID')}</div>
          <div className="text-xs text-gray-500 mt-0.5">UMKM Alumni</div>
        </div>
      </div>
    </div>
  )
}
