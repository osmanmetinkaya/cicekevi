import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDateTR, formatKurus } from "@/lib/format";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/orders/status";
import type { AdminOrderRow } from "@/lib/orders/types";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select(
      "id, order_number, stripe_session_id, email, amount_total, items, delivery_date, delivery_window, gift_note, sender_name, sender_phone, sender_email, recipient_name, recipient_phone, recipient_address, status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<AdminOrderRow[]>();

  const orders = data ?? [];
  const today = new Date().toISOString().slice(0, 10);

  const todayOrders = orders.filter((o) => o.created_at.startsWith(today));
  const todayRevenue = todayOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.amount_total, 0);
  const active = orders.filter((o) =>
    ["paid", "preparing", "on_delivery"].includes(o.status),
  );
  const todayDeliveries = orders.filter(
    (o) => o.delivery_date === today && o.status !== "cancelled",
  );

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Bugünkü sipariş" value={String(todayOrders.length)} />
        <Stat label="Bugünkü ciro" value={formatKurus(todayRevenue)} />
        <Stat label="Aktif sipariş" value={String(active.length)} />
        <Stat
          label="Bugün teslim edilecek"
          value={String(todayDeliveries.length)}
        />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-serif text-xl text-ink">Son siparişler</h2>
        <Link
          href="/admin/siparisler"
          className="text-sm text-leaf-600 transition-colors hover:text-rose-700"
        >
          Tümünü gör →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-line bg-white p-10 text-center text-ink-muted">
          Henüz sipariş yok. İlk sipariş geldiğinde burada görünecek.
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white">
          {orders.slice(0, 5).map((o) => (
            <li
              key={o.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
            >
              <div>
                <span className="text-sm font-medium text-ink">
                  #{o.order_number}
                </span>
                <span className="ml-3 text-sm text-ink-muted">
                  {o.recipient_name || o.email}
                </span>
                {o.delivery_date && (
                  <span className="ml-3 text-xs text-ink-muted">
                    → {formatDateTR(o.delivery_date)}
                    {o.delivery_window && ` · ${o.delivery_window}`}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[o.status]}`}
                >
                  {STATUS_LABELS[o.status]}
                </span>
                <span className="text-sm font-medium text-leaf-600">
                  {formatKurus(o.amount_total)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="mt-1 font-serif text-3xl text-ink">{value}</p>
    </div>
  );
}
