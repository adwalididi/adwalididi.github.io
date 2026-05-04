import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Exclude login paths, static assets, and webhooks
  if (
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/admin/open-gate') ||
    pathname.startsWith('/api/webhooks') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/)
  ) {
    return NextResponse.next();
  }

  // Protect /admin routes (except login, which is excluded above)
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

  // We rely on the API routes themselves to check the admin_session cookie
  // to avoid accidentally blocking any frontend interactions with custom APIs.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
