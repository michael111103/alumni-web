import { Suspense } from 'react'
import AlumniPageContent from '@/components/public/AlumniPageContent'

export default function AlumniPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-300">Memuat...</div>
      </div>
    }>
      <AlumniPageContent />
    </Suspense>
  )
}
