/**
 * Hafif, bağımlılıksız hız sınırlayıcı (in-memory, sabit pencere).
 *
 * Neden yeni bir paket / Redis / Vercel KV yok:
 *  - Vercel KV ayrı (ücretli olabilen) altyapı gerektirir; kısıtlar bunu
 *    "önemsiz eklenebiliyorsa" diye şarta bağladı, önemsiz değil.
 *  - Bu vitrin trafiği düşük; süreç-içi bir sayaç, brute-force ve spam'ı
 *    pratikte kesmeye yeter.
 *
 * SINIR (bilerek kabul edildi): sayaç her serverless örneğinde ayrı tutulur.
 * Vercel birden çok lambda örneği açarsa efektif limit örnek sayısıyla çarpılır.
 * Yine de "sınırsız"dan çok daha iyidir ve kalıcı depo gerektirmez. Daha katı
 * dağıtık bir limit gerekirse ileride Upstash/Vercel KV'ye taşınabilir.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

// Anahtar başına pencere durumu. Modül düzeyinde yaşar; sıcak lambda boyunca
// kalıcıdır, soğuk başlangıçta sıfırlanır (kabul edilebilir).
const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  /** Kalan deneme (bu pencerede). */
  remaining: number;
  /** Pencerenin sıfırlanacağı zaman (ms, epoch). */
  resetAt: number;
  /** Retry-After başlığı için saniye (yalnızca ok=false iken anlamlı). */
  retryAfter: number;
}

/**
 * Belirtilen anahtar için bir isteği kaydeder ve limit içinde olup olmadığını
 * döner.
 *
 * @param key     Sınırlanacak birim (örn. "signin:1.2.3.4:user@x.com").
 * @param limit   Pencere başına izin verilen istek sayısı.
 * @param windowMs Pencere uzunluğu (ms).
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    // Yeni pencere.
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    maybeSweep(now);
    return { ok: true, remaining: limit - 1, resetAt, retryAfter: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return {
      ok: false,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  return {
    ok: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
    retryAfter: 0,
  };
}

// Süresi dolmuş kayıtları ara sıra temizle ki Map sınırsız büyümesin.
let lastSweep = 0;
function maybeSweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(k);
  }
}

/**
 * Bir Request'ten istemci IP'sini çıkarır. Vercel/proxy arkasında gerçek IP
 * `x-forwarded-for` başlığının ilk değeridir.
 */
export function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
