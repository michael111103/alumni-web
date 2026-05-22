// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTanggal(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatWhatsApp(wa: string) {
  // Normalize to 62 prefix for WA link
  let number = wa.replace(/\D/g, '')
  if (number.startsWith('0')) number = '62' + number.slice(1)
  return `https://wa.me/${number}`
}

export function formatInstagram(ig: string) {
  const handle = ig.replace('@', '')
  return `https://instagram.com/${handle}`
}

export function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

export function isShowcaseActive(mulai: string, selesai: string) {
  const now = new Date()
  const start = new Date(mulai)
  const end = new Date(selesai)
  return now >= start && now <= end
}
