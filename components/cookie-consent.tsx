"use client";

import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { getConsent, setConsent, ConsentState, defaultConsent } from '@/lib/consent';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [preferences, setPreferences] = useState<ConsentState>(defaultConsent);

  useEffect(() => {
    // Delay to prevent hydration mismatch
    const timer = setTimeout(() => {
      const consent = getConsent();
      if (!consent) {
        setShowBanner(true);
      } else {
        setPreferences(consent);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAcceptAll = () => {
    const allGranted: ConsentState = {
      analytics_storage: 'granted',
      ad_storage: 'granted',
    };
    setConsent(allGranted, 'accept_all');
    setShowBanner(false);
    setShowManage(false);
  };

  const handleRejectAll = () => {
    setConsent(defaultConsent, 'reject_all');
    setShowBanner(false);
    setShowManage(false);
  };

  const handleSavePreferences = () => {
    setConsent(preferences, 'save_preferences');
    setShowBanner(false);
    setShowManage(false);
  };

  const togglePreference = (key: keyof ConsentState) => {
    setPreferences(prev => ({
      ...prev,
      [key]: prev[key] === 'granted' ? 'denied' : 'granted'
    }));
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && !showManage && (
          <m.div
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-[450px] z-50 p-4 md:p-6 bg-white/90 backdrop-blur-md border border-neutral-200 rounded-2xl shadow-xl space-y-3 md:space-y-4"
          >
            <div>
              <h3 className="font-syne font-semibold text-base md:text-lg text-near-black mb-1 md:mb-2">We value your privacy</h3>
              <p className="text-xs md:text-sm text-neutral-600 font-inter leading-relaxed">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies in accordance with the Indian DPDPA 2023.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1 md:pt-2">
              <Button variant="ghost" onClick={handleRejectAll} className="text-neutral-500 hover:text-neutral-600 hover:bg-neutral-200/50 transition-colors flex-1 px-2 text-xs md:text-sm focus-visible:ring-0 focus-visible:ring-offset-0">
                Reject All
              </Button>
              <Button variant="ghost" onClick={() => setShowManage(true)} className="text-neutral-500 hover:text-neutral-600 hover:bg-neutral-200/50 transition-colors flex-1 px-2 text-xs md:text-sm focus-visible:ring-0 focus-visible:ring-offset-0">
                Manage
              </Button>
              <Button onClick={handleAcceptAll} className="bg-teal-600 hover:bg-teal-700 text-white flex-1 md:flex-none text-xs md:text-sm px-3 md:px-4 focus-visible:ring-0 focus-visible:ring-offset-0">
                Accept All
              </Button>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showManage && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <m.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="bg-white rounded-2xl shadow-2xl border border-neutral-100 max-w-md w-full overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-neutral-100 flex items-start justify-between">
                <div>
                  <h2 className="font-syne text-xl font-bold text-near-black">Manage Preferences</h2>
                  <p className="text-sm text-neutral-500 mt-1">Review and update your cookie settings.</p>
                </div>
                <button 
                  onClick={() => setShowManage(false)}
                  className="p-2 -mr-2 -mt-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                  aria-label="Close manage preferences"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-near-black text-sm">Strictly Necessary</h4>
                    <p className="text-xs text-neutral-500 mt-1">Required for the website to function properly. Cannot be disabled.</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-teal-600 opacity-50 cursor-not-allowed">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition border translate-x-6" />
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-near-black text-sm">Analytics & Performance</h4>
                    <p className="text-xs text-neutral-500 mt-1">Helps us understand how visitors interact with our website.</p>
                  </div>
                  <button 
                    onClick={() => togglePreference('analytics_storage')}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${preferences.analytics_storage === 'granted' ? 'bg-teal-600' : 'bg-neutral-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${preferences.analytics_storage === 'granted' ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-near-black text-sm">Marketing & Advertising</h4>
                    <p className="text-xs text-neutral-500 mt-1">Used to deliver ads more relevant to you and your interests.</p>
                  </div>
                  <button 
                    onClick={() => togglePreference('ad_storage')}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${preferences.ad_storage === 'granted' ? 'bg-teal-600' : 'bg-neutral-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${preferences.ad_storage === 'granted' ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              <div className="p-4 md:p-6 border-t border-neutral-100 bg-neutral-50 flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                <Button variant="ghost" onClick={handleRejectAll} className="text-neutral-500 hover:text-neutral-600 hover:bg-neutral-200/50 transition-colors mr-auto sm:mr-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                  Reject All
                </Button>
                <Button variant="outline" onClick={handleSavePreferences} className="focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-neutral-100 hover:text-neutral-900 border-neutral-200 text-neutral-700">
                  Save Preferences
                </Button>
                <Button onClick={handleAcceptAll} className="bg-teal-600 hover:bg-teal-700 text-white focus-visible:ring-0 focus-visible:ring-offset-0">
                  Accept All
                </Button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
