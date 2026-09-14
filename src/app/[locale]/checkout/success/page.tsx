import { CheckCircle2, Clock4, XCircle } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPaytrCredentials, queryPaytrStatus } from "@/lib/paytr";
import { markOrderPaid } from "@/lib/orders/mark-paid";
import { ClearCart } from "@/components/cart/clear-cart";
import { OrderSummary, type OrderView } from "@/components/order/order-summary";
import { PurchaseTracker } from "@/components/order/purchase-tracker";
import type { OrderStatus } from "@/lib/orders/status";

interface OrderRow {
  id: string;
  order_number: string;
  email: string;
  sender_email: string | null;
  sender_name: string | null;
  sender_phone: string | null;
  amount_total: number;
  items: { name: string; qty: number; amount: number }[];
  delivery_date: string | null;
  delivery_window: string | null;
  gift_note: string | null;
  recipient_name: string | null;
  recipient_phone: string | null;
  recipient_address: string | null;
  status: OrderStatus;
  created_at: string;
}

/** Bu süreden önce yalnızca webhook'u bekleriz (genelde saniyeler içinde
 * düşer). Aktif sorguyu erken/gereksiz yere PayTR'ye açmamak için. */
const ACTIVE_CHECK_AFTER_MS = 15_000;
/** Bu süreden sonra aktif sorguyu da bırakırız — muhtemelen ödeme hiç
 * tamamlanmadı, sonsuz otomatik yenilemeyle kaynak tüketmeye gerek yok. */
const GIVE_UP_AFTER_MS = 3 * 60_000;

/**
 * Ödeme dönüş sayfası. PayTR, merchant_ok_url/merchant_fail_url olarak buraya
 * yönlendirir; ödemenin gerçek sonucu ise sunucudan sunucuya gelen bildirimle
 * (/api/paytr/callback) yazılır. Bu yüzden sayfa, siparişin veritabanındaki
 * güncel durumunu okur ve ona göre mesaj gösterir.
 *
 * Erişim modeli: merchant_oid tahmin edilemez rastgele bir değer; onu bilmek
 * = siparişi görme yetkisi (misafir siparişleri de görüntülenebilsin diye
 * service-role istemcisi kullanılıyor, tıpkı eski Stripe session_id akışı gibi).
 */
export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ merchant_oid?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("success");
  const { merchant_oid } = await searchParams;

  let row: OrderRow | null = null;
  // Webhook'un gecikip müşteriyi süresiz "onaylanıyor" ekranında bırakmasını
  // önlemek için — bkz. dosya başındaki eşik sabitleri ve queryPaytrStatus.
  let gaveUpWaiting = false;

  if (merchant_oid) {
    const admin = createAdminClient();
    if (admin) {
      const { data } = await admin
        .from("orders")
        .select(
          "id, order_number, email, sender_email, sender_name, sender_phone, amount_total, items, delivery_date, delivery_window, gift_note, recipient_name, recipient_phone, recipient_address, status, created_at",
        )
        .eq("paytr_merchant_oid", merchant_oid)
        .maybeSingle<OrderRow>();
      row = data ?? null;

      if (row && row.status === "pending") {
        const ageMs = Date.now() - new Date(row.created_at).getTime();
        if (ageMs >= GIVE_UP_AFTER_MS) {
          gaveUpWaiting = true;
        } else if (ageMs >= ACTIVE_CHECK_AFTER_MS) {
          const creds = getPaytrCredentials();
          if (creds) {
            const result = await queryPaytrStatus(creds, merchant_oid);
            if (result === "paid") {
              const { error } = await markOrderPaid(admin, row);
              if (error) {
                console.error("[checkout/success] mark paid failed", error);
              } else {
                row = { ...row, status: "paid" };
              }
            }
          }
        }
      }
    }
  }

  const order: OrderView | null = row
    ? {
        ref: row.order_number,
        items: (row.items ?? []).map((item) => ({
          name: item.name || t("fallbackItem"),
          qty: item.qty,
          amount: item.amount,
        })),
        totalKurus: row.amount_total,
        deliveryDate: row.delivery_date || undefined,
        deliveryWindow: row.delivery_window || undefined,
        giftNote: row.gift_note || undefined,
        recipientName: row.recipient_name,
        recipientPhone: row.recipient_phone,
        recipientAddress: row.recipient_address,
      }
    : null;

  const status = row?.status ?? "paid";
  const isPending = status === "pending";
  const isFailed = status === "cancelled";
  // Yalnızca müşterinin gerçekten girdiği e-posta gösterilir (checkout,
  // e-posta boşsa telefondan türetilmiş bir yedek adres üretiyor).
  const email = row?.sender_email || null;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
      {/* Ödeme başarısızsa sepet korunur ki müşteri tekrar deneyebilsin. */}
      {!isFailed && <ClearCart />}

      {/* Bildirim (callback) birkaç saniye içinde düşer; sayfayı tazele.
          GIVE_UP_AFTER_MS'i geçtiysek otomatik yenilemeyi durdururuz —
          bkz. pendingText/pendingTextLong. */}
      {isPending && !gaveUpWaiting && <meta httpEquiv="refresh" content="4" />}

      {isPending ? (
        <Clock4 size={64} strokeWidth={1.4} className="mx-auto text-amber-500" />
      ) : isFailed ? (
        <XCircle size={64} strokeWidth={1.4} className="mx-auto text-rose-700" />
      ) : (
        <CheckCircle2
          size={64}
          strokeWidth={1.4}
          className="mx-auto text-leaf-500"
        />
      )}

      <h1 className="mt-5 font-serif text-3xl text-ink">
        {isPending
          ? t("pendingTitle")
          : isFailed
            ? t("cancelledTitle")
            : t("title")}
      </h1>
      <p className="mt-3 text-ink-muted">
        {isPending ? (
          gaveUpWaiting ? t("pendingTextLong") : t("pendingText")
        ) : isFailed ? (
          t("cancelledText")
        ) : (
          <>
            {t("thanks")}
            {email && <> {t("emailSent", { email })}</>}
          </>
        )}
      </p>

      {order && !isFailed && <OrderSummary order={order} />}
      {order && !isPending && !isFailed && (
        <PurchaseTracker
          transactionId={order.ref}
          valueTRY={order.totalKurus !== null ? order.totalKurus / 100 : 0}
          items={order.items}
        />
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {isFailed && (
          <Link
            href="/sepet"
            className="inline-block rounded-full bg-rose-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-900"
          >
            {t("backToCart")}
          </Link>
        )}
        <Link
          href="/"
          className={`inline-block rounded-full px-6 py-3 text-sm font-medium transition-colors ${
            isFailed
              ? "border border-line text-ink hover:border-blush-300 hover:text-rose-700"
              : "bg-rose-700 text-white hover:bg-rose-900"
          }`}
        >
          {t("continueShopping")}
        </Link>
      </div>
    </div>
  );
}
