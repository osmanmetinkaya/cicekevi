/** Rakam dışındaki her şeyi at (boşluk, parantez, tire, +90 vb.). */
export function digitsOnly(raw: string): string {
  return raw.replace(/\D/g, "");
}

/** Türkiye telefon numaraları için gevşek doğrulama: 10-12 haneli
 * (alan kodu + numara, isteğe bağlı ülke kodu ile). Kayıt formundaki
 * (giris/actions.ts) kuralla aynı. */
export function isValidPhone(raw: string): boolean {
  const digits = digitsOnly(raw);
  return digits.length >= 10 && digits.length <= 12;
}
