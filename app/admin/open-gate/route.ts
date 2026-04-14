import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const formData = await request.formData();
  const secret = String(formData.get('secret') || '').trim();
  const target = formData.get('target') === 'outreach' ? 'outreach' : 'leads';
  const expectedSecret = process.env.ADMIN_PASSWORD?.trim();

  if (!secret || !expectedSecret || secret !== expectedSecret) {
    return NextResponse.redirect(new URL(`/admin/${target}/?error=gate`, url));
  }

  const redirectUrl = new URL(`/admin/${target}/`, url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set('admin_gate', 'active', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin/',
  });

  return response;
}
