# Plan: GTM + Zaraz Deduplication for Meta Conversions

**TL;DR**: Create a unified conversion tracking utility that generates a single UUID per conversion event and simultaneously pushes it to both GTM's dataLayer and Zaraz at the edge. This eliminates duplicate conversions in Meta's pipeline. Requires: (1) new utility file with HTTP localhost fallback, (2) modification of lead form + other conversion points, (3) GTM tag configuration, (4) Zaraz payload mapping in Cloudflare.

## Critical Fix: Secure UUID Generation

⚠️ **Important**: `crypto.randomUUID()` only works in HTTPS contexts. For local development on HTTP localhost, a fallback mechanism is required to prevent application crashes.

---

## Steps

### Phase 1: Create Unified Conversion Tracking Utility (No Dependencies)

**File**: Create [lib/conversion-tracking.ts](lib/conversion-tracking.ts)

```typescript
// lib/conversion-tracking.ts

// Ensure global types for GTM and Zaraz
declare global {
  interface Window {
    dataLayer: any[];
    zaraz?: {
      track: (eventName: string, parameters?: Record<string, any>) => void;
    };
  }
}

export const trackConversion = (
  eventName: string,
  metadata: Record<string, any> = {}
) => {
  if (typeof window === 'undefined') return;

  // Assuming ad_storage is saved in localStorage. Adjust if using a cookie or state manager.
  const hasConsent = localStorage.getItem('ad_storage') === 'granted';
  if (!hasConsent) {
    console.log(`[Tracking Blocked] ${eventName} - No Consent`);
    return;
  }

  // Safe UUID generation (handles HTTP localhost)
  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const uniqueEventId = generateUUID();

  // 1. Push to GTM dataLayer
  // NOTE: GTM trigger listens for 'custom_conversion_event' (always the same)
  // Use 'conversion_type' field to differentiate event types in GTM mappings
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'custom_conversion_event', // GTM Custom Event Trigger (constant)
    conversion_type: eventName,       // Differentiator for GTM logic (Lead_Submission, WhatsApp_Click, etc.)
    meta_event_id: uniqueEventId,
    ...metadata,
  });

  // 2. Push to Cloudflare Zaraz
  // NOTE: Zaraz receives the actual event name (Lead_Submission, WhatsApp_Click, etc.)
  // Zaraz Actions must listen for these specific event names or use a catch-all mapping
  if (typeof window.zaraz !== 'undefined') {
    window.zaraz.track(eventName, {
      event_id: uniqueEventId,
      ...metadata,
    });
  } else {
    console.warn(`[Zaraz Missing] Could not fire ${eventName} to edge.`);
  }
};
```

**Key Features**:
- ✅ Safe UUID generation with HTTP localhost fallback
- ✅ Consent check via `localStorage.getItem('ad_storage')`
- ✅ GTM dataLayer push with `meta_event_id` for browser pixel
- ✅ Zaraz push with `event_id` for server-side CAPI
- ✅ Proper TypeScript declarations for Window interface
- ✅ Logging/debugging for troubleshooting
- ✅ **Event name consistency**: GTM always sees `custom_conversion_event`, Zaraz sees specific event names

**IMPORTANT — Event Name Consistency**:
- **GTM Side**: All conversions trigger on `custom_conversion_event`. Use `conversion_type` variable to differentiate behavior.
- **Zaraz Side**: Each event fires with its actual name (e.g., `Lead_Submission`, `WhatsApp_Click`). Zaraz Actions must listen for these specific names or use a catch-all configuration.

---

### Phase 2: Implement Deduplication in Lead Form (Depends on Phase 1)

**Files to Modify**:
- [components/home/lead-form-helpers.ts](components/home/lead-form-helpers.ts)
- [components/home/lead-form.tsx](components/home/lead-form.tsx)

**Update lead-form-helpers.ts or lead-form.tsx**:

Replace the existing `fireLeadPixelEvent()` or form submission handler with:

```typescript
import { trackConversion } from '@/lib/conversion-tracking';

// Inside your form submission handler
const handleLeadSubmit = async (formData: FormData) => {
  // ... your existing validation and API submission logic ...

  const response = await submitToBackend(formData);

  if (response.success) {
    // Fire unified tracking immediately upon success
    trackConversion('Lead_Submission', {
      business_type: formData.get('businessType'),
      lead_source: 'homepage'
    });
    
    // ... redirect or show success message ...
  }
};
```

**Key Changes**:
- ✅ Remove direct `fbq()` calls (GTM handles via dataLayer)
- ✅ Call `trackConversion()` on successful form submission
- ✅ Pass `business_type` and `lead_source` as metadata
- ✅ Unified function ensures both GTM + Zaraz get identical event_id

---

### Phase 3: Implement Deduplication at Other Conversion Points (Depends on Phase 1)

Apply the same `trackConversion()` pattern to all engagement points:

#### 3a. Services Page Form
**File**: [app/(public)/services/page.tsx](app/(public)/services/page.tsx)

```typescript
import { trackConversion } from '@/lib/conversion-tracking';

// On form submission:
trackConversion('Lead_Submission', {
  business_type: formData.get('businessType'),
  lead_source: 'services_page'
});
```

#### 3b. WhatsApp Button Clicks
**File**: [components/whatsapp-button.tsx](components/whatsapp-button.tsx)

```typescript
import { trackConversion } from '@/lib/conversion-tracking';

const handleWhatsAppClick = () => {
  trackConversion('WhatsApp_Click', {
    source: 'mobile_button'
  });
  // Then open WhatsApp link
  window.location.href = 'https://wa.me/916261643774';
};
```

#### 3c. Hero Section CTA
**File**: [components/home/hero-section.tsx](components/home/hero-section.tsx)

```typescript
import { trackConversion } from '@/lib/conversion-tracking';

const handleCtaClick = () => {
  trackConversion('WhatsApp_Click', {
    source: 'hero_cta'
  });
  window.location.href = 'https://wa.me/916261643774?text=...';
};
```

#### 3d. CTA Section Links
**File**: [components/home/cta-section.tsx](components/home/cta-section.tsx)

```typescript
import { trackConversion } from '@/lib/conversion-tracking';

const handleCtaClick = () => {
  trackConversion('WhatsApp_Click', {
    source: 'cta_section'
  });
  window.location.href = 'https://wa.me/916261643774?text=...';
};
```

#### 3e. Navbar "Let's Talk" CTA
**File**: [components/navbar.tsx](components/navbar.tsx)

```typescript
import { trackConversion } from '@/lib/conversion-tracking';

const handleLetsTalk = () => {
  trackConversion('Contact_CTA', {
    source: 'navbar'
  });
  // Navigate to contact page
  router.push('/contact');
};
```

---

### Phase 4: GTM Configuration (Browser Pixel)

**Where**: Google Tag Manager UI at https://tagmanager.google.com/

**Key Principle**: All conversion events fire the same trigger (`custom_conversion_event`). Use `conversion_type` variable to differentiate behavior if needed.

**Steps**:

1. **Create Data Layer Variable**
   - Click Variables > New > User-Defined Variable
   - Name: `DLV - Meta Event ID`
   - Type: Data Layer Variable
   - Data Layer Variable Name: `meta_event_id`
   - Save

2. **Create Data Layer Variable for Conversion Type (Optional)**
   - Name: `DLV - Conversion Type`
   - Type: Data Layer Variable
   - Data Layer Variable Name: `conversion_type`
   - This lets you differentiate events in GTM if needed
   - Save

3. **Create Trigger for All Conversion Events**
   - Click Triggers > New
   - Name: `Custom Event - All Conversions`
   - Type: Custom Event
   - Event Name: `custom_conversion_event` (this is the constant value from trackConversion)
   - Save

4. **Update Meta Pixel Tag**
   - Open existing Meta Pixel tag in GTM (or create if doesn't exist)
   - Go to "More Settings" > "Advanced"
   - Locate "Event ID" field
   - Set value: `{{DLV - Meta Event ID}}`
   - Update Firing Trigger: `Custom Event - All Conversions`
   - Save

**Result**: Every conversion event from your app fires `custom_conversion_event`, GTM catches it, extracts `meta_event_id`, and passes it to Meta Pixel. All events use the same trigger for consistency.

---

### Phase 5: Zaraz Configuration (Server-Side CAPI)

**Where**: Cloudflare Dashboard

**Prerequisites**: Cloudflare Zaraz must already be deployed on your domain.

#### 5.1: Collect Meta Business Data (PREREQUISITE)

Before configuring Zaraz, gather these credentials from Meta Business Manager:

1. **Dataset ID (Pixel ID)**
   - Log in to [business.facebook.com](https://business.facebook.com)
   - Go to Events Manager
   - Navigate to "Settings" tab
   - Copy the **Dataset ID** (this is your Pixel ID)
   - Store securely (e.g., environment variable: `NEXT_PUBLIC_META_PIXEL_ID`)

2. **CAPI Access Token**
   - In Events Manager, go to Settings tab
   - Scroll down to "Conversions API" section
   - Click "Generate Access Token"
   - Copy the token **immediately** (Meta won't show it again)
   - Store securely in Cloudflare Zaraz environment variables or a secrets manager

3. **Test Event Code** (Optional but Recommended)
   - In Events Manager, go to "Test Events" tab
   - Copy the server-side test code
   - Use this in Phase 6 testing to verify events in real-time

#### 5.2: Configure Zaraz Actions

**Goal**: Map each conversion event from your app to the Meta Conversions API with the correct `event_id`.

**Strategy**: You have two options:

**Option A: Separate Actions (Recommended for Clarity)**
- Create one Action per conversion type:
  - `Lead_Submission` → Maps to Meta "Lead" event
  - `WhatsApp_Click` → Maps to Meta "Contact" or "InitiateCheckout"
  - `Contact_CTA` → Maps to Meta "Lead" or "Contact"
- Pros: Clear mappings, easier to debug
- Cons: More setup in Zaraz

**Option B: Catch-All Action (Simpler but Less Flexible)**
- Create one Action that catches all events
- Use Zaraz variables to dynamically map `conversion_type` to Meta event names
- Pros: Single configuration
- Cons: Requires dynamic variable mapping in payload

**Recommended: Option A** — Configure as follows:

1. **Access Zaraz**
   - Log in to Cloudflare Dashboard
   - Go to Tools > Zaraz

2. **Create Action for Lead_Submission**
   - Click "+ Create" or "New Action"
   - Name: `Meta CAPI - Lead Submission`
   - Trigger: `Lead_Submission` (listening for this exact event name from `zaraz.track()`)
   - Tool: Select "Meta Conversions API"
   - Configuration:
     - Event Name: `Lead` (or `Lead` as Meta calls it in CAPI)
     - Event ID: `{{ client.track.event_id }}`
     - Event Source URL: `{{ client.url }}`
     - Include other fields: `user_data`, `custom_data`, `timestamp` (as needed)
   - Save

3. **Create Action for WhatsApp_Click**
   - Name: `Meta CAPI - WhatsApp Click`
   - Trigger: `WhatsApp_Click`
   - Tool: Meta Conversions API
   - Configuration:
     - Event Name: `Contact` (appropriate Meta event for engagement)
     - Event ID: `{{ client.track.event_id }}`
     - Event Source URL: `{{ client.url }}`
   - Save

4. **Create Action for Contact_CTA**
   - Name: `Meta CAPI - Contact CTA`
   - Trigger: `Contact_CTA`
   - Tool: Meta Conversions API
   - Configuration:
     - Event Name: `Lead` or `Contact`
     - Event ID: `{{ client.track.event_id }}`
     - Event Source URL: `{{ client.url }}`
   - Save

**Critical Field Mapping**:
```
Zaraz Variable          → Meta CAPI Field
{{ client.track.event_id }} → Event ID (primary deduplication key)
{{ client.url }}           → Event Source URL
{{ client.timestamp }}     → Timestamp
```

**Result**: When `trackConversion()` fires on the client, the event reaches Zaraz with the correct event name and `event_id`. Zaraz routes it to the appropriate Meta Action, which sends the event to Meta Conversions API with the matching `event_id` for deduplication.

---

## Event Name Mapping Reference

**Critical Understanding**: The same conversion event travels through multiple systems with different naming:

| User Action | JavaScript Call | GTM Sees | Zaraz Sees | Meta CAPI Event | UUID Field |
|---|---|---|---|---|---|
| Lead form submit | `trackConversion('Lead_Submission', {...})` | `custom_conversion_event` (with `conversion_type: 'Lead_Submission'`) | `Lead_Submission` | `Lead` | `meta_event_id` → `event_id` |
| WhatsApp click | `trackConversion('WhatsApp_Click', {...})` | `custom_conversion_event` (with `conversion_type: 'WhatsApp_Click'`) | `WhatsApp_Click` | `Contact` | `meta_event_id` → `event_id` |
| Contact CTA click | `trackConversion('Contact_CTA', {...})` | `custom_conversion_event` (with `conversion_type: 'Contact_CTA'`) | `Contact_CTA` | `Lead` or `Contact` | `meta_event_id` → `event_id` |

**Why This Matters**:
- **GTM**: Always listens for `custom_conversion_event` (constant). Uses `conversion_type` field for internal routing.
- **Zaraz**: Listens for specific event names (Lead_Submission, WhatsApp_Click, etc.). Each requires its own Action configuration.
- **Meta**: Receives mapped event names (Lead, Contact, InitiateCheckout, etc.) based on Zaraz Action configuration.
- **Deduplication**: Both pipelines use the same `event_id` (UUID) to identify duplicate events.

---

### Local Testing (HTTP Localhost)

1. **Enable Consent**
   ```javascript
   localStorage.setItem('ad_storage', 'granted');
   ```

2. **Submit Lead Form**
   - Fill form and submit
   - Check DevTools > Console for logs: `[Tracking Blocked]` should NOT appear

3. **Verify GTM DataLayer**
   - Open DevTools > Application > Local Storage > check `ad_storage`
   - Open DevTools > Console, run:
     ```javascript
     console.log(window.dataLayer);
     ```
   - Look for entry with:
     ```json
     {
       "event": "custom_conversion_event",
       "conversion_type": "Lead_Submission",
       "meta_event_id": "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
       "business_type": "...",
       "lead_source": "homepage"
     }
     ```

4. **Verify UUID Format**
   - UUID should follow pattern: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
   - On HTTP localhost, should use fallback generator (still valid UUIDv4-like format)
   - On HTTPS, should use native `crypto.randomUUID()`

5. **Check Network Activity**
   - Open DevTools > Network tab
   - Filter for "zaraz" or "google-analytics"
   - Verify request includes `event_id` parameter with matching UUID

### Production Testing (HTTPS)

1. **Verify Secure UUID**
   - Confirm `crypto.randomUUID()` is being used (not fallback)
   - Check DevTools Console for UUID logs

2. **Meta Events Manager**
   - Wait 1-2 hours for data to propagate
   - Go to Meta Business Suite > Events Manager
   - Check Conversions column
   - Look for matching `event_id` in both:
     - **Browser column** (GTM → Meta Pixel)
     - **API column** (Zaraz → CAPI)
   - Verify single deduplicated event count (not doubled)

3. **Zaraz Edge Logs** (if available in Cloudflare)
   - Check Zaraz activity logs for tracked events
   - Verify `event_id` matches GTM dataLayer

### Automated Testing (Optional E2E)

```typescript
// E2E test example (Playwright/Cypress)
test('Lead form submission fires unified conversion tracking', async ({ page }) => {
  // Enable consent
  await page.evaluate(() => {
    localStorage.setItem('ad_storage', 'granted');
  });

  // Intercept dataLayer push
  let dataLayerEvent: any;
  await page.evaluate(() => {
    window.dataLayer = window.dataLayer || [];
    const originalPush = window.dataLayer.push;
    window.dataLayer.push = function(...args: any[]) {
      if (args[0].event === 'custom_conversion_event') {
        dataLayerEvent = args[0];
      }
      return originalPush.apply(this, args);
    };
  });

  // Submit form
  await page.fill('input[name="email"]', 'test@example.com');
  await page.click('button[type="submit"]');

  // Verify dataLayer event
  const event = await page.evaluate(() => (window as any).dataLayerEvent);
  expect(event.meta_event_id).toMatch(/[a-f0-9-]{36}/); // UUID pattern
  expect(event.conversion_type).toBe('Lead_Submission');
});
```

---

## Verification Checklist

### Prerequisites
- [ ] Meta Dataset ID (Pixel ID) collected from business.facebook.com
- [ ] Meta CAPI Access Token generated and stored securely
- [ ] Meta Test Event Code obtained (optional for real-time testing)
- [ ] Cloudflare Zaraz already deployed on domain

### Implementation
- [ ] Phase 1: `lib/conversion-tracking.ts` created with UUID fallback
- [ ] Phase 2: Lead form helpers/handler updated to use `trackConversion()`
- [ ] Phase 3: WhatsApp buttons, CTAs, navbar updated with tracking calls
- [ ] Phase 4: GTM configured with Data Layer Variable + Custom Event Trigger
- [ ] Phase 5: Zaraz Actions created for each event type with `event_id` mapping
- [ ] Event name consistency verified across all platforms

### Testing
- [ ] Local testing: Consent enabled, form submits, dataLayer captured
- [ ] UUID format verified (both HTTP fallback and HTTPS native)
- [ ] Zaraz events reaching Cloudflare (network tab shows requests)
- [ ] Production testing: Events appear in Meta Events Manager without duplication
- [ ] Console logs show no errors or "No Consent" blocks
- [ ] GTM and Zaraz event IDs match for same conversion event

---

## Scope

**Covered**:
- Lead form submissions (homepage + services)
- WhatsApp engagement tracking
- Contact CTA clicks
- Navbar "Let's Talk" button

**Not Covered** (can be added later):
- Page view tracking (requires separate GA4/GTM setup)
- Form field interactions
- Blog/Portfolio engagement
- Email click tracking (already via Brevo webhooks)

---

## Next Steps

### BEFORE Implementation (Gather Credentials)
1. **Collect Meta Business Data** (Phase 5 Prerequisites):
   - Log into [business.facebook.com](https://business.facebook.com)
   - Navigate to Events Manager → Settings
   - Copy **Dataset ID (Pixel ID)**
   - Scroll to "Conversions API" and **Generate Access Token** (copy immediately)
   - (Optional) Get Test Event Code from "Test Events" tab
   - Store all credentials securely

2. **Confirm Cloudflare Setup**:
   - Verify Zaraz is active on your domain
   - Confirm you have dashboard access

### During Implementation
3. **Implement Phase 1-3**: Create utility file and update all conversion points
4. **Configure Phase 4**: GTM Data Layer Variable + Custom Event Trigger
5. **Configure Phase 5**: Create Zaraz Actions for each event type (Lead_Submission, WhatsApp_Click, Contact_CTA)
6. **Run Local Tests**: Verify UUID generation works on HTTP localhost

### After Deployment
7. **Monitor Production**: 
   - Check Zaraz event logs in Cloudflare dashboard
   - Wait 1-2 hours for data propagation
   - Check Meta Events Manager for deduplicated events
   - Verify matching event IDs in browser pixel and CAPI columns
