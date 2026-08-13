import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getProductById } from "@/lib/products";
import { pick, type Locale } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { DELIVERY_WINDOWS } from "@/lib/delivery";
import { isValidPhone, digitsOnly } from "@/lib/phone";
import {
  PAYTR_TOKEN_URL,
  encodeBasket,
  getPaytrCredentials,
  newMerchantOid,
  paytrTokenHash,
} from "@/lib/paytr";

interface IncomingItem {
  id: string;
  qty: number;
}

interface IncomingDelivery {
  date?: string;
  window?: string;
}

interface IncomingSender {
  name?: string;
  phone?: string;
  email?: string;
}

interface IncomingRecipient {
  name?: string;
  phone?: string;
  address?: string;
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanSender(
  s: IncomingSender | undefined,
): { name: string; phone: string; email: string } | null {
  const name = typeof s?.name === "string" ? s.name.trim().slice(0, 120) : "";
  const phone = typeof s?.phone === "string" ? digitsOnly(s.phone) : "";
  const email = typeof s?.email === "string" ? s.email.trim().slice(0, 200) : "";
  if (!name || !isValidPhone(phone)) return null;
  if (email && !EMAIL_RE.test(email)) return null;
  return { name, phone, email };
}

function cleanRecipient(
  r: IncomingRecipient | undefined,
): { name: string; phone: string; address: string } | null {
  const name = typeof r?.name === "string" ? r.name.trim().slice(0, 120) : "";
  const phone = typeof r?.phone === "string" ? digitsOnly(r.phone) : "";
  const address =
    typeof r?.address === "string" ? r.address.trim().slice(0, 400) : "";
  if (!name || !isValidPhone(phone) || !address) return null;
  return { name, phone, address };
}

function siteUrl(request: Request): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin
  ).replace(/\/$/, "");
}

/** Okunabilir sipariş numarası (ör. DC-1042), Postgres sequence üzerinden
 * rezerve edilir. RPC başarısız olursa rastgele bir yedek üretilir ki
 * sipariş numarasız kalmasın.
 *
 * NOT: Bu değer müşteriye gösterilen SIRALI numaradır; PayTR'e giden
 * merchant_oid ile aynı olmamalı (tahmin edilebilir olurdu). */
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
  // Hız sınırı: aynı IP dakikada en fazla 10 ödeme oturumu başlatabilir.
  // Token alma maliyet/suistimal riskidir; spam'i keser.
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
    sender?: IncomingSender;
    recipient?: IncomingRecipient;
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

  const locale: Locale = body.locale === "en" ? "en" : "tr";

  const delivery = cleanDelivery(body.delivery);
  const giftNote =
    typeof body.giftNote === "string" ? body.giftNote.trim().slice(0, 400) : "";

  // Gönderen ve alıcı bilgileri bizim formumuzdan geliyor — istemci tarafı
  // atlatılabileceği için sunucuda da doğrulanır.
  const sender = cleanSender(body.sender);
  if (!sender) {
    return NextResponse.json(
      { error: "Gönderen adı ve telefon numarasını eksiksiz gir." },
      { status: 400 },
    );
  }
  const recipient = cleanRecipient(body.recipient);
  if (!recipient) {
    return NextResponse.json(
      { error: "Alıcı adı, telefon numarası ve adresini eksiksiz gir." },
      { status: 400 },
    );
  }

  // Never trust client-supplied prices: resolve every line from our own
  // catalogue and build the amounts server-side.
  const orderItems: { name: string; qty: number; amount: number }[] = [];
  const basketItems: { name: string; priceKurus: number; qty: number }[] = [];
  let amountTotal = 0;
  for (const item of items) {
    // Fiyat DAİMA sunucuda, veritabanındaki katalogdan çözülür.
    const product = await getProductById(item.id);
    const qty = Math.floor(Number(item.qty));
    if (!product || !Number.isFinite(qty) || qty < 1 || qty > 50) {
      return NextResponse.json(
        { error: "Sepette geçersiz bir ürün var." },
        { status: 400 },
      );
    }
    const name = pick(product.name, locale);
    amountTotal += product.priceKurus * qty;
    orderItems.push({ name, qty, amount: product.priceKurus * qty });
    basketItems.push({ name, priceKurus: product.priceKurus, qty });
  }

  const creds = getPaytrCredentials();
  if (!creds) {
    return NextResponse.json(
      { error: "Ödeme altyapısı henüz yapılandırılmadı (PAYTR_*)." },
      { status: 503 },
    );
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Sipariş altyapısı henüz yapılandırılmadı." },
      { status: 503 },
    );
  }

  const base = siteUrl(request);
  // Locale öneki: tr (varsayılan) kök URL'de, en /en altında.
  const localePrefix = locale === "en" ? "/en" : "";

  // Girişli kullanıcıyı siparişe bağla.
  let userId = "";
  let userEmail = "";
  const supabase = isSupabaseConfigured() ? await createClient() : null;
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
      userEmail = user.email ?? "";
    }
  }

  const orderNumber = await nextOrderNumber(supabase);
  const merchantOid = newMerchantOid();

  // PayTR e-posta alanını zorunlu tutar; gönderen e-postası isteğe bağlı
  // olduğundan boşsa telefon numarasından türetilmiş bir yedek kullanılır.
  const email = (
    sender.email ||
    userEmail ||
    `${sender.phone}@misafir.denizlicicekevi.online`
  ).slice(0, 100);

  // PayTR bizim gönderdiğimiz metadata'yı callback'te geri yansıtmadığı için
  // sipariş detayları ödeme BAŞLAMADAN önce kendi tablomuza yazılır; callback
  // geldiğinde yalnızca status güncellenir.
  const { error: insertError } = await admin.from("orders").insert({
    user_id: userId || null,
    email,
    payment_provider: "paytr",
    paytr_merchant_oid: merchantOid,
    order_number: orderNumber,
    amount_total: amountTotal,
    currency: "try",
    items: orderItems,
    delivery_date: delivery?.date || null,
    delivery_window: delivery?.window || null,
    gift_note: giftNote || null,
    sender_name: sender.name,
    sender_phone: sender.phone,
    sender_email: sender.email || null,
    recipient_name: recipient.name,
    recipient_phone: recipient.phone,
    recipient_address: recipient.address,
    status: "pending",
  });

  if (insertError) {
    console.error("[paytr/checkout] order insert failed", insertError);
    return NextResponse.json(
      { error: "Sipariş oluşturulamadı. Lütfen tekrar dene." },
      { status: 500 },
    );
  }

  /** Ödeme başlatılamazsa yarım kalan pending satırı temizle (best-effort). */
  async function cleanupPendingOrder() {
    try {
      const { error } = await admin!
        .from("orders")
        .delete()
        .eq("paytr_merchant_oid", merchantOid)
        .eq("status", "pending");
      if (error) console.error("[paytr/checkout] cleanup failed", error);
    } catch (err) {
      console.error("[paytr/checkout] cleanup threw", err);
    }
  }

  const userBasket = encodeBasket(basketItems);
  const noInstallment = "0";
  const maxInstallment = "0";
  const currency = "TL";
  // Mağaza PayTR'de canlı moda alındı — gerçek ödemeler için "0".
  const testMode = "0";

  const paytrToken = paytrTokenHash(creds, {
    merchantOid,
    userIp: ip,
    email,
    paymentAmount: amountTotal,
    userBasket,
    noInstallment,
    maxInstallment,
    currency,
    testMode,
  });

  const okUrl = `${base}${localePrefix}/checkout/success?merchant_oid=${merchantOid}`;

  const form = new URLSearchParams({
    merchant_id: creds.merchantId,
    user_ip: ip.slice(0, 39),
    merchant_oid: merchantOid,
    email,
    payment_amount: String(amountTotal),
    user_basket: userBasket,
    no_installment: noInstallment,
    max_installment: maxInstallment,
    currency,
    user_name: sender.name.slice(0, 60),
    user_address: recipient.address.slice(0, 400),
    user_phone: sender.phone.slice(0, 20),
    merchant_ok_url: okUrl.slice(0, 400),
    merchant_fail_url: okUrl.slice(0, 400),
    test_mode: testMode,
    debug_on: "1",
    timeout_limit: "30",
    lang: locale === "en" ? "en" : "tr",
    paytr_token: paytrToken,
  });

  try {
    const res = await fetch(PAYTR_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      cache: "no-store",
    });

    const data: unknown = await res.json();
    const result = data as { status?: string; token?: string; reason?: string };

    if (result.status !== "success" || !result.token) {
      console.error("[paytr/checkout] get-token failed", {
        status: result.status,
        reason: result.reason,
      });
      await cleanupPendingOrder();
      return NextResponse.json(
        { error: "Ödeme başlatılamadı. Lütfen tekrar dene." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      token: result.token,
      merchantOid,
      orderNumber,
    });
  } catch (err) {
    console.error("[paytr/checkout] get-token request error", err);
    await cleanupPendingOrder();
    return NextResponse.json(
      { error: "Ödeme başlatılamadı. Lütfen tekrar dene." },
      { status: 502 },
    );
  }
}
