/**
 * Çerez bildirimi onay durumu — localStorage'da saklanır, hem banner hem
 * analytics-loader tarafından okunur/yazılır. "granted" olmadan Google
 * Analytics/Ads asla yüklenmez (bkz. src/lib/gtag.ts).
 */

export type ConsentState = "granted" | "denied";

const KEY = "cicekevi-cerez-bildirimi";
export const CONSENT_EVENT = "cicekevi:consent-granted";

export function getStoredConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(KEY);
  return v === "granted" || v === "denied" ? v : null;
}

export function setStoredConsent(state: ConsentState): void {
  localStorage.setItem(KEY, state);
  if (state === "granted") {
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }
}
