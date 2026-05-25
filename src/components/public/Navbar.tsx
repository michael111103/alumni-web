'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar({ dark }: { dark?: boolean } = {}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/alumni', label: 'Direktori' },
    { href: '/umkm', label: 'UMKM' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 border-b"
      style={{ background: '#2A2A2A', borderColor: '#C0272D' }}>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-xs font-bold"
          style={{ color: '#2A2A2A', fontFamily: "'Playfair Display', serif" }}>
          T
        </div>
        <span className="font-bold text-base text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          Alumni <span className="font-normal opacity-75">Tarakanita</span>
        </span>
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-5">
        {links.map(({ href, label }) => (
          <Link key={href} href={href}
            className="text-xs transition"
            style={{ color: 'rgba(255,255,255,0.72)' }}>
            {label}
          </Link>
        ))}
        <Link href="/daftar"
          className="text-white text-xs font-semibold px-3.5 py-1.5 rounded-md transition hover:opacity-90"
          style={{ background: '#C0272D' }}>
          Daftar Alumni
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button onClick={() => setOpen(!open)}
        className="md:hidden p-1.5 text-white/70 hover:text-white transition">
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-14 left-0 right-0 border-b py-3 px-5 space-y-1"
          style={{ background: '#2A2A2A', borderColor: '#444' }}>
          {links.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="block py-2 text-sm transition"
              style={{ color: 'rgba(255,255,255,0.72)' }}>
              {label}
            </Link>
          ))}
          <Link href="/daftar" onClick={() => setOpen(false)}
            className="block text-white text-sm font-semibold px-4 py-2.5 rounded-lg text-center mt-2 transition hover:opacity-90"
            style={{ background: '#C0272D' }}>
            Daftar UMKM
          </Link>
        </div>
      )}
    </nav>
  )
}
