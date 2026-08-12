import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDateTR, formatKurus } from "@/lib/format";
import { STATUS_LABELS } from "@/lib/orders/status";
import type { AdminOrderRow } from "@/lib/orders/types";
import { SITE_NAME } from "@/lib/site";
import { PrintButton } from "@/components/admin/print-button";

const SELECT =
  "id, order_number, email, amount_total, items, delivery_date, delivery_window, gift_note, sender_name, sender_phone, sender_email, recipient_name, recipient_phone, recipient_address, status, created_at";

export default async function OrderReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle<AdminOrderRow>();

  if (!data) notFound();
  const o = data;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/admin/siparisler"
          className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-rose-700"
        >
          <ChevronLeft size={15} /> Siparişler
        </Link>
        <PrintButton label="Fişi yazdır" />
      </div>

      <div className="rounded-2xl border border-line bg-white p-8 print:rounded-none print:border-0 print:p-0">
        <header className="flex items-start justify-between border-b border-line pb-4">
          <div>
            <h1 className="font-serif text-2xl text-ink">{SITE_NAME}</h1>
            <p className="text-sm text-ink-muted">Sipariş Fişi</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-ink">#{o.order_number}</p>
            <p className="text-sm text-ink-muted">
              {new Intl.DateTimeFormat("tr-TR", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(o.created_at))}
            </p>
          </div>
        </header>

        <section className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <h2 className="text-xs font-medium tracking-wide text-ink-muted uppercase">
              Gönderen
            </h2>
            <p className="mt-1 text-sm text-ink">{o.sender_name || "—"}</p>
            {o.sender_phone && (
              <p className="text-sm text-ink-muted">{o.sender_phone}</p>
            )}
            {o.sender_email && (
              <p className="text-sm text-ink-muted">{o.sender_email}</p>
            )}
            <p className="text-sm text-ink-muted">{o.email}</p>
          </div>
          <div>
            <h2 className="text-xs font-medium tracking-wide text-ink-muted uppercase">
              Alıcı
            </h2>
            <p className="mt-1 text-sm text-ink">{o.recipient_name || "—"}</p>
            {o.recipient_phone && (
              <p className="text-sm text-ink-muted">{o.recipient_phone}</p>
            )}
            {o.recipient_address && (
              <p className="text-sm text-ink-muted">{o.recipient_address}</p>
            )}
          </div>
        </section>

        {(o.delivery_date || o.delivery_window) && (
          <p className="mt-4 text-sm text-ink">
            <span className="text-ink-muted">Teslimat: </span>
            {o.delivery_date ? formatDateTR(o.delivery_date) : "—"}
            {o.delivery_window && ` · ${o.delivery_window}`}
          </p>
        )}

        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs tracking-wide text-ink-muted uppercase">
              <th className="py-2 font-medium">Ürün</th>
              <th className="py-2 text-center font-medium">Adet</th>
              <th className="py-2 text-right font-medium">Birim</th>
              <th className="py-2 text-right font-medium">Tutar</th>
            </tr>
          </thead>
          <tbody>
            {o.items.map((item, i) => (
              <tr key={i} className="border-b border-line/60">
                <td className="py-2 text-ink">{item.name}</td>
                <td className="py-2 text-center text-ink-muted">{item.qty}</td>
                <td className="py-2 text-right text-ink-muted">
                  {formatKurus(Math.round(item.amount / item.qty))}
                </td>
                <td className="py-2 text-right text-ink">
                  {formatKurus(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <div className="flex w-48 items-center justify-between border-t border-line pt-3 text-base font-medium text-ink">
            <span>Toplam</span>
            <span>{formatKurus(o.amount_total)}</span>
          </div>
        </div>

        {o.gift_note && (
          <div className="mt-6 rounded-xl bg-cream p-4 print:border print:border-line">
            <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">
              Hediye notu
            </p>
            <p className="mt-1 font-serif text-ink italic">“{o.gift_note}”</p>
          </div>
        )}

        <p className="mt-6 text-xs text-ink-muted">
          Durum: {STATUS_LABELS[o.status]}
        </p>
      </div>
    </div>
  );
}
