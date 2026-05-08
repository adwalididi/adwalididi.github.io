export function getGroqKeys(): string[] {
  return [
    process.env.GROQ_API_KEY,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
    process.env.GROQ_API_KEY_4,
    process.env.GROQ_API_KEY_5,
  ].filter(Boolean) as string[];
}

function isRetryableError(status: number): boolean {
  return status === 429 || status >= 500;
}

export async function generateContentGroq(prompt: string, systemPrompt?: string): Promise<string> {
  const keys = getGroqKeys();
  if (keys.length === 0) throw new Error('Groq not configured — skipping');
  let lastError: unknown;

  const resolvedSystemPrompt = systemPrompt ||
    'You are a professional digital marketing copywriter for an Indian digital marketing agency called Adwalididi.';

  const startIndex = Math.floor(Math.random() * keys.length);

  for (let i = 0; i < keys.length; i++) {
    const keyIndex = (startIndex + i) % keys.length;
    const key = keys[keyIndex];

    try {
      const url = 'https://api.groq.com/openai/v1/chat/completions';

      const body = {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: resolvedSystemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg = data.error?.message || `HTTP ${res.status}`;

        if (isRetryableError(res.status)) {
          console.warn(`[Groq] key ${keyIndex + 1} transient error (${errMsg}), retrying...`);
          lastError = new Error(errMsg);
          await new Promise((r) => setTimeout(r, 500));
          continue;
        }

        // Auth / suspended key — skip to the next key rather than breaking the loop
        if (res.status === 401 || res.status === 403) {
          console.warn(`[Groq] key ${keyIndex + 1} auth error (${res.status}: ${errMsg}), trying next key...`);
          lastError = new Error(errMsg);
          continue;
        }

        throw new Error(errMsg);
      }

      return data.choices?.[0]?.message?.content || '';

    } catch (e) {
      lastError = e;
      const msg = String(e).toLowerCase();

      if (
        msg.includes('429') || msg.includes('rate') ||
        msg.includes('503') || msg.includes('overloaded') ||
        msg.includes('suspended') || msg.includes('deactivated') ||
        msg.includes('401') || msg.includes('403')
      ) {
        console.warn(`[Groq] key ${keyIndex + 1} transient/auth error, trying next key...`);
        await new Promise((r) => setTimeout(r, 200));
        continue;
      }

      throw e;
    }
  }

  throw lastError ?? new Error('All Groq keys exhausted');
}

export async function testGroqKey(apiKey: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: 'Respond with exactly "ok".' }],
        max_tokens: 5,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { ok: false, error: data.error?.message || `HTTP ${res.status}` };
    }

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Connection failed' };
  }
}
