import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import type Stripe from "stripe";

/** Ödemesi tamamlanan oturumu orders tablosuna yazar (varsa). */
async function persistOrder(session: Stripe.Checkout.Session) {
  const admin = createAdminClient();
  if (!admin) {
    console.warn("[webhook] supabase not configured — order not persisted");
    return;
  }

  // Satır kalemleri webhook payload'ında gelmez; ayrıca çekilir.
  const lineItems = await getStripe().checkout.sessions.listLineItems(
    session.id,
    { limit: 100 },
  );

  const md = session.metadata ?? {};
  const { error } = await admin.from("orders").insert({
    user_id: md.user_id || null,
    email: session.customer_details?.email ?? "",
    stripe_session_id: session.id,
    // Checkout API tarafından rezerve edilir; metadata hiç gelmezse (ör.
    // bu özellikten önce açılmış eski bir oturum) sipariş numarasız kalmasın.
    order_number: md.order_number || `DC-${session.id.slice(-8).toUpperCase()}`,
    amount_total: session.amount_total ?? 0,
    currency: session.currency ?? "try",
    items: lineItems.data.map((li) => ({
      name: li.description ?? "Ürün",
      qty: li.quantity ?? 1,
      amount: li.amount_total ?? 0,
    })),
    delivery_date: md.delivery_date || null,
    delivery_window: md.delivery_window || null,
    gift_note: md.gift_note || null,
    sender_name: md.sender_name || null,
    sender_phone: md.sender_phone || null,
    sender_email: md.sender_email || null,
    recipient_name: md.recipient_name || null,
    recipient_phone: md.recipient_phone || null,
    recipient_address: md.recipient_address || null,
  });

  // unique(stripe_session_id) sayesinde tekrar denemeler idempotent;
  // duplicate hatası sessizce yutulur, diğer hatalar loglanır.
  if (error && error.code !== "23505") {
    console.error("[webhook] order insert failed", error);
    throw new Error("order insert failed");
  }
}

// Webhook-first: treat Stripe events as the source of truth for payment
// state, not the API response the browser saw.
export async function POST(request: Request) {
  // İmza doğrulaması ZATEN sahte istekleri reddeder; bu limit yalnızca kaba bir
  // flood/DoS emniyet valfidir. Gerçek Stripe trafiği (az sayıda IP, makul hız)
  // bu tavanın çok altında kalır. Cömert tutuldu ki meşru retry'lar kesilmesin.
  const ip = clientIp(request);
  const limit = rateLimit(`webhook:${ip}`, 100, 60_000);
  if (!limit.ok) {
    return new Response("Too many requests", {
      status: 429,
      headers: { "Retry-After": String(limit.retryAfter) },
    });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not set");
    return new Response("Webhook not configured", { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  // The raw body is required for signature verification — never parse it first.
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = await getStripe().webhooks.constructEventAsync(
      payload,
      signature,
      secret,
    );
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("[webhook] order paid", {
        id: session.id,
        amount_total: session.amount_total,
        email: session.customer_details?.email,
      });
      try {
        await persistOrder(session);
      } catch {
        // 500 dön ki Stripe yeniden denesin (insert idempotent).
        return new Response("persist failed", { status: 500 });
      }
      break;
    }
    case "checkout.session.expired":
      console.log("[webhook] checkout expired", event.data.object.id);
      break;
    default:
      // Acknowledge unhandled events so Stripe stops retrying.
      break;
  }

  return Response.json({ received: true });
}
