"use client";

import { useEffect } from "react";
import { getStoredConsent, CONSENT_EVENT } from "@/lib/consent";
import { loadGtag, isAnalyticsConfigured } from "@/lib/gtag";

/**
 * Google Analytics/Ads'i yalnızca daha önce onay verilmişse (sayfa
 * yüklenirken) veya çerez bildiriminde tam o anda onay verilirse
 * (sayfa yenilenmeden) yükler. Görünür bir çıktısı yok.
 */
export function AnalyticsLoader() {
  useEffect(() => {
    if (!isAnalyticsConfigured()) return;
    if (getStoredConsent() === "granted") loadGtag();

    function onConsentGranted() {
      loadGtag();
    }
    window.addEventListener(CONSENT_EVENT, onConsentGranted);
    return () => window.removeEventListener(CONSENT_EVENT, onConsentGranted);
  }, []);

  return null;
}
