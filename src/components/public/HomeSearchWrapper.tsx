'use client'
import HeroSearch from '@/components/public/HeroSearch'
import { useCallback } from 'react'

export default function HomeSearchWrapper() {
  const handleSelect = useCallback((id: string) => {
    // Dispatch custom event yang didengarkan FeaturedAlumniSection
    window.dispatchEvent(new CustomEvent('alumni-select', { detail: { id } }))
  }, [])

  return <HeroSearch onSelectAlumni={handleSelect} />
}
