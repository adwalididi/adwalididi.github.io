import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {
    const { id, password, redirect } = await request.json();

    const expectedId = process.env.ADMIN_USER_ID;
    const expectedPassword = process.env.ADMIN_USER_PASSWORD;

    if (!expectedId || !expectedPassword) {
      console.error('Auth variables missing in environment');
      return NextResponse.json(
        { success: false, error: 'Server auth variables missing.' },
        { status: 500 }
      );
    }

    if (id === expectedId && password === expectedPassword) {
      const response = NextResponse.json({
        success: true,
        redirect: redirect || '/admin/leads'
      });

      // Set session cookies
      response.cookies.set('admin_session', 'active', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      response.cookies.set('admin_session_outreach', 'active', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid User ID or Password.' },
      { status: 401 }
    );
  } catch (e) {
    console.error('Login error:', e);
    return NextResponse.json(
      { success: false, error: 'Login failed due to server error.' },
      { status: 500 }
    );
  }
}
