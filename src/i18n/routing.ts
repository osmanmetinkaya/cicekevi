import { defineRouting } from "next-intl/routing";

/**
 * Site iki dilli: Türkçe (varsayılan) ve İngilizce. `localePrefix: "as-needed"`
 * ile Türkçe temiz kök URL'lerde kalır (/, /sepet, /products/pembe-safak),
 * İngilizce ise /en altında yaşar (/en, /en/sepet, /en/products/pembe-safak).
 */
export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localePrefix: "as-needed",
  // Kabul-Dil başlığına göre otomatik yönlendirme yapma; Türkçe-öncelikli
  // site kök URL'de kalsın, kullanıcı EN'i açıkça seçsin.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
