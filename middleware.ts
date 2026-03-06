import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page, root, and API routes
  if (pathname === '/login' || pathname === '/' || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // For admin routes, middleware won't enforce auth (handled by client-side)
  // This avoids hydration issues - auth check happens in the component
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
