export function isAllowedRequestOrigin(request: Request): boolean {
  const requestUrl = new URL(request.url);
  const headerValue = request.headers.get('origin') || request.headers.get('referer');

  if (!headerValue) {
    return process.env.NODE_ENV !== 'production';
  }

  try {
    const sourceUrl = new URL(headerValue);
    const hostname = sourceUrl.hostname;
    const requestHostname = requestUrl.hostname;

    if (hostname === requestHostname) return true;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;

    return false;
  } catch {
    return false;
  }
}
