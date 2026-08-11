import { createHmac } from "node:crypto";

/**
 * PayTR iFrame API yardımcıları.
 *
 * Mağaza bilgileri (merchant_id / merchant_key / merchant_salt) YALNIZCA
 * ortam değişkenlerinden okunur; hiçbir zaman koda ya da istemciye sızmaz
 * (NEXT_PUBLIC_ öneki bilerek yok).
 */

export const PAYTR_TOKEN_URL = "https://www.paytr.com/odeme/api/get-token";
/** Ödeme formunun adresi: `${PAYTR_IFRAME_BASE}/${token}`. Bu modül sunucuya
 * özel (node:crypto) olduğundan istemci tarafında adres doğrudan yazılır. */
export const PAYTR_IFRAME_BASE = "https://www.paytr.com/odeme/guvenli";

export interface PaytrCredentials {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
}

/** Ortamdaki mağaza bilgileri; eksikse null. */
export function getPaytrCredentials(): PaytrCredentials | null {
  const merchantId = process.env.PAYTR_MERCHANT_ID;
  const merchantKey = process.env.PAYTR_MERCHANT_KEY;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT;
  if (!merchantId || !merchantKey || !merchantSalt) return null;
  return { merchantId, merchantKey, merchantSalt };
}

export function isPaytrConfigured(): boolean {
  return getPaytrCredentials() !== null;
}

/** HMAC-SHA256(input, key) → base64. PayTR'ın tüm imzaları bu biçimde. */
function hmacBase64(input: string, key: string): string {
  return createHmac("sha256", key).update(input).digest("base64");
}

/**
 * merchant_oid: PayTR'e giden ve bildirim (callback) isteğinde geri dönen
 * sipariş kimliği. SADECE alfanumerik, en fazla 64 karakter — tire YOK.
 *
 * Güvenlik: bu değer aynı zamanda ödeme sonrası durum sayfasında siparişi
 * sorgulamak için kullanılır, bu yüzden okunabilir/sıralı `order_number`
 * (DC-1042) ile ASLA aynı olmamalı; tahmin edilemez olmalı.
 */
export function newMerchantOid(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

export interface TokenHashInput {
  merchantOid: string;
  userIp: string;
  email: string;
  /** Kuruş cinsinden tutar (34.56 TL → 3456). */
  paymentAmount: number;
  /** base64 kodlanmış sepet. */
  userBasket: string;
  noInstallment: string;
  maxInstallment: string;
  currency: string;
  testMode: string;
}

/**
 * STEP 1 — get-token imzası.
 * hashSTR = merchant_id + user_ip + merchant_oid + email + payment_amount +
 *           user_basket + no_installment + max_installment + currency + test_mode
 * token   = HMAC-SHA256(hashSTR + merchant_salt, merchant_key) → base64
 * SIRA KRİTİK: alanların sırası değişirse PayTR imzayı reddeder.
 */
export function paytrTokenHash(
  creds: PaytrCredentials,
  input: TokenHashInput,
): string {
  const hashStr =
    creds.merchantId +
    input.userIp +
    input.merchantOid +
    input.email +
    String(input.paymentAmount) +
    input.userBasket +
    input.noInstallment +
    input.maxInstallment +
    input.currency +
    input.testMode;
  return hmacBase64(hashStr + creds.merchantSalt, creds.merchantKey);
}

/**
 * STEP 2 — bildirim (callback) imzası.
 * hashSTR = merchant_oid + merchant_salt + status + total_amount
 * Beklenen değer callback'teki `hash` alanıyla birebir eşleşmeli.
 */
export function paytrCallbackHash(
  creds: PaytrCredentials,
  params: { merchantOid: string; status: string; totalAmount: string },
): string {
  const hashStr =
    params.merchantOid +
    creds.merchantSalt +
    params.status +
    params.totalAmount;
  return hmacBase64(hashStr, creds.merchantKey);
}

/** Kuruş → PayTR sepetinin beklediği "549.00" biçimi. */
export function kurusToBasketPrice(kurus: number): string {
  return (kurus / 100).toFixed(2);
}

/**
 * user_basket: [["Ürün adı","18.00",1], ...] JSON'unun base64'ü.
 * Fiyat string, adet integer olmalı.
 */
export function encodeBasket(
  items: { name: string; priceKurus: number; qty: number }[],
): string {
  const basket = items.map((i) => [
    i.name,
    kurusToBasketPrice(i.priceKurus),
    i.qty,
  ]);
  return Buffer.from(JSON.stringify(basket), "utf8").toString("base64");
}
