"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { setProductActive } from "@/app/admin/catalog-actions";

/** Ürünü tamamen silmeden vitrinden gizler/geri getirir — yayın dışıyken
 * ürün sayfası ve sepete ekleme kapanır, ama tüm veriler (açıklama, fotoğraf,
 * kategoriler) korunur. */
export function ActiveToggle({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="inline-flex flex-col items-end">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const res = await setProductActive(id, !active);
            if (res.error) setError(res.error);
            else router.refresh();
          });
        }}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors disabled:opacity-50 ${
          active
            ? "border-line text-ink hover:border-blush-300 hover:text-rose-700"
            : "border-amber-300 bg-amber-50 text-amber-800 hover:border-amber-400"
        }`}
      >
        {pending ? (
          <Loader2 size={14} className="animate-spin" />
        ) : active ? (
          <Eye size={14} />
        ) : (
          <EyeOff size={14} />
        )}
        {active ? "Yayında" : "Yayın dışı"}
      </button>
      {error && (
        <span className="mt-1 text-xs text-rose-700" role="alert">
          {error}
        </span>
      )}
    </span>
  );
}
