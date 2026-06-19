import { NextRequest, NextResponse } from 'next/server';
import { COOKIES_NAME } from './src/utils/constants';

const PROTECTED_PATHS = ['/give-pet', '/user', '/pet'];

function isProtected(pathname: string): boolean {
  return PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function isAdminPath(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!request.cookies.has(COOKIES_NAME.ACCESS_TOKEN_SERVER)) {
    if (request.cookies.has(COOKIES_NAME.REFRESH_TOKEN_SERVER)) {
      const url = new URL('/api/auth/refresh', request.nextUrl.origin);
      url.searchParams.set('returnUrl', pathname + search);
      return NextResponse.redirect(url);
    }

    if (isProtected(pathname) || isAdminPath(pathname)) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.set(
        COOKIES_NAME.REDIRECT,
        pathname + search
      );
      return response;
    }
  }
}

export const config = {
  // Run on all pages; skip Next.js internals, static assets, and API routes.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)'],
};
