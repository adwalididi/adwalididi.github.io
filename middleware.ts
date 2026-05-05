import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const EXTERNAL_API_PREFIX = '/api/external';
const HOP_BY_HOP_HEADERS = [
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === EXTERNAL_API_PREFIX || pathname.startsWith(`${EXTERNAL_API_PREFIX}/`)) {
    return proxyExternalApiRequest(request);
  }

  if (
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/admin/open-gate') ||
    pathname.startsWith('/api/webhooks') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/)
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const hasGate = request.cookies.has('admin_gate');
    const hasSession = request.cookies.has('admin_session');

    if (!hasGate || !hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

function proxyExternalApiRequest(request: NextRequest) {
  const proxyOrigin = process.env.PROXY_ORIGIN;

  if (!proxyOrigin) {
    return NextResponse.json({ error: 'Proxy origin is not configured' }, { status: 500 });
  }

  let upstreamOrigin: URL;
  try {
    upstreamOrigin = new URL(proxyOrigin);
  } catch {
    return NextResponse.json({ error: 'Proxy origin is invalid' }, { status: 500 });
  }

  const upstreamPath = request.nextUrl.pathname.slice(EXTERNAL_API_PREFIX.length) || '/';
  const upstreamUrl = new URL(upstreamPath, upstreamOrigin);
  upstreamUrl.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  headers.delete('cookie');
  headers.delete('host');
  for (const header of HOP_BY_HOP_HEADERS) {
    headers.delete(header);
  }

  headers.set('x-forwarded-host', request.nextUrl.host);
  headers.set('x-forwarded-proto', request.nextUrl.protocol.replace(':', ''));
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    headers.set('x-forwarded-for', forwardedFor);
  }

  return fetch(upstreamUrl, {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
    redirect: 'manual',
  }).catch(() => NextResponse.json({ error: 'Proxy upstream request failed' }, { status: 502 }));
}

export const config = {
  matcher: ['/admin/:path*', '/api/external/:path*'],
};
