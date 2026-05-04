import { cookies } from 'next/headers';

export const runtime = 'edge';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: 'admin_session', path: '/' });
  cookieStore.delete({ name: 'admin_gate', path: '/' });
  return Response.json({ success: true });
}
