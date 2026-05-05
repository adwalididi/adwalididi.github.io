# Plain Text Email Deliverability Fix
**Date:** April 19, 2026

## Objective
To improve cold email deliverability by avoiding Google's promotions and spam filters. The original setup used a nested HTML structure (`<table role="presentation">`), an invisible preheader `div`, and sent via Brevo as `htmlContent`, which triggered marketing email signatures and allowed Brevo to automatically inject an invisible open-tracking pixel.

## Audit Findings
1. **Gemini Generation (`app/api/generate-email/route.ts`)**: Confirmed that the AI prompt explicitly requests plain text with standard line breaks. Gemini was NOT outputting HTML.
2. **Cold Email Wrapper (`app/api/send-cold-email/route.ts`)**: Discovered that the raw text from Gemini was being passed through `wrapColdEmailHtml()`, which injected the problematic marketing structure (`<!DOCTYPE html>`, `<table>`, invisible preheader).
3. **Welcome Email Wrapper (`app/api/send-welcome/route.ts`)**: Confirmed that Resend is already properly configured to send pure plain text (`text: textPayload`). No HTML or marketing wrappers exist here.

## Changes Implemented

### 1. Updated Brevo API Helper (`lib/brevo.ts`)
- **Added** support for `textContent` alongside `htmlContent`.
- **Modified** the request payload builder to dynamically include `textContent` if provided. This explicitly tells Brevo's SMTP API to treat the email as pure text, preventing the injection of tracking pixels.

### 2. Stripped HTML from Cold Emails (`app/api/send-cold-email/route.ts`)
- **Removed** the `wrapColdEmailHtml` import and function call.
- **Added** manual concatenation for the email signature: 
  ```javascript
  const textContent = `${body}\n\n--\nShivani\nAd Wali Didi`;
  ```
- **Modified** the `sendBrevoEmail` call to pass `textContent` instead of `htmlContent`.

## Rollback Instructions
If you need to revert to HTML emails for styling or tracking purposes:
1. In `app/api/send-cold-email/route.ts`, restore the import:
   `import { wrapColdEmailHtml } from '@/lib/email-templates/cold-email-wrapper';`
2. Change `textContent` back to `htmlContent`:
   ```javascript
   const htmlContent = wrapColdEmailHtml(body);
   ```
3. Update the `sendBrevoEmail` call payload to use `htmlContent`.
