import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const isDev = process.env.NODE_ENV === "development";

// Supabase REST/Realtime/Storage origini (connect-src için). Ortam değişkeni
// yoksa tüm *.supabase.co alt alan adlarına izin ver.
const supabaseHost = (() => {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return url ? new URL(url).origin : "https://*.supabase.co";
  } catch {
    return "https://*.supabase.co";
  }
})();

// Content-Security-Policy.
//
// Nonce tabanlı bir CSP tüm sayfaları dinamik render'a zorlar (statik vitrin
// için gereksiz maliyet) ve bu Next sürümünde middleware/proxy'ye ek tel
// çekmek gerektirir. Bunun yerine dokümante edilmiş "nonce'suz" yaklaşımı
// kullanıyoruz: script/style için 'unsafe-inline' (Next satır içi bootstrap
// script'leri ve Tailwind satır içi stilleri için gerekli), ama geri kalan her
// şey kilitli — object-src 'none', frame-ancestors 'none', base-uri 'self',
// form-action 'self', connect-src yalnızca self + Supabase.
//
// Not: Stripe tarayıcıda GÖMÜLÜ DEĞİL (Stripe.js yok, sadece sunucu tarafı +
// hosted Checkout'a redirect), o yüzden script-src/connect-src'e Stripe alanı
// eklemeye gerek yok. Fontlar self-hosted (font-src 'self').
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob:`,
  `font-src 'self'`,
  `connect-src 'self' ${supabaseHost}${isDev ? " ws:" : ""}`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `frame-src 'none'`,
  `upgrade-insecure-requests`,
].join("; ").concat(";");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Site hiçbir yerde iframe içine gömülmüyor; clickjacking'e karşı kilitle.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // Sunucu yazılımını ifşa eden "X-Powered-By: Next.js" başlığını kaldır.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

// next-intl: request config'i (src/i18n/request.ts) bağlar. Mevcut güvenlik
// başlıkları, CSP ve poweredByHeader ayarları olduğu gibi korunur — plugin
// yalnızca çeviri altyapısını sarmalar.
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
