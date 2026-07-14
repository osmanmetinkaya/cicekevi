import { CalendarDays, Clock4, Gift, MapPin, UserRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatDate, formatKurus } from "@/lib/format";

export interface OrderView {
  ref: string;
  items: { name: string; qty: number; amount: number }[];
  totalKurus: number | null;
  deliveryDate?: string;
  deliveryWindow?: string;
  giftNote?: string;
  recipientName?: string | null;
  recipientPhone?: string | null;
  recipientAddress?: string | null;
}

export function OrderSummary({ order }: { order: OrderView }) {
  const t = useTranslations("orderSummary");
  const locale = useLocale();
  const hasDelivery = order.deliveryDate || order.deliveryWindow;

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white text-left">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <span className="font-serif text-lg text-ink">{t("title")}</span>
        <span className="text-xs text-ink-muted">#{order.ref}</span>
      </div>

      {/* Ürünler */}
      <ul className="divide-y divide-line px-5">
        {order.items.map((item, i) => (
          <li key={i} className="flex items-center justify-between gap-3 py-3">
            <span className="text-sm text-ink">
              {item.name}
              <span className="text-ink-muted"> × {item.qty}</span>
            </span>
            <span className="shrink-0 text-sm font-medium text-leaf-600">
              {formatKurus(item.amount)}
            </span>
          </li>
        ))}
      </ul>

      {order.totalKurus !== null && (
        <div className="flex items-center justify-between border-t border-line px-5 py-4">
          <span className="font-medium text-ink">{t("total")}</span>
          <span className="font-serif text-2xl text-ink">
            {formatKurus(order.totalKurus)}
          </span>
        </div>
      )}

      {/* Teslimat + hediye */}
      {(hasDelivery ||
        order.giftNote ||
        order.recipientName ||
        order.recipientAddress) && (
        <div className="space-y-3 border-t border-line bg-cream px-5 py-4">
          {order.recipientName && (
            <Row Icon={UserRound} label={t("recipient")}>
              {order.recipientName}
              {order.recipientPhone && ` · ${order.recipientPhone}`}
            </Row>
          )}
          {order.recipientAddress && (
            <Row Icon={MapPin} label={t("recipientAddress")}>
              {order.recipientAddress}
            </Row>
          )}
          {order.deliveryDate && (
            <Row Icon={CalendarDays} label={t("deliveryDate")}>
              {formatDate(order.deliveryDate, locale)}
            </Row>
          )}
          {order.deliveryWindow && (
            <Row Icon={Clock4} label={t("timeWindow")}>
              {order.deliveryWindow}
            </Row>
          )}
          {order.giftNote && (
            <Row Icon={Gift} label={t("giftNote")}>
              <span className="font-serif italic text-ink">
                “{order.giftNote}”
              </span>
            </Row>
          )}
        </div>
      )}
    </div>
  );
}

function Row({
  Icon,
  label,
  children,
}: {
  Icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 text-sm">
      <Icon size={17} className="mt-0.5 shrink-0 text-leaf-500" />
      <div>
        <span className="block text-xs text-ink-muted">{label}</span>
        <span className="text-ink">{children}</span>
      </div>
    </div>
  );
}
