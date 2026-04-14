// @ts-nocheck
// Type annotation removed to prevent Next.js build errors for missing Cloudflare types
class NonceInjector {
  constructor(private nonce: string) {}

  element(element: any) {
    element.setAttribute('nonce', this.nonce);
  }
}

export const onRequest = async (context: any) => {
  // Pass the request to the Next.js assets/renderer first
  const response = await context.next();

  // Only intercept HTML responses; ignore images, css, js, etc.
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return response;
  }

  // Generate a cryptographically secure random string for the nonce
  const nonce = crypto.randomUUID();

  // Define the strict Content Security Policy using the nonce
  // Note: style-src retains 'unsafe-inline' to allow Framer Motion direct style injection
  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https: blob: https://www.googletagmanager.com;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' https: wss: https://www.google-analytics.com;
    frame-src 'self' https://challenges.cloudflare.com;
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, ' ').trim();

  // Clone the response to modify it
  const newResponse = new HTMLRewriter()
    .on('script', new NonceInjector(nonce))
    // We intentionally do not nonce <style> tags right now because React/Next.js and Framer Motion heavily rely on inline styles which would be broken if we completely drop unsafe-inline from style-src
    .transform(response);

  // Set the CSP header on the modified response
  newResponse.headers.set('Content-Security-Policy', csp);

  return newResponse;
};
