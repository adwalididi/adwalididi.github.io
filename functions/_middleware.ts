interface HtmlRewriterElement {
  setAttribute(name: string, value: string): void;
}

interface HtmlRewriterHandler {
  element(element: HtmlRewriterElement): void;
}

interface HtmlRewriterInstance {
  on(selector: string, handler: HtmlRewriterHandler): HtmlRewriterInstance;
  transform(response: Response): Response;
}

interface MiddlewareContext {
  next(): Promise<Response>;
}

declare const HTMLRewriter: {
  new (): HtmlRewriterInstance;
};

class NonceInjector {
  constructor(private nonce: string) {}

  element(element: HtmlRewriterElement) {
    element.setAttribute('nonce', this.nonce);
  }
}

export const onRequest = async (context: MiddlewareContext) => {
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
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https: blob: https://www.googletagmanager.com;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' https: wss: https://www.google-analytics.com;
    frame-src 'self' https://challenges.cloudflare.com;
    frame-ancestors 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  // Clone the response to modify it
  const newResponse = new HTMLRewriter()
    .on('script', new NonceInjector(nonce))
    .on('link[rel="preload"][as="script"]', new NonceInjector(nonce))
    // We intentionally do not nonce <style> tags right now because React/Next.js and Framer Motion heavily rely on inline styles which would be broken if we completely drop unsafe-inline from style-src
    .transform(response);

  // Set the CSP header on the modified response
  newResponse.headers.set('Content-Security-Policy', csp);

  return newResponse;
};
