"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/admin/actions";
import {
  ADMIN_SELECTABLE_STATUSES,
  STATUS_LABELS,
  type OrderStatus,
} from "@/lib/orders/status";

export function StatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <select
        defaultValue={status}
        disabled={pending}
        aria-label="Sipariş durumu"
        onChange={(e) => {
          const next = e.target.value;
          setError(null);
          startTransition(async () => {
            const res = await updateOrderStatus(orderId, next);
            if (res.error) setError(res.error);
          });
        }}
        className="cursor-pointer rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink outline-none transition-colors hover:border-blush-300 focus:border-rose-500 disabled:opacity-50"
      >
        {/* "Ödeme bekleniyor" yalnızca sistem tarafından atanır; admin elle
            seçemesin diye devre dışı, ama mevcut durum oysa görünür kalsın. */}
        {status === "pending" && (
          <option value="pending" disabled>
            {STATUS_LABELS.pending}
          </option>
        )}
        {ADMIN_SELECTABLE_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs text-rose-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
