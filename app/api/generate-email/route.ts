import { generateContent } from '@/lib/gemini';
import { sanitizeOutreachEmailBody, sanitizeOutreachPlainText } from '@/lib/sanitize-outreach-text';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { generateEmailSchema } from '@/lib/validators';
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
    const limit = checkRateLimit(request, 'generate-email', 20, 60_000);
    if (!limit.ok) {
      return Response.json(
        { error: `Rate limit exceeded. Try again in ${limit.retryAfterSeconds || 60}s.` },
        { status: 429 }
      );
    }

    const parsed = generateEmailSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const { businessName, ownerName, industry, targetService, email } = parsed.data;

    const prompt = `You are a professional digital marketing copywriter for Adwalididi, an Indian digital marketing agency.

Write an ultra-short cold email for this business:
- Business name: ${businessName}
- Owner name: ${ownerName || 'business owner'}
- Industry: ${industry}
- Service to pitch: ${targetService}

Rules:
- Extremely concise (under 75 words)
- Do NOT use emoji or special symbols — warmth comes from words only
- Do NOT mention physical locations or states
- One specific pain point for the ${industry} industry
- CTA: reply or book a free strategy call at https://adwalididi.com/#free-audit
- Sign off as Shivani from Adwalididi
- Casual, punchy, not salesy

IMPORTANT: Respond ONLY in this exact format with no extra text before or after:
SUBJECT: [write subject line here]
BODY:
[write email body here]`;

    const raw = (await generateContent(prompt)).trim();

    const subjectMatch = raw.match(/^SUBJECT:\s*(.+)/im);
    const bodyMatch = raw.match(/^BODY:\s*([\s\S]+)/im);

    if (!subjectMatch || !bodyMatch) {
      console.error('Gemini response did not match expected format:', raw);
      return Response.json({ error: 'Unexpected AI response format. Please try again.' }, { status: 500 });
    }

    const subject = sanitizeOutreachPlainText(subjectMatch[1].trim());
    const body = sanitizeOutreachEmailBody(bodyMatch[1].trim());

    // Log to Supabase outreach_log
    let outreachLogId: string | null = null;
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { data } = await supabase
        .from('outreach_log')
        .insert({
          channel: 'email',
          recipient_email: email || null,
          business_name: businessName,
          owner_name: ownerName || null,
          industry,
          target_service: targetService,
          subject,
          message_body: body,
          status: 'generated',
          provider: 'brevo',
        })
        .select('id')
        .single();
      outreachLogId = data?.id || null;
    } catch (e) {
      console.error('Supabase log error (non-fatal):', e);
    }

    return Response.json({ subject, body, outreachLogId });
  } catch (e) {
    console.error('Generate email error:', e);
    return Response.json({ error: 'Failed to generate email content' }, { status: 500 });
  }
}
