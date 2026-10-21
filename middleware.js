import { NextResponse } from 'next/server';

const locales = ['en', 'ar', 'zh'];

export function middleware(request) {
  const segment = request.nextUrl.pathname.split('/')[1];
  if (!locales.includes(segment)) return NextResponse.next();
  const pathname = request.nextUrl.pathname.replace(`/${segment}`, '') || '/';
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const response = NextResponse.rewrite(url);
  response.cookies.set('ecu-locale', segment, { path: '/', maxAge: 31536000, sameSite: 'lax' });
  return response;
}

export const config = { matcher: ['/en/:path*', '/ar/:path*', '/zh/:path*'] };
