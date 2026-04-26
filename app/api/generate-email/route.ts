import { generateContent } from '@/lib/gemini';
import { sanitizeOutreachEmailBody, sanitizeOutreachPlainText } from '@/lib/sanitize-outreach-text';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { generateEmailSchema } from '@/lib/validators';
import { isAllowedRequestOrigin } from '@/lib/request-origin';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    if (!isAllowedRequestOrigin(request)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    const session = (await cookies()).get('admin_session_outreach');
    if (!session || session.value !== 'active') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = generateEmailSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const { businessName, ownerName, city, industry, targetService, email } = parsed.data;

    const prompt = `You are writing a cold outreach email on behalf of Ad Wali Didi, a small Indian digital marketing agency.

The recipient does NOT know you. You have NEVER visited their business. You found them online. Be honest about that context.

Business details:
- Business name: ${businessName}
- Owner name: ${ownerName || 'the team'}
- City: ${city || 'not specified'}
- Industry: ${industry}
- Service to pitch: ${targetService}

Strict rules — break any of these and the email is useless:
1. Under 75 words. Every sentence must earn its place.
2. NO emoji, NO special symbols, NO exclamation marks.
3. NEVER say you "love" or "admire" their business — you have never been there, do not lie.
4. NEVER include any URLs, links, or hashtags.
5. Do NOT sign off with any name or signature — that is added separately.
6. Frame your context honestly: "came across your business" or "found you on Google Maps" — not "we love what you do."
7. Mention ONE real, specific pain point that ${industry} businesses commonly face (e.g. low Google visibility, inconsistent footfall, poor social presence) — be concrete, not generic.
8. If city is provided, weave it in once naturally. If not, skip it entirely.
9. End with a low-pressure question like "Would it make sense to chat for 5 minutes?" or "Happy to share a few ideas if you are open to it."
10. Tone: direct, respectful, human. Like a message from someone who genuinely thinks they can help — not a marketer trying to hit quota.

Respond ONLY in this exact format:
SUBJECT: [subject line — short, curiosity-driven, no clickbait]
BODY:
[email body — plain text, no formatting]`;

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
