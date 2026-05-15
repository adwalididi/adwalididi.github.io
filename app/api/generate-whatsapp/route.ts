import { generateContent } from '@/lib/gemini';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { sanitizeOutreachPlainText } from '@/lib/sanitize-outreach-text';
import { generateWhatsAppSchema } from '@/lib/validators';
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

    const parsed = generateWhatsAppSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const { phone, name, city, businessName, industry, targetService } = parsed.data;

    // Validate phone — must be exactly 10 digits
    const cleanPhone = (phone || '').replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      return Response.json({
        error: `Phone must be exactly 10 digits (got ${cleanPhone.length}). Do not include country code.`
      }, { status: 400 });
    }

    const waPhone = `91${cleanPhone}`;

    const prompt = `Write a WhatsApp cold outreach message for Adwalididi, a small Indian digital marketing agency.

Target details:
- Recipient name: ${name || 'there'}
- Business name: ${businessName}
- City: ${city || 'not specified'}
- Industry: ${industry}
- Service to pitch: ${targetService}

Message structure — follow this exactly in order:
1. OPENER: Address them by first name (or "Hey" if no name). One warm, direct sentence that makes clear you know their space — not generic.
2. PAIN POINT: Name one real, specific struggle that ${industry} businesses face (e.g. low walk-ins, poor online visibility, no social presence). Be concrete, not vague.
3. SOLUTION: Connect that pain point directly to ${targetService}. Show how it solves that specific problem.
4. CTA: A short, pull-based close that creates mild urgency — not a bland question. Something like "Don't let that growth sit idle — reply and let's see what's possible." Make it feel like an invitation, not a sales push.
5. SIGN-OFF: End with only "- Shivani, Adwalididi" on a new line. Do NOT mention Shivani or Adwalididi anywhere else in the message.

Strict rules:
- 70 to 80 words total. Every word must earn its place.
- If city is provided, weave it in once naturally. If not, skip it.
- Casual, warm tone — can mix Hindi and English if natural
- NO emoji, NO special symbols, NO exclamation marks
- Do NOT start with "Dear" or any formal opener
- Return ONLY the message text, no labels or commentary`;


    const systemPrompt = 'You are Shivani, a friendly digital marketing consultant at Adwalididi agency in India. You write casual WhatsApp messages that feel personal and get replies. Never be formal or spammy.';

    const message = sanitizeOutreachPlainText(
      (await generateContent(prompt, systemPrompt)).trim()
    );

    const waLink = `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;

    // Log to Supabase outreach_log
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await supabase.from('outreach_log').insert({
        channel: 'whatsapp',
        recipient_phone: cleanPhone,
        business_name: businessName,
        owner_name: name || null,
        industry,
        target_service: targetService,
        message_body: message,
        status: 'generated',
        provider: 'whatsapp',
      });
    } catch (e) {
      console.error('Supabase log error (non-fatal):', e);
    }

    return Response.json({ message, waLink, formattedPhone: `+91 ${cleanPhone}` });
  } catch (e) {
    console.error('Generate WhatsApp error:', e);
    return Response.json({ error: 'Failed to generate WhatsApp content' }, { status: 500 });
  }
}
