import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIES_NAME } from '@/src/utils/constants';
import { refreshServerToken } from '@/src/services/server-http';

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('returnUrl') ?? '/';
  const returnUrl = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';

  const cookieStore = cookies();
  const refreshToken = cookieStore.get(COOKIES_NAME.REFRESH_TOKEN_SERVER)?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL('/login', request.nextUrl.origin));
  }

  const tokens = await refreshServerToken(refreshToken);
  if (!tokens) {
    return NextResponse.redirect(new URL('/login', request.nextUrl.origin));
  }

  const response = NextResponse.redirect(new URL(returnUrl, request.nextUrl.origin));
  response.cookies.set(COOKIES_NAME.ACCESS_TOKEN_SERVER, tokens.accessToken, {
    expires: new Date(tokens.accessTokenExpiredDate),
    secure: true,
    sameSite: 'lax',
  });
  response.cookies.set(COOKIES_NAME.REFRESH_TOKEN_SERVER, tokens.refreshToken, {
    expires: new Date(tokens.refreshTokenExpiredDate),
    secure: true,
    sameSite: 'lax',
  });
  return response;
}
