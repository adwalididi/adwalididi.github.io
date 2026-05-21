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
    const session = (await cookies()).get('admin_session');
    if (!session || session.value !== 'active') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = generateEmailSchema.safeParse(await request.json());
    if (!parsed.success) {
      console.error('generate-email validation failed:', JSON.stringify(parsed.error.format()));
      return Response.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const { businessName, ownerName, city, industry, targetService, email } = parsed.data;

    const prompt = `You are writing a cold outreach email on behalf of Ad Wali Didi, a small Indian digital marketing agency.

The recipient does NOT know you. You found them online. Be honest about that context.

Business details:
- Business name: ${businessName}
- Owner name: ${ownerName || 'the team'}
- City: ${city || 'not specified'}
- Industry: ${industry}
- Service to pitch: ${targetService}

Email structure — follow this exactly in order:
1. OPENER: One direct sentence that acknowledges you came across their business ("found you on Google Maps", "came across ${businessName} online"). No flattery, no "we love what you do."
2. PAIN POINT: Name one real, specific problem that ${industry} businesses commonly face — something they would immediately recognize (e.g., low Google visibility, few enquiries from social media, inconsistent footfall). Be concrete, not generic.
3. SOLUTION: Show how ${targetService} solves that exact pain point. Keep it tight — one to two sentences.
4. CTA: A short, pull-based close with mild urgency. Not a bland question. Something like "There is real potential here that is not being used — happy to share ideas if you are open to it." Make it feel like an invitation.

Strict rules:
1. 80 to 100 words for the body. Every sentence must earn its place.
2. NO emoji, NO special symbols, NO exclamation marks.
3. NEVER say you "love" or "admire" their business.
4. NEVER include any URLs, links, or hashtags.
5. Do NOT include any name, signature, sign-off, or closing line (like "Best," or "Regards,") in the body — the signature is added separately by the system.
6. NEVER use square-bracket placeholders like [Your Name], [Contact Information], [Company Name], etc. The body must be complete, final text with zero placeholders.
7. Do NOT mention "Adwalididi" or "Ad Wali Didi" anywhere in the body — agency name appears only in the signature, not in the message itself.
8. If city is provided, weave it in once naturally. If not, skip it entirely.
9. Tone: direct, warm, human. Like someone who genuinely thinks they can help.

Respond ONLY in this exact format:
SUBJECT: [subject line — short, curiosity-driven, no clickbait, no exclamation marks]
BODY:
[email body — plain text, no formatting]`;

    let raw = '';
    let subjectMatch: RegExpMatchArray | null = null;
    let bodyMatch: RegExpMatchArray | null = null;

    // Retry once if AI returns a malformed response (no SUBJECT/BODY markers)
    for (let attempt = 1; attempt <= 2; attempt++) {
      raw = (await generateContent(prompt)).trim();
      subjectMatch = raw.match(/^SUBJECT:\s*(.+)/im);
      bodyMatch = raw.match(/^BODY:\s*([\s\S]+)/im);
      if (subjectMatch && bodyMatch) break;
      if (attempt < 2) console.warn(`AI response malformed on attempt ${attempt}, retrying...`);
    }

    if (!subjectMatch || !bodyMatch) {
      console.error('AI response did not match expected format:', raw);
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
