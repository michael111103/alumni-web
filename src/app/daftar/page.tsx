import { Suspense } from 'react'
import DaftarPageContent from '@/components/public/DaftarPageContent'

export default function DaftarPage() {
  return (
    <Suspense fallback={null}>
      <DaftarPageContent />
    </Suspense>
  )
}
