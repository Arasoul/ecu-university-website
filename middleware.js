import { NextResponse } from 'next/server';

const locales = ['en', 'ar', 'zh'];

export function middleware(request) {
  const segment = request.nextUrl.pathname.split('/')[1];
  const storedLocale = request.cookies.get('ecu-locale')?.value;
  if (!locales.includes(segment)) {
    if (storedLocale && storedLocale !== 'en') {
      const url = request.nextUrl.clone();
      url.pathname = `/${storedLocale}${request.nextUrl.pathname}`;
      return NextResponse.redirect(url);
    }
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-ecu-locale', 'en');
    requestHeaders.set('x-ecu-path', request.nextUrl.pathname);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }
  const pathname = request.nextUrl.pathname.replace(`/${segment}`, '') || '/';
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-ecu-locale', segment);
  requestHeaders.set('x-ecu-path', request.nextUrl.pathname);
  const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  response.cookies.set('ecu-locale', segment, { path: '/', maxAge: 31536000, sameSite: 'lax' });
  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/).*)'] };
