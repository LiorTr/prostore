// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Optional: Read secret from env (must be same as in next-auth config)
const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });

  const isAuthPage =
    req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register';

  if (!token && !isAuthPage) {

    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token && isAuthPage) {

    // Redirect authenticated users away from login/register
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

// Middleware matcher: applies to all routes except static, API, etc.
export const config = {
  matcher: ['/((?!api|_next|favicon.ico|static).*)'],
};
