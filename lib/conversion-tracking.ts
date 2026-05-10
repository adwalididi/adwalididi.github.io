// lib/conversion-tracking.ts
import { getConsent } from '@/lib/consent';

// Extend Window with Zaraz (declared here to avoid conflicting with other files)
declare global {
  interface Window {
    zaraz?: {
      track: (eventName: string, parameters?: Record<string, unknown>) => void;
    };
  }
}

/**
 * Unified conversion tracking utility that fires to both GTM (Browser) and Zaraz (Edge/Server).
 * Uses a single UUID for deduplication in Meta's pipeline.
 */
export const trackConversion = (
  eventName: string,
  metadata: Record<string, unknown> = {}
) => {
  if (typeof window === 'undefined') return;

  // Check consent from our existing consent utility
  const consent = getConsent();
  const hasConsent = consent?.ad_storage === 'granted';

  if (!hasConsent) {
    console.log(`[Tracking Blocked] ${eventName} - No Consent`);
    return;
  }

  // Safe UUID generation (handles HTTP localhost where crypto.randomUUID might be missing)
  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback for non-HTTPS environments
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const uniqueEventId = generateUUID();

  // 1. Push to GTM dataLayer
  // NOTE: GTM trigger should listen for 'custom_conversion_event'
  // Use 'conversion_type' field to differentiate event types in GTM mappings
  const win = window as unknown as { dataLayer: unknown[] };
  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push({
    event: 'custom_conversion_event', // GTM Custom Event Trigger (constant)
    conversion_type: eventName,       // Differentiator (Lead_Submission, WhatsApp_Click, etc.)
    meta_event_id: uniqueEventId,
    ...metadata,
  });

  // 2. Push to Cloudflare Zaraz
  // NOTE: Zaraz receives the actual event name (Lead_Submission, WhatsApp_Click, etc.)
  if (typeof window.zaraz !== 'undefined') {
    window.zaraz.track(eventName, {
      event_id: uniqueEventId,
      ...metadata,
    });
  } else {
    // Zaraz might be missing in local dev if not proxied through Cloudflare
    console.debug(`[Zaraz Info] Event ${eventName} skipped (only available in production/proxied environments).`);
  }

  console.log(`[Conversion Tracked] ${eventName}`, { event_id: uniqueEventId, ...metadata });
};
