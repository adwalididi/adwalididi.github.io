import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { sendBrevoEmail } from '@/lib/brevo';
import { wrapColdEmailHtml } from '@/lib/email-templates/cold-email-wrapper';
import { sendColdEmailSchema } from '@/lib/validators';
import { checkRateLimit } from '@/lib/rate-limit';
import { isAllowedRequestOrigin } from '@/lib/request-origin';

export async function POST(request: Request) {
  try {
    if (!isAllowedRequestOrigin(request)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    const session = (await cookies()).get('admin_session_outreach');
    if (!session || session.value !== 'active') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const limit = checkRateLimit(request, 'send-cold-email', 10, 60_000);
    if (!limit.ok) {
      return Response.json(
        { error: `Rate limit exceeded. Try again in ${limit.retryAfterSeconds || 60}s.` },
        { status: 429 }
      );
    }

    const parsed = sendColdEmailSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const { to, toName, subject, body, outreachLogId } = parsed.data;

    const htmlContent = wrapColdEmailHtml(body);

    const result = await sendBrevoEmail({
      to,
      toName,
      subject,
      htmlContent,
    });

    // Update outreach_log in Supabase
    if (outreachLogId) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      await supabase
        .from('outreach_log')
        .update({
          status: result.success ? 'sent' : 'failed',
          sent_at: result.success ? new Date().toISOString() : null,
        })
        .eq('id', outreachLogId);
    }

    if (!result.success) {
      return Response.json({ success: false, error: result.error }, { status: 500 });
    }

    return Response.json({ success: true, messageId: result.messageId });
  } catch (e) {
    console.error('Send cold email error:', e);
    return Response.json({ success: false, error: 'Failed to send cold email' }, { status: 500 });
  }
}
