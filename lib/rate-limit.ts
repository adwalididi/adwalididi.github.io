type RateBucket = {
  count: number;
  resetAt: number;
};

const GLOBAL_BUCKET_KEY = '__adwalididi_rate_limit_buckets__';

function getBuckets(): Map<string, RateBucket> {
  const globalState = globalThis as typeof globalThis & {
    [GLOBAL_BUCKET_KEY]?: Map<string, RateBucket>;
  };

  if (!globalState[GLOBAL_BUCKET_KEY]) {
    globalState[GLOBAL_BUCKET_KEY] = new Map<string, RateBucket>();
  }

  return globalState[GLOBAL_BUCKET_KEY];
}

function getClientKey(request: Request): string {
  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';
  return ip;
}

export function checkRateLimit(
  request: Request,
  endpointKey: string,
  limit: number,
  windowMs: number
): { ok: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const key = `${endpointKey}:${getClientKey(request)}`;
  const buckets = getBuckets();
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (existing.count >= limit) {
    return { ok: false, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  buckets.set(key, existing);
  return { ok: true };
}
