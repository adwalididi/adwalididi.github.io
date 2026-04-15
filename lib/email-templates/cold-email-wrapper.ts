import { EMAIL_BRAND } from './email-brand';
import { escapeHtml, plainTextToEmailParagraphs } from './email-html-utils';

export function wrapColdEmailHtml(body: string, ctaText?: string, ctaUrl?: string): string {
  const finalCtaText = ctaText || 'Book a Free Strategy Call';
  const finalCtaUrl = ctaUrl || 'https://adwalididi.com/#free-audit';
  const { primary, primaryDark, tint, border, textMuted, footer, white } = EMAIL_BRAND;

  const paragraphsHtml = plainTextToEmailParagraphs(body);
  const preheader = escapeHtml(body.replace(/\s+/g, ' ').trim().slice(0, 120));

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Ad Wali Didi</title>
</head>
<body style="margin:0;padding:0;background:${tint};-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${tint};padding:40px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${white};border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(0,107,92,0.12);border:1px solid ${border};">

<tr>
<td style="background:linear-gradient(135deg,${primary} 0%,${primaryDark} 100%);padding:36px 40px 32px;text-align:center;">
<p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.75);">Digital growth for Indian SMBs</p>
<h1 style="margin:0;color:${white};font-size:26px;font-weight:800;letter-spacing:-0.03em;line-height:1.2;">Ad Wali Didi</h1>
<p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.9);line-height:1.5;">Straight talk. Real results. No agency fluff.</p>
</td>
</tr>

<tr>
<td style="padding:40px 40px 8px;">
<div style="width:48px;height:4px;border-radius:2px;background:linear-gradient(90deg,${primary},${primaryDark});margin-bottom:24px;"></div>
${paragraphsHtml}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:32px 0 8px;">
<tr>
<td style="border-radius:12px;background:linear-gradient(135deg,${primary} 0%,${primaryDark} 100%);">
<a href="${finalCtaUrl}" style="display:inline-block;padding:16px 32px;font-size:15px;font-weight:700;color:${white};text-decoration:none;border-radius:12px;letter-spacing:0.02em;">${escapeHtml(finalCtaText)} &rarr;</a>
</td>
</tr>
</table>
<p style="margin:24px 0 0;font-size:14px;color:${textMuted};line-height:1.6;">&mdash; Shivani<br><span style="color:${primary};font-weight:600;">Adwalididi</span></p>
</td>
</tr>

<tr>
<td style="padding:28px 40px 36px;background:${tint};border-top:1px solid ${border};text-align:center;">
<p style="margin:0 0 8px;font-size:12px;color:${footer};line-height:1.6;">You&apos;re receiving this because we think your business could grow with clearer digital marketing.</p>
<p style="margin:0;font-size:11px;color:#aaaaaa;">
<a href="https://adwalididi.com" style="color:${primary};text-decoration:none;font-weight:600;">adwalididi.com</a>
&middot; Maharashtra, India<br>
<span style="opacity:0.9;">Reply &quot;unsubscribe&quot; to opt out.</span>
</p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
