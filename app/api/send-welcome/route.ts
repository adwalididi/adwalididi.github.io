import { Resend } from 'resend';
import { getWelcomeEmailHtml } from '@/lib/email-templates/welcome-email';

export const runtime = 'edge';

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_build_key');
  
  try {
    // Origin check — prevent external abuse of this unauthenticated endpoint
    const origin = request.headers.get('origin') || request.headers.get('referer') || '';
    const isAllowed = origin.includes('adwalididi.com') || origin.includes('localhost') || origin.includes('127.0.0.1');
    if (!isAllowed && process.env.NODE_ENV === 'production') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, email, businessType, services } = await request.json();

    if (!email || !email.trim()) {
      return Response.json({ success: true, skipped: true });
    }

    const html = getWelcomeEmailHtml(
      name || 'there',
      services || [],
      businessType || 'Business'
    );

    const { data, error } = await resend.emails.send({
      from: `Ad Wali Didi <${process.env.RESEND_FROM_EMAIL || 'hello@adwalididi.com'}>`,
      to: [email.trim()],
      subject: `${name ? name.split(' ')[0] + ', y' : 'Y'}our free audit request is confirmed! 🎯`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return Response.json({ success: false, error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, id: data?.id });
  } catch (e) {
    console.error('Welcome email error:', e);
    return Response.json({ success: false, error: String(e) }, { status: 500 });
  }
}
