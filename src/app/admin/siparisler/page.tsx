import Link from "next/link";
import { Gift, MapPin, Phone, Printer, StickyNote, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDateTR, formatKurus } from "@/lib/format";
import type { AdminOrderRow } from "@/lib/orders/types";
import { StatusSelect } from "@/components/admin/status-select";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select(
      "id, order_number, stripe_session_id, paytr_merchant_oid, payment_provider, email, amount_total, items, delivery_date, delivery_window, gift_note, sender_name, sender_phone, sender_email, recipient_name, recipient_phone, recipient_address, status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<AdminOrderRow[]>();

  const orders = data ?? [];

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-white p-10 text-center text-ink-muted">
        Henüz sipariş yok.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {orders.map((o) => (
        <li key={o.id} className="rounded-2xl border border-line bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-medium text-ink">
                  #{o.order_number}
                </span>
                <span className="text-sm text-ink-muted">{o.email}</span>
                <span className="text-xs text-ink-muted">
                  {new Intl.DateTimeFormat("tr-TR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(o.created_at))}
                </span>
              </div>

              <p className="mt-2 text-sm text-ink">
                {o.items
                  .map((item) => `${item.name} × ${item.qty}`)
                  .join(" · ")}
              </p>

              {(o.delivery_date || o.delivery_window) && (
                <p className="mt-1 text-sm text-ink-muted">
                  Teslimat:{" "}
                  {o.delivery_date ? formatDateTR(o.delivery_date) : "—"}
                  {o.delivery_window && ` · ${o.delivery_window}`}
                </p>
              )}

              {o.gift_note && (
                <p className="mt-1 flex items-start gap-1.5 text-sm text-ink-muted">
                  <Gift size={15} className="mt-0.5 shrink-0 text-rose-700" />
                  <span className="font-serif italic">“{o.gift_note}”</span>
                </p>
              )}

              {(o.recipient_name || o.recipient_phone || o.recipient_address) && (
                <div className="mt-3 rounded-xl bg-cream p-3">
                  <p className="text-xs font-medium text-ink-muted">Alıcı</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink">
                    <UserRound size={14} className="shrink-0 text-leaf-600" />
                    {o.recipient_name}
                    {o.recipient_phone && (
                      <span className="inline-flex items-center gap-1 text-ink-muted">
                        <Phone size={13} /> {o.recipient_phone}
                      </span>
                    )}
                  </p>
                  {o.recipient_address && (
                    <p className="mt-1 flex items-start gap-1.5 text-sm text-ink-muted">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-leaf-600" />
                      {o.recipient_address}
                    </p>
                  )}
                </div>
              )}

              {(o.sender_name || o.sender_phone) && (
                <p className="mt-2 text-xs text-ink-muted">
                  Gönderen: {o.sender_name}
                  {o.sender_phone && ` · ${o.sender_phone}`}
                  {o.sender_email && ` · ${o.sender_email}`}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="font-serif text-xl text-ink">
                {formatKurus(o.amount_total)}
              </span>
              <StatusSelect orderId={o.id} status={o.status} />
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/admin/siparisler/${o.id}/fis`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-blush-300 hover:text-rose-700"
                >
                  <Printer size={13} /> Fiş
                </Link>
                {o.gift_note && (
                  <Link
                    href={`/admin/siparisler/${o.id}/not`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-blush-300 hover:text-rose-700"
                  >
                    <StickyNote size={13} /> Not
                  </Link>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
