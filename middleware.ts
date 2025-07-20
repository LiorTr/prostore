// middleware.ts
import { auth } from '@/auth-lite'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const url = req.nextUrl

  const isAuthPage = url.pathname === '/sign-in' || url.pathname === '/sign-up'

  if (!req.auth && !isAuthPage) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  if (req.auth && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Optionally set sessionCartId manually here if needed
})
