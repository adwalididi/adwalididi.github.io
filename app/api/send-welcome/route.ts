import { Resend } from 'resend';
import { getWelcomeEmailHtml } from '@/lib/email-templates/welcome-email';
import { welcomeEmailSchema } from '@/lib/validators';

export const runtime = 'edge';

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

    const parsed = welcomeEmailSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ success: false, error: 'Invalid request payload' }, { status: 400 });
    }

    const { name, email, businessType, services } = parsed.data;

    const html = getWelcomeEmailHtml(
      name || 'there',
      services || [],
      businessType || 'Business'
    );

    const { data, error } = await resend.emails.send({
      from: `Ad Wali Didi <${process.env.RESEND_FROM_EMAIL || 'hello@adwalididi.com'}>`,
      to: [email],
      subject: `${name ? name.split(' ')[0] + ', y' : 'Y'}our free audit request is confirmed! 🎯`,
      html,
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
