# Çiçek & Co. 🌸

İstanbul içi aynı gün teslimatlı çiçekçi e-ticaret sitesi. Soft & romantik
tasarım dili, durum-bazlı navigasyon, sepet ve Stripe ile ödeme.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first tema, `src/app/globals.css`)
- **Stripe Checkout** (ödeme) — webhook doğrulamalı
- Sepet: React Context + `localStorage` (`src/components/cart`)

> Not: Ürün kataloğu şimdilik `src/lib/products.ts` içinde statik. Supabase
> (ürün/sipariş/stok + üyelik) sonraki fazda eklenecek.

## Kurulum

```bash
npm install
cp .env.example .env.local   # anahtarları doldur
npm run dev                  # http://localhost:3000
```

### Stripe'ı etkinleştirme (test modu)

1. https://dashboard.stripe.com/test/apikeys adresinden test anahtarlarını al.
2. `.env.local` içine `STRIPE_SECRET_KEY` ve
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` gir.
3. Webhook'ları yerelde dinlemek için:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Çıktıdaki `whsec_...` değerini `STRIPE_WEBHOOK_SECRET` olarak ekle.
4. Test kartı: `4242 4242 4242 4242`, herhangi bir ileri tarih ve CVC.

Anahtar girilmeden site tümüyle gezilebilir; yalnızca "Ödemeye geç" adımı
"altyapı yapılandırılmadı" uyarısı verir.

## Mimari notları

- **Fiyatlar kuruş cinsinden integer** tutulur (`priceKurus`) — para matematiği
  hatasız kalsın diye.
- **Checkout sunucu tarafında fiyat doğrular**: istemciden gelen fiyatlara asla
  güvenilmez, her satır `src/lib/products.ts`'ten yeniden çözülür
  (`src/app/api/checkout/route.ts`).
- **Webhook-first**: ödeme durumu için Stripe olayları kaynak alınır, imza
  doğrulanır (`src/app/api/webhooks/stripe/route.ts`).
- Ürün görselleri şimdilik renkli placeholder (`src/components/product/artwork.tsx`);
  gerçek fotoğraflar `next/image` ile aynı oranı koruyarak takılabilir.

## Yol haritası

- [ ] Gerçek ürün fotoğrafları
- [ ] Supabase: ürün/sipariş kalıcılığı + üyelik
- [ ] Teslimat tarihi & saat penceresi seçimi
- [ ] Çiçek aboneliği (Stripe Subscriptions)
- [ ] Sipariş onay e-postası
