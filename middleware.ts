import { NextRequest, NextResponse } from 'next/server';
import { COOKIES_NAME } from './src/utils/constants';
import type { ILoginResponse } from './src/interfaces/authentication';

async function tryRefresh(refreshToken: string): Promise<ILoginResponse | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/Authentication/Refresh?refreshToken=${encodeURIComponent(refreshToken)}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const body = await res.json();
    const data: ILoginResponse = body?.data ?? body;
    return data?.accessToken ? data : null;
  } catch {
    return null;
  }
}

export default async function middleware(request: NextRequest) {
  if (!request.cookies.has(COOKIES_NAME.ACCESS_TOKEN_SERVER)) {
    const refreshToken = request.cookies.get(COOKIES_NAME.REFRESH_TOKEN_SERVER)?.value;
    if (refreshToken) {
      const tokens = await tryRefresh(refreshToken);
      if (tokens) {
        const existingCookies = (request.headers.get('cookie') ?? '')
          .split('; ')
          .filter((c) => c && !c.startsWith(`${COOKIES_NAME.ACCESS_TOKEN_SERVER}=`))
          .join('; ');
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set(
          'cookie',
          [`${COOKIES_NAME.ACCESS_TOKEN_SERVER}=${tokens.accessToken}`, existingCookies]
            .filter(Boolean)
            .join('; ')
        );
        const response = NextResponse.next({ request: { headers: requestHeaders } });
        response.cookies.set(COOKIES_NAME.ACCESS_TOKEN_SERVER, tokens.accessToken, {
          expires: new Date(tokens.accessTokenExpiredDate),
          secure: true,
          sameSite: 'lax',
        });
        if (tokens.refreshToken) {
          response.cookies.set(COOKIES_NAME.REFRESH_TOKEN_SERVER, tokens.refreshToken, {
            expires: new Date(tokens.refreshTokenExpiredDate),
            secure: true,
            sameSite: 'lax',
          });
        }
        return response;
      }
    }

    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set(
      COOKIES_NAME.REDIRECT,
      request.nextUrl.pathname + request.nextUrl.search
    );
    return response;
  }
}

export const config = {
  matcher: ['/user', '/user/:path*', '/blog/new'],
};
