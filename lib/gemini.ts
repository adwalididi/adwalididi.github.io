// Lightweight Gemini API wrapper using direct REST calls
// Replaces the heavy @google/genai SDK (~13 MB + protobufjs ~3 MB)

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
  const keys = getKeys();
  let lastError: unknown;

  // Randomize starting index to evenly distribute Requests Per Minute (RPM) across all keys
  const startIndex = Math.floor(Math.random() * keys.length);

  for (let i = 0; i < keys.length; i++) {
    const keyIndex = (startIndex + i) % keys.length;
    const key = keys[keyIndex];
    
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
      
      const body: Record<string, unknown> = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7 },
      };

      if (systemPrompt) {
        body.systemInstruction = { parts: [{ text: systemPrompt }] };
      } else {
        body.systemInstruction = {
          parts: [{ text: 'You are a professional digital marketing copywriter for an Indian digital marketing agency called Adwalididi.' }],
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data: GeminiResponse = await res.json();

      if (!res.ok) {
        const errMsg = data.error?.message || `HTTP ${res.status}`;
        if (isRetryableError(res.status, errMsg)) {
          console.warn(`Gemini key ${keyIndex + 1} failed (retryable: ${errMsg}), trying next key...`);
          await new Promise((r) => setTimeout(r, 500));
          continue;
        }
        throw new Error(errMsg);
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || '';
    } catch (e) {
      lastError = e;
      const msg = String(e).toLowerCase();
      if (msg.includes('quota') || msg.includes('429') || msg.includes('rate') || msg.includes('503')) {
        console.warn(`Gemini key ${keyIndex + 1} failed (retryable), trying next key...`);
        await new Promise((r) => setTimeout(r, 500));
        continue;
      }
      throw e; // Non-retryable error — don't retry
    }
  }

  throw lastError; // All keys exhausted
}

/**
 * Quick connectivity test for a specific Gemini API key.
 * Used by the health checker to test individual keys.
 */
export async function testGeminiKey(apiKey: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
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
      return { ok: false, error: data.error?.message || `HTTP ${res.status}` };
    }

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Connection failed' };
  }
}
