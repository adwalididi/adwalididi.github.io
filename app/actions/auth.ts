'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: 'admin_session', path: '/' });
  cookieStore.delete({ name: 'admin_gate', path: '/admin/' });
  redirect('/admin/login');
}
