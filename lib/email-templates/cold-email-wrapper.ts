export function wrapColdEmailHtml(body: string, ctaText?: string, ctaUrl?: string): string {
  const finalCtaText = ctaText || 'Book a Free Strategy Call';
  const finalCtaUrl = ctaUrl || 'https://adwalididi.com/#free-audit';
  const htmlBody = body.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#f8f8f8;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;padding:32px;max-width:560px">
<tr><td style="border-bottom:3px solid #008573;padding-bottom:16px;margin-bottom:24px">
<span style="font-size:18px;font-weight:bold;color:#008573">Ad Wali Didi</span>
</td></tr>
<tr><td style="padding-top:24px;color:#333;font-size:15px;line-height:1.7">
<p>${htmlBody}</p>
<p style="margin-top:28px">
<a href="${finalCtaUrl}" style="background:#008573;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px">${finalCtaText} →</a>
</p>
</td></tr>
<tr><td style="padding-top:24px;border-top:1px solid #eee;color:#999;font-size:11px;text-align:center">
Sent by Shivani · Adwalididi Growth · <a href="https://adwalididi.com" style="color:#008573">adwalididi.com</a><br>
Reply "unsubscribe" to opt out.
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}
