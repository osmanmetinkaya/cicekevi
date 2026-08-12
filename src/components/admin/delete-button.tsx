"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { deleteCategory, deleteProduct } from "@/app/admin/catalog-actions";

/**
 * Katalog silme butonu — tarayıcı `confirm()` ile onay ister, sonra ilgili
 * server action'ı çağırır. (status-select.tsx ile aynı useTransition deseni.)
 */
export function DeleteButton({
  kind,
  id,
  confirmText,
  label = "Sil",
}: {
  kind: "product" | "category";
  id: string;
  confirmText: string;
  label?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="inline-flex flex-col items-end">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(confirmText)) return;
          setError(null);
          startTransition(async () => {
            const res =
              kind === "product"
                ? await deleteProduct(id)
                : await deleteCategory(id);
            if (res.error) setError(res.error);
            else router.refresh();
          });
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm text-ink-muted transition-colors hover:border-rose-500 hover:text-rose-700 disabled:opacity-50"
      >
        {pending ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Trash2 size={14} />
        )}
        {label}
      </button>
      {error && (
        <span className="mt-1 text-xs text-rose-700" role="alert">
          {error}
        </span>
      )}
    </span>
  );
}
