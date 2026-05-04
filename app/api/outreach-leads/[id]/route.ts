import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { isAllowedRequestOrigin } from '@/lib/request-origin';


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

/** PATCH /api/outreach-leads/[id]/ — partial update of a lead */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAllowedRequestOrigin(request)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!(await requireAuth())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await request.json();

    // Map camelCase → snake_case, only include keys that were sent
    const updates: Record<string, unknown> = {};
    if ('businessName'    in body) updates.business_name     = body.businessName;
    if ('ownerName'       in body) updates.owner_name        = body.ownerName    || null;
    if ('city'            in body) updates.city              = body.city         || null;
    if ('email'           in body) updates.email             = body.email        || null;
    if ('phone'           in body) updates.phone             = body.phone        || null;
    if ('industry'        in body) updates.industry          = body.industry;
    if ('targetService'   in body) updates.target_service    = body.targetService;
    if ('emailStatus'     in body) updates.email_status      = body.emailStatus;
    if ('waStatus'        in body) updates.wa_status         = body.waStatus;
    if ('generatedSubject' in body) updates.generated_subject = body.generatedSubject || null;
    if ('generatedBody'   in body) updates.generated_body    = body.generatedBody    || null;
    if ('generatedMessage' in body) updates.generated_message = body.generatedMessage || null;
    if ('waLink'          in body) updates.wa_link           = body.waLink           || null;
    if ('formattedPhone'  in body) updates.formatted_phone   = body.formattedPhone   || null;
    if ('emailError'      in body) updates.email_error       = body.emailError       || null;
    if ('waError'         in body) updates.wa_error          = body.waError          || null;
    if ('outreachLogId'   in body) updates.outreach_log_id   = body.outreachLogId    || null;

    const { error } = await getSupabase()
      .from('outreach_leads')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    return Response.json({ success: true });
  } catch (e) {
    console.error('Update outreach lead error:', e);
    return Response.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

/** DELETE /api/outreach-leads/[id]/ — remove a lead */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAllowedRequestOrigin(request)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!(await requireAuth())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const { error } = await getSupabase()
      .from('outreach_leads')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return Response.json({ success: true });
  } catch (e) {
    console.error('Delete outreach lead error:', e);
    return Response.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
