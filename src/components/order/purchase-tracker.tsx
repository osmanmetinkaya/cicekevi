"use client";

import { useEffect } from "react";
import { getStoredConsent } from "@/lib/consent";
import { loadGtag, trackPurchase } from "@/lib/gtag";

/**
 * Ödeme onaylanan sipariş için GA4/Google Ads dönüşüm olayını tetikler.
 * `loadGtag()` burada da (idempotent) çağrılır — sayfa doğrudan bu adrese
 * geldiğinde (PayTR dönüşü) AnalyticsLoader'ın effect'i henüz çalışmamış
 * olabilir; iki çağrı arasında sıra garantisi aranmaz. Görünür bir çıktısı
 * yok, yalnızca izleme yan etkisi içindir.
 */
export function PurchaseTracker({
  transactionId,
  valueTRY,
  items,
}: {
  transactionId: string;
  valueTRY: number;
  items: { name: string; qty: number; amount: number }[];
}) {
  useEffect(() => {
    if (getStoredConsent() !== "granted") return;
    loadGtag();
    trackPurchase({ transactionId, valueTRY, items });
  }, [transactionId, valueTRY, items]);

  return null;
}
