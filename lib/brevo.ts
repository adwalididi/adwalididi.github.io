export async function sendBrevoEmail({
  to,
  toName,
  subject,
  htmlContent,
  textContent,
}: {
  to: string;
  toName?: string;
  subject: string;
  htmlContent?: string;
  textContent?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string; status?: number }> {
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Ad Wali Didi',
          email: process.env.BREVO_FROM_EMAIL!,
        },
        replyTo: {
          name: 'Ad Wali Didi',
          email: 'growth@adwalididi.com',
        },
        to: [{ email: to, name: toName || to }],
        subject,
        ...(htmlContent ? { htmlContent } : {}),
        ...(textContent ? { textContent } : {}),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { success: false, error: err, status: res.status };
    }

    const data = await res.json();
    return { success: true, messageId: data.messageId, status: res.status };
  } catch (e) {
    return { success: false, error: String(e), status: 500 };
  }
}
