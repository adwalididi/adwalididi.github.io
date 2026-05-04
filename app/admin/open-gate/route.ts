import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  const url = new URL(request.url);
  const formData = await request.formData();
  const secret = String(formData.get('secret') || '').trim();
  const target = formData.get('target') as string || 'leads';
  const expectedSecret = process.env.ADMIN_PASSWORD?.trim();

  if (!secret || !expectedSecret || secret !== expectedSecret) {
    return NextResponse.redirect(new URL(`/admin/login/?error=gate&redirect=/admin/${target}`, url));
  }

  const redirectUrl = new URL(`/admin/login/?redirect=/admin/${target}`, url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set('admin_gate', 'active', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin/',
  });

  return response;
}
