import { createClient } from '@supabase/supabase-js';


export const runtime = 'edge';

// We do not require auth here because Brevo is calling this, not an admin session.
export async function POST(request: Request) {
  try {
    // Check Authorization Header
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.BREVO_WEBHOOK_SECRET;

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return Response.json({ error: 'Unauthorized webhook' }, { status: 401 });
    }

    const payload = await request.json();

    // Brevo sends a test webhook when you first create it
    if (payload.event === 'test' || payload.event === 'test_webhook') {
      return Response.json({ success: true });
    }

    const { event, email, reason } = payload;
    
    if (!email || !event) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Initialize Supabase admin client to bypass RLS (since this is a background webhook)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let statusUpdate = '';
    let errorMessage = '';

    // Map Brevo events to our statuses
    switch (event) {
      case 'delivered':
        statusUpdate = 'delivered';
        break;
      case 'hard_bounce':
      case 'soft_bounce':
      case 'invalid_email':
      case 'error':
      case 'blocked':
        statusUpdate = 'failed';
        // Extract a clean error reason if provided by Brevo
        errorMessage = reason || `Email failed (${event.replace('_', ' ')})`;
        break;
      case 'complaint':
        statusUpdate = 'failed';
        errorMessage = 'Marked as Spam by recipient';
        break;
      // We can ignore 'request', 'deferred', 'opened', 'clicked' for now unless you want to track them
      default:
        return Response.json({ success: true, ignored: true });
    }

    // Find the lead by email and update it
    if (statusUpdate) {
      const updateData: Record<string, string> = { email_status: statusUpdate };
      if (statusUpdate === 'failed') {
        updateData.email_error = errorMessage;
      }

      await supabase
        .from('outreach_leads')
        .update(updateData)
        .eq('email', email)
        .in('email_status', ['sent', 'generated', 'pending']); // Only update if it hasn't been manually changed
        
      // Also update the outreach_log if we want a historical record
      await supabase
        .from('outreach_log')
        .update({ status: statusUpdate === 'failed' ? 'failed' : 'sent' }) // Log table only has sent/failed/generated
        .eq('recipient_email', email)
        .eq('status', 'sent'); // Update the most recent sent log
    }

    return Response.json({ success: true });
  } catch (e) {
    console.error('Brevo Webhook Error:', e);
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
