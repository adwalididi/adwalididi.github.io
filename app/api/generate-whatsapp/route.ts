import { generateContent } from '@/lib/gemini';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { generateWhatsAppSchema } from '@/lib/validators';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const session = (await cookies()).get('admin_session_outreach');
    if (!session || session.value !== 'active') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = generateWhatsAppSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const { phone, name, businessName, industry, targetService } = parsed.data;

    // Validate phone — must be exactly 10 digits
    const cleanPhone = (phone || '').replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      return Response.json({
        error: `Phone must be exactly 10 digits (got ${cleanPhone.length}). Do not include country code.`
      }, { status: 400 });
    }

    const waPhone = `91${cleanPhone}`;

    const prompt = `Write a WhatsApp-style cold outreach message for Adwalididi, an Indian digital marketing agency.

Target details:
- Person's name: ${name || 'there'}
- Business name: ${businessName}
- Industry: ${industry}
- Service being pitched: ${targetService}

Rules:
- Keep it under 50 words, casual, friendly
- Do NOT mention physical locations or states
- Can use a mix of Hindi and English if natural
- Use 1-2 emojis max
- Pitch the specific service naturally
- End with a question to encourage reply
- Do NOT be formal, do NOT use "Dear Sir/Madam"
- Sign as "Shivani from Adwalididi"
- Return ONLY the message text`;


    const systemPrompt = 'You are Shivani, a friendly digital marketing consultant at Adwalididi agency in India. You write casual WhatsApp messages that feel personal and get replies. Never be formal or spammy.';

    const message = (await generateContent(prompt, systemPrompt)).trim();

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
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
