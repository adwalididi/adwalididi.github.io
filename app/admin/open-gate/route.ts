import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const target = url.searchParams.get('target') || '/admin/leads';
  return NextResponse.redirect(new URL(`/admin/login/?redirect=${encodeURIComponent(target)}`, url), 303);
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  let secret = '';
  let target = '/admin/leads';

  try {
    const formData = await request.formData();
    secret = String(formData.get('secret') || '').trim();
    target = formData.get('target') as string || '/admin/leads';
  } catch (e) {
    console.error('Failed to parse form data in open-gate:', e);
    return NextResponse.redirect(new URL(`/admin/login/?error=gate&redirect=${encodeURIComponent(target)}`, url), 303);
  }

  const expectedSecret = process.env.ADMIN_PASSWORD?.trim();

  if (!secret || !expectedSecret || secret !== expectedSecret) {
    return NextResponse.redirect(new URL(`/admin/login/?error=gate&redirect=${encodeURIComponent(target)}`, url), 303);
  }

  const redirectUrl = new URL(`/admin/login/?redirect=${encodeURIComponent(target)}`, url);
  const response = NextResponse.redirect(redirectUrl, 303);

  response.cookies.set('admin_gate', 'active', {
    httpOnly: true,
    secure: true, // Always true for Cloudflare
    sameSite: 'lax',
    path: '/',
  });

  return response;
}
