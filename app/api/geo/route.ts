
export async function GET(request: Request) {
  const headers = request.headers;

  // Cloudflare automatically injects these headers on Pages/Workers
  const cfCountryCode =
    headers.get('CF-IPCountry') ||
    headers.get('cf-ipcountry') ||
    null;

  // Real visitor IP (Cloudflare strips/replaces x-forwarded-for)
  const cfIp =
    headers.get('CF-Connecting-IP') ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    null;

  let country: string | null = null;
  let city: string | null = null;
  let region: string | null = null;
  let latitude: number | null = null;
  let longitude: number | null = null;

  // Enrich with ipapi.co (1,000 free req/day, no key needed)
  if (cfIp) {
    try {
      const res = await fetch(`https://ipapi.co/${cfIp}/json/`, {
        headers: { 'User-Agent': 'adwalididi-website/1.0' },
        // Short timeout so it never blocks a lead submit
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          country_name?: string;
          city?: string;
          region?: string;
          latitude?: number;
          longitude?: number;
          error?: boolean;
        };
        if (!data.error) {
          country   = data.country_name ?? null;
          city      = data.city         ?? null;
          region    = data.region        ?? null;
          latitude  = data.latitude      ?? null;
          longitude = data.longitude     ?? null;
        }
      }
    } catch {
      // Silent fail — geo is nice-to-have, never blocks the form
    }
  }

  return Response.json({
    country,
    country_code: cfCountryCode,
    city,
    region,
    latitude,
    longitude,
  });
}
