import { Resend } from 'resend';
import { welcomeEmailSchema } from '@/lib/validators';
import { hasMxRecords } from '@/lib/email-validator';
import { checkRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

function isAllowedRequestOrigin(request: Request): boolean {
  const requestUrl = new URL(request.url);
  const headerValue = request.headers.get('origin') || request.headers.get('referer');

  if (!headerValue) {
    return process.env.NODE_ENV !== 'production';
  }

  try {
    const sourceUrl = new URL(headerValue);
    const hostname = sourceUrl.hostname;
    const requestHostname = requestUrl.hostname;

    if (hostname === requestHostname) return true;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;

    return false;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_build_key');
  
  try {
    // Only allow same-origin browser calls to this public endpoint.
    if (!isAllowedRequestOrigin(request)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const limit = await checkRateLimit(request, 'send-welcome');
    if (!limit.ok) {
      return Response.json(
        { success: false, error: `Rate limit exceeded. Try again in ${limit.retryAfterSeconds || 600}s.` },
        { status: 429 }
      );
    }

    const parsed = welcomeEmailSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ success: false, error: 'Invalid request payload' }, { status: 400 });
    }

    // DNS/MX check — reject emails whose domain cannot receive mail
    const mxValid = await hasMxRecords(parsed.data.email);
    if (!mxValid) {
      return Response.json(
        { success: false, error: 'Email domain does not appear to accept mail. Please check the address.' },
        { status: 422 }
      );
    }

    const { name, email, businessType, businessName, budget, services } = parsed.data;

    const firstName = name ? name.split(' ')[0] : 'there';
    const bizNameText = businessName ? businessName : 'your business';
    const servicesText = services && services.length > 0 ? services.join(' + ') : 'your setup';
    const bizTypeText = businessType ? businessType.toLowerCase() : 'business';
    const budgetText = budget ? budget : 'specified';
    const senderName = Math.random() > 0.5 ? 'Shivani' : 'Shubham';

    const textPayload = `Just confirmed — I've received your audit request for ${bizNameText}.

Here's what you asked us to look at:
${servicesText}

Given your budget (${budgetText}), I already have a few things in mind. I'll go through your ${bizTypeText} setup and send you the audit on WhatsApp within a few hours.

If you want to connect faster, just reply here or message me directly: wa.me/916261643774

Speak soon,
${senderName}
Ad Wali Didi`;

    const { data, error } = await resend.emails.send({
      from: `Ad Wali Didi <${process.env.RESEND_FROM_EMAIL || 'hello@adwalididi.com'}>`,
      to: [email],
      subject: `Hi ${firstName},`,
      text: textPayload,
    });

    if (error) {
      console.error('Resend error:', error);
      return Response.json({ success: false, error: 'Failed to send welcome email' }, { status: 500 });
    }

    return Response.json({ success: true, id: data?.id });
  } catch (e) {
    console.error('Welcome email error:', e);
    return Response.json({ success: false, error: 'Failed to process welcome email request' }, { status: 500 });
  }
}
