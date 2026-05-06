import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const cookieStore = await cookies();
  const hasGate = cookieStore.has('admin_gate');
  const hasSession = cookieStore.has('admin_session');

  return NextResponse.json({
    hasGate,
    hasSession
  });
}
