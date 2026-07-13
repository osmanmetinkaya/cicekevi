const tl = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

/** Format a kuruş amount (integer) as Turkish Lira, e.g. 54900 -> "₺549". */
export function formatKurus(kurus: number): string {
  return tl.format(kurus / 100);
}

const dateFormatters: Record<string, Intl.DateTimeFormat> = {
  tr: new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }),
  en: new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }),
};

/**
 * "2026-07-24" -> locale'e göre uzun tarih (tr: "24 Temmuz 2026 Perşembe",
 * en: "Thursday, 24 July 2026"). Geçersiz tarihte girdiyi döndürür.
 */
export function formatDate(iso: string, locale: string = "tr"): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return (dateFormatters[locale] ?? dateFormatters.tr).format(d);
}

/** Geriye dönük uyum: Türkçe uzun tarih. */
export function formatDateTR(iso: string): string {
  return formatDate(iso, "tr");
}
