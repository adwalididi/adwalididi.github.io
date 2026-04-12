import { GoogleGenAI } from '@google/genai';

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

function isQuotaError(e: unknown): boolean {
  const msg = String(e).toLowerCase();
  return msg.includes('quota') || msg.includes('429') || msg.includes('rate') || msg.includes('exhausted') || msg.includes('resource_exhausted');
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
      const ai = new GoogleGenAI({ apiKey: key });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemPrompt || 'You are a professional digital marketing copywriter for an Indian digital marketing agency called Adwalididi.',
          temperature: 0.7,
        }
      });
      return response.text || '';
    } catch (e) {
      lastError = e;
      if (isQuotaError(e)) {
        console.warn(`Gemini key exhausted, trying next key...`);
        continue; // Try next key
      }
      throw e; // Non-quota error — don't retry
    }
  }

  throw lastError; // All keys exhausted
}
