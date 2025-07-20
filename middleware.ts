// middleware.ts
import { auth } from '@/auth' // assuming your NextAuth config is in auth.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const session = await auth()

  const isAuthPage =
    req.nextUrl.pathname === '/sign-in' || req.nextUrl.pathname === '/sign-up'

  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico).*)'],
}
