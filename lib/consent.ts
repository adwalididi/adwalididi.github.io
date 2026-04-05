import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export type ConsentState = {
  analytics_storage: 'granted' | 'denied';
  ad_storage: 'granted' | 'denied';
};

export const defaultConsent: ConsentState = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
};

// Check standard localStorage for existing preferences
export const getConsent = (): ConsentState | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('cookie_consent');
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as ConsentState;
      if (parsed.analytics_storage && parsed.ad_storage) {
        return parsed;
      }
    } catch {
      return null;
    }
  }
  return null;
};

// Save to localStorage and update GTM and log to Supabase
export const setConsent = async (state: ConsentState, action: string = 'update') => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('cookie_consent', JSON.stringify(state));
  
  // Update Google Consent Mode V2
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  
  function gtagHelper(_type: string, _action: string, _payload: object) {
    w.dataLayer.push(arguments);
  }
  
  // Map over to V2 parameters alongside the base ones
  gtagHelper('consent', 'update', {
    ...state,
    ad_user_data: state.ad_storage,
    ad_personalization: state.ad_storage,
  });

  // Supabase Audit Trail Logging
  try {
    let consentId = localStorage.getItem('consent_receipt_id');
    if (!consentId) {
      consentId = uuidv4();
      localStorage.setItem('consent_receipt_id', consentId);
    }

    const { error } = await supabase
      .from('consent_logs')
      .insert([{
        consent_id: consentId,
        action: action,
        consent_state: state,
        page_url: window.location.href,
        user_agent: navigator.userAgent
      }]);

    if (error) {
      console.error('Audit trail logging failed:', error);
    }
  } catch (err) {
    console.error('Audit trail error:', err);
  }
};
