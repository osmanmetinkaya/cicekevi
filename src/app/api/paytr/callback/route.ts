import { createAdminClient } from "@/lib/supabase/admin";
import { getPaytrCredentials, paytrCallbackHash } from "@/lib/paytr";

/**
 * PayTR bildirim (callback) URL'i — SUNUCUDAN SUNUCUYA POST.
 *
 * Bu adres kod içinde PayTR'e gönderilmez; mağaza panelinde "Bildirim URL"
 * olarak tanımlanır:  https://denizlicicekevi.online/api/paytr/callback
 *
 * KURALLAR (PayTR dokümanı):
 *  - Yanıt SADECE düz metin "OK" olmalı; öncesinde/sonrasında hiçbir çıktı
 *    olmamalı. Aksi halde PayTR bildirimi başarısız sayar.
 *  - Route asla 500 vermemeli; hata durumunda bile "OK" dönüp loglanır
 *    (aksi halde PayTR sonsuz retry yapar).
 *  - Aynı ödeme için birden fazla bildirim gelebilir → merchant_oid bazında
 *    idempotent davranılır.
 *  - Bu yol auth/middleware kapsamı dışında (middleware matcher'ı /api'yi
 *    hariç tutuyor).
 */

/** Tek çıkış noktası: her koşulda düz metin "OK". */
function ok(): Response {
  return new Response("OK", {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const merchantOid = String(form.get("merchant_oid") ?? "");
    const status = String(form.get("status") ?? "");
    const totalAmount = String(form.get("total_amount") ?? "");
    const hash = String(form.get("hash") ?? "");

    if (!merchantOid) {
      console.error("[paytr/callback] merchant_oid missing");
      return ok();
    }

    const creds = getPaytrCredentials();
    if (!creds) {
      console.error("[paytr/callback] PAYTR_* env vars not configured");
      return ok();
    }

    // Hash doğrulaması ZORUNLU: doğrulanmamış bildirimle sipariş "ödendi"
    // işaretlenirse mali kayıp riski var.
    const expected = paytrCallbackHash(creds, {
      merchantOid,
      status,
      totalAmount,
    });
    if (expected !== hash) {
      console.error("[paytr/callback] hash mismatch — ignoring", {
        merchantOid,
      });
      return ok();
    }

    const admin = createAdminClient();
    if (!admin) {
      console.error("[paytr/callback] supabase admin client unavailable");
      return ok();
    }

    const { data: order, error: selectError } = await admin
      .from("orders")
      .select("id, status, amount_total")
      .eq("paytr_merchant_oid", merchantOid)
      .maybeSingle();

    if (selectError) {
      console.error("[paytr/callback] order lookup failed", selectError);
      return ok();
    }
    if (!order) {
      console.error("[paytr/callback] order not found", { merchantOid });
      return ok();
    }

    // Idempotent: ikinci/üçüncü bildirimde tekrar işlem yapma.
    if (order.status !== "pending") {
      return ok();
    }

    if (status === "success") {
      // Tutar uyuşmazlığı ödeme akışını durdurmaz (taksit komisyonu gibi
      // durumlarda total_amount farklı olabilir) ama izlenebilir olsun.
      const paid = Number(totalAmount);
      if (Number.isFinite(paid) && paid !== order.amount_total) {
        console.warn("[paytr/callback] amount mismatch", {
          merchantOid,
          expected: order.amount_total,
          paid,
        });
      }
      const { error } = await admin
        .from("orders")
        .update({ status: "paid" })
        .eq("id", order.id);
      if (error) console.error("[paytr/callback] mark paid failed", error);
    } else {
      console.warn("[paytr/callback] payment failed", {
        merchantOid,
        code: form.get("failed_reason_code"),
        msg: form.get("failed_reason_msg"),
      });
      const { error } = await admin
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", order.id);
      if (error) console.error("[paytr/callback] mark cancelled failed", error);
    }
  } catch (err) {
    // Hiçbir koşulda crash/500 verme — PayTR sonsuz retry yapar.
    console.error("[paytr/callback] unexpected error", err);
  }

  return ok();
}
