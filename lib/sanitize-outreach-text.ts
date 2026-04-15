/**
 * Strip emoji/pictographs and normalize Unicode for AI-generated outreach copy.
 */

function stripEmojiAndPictographs(raw: string): string {
  let s = raw.normalize('NFC');
  s = s.replace(/\p{Extended_Pictographic}/gu, '');
  s = s.replace(/\uFE0F/g, '');
  s = s.replace(/\u200D/g, '');
  return s;
}

/** Single-line or WhatsApp: strip emoji and collapse whitespace. */
export function sanitizeOutreachPlainText(raw: string): string {
  return stripEmojiAndPictographs(raw).replace(/\s+/g, ' ').trim();
}

/** Email body: strip emoji but keep newlines for paragraph breaks. */
export function sanitizeOutreachEmailBody(raw: string): string {
  let s = stripEmojiAndPictographs(raw);
  s = s.replace(/\n{3,}/g, '\n\n');
  s = s
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trimEnd())
    .join('\n');
  return s.trim();
}
