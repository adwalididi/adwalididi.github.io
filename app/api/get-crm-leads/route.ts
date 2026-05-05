import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const session = (await cookies()).get('admin_session_outreach');
    if (!session || session.value !== 'active') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('leads')
      .select('id, name, email, whatsapp, business_name, business_type, services, status, created_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) throw error;

    // Map Supabase leads → outreach lead format
    const mapped = (data || []).map((lead) => ({
      id: crypto.randomUUID(), // New client-side ID
      crmId: lead.id,
      email: lead.email || '',
      phone: lead.whatsapp || '',
      businessName: lead.business_name || lead.name || '',
      ownerName: lead.name || '',
      industry: lead.business_type || 'Other',
      // Map first selected service to a target service, or use default
      targetService: mapService(lead.services),
      emailStatus: 'pending',
      waStatus: 'pending',
    }));

    return Response.json({ leads: mapped, total: mapped.length });
  } catch (e) {
    console.error('Get CRM leads error:', e);
    return Response.json({ error: 'Failed to fetch CRM leads' }, { status: 500 });
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
