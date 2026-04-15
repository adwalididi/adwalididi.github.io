import { EMAIL_BRAND } from './email-brand';
import { escapeHtml } from './email-html-utils';

export function getWelcomeEmailHtml(name: string, services: string[], businessType: string): string {
  const safeName = escapeHtml(name);
  const safeBusinessType = escapeHtml(businessType);
  const servicesList = services
    .map(
      (s) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid ${EMAIL_BRAND.border};"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${EMAIL_BRAND.primary};margin-right:12px;vertical-align:middle;"></span><span style="color:#333;font-size:15px;vertical-align:middle;">${escapeHtml(s)}</span></td></tr>`
    )
    .join('');

  const { primary, primaryDark, tint, border, text, textMuted, footer, white } = EMAIL_BRAND;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:${tint};-webkit-font-smoothing:antialiased;font-family:Georgia,'Times New Roman',serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${tint};padding:40px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${white};border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(0,107,92,0.12);border:1px solid ${border};">

<tr>
<td style="background:linear-gradient(135deg,${primary} 0%,${primaryDark} 100%);padding:40px 40px 36px;text-align:center;">
<p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.75);">Thank you</p>
<h1 style="margin:0;color:${white};font-size:28px;font-weight:800;letter-spacing:-0.03em;font-family:Arial,Helvetica,sans-serif;">Ad Wali Didi</h1>
<p style="margin:12px 0 0;font-size:14px;color:rgba(255,255,255,0.92);line-height:1.5;font-family:Arial,Helvetica,sans-serif;">Your growth partner for ads, Google &amp; more</p>
</td>
</tr>

<tr>
<td style="padding:40px 40px 32px;font-family:Arial,Helvetica,sans-serif;">
<h2 style="margin:0 0 12px;color:${text};font-size:22px;font-weight:700;letter-spacing:-0.02em;">Hi ${safeName},</h2>
<p style="color:${textMuted};font-size:15px;line-height:1.75;margin:0 0 28px;">
Thank you for requesting your <strong style="color:${primary};">free audit</strong>. We&apos;ve got your details and we&apos;re on it.
</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${tint};border:1px solid ${border};border-radius:16px;margin-bottom:28px;">
<tr><td style="padding:22px 24px;">
<p style="margin:0 0 6px;font-size:10px;color:${primary};font-weight:800;letter-spacing:0.2em;text-transform:uppercase;">Your business</p>
<p style="margin:0 0 20px;font-size:16px;color:${text};font-weight:600;">${safeBusinessType}</p>
<p style="margin:0 0 10px;font-size:10px;color:${primary};font-weight:800;letter-spacing:0.2em;text-transform:uppercase;">Services you picked</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${servicesList}</table>
</td></tr>
</table>

<p style="color:${textMuted};font-size:15px;line-height:1.75;margin:0 0 28px;">
We&apos;ll reach out on <strong style="color:${text};">WhatsApp within a few hours</strong> with your personalized audit. Want to skip the queue?
</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:8px 0 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" style="border-radius:14px;background:#25D366;">
<tr><td>
<a href="https://wa.me/916261643774" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:16px 40px;font-size:16px;font-weight:700;color:${white};text-decoration:none;font-family:Arial,Helvetica,sans-serif;border-radius:14px;">
Message us on WhatsApp
</a>
</td></tr>
</table>
</td></tr>
</table>
</td>
</tr>

<tr>
<td style="padding:28px 40px 36px;background:${tint};border-top:1px solid ${border};text-align:center;font-family:Arial,Helvetica,sans-serif;">
<p style="margin:0 0 6px;font-size:12px;color:${footer};">Ad Wali Didi &middot; Digital marketing for Indian businesses</p>
<p style="margin:0;font-size:11px;color:#aaaaaa;">Maharashtra, India &middot; <a href="https://adwalididi.com" style="color:${primary};text-decoration:none;font-weight:600;">adwalididi.com</a></p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
