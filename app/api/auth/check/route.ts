import { cookies } from 'next/headers';

export const runtime = 'edge';

export async function GET() {
  const cookieStore = await cookies();
  const hasGate = cookieStore.get('admin_gate')?.value === 'active';
  const hasSession = cookieStore.get('admin_session')?.value === 'active';
  return Response.json({ hasGate, hasSession });
}
