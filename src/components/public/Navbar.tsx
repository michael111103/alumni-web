'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Store, Menu, X, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/alumni', label: 'Direktori Alumni', icon: Users },
    { href: '/umkm', label: 'UMKM Alumni', icon: Store },
    { href: '/daftar', label: 'Daftar Alumni', icon: UserPlus },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="group">
            <span className="font-bold text-gray-900 text-xl tracking-tight" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>
              Tarki<span className="text-red-700">Pages</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  pathname.startsWith(href)
                    ? 'bg-red-50 text-red-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          <button onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden py-3 border-t border-gray-100 space-y-1 animate-fade-up">
            {links.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  pathname.startsWith(href) ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
