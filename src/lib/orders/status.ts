export const ORDER_STATUSES = [
  "paid",
  "preparing",
  "on_delivery",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  paid: "Ödendi",
  preparing: "Hazırlanıyor",
  on_delivery: "Yolda",
  delivered: "Teslim edildi",
  cancelled: "İptal",
};

/** Rozet renkleri — tasarım paletiyle uyumlu. */
export const STATUS_STYLES: Record<OrderStatus, string> = {
  paid: "bg-blush-100 text-rose-700",
  preparing: "bg-amber-100 text-amber-800",
  on_delivery: "bg-blue-100 text-blue-800",
  delivered: "bg-leaf-400/30 text-leaf-600",
  cancelled: "bg-cream-deep text-ink-muted",
};

export function isOrderStatus(v: string): v is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(v);
}
