import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// In case environment variables aren't set yet (e.g. during local dev), don't crash at module level.
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://dummy.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'dummy',
});

// Rate limiter — only protects public-facing endpoints.
// Admin endpoints (send-cold-email, generate-email, generate-whatsapp) are
// behind session auth and don't need in-app rate limiting.
const limiters = {
  'send-welcome': new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '10 m'),
    prefix: 'rl:send-welcome',
  }),
};

function getClientKey(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

export async function checkRateLimit(
  request: Request,
  endpointKey: keyof typeof limiters
): Promise<{ ok: boolean; retryAfterSeconds?: number }> {
  // Gracefully handle missing UPSTASH credentials in local development
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('Upstash Redis credentials missing. Rate limiting bypassed.');
    return { ok: true };
  }

  const limiter = limiters[endpointKey];
  if (!limiter) return { ok: true };

  const ip = getClientKey(request);
  try {
    const { success, reset } = await limiter.limit(ip);

    if (!success) {
      const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000);
      return { ok: false, retryAfterSeconds };
    }

    return { ok: true };
  } catch (err) {
    // Fail open if Redis fails
    console.error('Rate limiter Redis error:', err);
    return { ok: true };
  }
}
