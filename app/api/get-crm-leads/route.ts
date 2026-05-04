import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';


/**
 * GET /api/get-crm-leads/
 *
 * Imports website form submissions from the `leads` table into `outreach_leads`.
 * Uses UPSERT with ON CONFLICT (crm_id) DO NOTHING so:
 *  - Leads already imported are silently skipped (no duplicates).
 *  - Returns the count of newly imported vs skipped rows.
 */
export async function GET() {
  try {
    const session = (await cookies()).get('admin_session');
    if (!session || session.value !== 'active') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Fetch latest CRM form submissions
    const { data, error } = await supabase
      .from('leads')
      .select('id, name, email, whatsapp, business_name, business_type, services, created_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) throw error;

    // 2. Map to outreach_leads row format
    const rows = (data || [])
      .map((lead) => ({
        crm_id:         lead.id,
        business_name:  lead.business_name || lead.name || '',
        owner_name:     lead.name          || null,
        email:          lead.email         || null,
        phone:          lead.whatsapp      || null,
        industry:       lead.business_type || 'Other',
        target_service: mapService(lead.services),
        email_status:  'pending',
        wa_status:     'pending',
      }))
      .filter((r) => r.business_name.trim().length > 0);

    if (rows.length === 0) {
      return Response.json({ imported: 0, skipped: 0 });
    }

    // 3. Upsert — crm_id UNIQUE constraint ensures no duplicates
    //    ignoreDuplicates: true → conflicting rows are silently skipped
    const { data: inserted, error: upsertError } = await supabase
      .from('outreach_leads')
      .upsert(rows, { onConflict: 'crm_id', ignoreDuplicates: true })
      .select('id');

    if (upsertError) throw upsertError;

    const imported = (inserted || []).length;
    const skipped  = rows.length - imported;

    return Response.json({ imported, skipped });
  } catch (e) {
    console.error('CRM import error:', e);
    return Response.json({ error: 'Failed to import CRM leads' }, { status: 500 });
  }
}

function mapService(services: string[] | null | undefined): string {
  if (!services || services.length === 0) return 'Full Digital Marketing Package';
  const s = services[0]?.toLowerCase() || '';
  if (s.includes('meta') || s.includes('facebook')) return 'Meta Ads (Facebook + Instagram)';
  if (s.includes('google-ads') || s.includes('google ads')) return 'Google Ads (Search + Display)';
  if (s.includes('gbp') || s.includes('google business')) return 'Google Business Profile Optimization';
  if (s.includes('social')) return 'Social Media Management';
  if (s.includes('creative') || s.includes('content')) return 'Ad Creatives & Content';
  return 'Full Digital Marketing Package';
}
