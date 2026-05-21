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

/**
 * Strip common AI-generated placeholder patterns that leak through despite prompting.
 * e.g. [Your Name], [Contact Information], [Your Company], [Phone Number], etc.
 * Also strips trailing signature blocks like "Best,\n[Your Name]" or "Regards,\n..."
 */
function stripPlaceholders(raw: string): string {
  let s = raw;
  // Remove any [...] placeholder tokens (e.g. [Your Name], [Contact Information])
  s = s.replace(/\[(?:Your\s+Name|Contact\s+Information|Your\s+Company|Company\s+Name|Phone\s+Number|Email\s+Address|Your\s+Title|Your\s+Position|Insert\s+[^\]]+|Sender\s+Name|Agency\s+Name|Your\s+Agency)\]/gi, '');
  // Remove trailing signature blocks that the AI sometimes appends
  // Matches: Best/Regards/Warm regards/Cheers, followed by optional placeholder lines
  s = s.replace(/\n*(?:Best|Regards|Warm\s+regards|Kind\s+regards|Cheers|Thanks|Thank\s+you),?\s*\n(?:\s*(?:\[.*?\]|Ad\s*Wali\s*Didi|Adwalididi)\s*\n?)*\s*$/gi, '');
  // Clean up any resulting double blank lines
  s = s.replace(/\n{3,}/g, '\n\n');
  return s;
}

/** Single-line or WhatsApp: strip emoji and collapse whitespace. */
export function sanitizeOutreachPlainText(raw: string): string {
  let s = stripEmojiAndPictographs(raw);
  s = stripPlaceholders(s);
  return s.replace(/\s+/g, ' ').trim();
}

/** Email body: strip emoji but keep newlines for paragraph breaks. */
export function sanitizeOutreachEmailBody(raw: string): string {
  let s = stripEmojiAndPictographs(raw);
  s = stripPlaceholders(s);
  s = s.replace(/\n{3,}/g, '\n\n');
  s = s
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trimEnd())
    .join('\n');
  return s.trim();
}
