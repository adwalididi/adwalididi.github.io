import { escapeHtml, plainTextToEmailParagraphs } from './email-html-utils';

export function wrapColdEmailHtml(body: string): string {
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
<body style="margin:0;padding:0;background:#ffffff;-webkit-font-smoothing:antialiased;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;text-align:left;">

<tr>
<td style="padding:0;">
${paragraphsHtml}
<p style="margin:24px 0 0;color:#333;font-size:15px;line-height:1.75;">&mdash; Shivani<br>Ad Wali Didi</p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
