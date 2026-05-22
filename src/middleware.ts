import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasSession = request.cookies.getAll().some(
    cookie => cookie.name.includes('sb-') && cookie.name.includes('-auth-token')
  )

  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !hasSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (pathname === '/admin/login' && hasSession) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
