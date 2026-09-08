/**
 * Google Analytics (GA4) + Google Ads dönüşüm izleme.
 *
 * Yalnızca ilgili NEXT_PUBLIC_* ortam değişkenleri tanımlıysa VE ziyaretçi
 * çerez bildiriminde onay verdiyse yüklenir (bkz. analytics-loader.tsx,
 * cookie-notice.tsx) — sitenin çerez politikasında verilen "analiz/reklam
 * çerezleri yalnızca onayla" taahhüdü burada uygulanır.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";
export const GOOGLE_ADS_PURCHASE_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL || "";

export function isAnalyticsConfigured(): boolean {
  return Boolean(GA_MEASUREMENT_ID || GOOGLE_ADS_ID);
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let loaded = false;

/** gtag.js'i sayfaya bir kez ekler ve yapılandırılan ID'leri initialize eder. */
export function loadGtag(): void {
  if (loaded || typeof window === "undefined" || !isAnalyticsConfigured()) return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag;
  gtag("js", new Date());

  const primaryId = GA_MEASUREMENT_ID || GOOGLE_ADS_ID;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${primaryId}`;
  document.head.appendChild(script);

  if (GA_MEASUREMENT_ID) gtag("config", GA_MEASUREMENT_ID);
  if (GOOGLE_ADS_ID) gtag("config", GOOGLE_ADS_ID);
}

const trackedOrders = new Set<string>();

/**
 * Sipariş ödemesi onaylandığında (checkout/success, status=paid) çağrılır.
 * GA4 `purchase` olayını ve — yapılandırılmışsa — Google Ads dönüşüm
 * olayını tetikler. Aynı sipariş için (sayfa yenilense bile) yalnızca bir
 * kez gönderilir.
 */
export function trackPurchase(order: {
  transactionId: string;
  valueTRY: number;
  items: { name: string; qty: number; amount: number }[];
}): void {
  if (typeof window === "undefined" || !window.gtag) return;
  if (trackedOrders.has(order.transactionId)) return;
  trackedOrders.add(order.transactionId);

  if (GA_MEASUREMENT_ID) {
    window.gtag("event", "purchase", {
      transaction_id: order.transactionId,
      value: order.valueTRY,
      currency: "TRY",
      items: order.items.map((item) => ({
        item_name: item.name,
        quantity: item.qty,
        price: item.amount / 100,
      })),
    });
  }

  if (GOOGLE_ADS_ID && GOOGLE_ADS_PURCHASE_LABEL) {
    window.gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_PURCHASE_LABEL}`,
      transaction_id: order.transactionId,
      value: order.valueTRY,
      currency: "TRY",
    });
  }
}
