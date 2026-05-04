import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const runtime = 'edge';

export async function POST(request: Request) {
  const session = (await cookies()).get('admin_session');
  if (!session || session.value !== 'active') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { leadId, status } = await request.json();
    if (!leadId || !status) {
      return Response.json({ error: 'Missing leadId or status' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', leadId);

    if (error) throw error;

    return Response.json({ success: true });
  } catch (e) {
    console.error('Update lead status error:', e);
    return Response.json({ error: 'Failed to update lead status' }, { status: 500 });
  }
}
