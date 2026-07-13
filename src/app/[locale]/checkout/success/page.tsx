import { CheckCircle2 } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getStripe } from "@/lib/stripe";
import { ClearCart } from "@/components/cart/clear-cart";
import { OrderSummary, type OrderView } from "@/components/order/order-summary";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("success");
  const { session_id } = await searchParams;

  let email: string | null = null;
  let order: OrderView | null = null;

  if (session_id && process.env.STRIPE_SECRET_KEY) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(session_id, {
        expand: ["line_items"],
      });
      const md = session.metadata ?? {};
      email = session.customer_details?.email ?? null;
      order = {
        ref: session.id.slice(-8).toUpperCase(),
        items: (session.line_items?.data ?? []).map((li) => ({
          name: li.description ?? t("fallbackItem"),
          qty: li.quantity ?? 1,
          amount: li.amount_total ?? 0,
        })),
        totalKurus: session.amount_total,
        deliveryDate: md.delivery_date || undefined,
        deliveryWindow: md.delivery_window || undefined,
        giftNote: md.gift_note || undefined,
        recipientName: session.customer_details?.name ?? null,
      };
    } catch {
      // Stale or invalid session id — show a generic confirmation.
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
      <ClearCart />
      <CheckCircle2 size={64} strokeWidth={1.4} className="mx-auto text-leaf-500" />
      <h1 className="mt-5 font-serif text-3xl text-ink">{t("title")}</h1>
      <p className="mt-3 text-ink-muted">
        {t("thanks")}
        {email && <> {t("emailSent", { email })}</>}
      </p>

      {order && <OrderSummary order={order} />}

      <Link
        href="/"
        className="mt-10 inline-block rounded-full bg-rose-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-900"
      >
        {t("continueShopping")}
      </Link>
    </div>
  );
}
