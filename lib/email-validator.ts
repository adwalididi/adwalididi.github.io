/**
 * Checks if an email address domain has valid MX records using
 * Cloudflare's DNS-over-HTTPS API. Works on both Node.js and Edge Runtime.
 *
 * @returns `true` if the domain has MX records, `false` otherwise.
 */
export async function hasMxRecords(email: string): Promise<boolean> {
  try {
    const domain = email.split('@')[1];
    if (!domain) return false;

    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`,
      {
        headers: { Accept: 'application/dns-json' },
        // Short timeout — don't block user requests on slow DNS
        signal: AbortSignal.timeout(3000),
      }
    );

    if (!response.ok) return true; // fail open on network errors

    const data = (await response.json()) as { Status: number; Answer?: unknown[] };

    // Status 0 = NOERROR; if Answer array is non-empty there are MX records
    if (data.Status !== 0) return false;
    return Array.isArray(data.Answer) && data.Answer.length > 0;
  } catch {
    // Fail open so transient DNS issues don't block legitimate sign-ups
    return true;
  }
}
