export function getWelcomeEmailHtml(name: string, services: string[], businessType: string): string {
  const servicesList = services.map(s => `<li style="padding:4px 0;color:#333;font-size:15px;">✅ ${s}</li>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4faf9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4faf9;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,133,115,0.08);">

<!-- Header -->
<tr><td style="background:#008573;padding:32px 40px;text-align:center;">
  <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Ad Wali Didi</h1>
  <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;letter-spacing:0.5px;">Your Growth Partner</p>
</td></tr>

<!-- Body -->
<tr><td style="padding:40px;">
  <h2 style="margin:0 0 8px;color:#1a1a1a;font-size:22px;font-weight:700;">Hi ${name} 👋</h2>
  <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 24px;">
    Thank you for requesting your <strong style="color:#008573;">free audit</strong>! We've received your details and our team is already on it.
  </p>

  <div style="background:#f4faf9;border:1px solid #c8e8e3;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
    <p style="margin:0 0 4px;font-size:11px;color:#008573;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Your Business Type</p>
    <p style="margin:0 0 16px;font-size:15px;color:#1a1a1a;font-weight:600;">${businessType}</p>
    <p style="margin:0 0 8px;font-size:11px;color:#008573;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Services You Selected</p>
    <ul style="margin:0;padding:0;list-style:none;">${servicesList}</ul>
  </div>

  <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 28px;">
    We'll reach out on <strong style="color:#1a1a1a;">WhatsApp within a few hours</strong> with your personalized audit. If you'd like to chat sooner, tap below:
  </p>

  <!-- CTA Button -->
  <table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center">
    <a href="https://wa.me/916261643774" target="_blank" style="display:inline-block;background:#25D366;color:#ffffff;font-size:16px;font-weight:700;padding:14px 36px;border-radius:12px;text-decoration:none;letter-spacing:0.3px;">
      💬 WhatsApp Didi Now
    </a>
  </td></tr>
  </table>
</td></tr>

<!-- Footer -->
<tr><td style="background:#f4faf9;padding:24px 40px;border-top:1px solid #e8f0ee;text-align:center;">
  <p style="margin:0 0 4px;color:#888;font-size:12px;">Ad Wali Didi · Digital Marketing Agency</p>
  <p style="margin:0;color:#aaa;font-size:11px;">Maharashtra, India · <a href="https://adwalididi.com" style="color:#008573;text-decoration:none;">adwalididi.com</a></p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
