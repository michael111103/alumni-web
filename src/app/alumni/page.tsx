import { Suspense } from 'react'
import AlumniPageContent from '@/components/public/AlumniPageContent'
import Navbar from '@/components/public/Navbar'

export default function AlumniPage() {
  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Suspense fallback={<AlumniPageSkeleton />}>
        <AlumniPageContent />
      </Suspense>
    </div>
  )
}

function AlumniPageSkeleton() {
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
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-3">
        <div className="h-6 w-40 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-12 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-3 gap-3 mt-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
