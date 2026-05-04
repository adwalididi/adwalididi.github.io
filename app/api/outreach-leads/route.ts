import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { isAllowedRequestOrigin } from '@/lib/request-origin';

export const runtime = 'edge';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function requireAuth(): Promise<boolean> {
  const session = (await cookies()).get('admin_session');
  return session?.value === 'active';
}

/** GET /api/outreach-leads/ — list all outreach leads */
export async function GET() {
  if (!(await requireAuth())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { data, error } = await getSupabase()
      .from('outreach_leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return Response.json({ leads: data || [] });
  } catch (e) {
    console.error('List outreach leads error:', e);
    return Response.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

/** POST /api/outreach-leads/ — create one lead or bulk insert */
export async function POST(request: Request) {
  if (!isAllowedRequestOrigin(request)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!(await requireAuth())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();

    // ── Bulk insert (CSV upload) ────────────────────────────────────
    if (Array.isArray(body.leads)) {
      const rows = body.leads.map((l: Record<string, string>) => ({
        id:              l.id           || undefined,
        crm_id:          l.crmId        || null,
        business_name:   l.businessName,
        owner_name:      l.ownerName    || null,
        city:            l.city         || null,
        email:           l.email        || null,
        phone:           l.phone        || null,
        industry:        l.industry,
        target_service:  l.targetService,
        email_status:   'pending',
        wa_status:      'pending',
      }));

      const { data, error } = await getSupabase()
        .from('outreach_leads')
        .upsert(rows, { onConflict: 'id', ignoreDuplicates: true })
        .select();

      if (error) throw error;
      return Response.json({ inserted: data?.length || 0 }, { status: 201 });
    }

    // ── Single insert (manual add) ──────────────────────────────────
    const row = {
      id:              body.id           || undefined,
      crm_id:          body.crmId        || null,
      business_name:   body.businessName,
      owner_name:      body.ownerName    || null,
      city:            body.city         || null,
      email:           body.email        || null,
      phone:           body.phone        || null,
      industry:        body.industry,
      target_service:  body.targetService,
      email_status:   'pending',
      wa_status:      'pending',
    };

    const { data, error } = await getSupabase()
      .from('outreach_leads')
      .insert(row)
      .select()
      .single();

    if (error) throw error;
    return Response.json({ lead: data }, { status: 201 });
  } catch (e) {
    console.error('Create outreach lead error:', e);
    return Response.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
