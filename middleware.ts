import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';  // <-- add this import

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });

  const isAuthPage =
    req.nextUrl.pathname === '/sign-in' || req.nextUrl.pathname === '/sign-up';

  // Session cart Id coolie setup
  const sessionCartId = req.cookies.get('sessionCartId');
  const response = NextResponse.next();

  if (!sessionCartId) {
    const newSessionCartId = uuidv4();
    response.cookies.set({
      name: 'sessionCartId',
      value: newSessionCartId,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
    });
  }

  // auth redirections
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico|static).*)'],
};
