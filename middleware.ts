// middleware.ts
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const secret = process.env.NEXTAUTH_SECRET

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret })

  const isAuthPage =
    req.nextUrl.pathname === '/sign-in' || req.nextUrl.pathname === '/sign-up'

  const res = NextResponse.next()

  // Ensure sessionCartId exists for all visitors
  const sessionCartId = req.cookies.get('sessionCartId')
  if (!sessionCartId) {
    const newCartId = crypto.randomUUID()
    res.cookies.set('sessionCartId', newCartId, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
  }

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico|static).*)'],
}
