import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: 'TarkiPages — Direktori & UMKM Alumni',
  description: 'Platform digital untuk menghimpun database alumni dan menampilkan usaha UMKM alumni secara berkala.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${playfair.variable} ${jakarta.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
