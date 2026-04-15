export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Plain-text body → safe HTML paragraphs (double newline = new paragraph). */
export function plainTextToEmailParagraphs(body: string): string {
  const t = body.trim();
  if (!t) return '';
  const escaped = escapeHtml(t);
  const blocks = escaped.split(/\n\n+/);
  return blocks
    .map((block) => {
      const inner = block.split(/\n/).join('<br>');
      return `<p style="margin:0 0 18px;color:#333;font-size:15px;line-height:1.75;">${inner}</p>`;
    })
    .join('');
}
