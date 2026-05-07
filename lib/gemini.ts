import { generateContentGroq } from './groq';

// Rotate through multiple API keys — tries each in order on quota/rate errors
function getKeys(): string[] {
  const keys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_5,
  ].filter(Boolean) as string[];
  
  if (keys.length === 0) throw new Error('No Gemini API keys configured');
  return keys;
}

// Model cascade: try best model first, fall back to higher-quota models
// Free-tier daily limits: gemini-2.5-flash=20, gemini-2.0-flash=200, gemini-1.5-flash=1500
const MODEL_CASCADE = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
] as const;

function isQuotaError(status: number, body: string): boolean {
  if (status === 429) return true;
  const msg = body.toLowerCase();
  return (
    msg.includes('quota') ||
    msg.includes('exhausted') ||
    msg.includes('resource_exhausted') ||
    msg.includes('free_tier')
  );
}

function isRetryableError(status: number, body: string): boolean {
  if (status === 429 || status === 503) return true;
  const msg = body.toLowerCase();
  return (
    msg.includes('quota') ||
    msg.includes('rate') ||
    msg.includes('exhausted') ||
    msg.includes('resource_exhausted') ||
    msg.includes('overloaded')
  );
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: { message?: string; code?: number };
}

export async function generateContent(prompt: string, systemPrompt?: string): Promise<string> {
  // 1. Try Groq first (72,000 req/day free limit)
  try {
    return await generateContentGroq(prompt, systemPrompt);
  } catch (groqError) {
    console.warn('[AI] Groq failed, falling back to Gemini cascade:', groqError);
  }

  // 2. Fall back to Gemini
  const keys = getKeys();
  let lastError: unknown;

  const resolvedSystemPrompt = systemPrompt ||
    'You are a professional digital marketing copywriter for an Indian digital marketing agency called Adwalididi.';

  // Outer loop: cascade through models from best to highest-quota fallback
  for (const model of MODEL_CASCADE) {
    let allKeysQuotaExhausted = true;

    // Randomize starting key per model to spread RPM load
    const startIndex = Math.floor(Math.random() * keys.length);

    // Inner loop: try every key for this model
    for (let i = 0; i < keys.length; i++) {
      const keyIndex = (startIndex + i) % keys.length;
      const key = keys[keyIndex];

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

        const body: Record<string, unknown> = {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 },
          systemInstruction: { parts: [{ text: resolvedSystemPrompt }] },
        };

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data: GeminiResponse = await res.json();

        if (!res.ok) {
          const errMsg = data.error?.message || `HTTP ${res.status}`;

          if (isQuotaError(res.status, errMsg)) {
            // Quota exhausted for this key — try next key for same model
            console.warn(`[Gemini] ${model} key ${keyIndex + 1} quota exhausted, trying next key...`);
            lastError = new Error(errMsg);
            continue;
          }

          if (isRetryableError(res.status, errMsg)) {
            // Transient error (overloaded, rate limit spike) — retry same model next key
            console.warn(`[Gemini] ${model} key ${keyIndex + 1} transient error (${errMsg}), retrying...`);
            lastError = new Error(errMsg);
            allKeysQuotaExhausted = false; // Not a quota issue, don't cascade model yet
            await new Promise((r) => setTimeout(r, 500));
            continue;
          }

          // Hard error (bad request, invalid key, etc.) — throw immediately
          throw new Error(errMsg);
        }

        // Success
        if (model !== 'gemini-2.5-flash') {
          console.info(`[Gemini] Fell back to ${model} (key ${keyIndex + 1})`);
        }
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return text || '';

      } catch (e) {
        lastError = e;
        const msg = String(e).toLowerCase();

        if (msg.includes('quota') || msg.includes('exhausted') || msg.includes('free_tier')) {
          console.warn(`[Gemini] ${model} key ${keyIndex + 1} quota exhausted (caught), trying next key...`);
          continue; // Try next key, allKeysQuotaExhausted stays true
        }

        if (msg.includes('429') || msg.includes('rate') || msg.includes('503') || msg.includes('overloaded')) {
          console.warn(`[Gemini] ${model} key ${keyIndex + 1} transient error, retrying...`);
          allKeysQuotaExhausted = false;
          await new Promise((r) => setTimeout(r, 500));
          continue;
        }

        throw e; // Non-retryable — propagate immediately
      }
    }

    // All keys tried for this model
    if (allKeysQuotaExhausted) {
      console.warn(`[Gemini] All keys quota-exhausted for ${model}, cascading to next model...`);
      // Continue outer loop to try next model
    } else {
      // All keys failed for non-quota reasons — don't cascade, surface the error
      break;
    }
  }

  throw lastError ?? new Error('All Gemini models and keys exhausted');
}

/**
 * Quick connectivity test for a specific Gemini API key.
 * Used by the health checker to test individual keys.
 * Pass `model` to test a specific tier (defaults to gemini-2.5-flash).
 */
export async function testGeminiKey(
  apiKey: string,
  model: string = 'gemini-2.5-flash'
): Promise<{ ok: boolean; error?: string; quotaExhausted?: boolean }> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Respond with exactly "ok".' }] }],
        generationConfig: { maxOutputTokens: 5 },
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      const errMsg = data.error?.message || `HTTP ${res.status}`;
      const quotaExhausted = isQuotaError(res.status, errMsg);
      return { ok: false, error: errMsg, quotaExhausted };
    }

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Connection failed' };
  }
}
