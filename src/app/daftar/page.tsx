import { Suspense } from 'react'
import DaftarPageContent from '@/components/public/DaftarPageContent'

export default function DaftarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-300 text-sm">Memuat...</div>
      </div>
    }>
      <DaftarPageContent />
    </Suspense>
  )
}
