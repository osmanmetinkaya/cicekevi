const TR_MAP: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
  â: "a",
  î: "i",
  û: "u",
};

/**
 * Türkçe bir başlıktan URL'e uygun slug üretir.
 * "Pembe Şafak" → "pembe-safak"
 *
 * Not: mevcut ürün/kategori slug'ları bu kuralla üretilmişti; yeni kayıtlar
 * için de aynı davranış korunur. Slug admin formunda elle düzenlenebilir.
 */
export function slugify(input: string): string {
  return input
    .trim()
    .replace(/[çÇğĞıİöÖşŞüÜâîû]/g, (ch) => TR_MAP[ch] ?? ch)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
