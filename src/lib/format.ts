const tl = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

/** Format a kuruş amount (integer) as Turkish Lira, e.g. 54900 -> "₺549". */
export function formatKurus(kurus: number): string {
  return tl.format(kurus / 100);
}

const trDate = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
});

/** "2026-07-24" -> "24 Temmuz 2026 Perşembe". Returns the input on bad dates. */
export function formatDateTR(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : trDate.format(d);
}
