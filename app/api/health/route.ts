import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { testGeminiKey } from '@/lib/gemini';

export const runtime = 'edge';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: Request) {
  const session = (await cookies()).get('admin_session');
  if (!session || session.value !== 'active') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const requestedService = searchParams.get('service');

  const results: Record<string, { status: string; latency: number; error: string | null }> = {};
  const tasks: Promise<void>[] = [];

  const shouldCheck = (service: string) => !requestedService || requestedService === service;

  // 1. Check Supabase
  if (shouldCheck('supabase')) {
    results.supabase = { status: 'pending', latency: 0, error: null };
    tasks.push((async () => {
      try {
        const start = Date.now();
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        const { error } = await supabase.from('leads').select('id').limit(1);
        if (error) throw error;
        results.supabase = { status: 'operational', latency: Date.now() - start, error: null };
      } catch (e: unknown) {
        results.supabase = { status: 'failing', latency: 0, error: e instanceof Error ? e.message : 'Connection failed' };
      }
    })());
  }

  // 2. Check Brevo
  if (shouldCheck('brevo')) {
    results.brevo = { status: 'pending', latency: 0, error: null };
    tasks.push((async () => {
      try {
        const start = Date.now();
        const res = await fetch('https://api.brevo.com/v3/account', {
          headers: {
            'api-key': process.env.BREVO_API_KEY || '',
            'accept': 'application/json'
          }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        results.brevo = { status: 'operational', latency: Date.now() - start, error: null };
      } catch (e: unknown) {
        results.brevo = { status: 'failing', latency: 0, error: e instanceof Error ? e.message : 'Connection failed' };
      }
    })());
  }

  // 3. Check Resend
  if (shouldCheck('resend')) {
    results.resend = { status: 'pending', latency: 0, error: null };
    tasks.push((async () => {
      try {
        const start = Date.now();
        const res = await fetch('https://api.resend.com/emails', {
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY || ''}`,
          }
        });
        if (res.status === 401 || res.status === 403) throw new Error(`HTTP ${res.status} Unauthorized`);
        results.resend = { status: 'operational', latency: Date.now() - start, error: null };
      } catch (e: unknown) {
        results.resend = { status: 'failing', latency: 0, error: e instanceof Error ? e.message : 'Connection failed' };
      }
    })());
  }

  // 4. Check Gemini Keys (using lightweight fetch-based test)
  const geminiKeys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_5,
  ];

  for (let i = 0; i < geminiKeys.length; i++) {
    const keyName = `gemini_${i + 1}`;
    if (shouldCheck(keyName)) {
      results[keyName] = { status: 'pending', latency: 0, error: null };
      if (!geminiKeys[i]) {
        results[keyName] = { status: 'failing', latency: 0, error: 'Key not configured' };
        continue;
      }
      tasks.push((async () => {
        try {
          const start = Date.now();
          const result = await testGeminiKey(geminiKeys[i] as string);
          if (result.ok) {
            results[keyName] = { status: 'operational', latency: Date.now() - start, error: null };
          } else {
            results[keyName] = { status: 'failing', latency: Date.now() - start, error: result.error || 'Unknown error' };
          }
        } catch (e: unknown) {
          results[keyName] = { status: 'failing', latency: 0, error: e instanceof Error ? e.message : 'Connection failed' };
        }
      })());
    }
  }

  await Promise.allSettled(tasks);

  return Response.json(results);
}
