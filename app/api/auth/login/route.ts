import { cookies } from 'next/headers';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { id, password, redirect: redirectTo } = await request.json();

    if (!process.env.ADMIN_USER_ID || !process.env.ADMIN_USER_PASSWORD) {
      return Response.json({ success: false, error: 'Server auth variables missing' }, { status: 500 });
    }

    if (id === process.env.ADMIN_USER_ID && password === process.env.ADMIN_USER_PASSWORD) {
      (await cookies()).set('admin_session', 'active', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      });
      return Response.json({ success: true, redirect: redirectTo || '/admin/leads' });
    } else {
      return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }
  } catch {
    return Response.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
