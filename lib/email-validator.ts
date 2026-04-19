import dns from 'dns/promises';

/**
 * Checks if an email address domain has valid MX records,
 * meaning the domain can actually receive email.
 * This is a free, server-side check that requires no external API.
 *
 * @returns `true` if the domain has MX records, `false` otherwise.
 */
export async function hasMxRecords(email: string): Promise<boolean> {
  try {
    const domain = email.split('@')[1];
    if (!domain) return false;
    const mxRecords = await dns.resolveMx(domain);
    return Array.isArray(mxRecords) && mxRecords.length > 0;
  } catch {
    // ENODATA or ENOTFOUND means the domain has no MX records
    return false;
  }
}
