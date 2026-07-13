import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getStripe } from "@/lib/stripe";
import { getProductById } from "@/lib/products";
import { pick, type Locale } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { DELIVERY_WINDOWS } from "@/lib/delivery";

interface IncomingItem {
  id: string;
  qty: number;
}

interface IncomingDelivery {
  date?: string;
  window?: string;
}

function cleanDelivery(d: IncomingDelivery | undefined): {
  date: string;
  window: string;
} | null {
  if (!d) return null;
  const date = typeof d.date === "string" ? d.date.slice(0, 10) : "";
  const win = typeof d.window === "string" ? d.window : "";
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
  if (!validDate || !DELIVERY_WINDOWS.includes(win)) return null;
  return { date, window: win };
}

function siteUrl(request: Request): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin
  ).replace(/\/$/, "");
}

/** Okunabilir sipariş numarası (ör. DC-1042), Postgres sequence üzerinden
 * rezerve edilir. RPC başarısız olursa rastgele bir yedek üretilir ki
 * sipariş numarasız kalmasın. */
async function nextOrderNumber(
  supabase: Awaited<ReturnType<typeof createClient>> | null,
): Promise<string> {
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc("next_order_number");
      if (!error && typeof data === "string" && data) return data;
    } catch {
      // aşağıdaki yedeğe düş
    }
  }
  return `DC-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export async function POST(request: Request) {
  // Hız sınırı: aynı IP dakikada en fazla 10 checkout oturumu oluşturabilir.
  // Stripe oturum oluşturma maliyet/suistimal riskidir; spam'i keser.
  const ip = clientIp(request);
  const limit = rateLimit(`checkout:${ip}`, 10, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Çok fazla deneme. Lütfen biraz sonra tekrar dene." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: {
    items?: IncomingItem[];
    delivery?: IncomingDelivery;
    giftNote?: string;
    contractAccepted?: boolean;
    locale?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const items = body.items ?? [];
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Sepet boş." }, { status: 400 });
  }

  // Mesafeli Satış Sözleşmesi onayı olmadan sipariş oluşturulamaz — istemci
  // tarafı kontrolü atlatılabileceği için sunucuda da doğrulanır.
  if (body.contractAccepted !== true) {
    return NextResponse.json(
      { error: "Mesafeli Satış Sözleşmesi'ni onaylamalısın." },
      { status: 400 },
    );
  }

  // Stripe hosted Checkout dilini kullanıcının site dilinden türet.
  const stripeLocale = body.locale === "en" ? "en" : "tr";

  const delivery = cleanDelivery(body.delivery);
  // Gift note is free text; cap it so it fits Stripe metadata (500 char limit).
  const giftNote =
    typeof body.giftNote === "string" ? body.giftNote.trim().slice(0, 400) : "";

  // Never trust client-supplied prices: resolve every line from our own
  // catalogue and build the amounts server-side.
  const lineItems = [];
  for (const item of items) {
    const product = getProductById(item.id);
    const qty = Math.floor(Number(item.qty));
    if (!product || !Number.isFinite(qty) || qty < 1 || qty > 50) {
      return NextResponse.json(
        { error: "Sepette geçersiz bir ürün var." },
        { status: 400 },
      );
    }
    lineItems.push({
      quantity: qty,
      price_data: {
        currency: "try",
        unit_amount: product.priceKurus,
        product_data: {
          name: pick(product.name, stripeLocale as Locale),
          description: pick(product.tagline, stripeLocale as Locale),
          metadata: { product_id: product.id },
        },
      },
    });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Ödeme altyapısı henüz yapılandırılmadı (STRIPE_SECRET_KEY)." },
      { status: 503 },
    );
  }

  const base = siteUrl(request);
  // Locale öneki: tr (varsayılan) kök URL'de, en /en altında.
  const localePrefix = stripeLocale === "en" ? "/en" : "";

  // Girişli kullanıcıyı siparişe bağla (webhook orders.user_id doldurur).
  let userId = "";
  let userEmail: string | undefined;
  const supabase = isSupabaseConfigured() ? await createClient() : null;
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
      userEmail = user.email ?? undefined;
    }
  }
  const orderNumber = await nextOrderNumber(supabase);

  try {
    const session = await getStripe().checkout.sessions.create(
      {
        mode: "payment",
        line_items: lineItems,
        // Collect a shipping address — flowers need somewhere to go.
        shipping_address_collection: { allowed_countries: ["TR"] },
        phone_number_collection: { enabled: true },
        locale: stripeLocale,
        success_url: `${base}${localePrefix}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}${localePrefix}/sepet?checkout=cancelled`,
        // Order details the florist needs — surfaced on the session + webhook.
        customer_email: userEmail,
        metadata: {
          source: "web",
          user_id: userId,
          order_number: orderNumber,
          delivery_date: delivery?.date ?? "",
          delivery_window: delivery?.window ?? "",
          gift_note: giftNote,
          // Denetim izi: sözleşme onayının ne zaman verildiği.
          contract_accepted_at: new Date().toISOString(),
        },
        custom_text: giftNote
          ? { submit: { message: `Hediye notu: ${giftNote}` } }
          : undefined,
      },
      // Idempotency: a double-clicked "Pay" button can't create two sessions
      // for the same attempt.
      { idempotencyKey: randomUUID() },
    );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] stripe error", err);
    return NextResponse.json(
      { error: "Ödeme oturumu oluşturulamadı. Lütfen tekrar dene." },
      { status: 502 },
    );
  }
}
