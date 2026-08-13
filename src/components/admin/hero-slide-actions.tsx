"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Loader2, Trash2 } from "lucide-react";
import { deleteHeroSlide, moveHeroSlide } from "@/app/admin/content-actions";

export function HeroSlideActions({
  id,
  isFirst,
  isLast,
  canDelete,
}: {
  id: string;
  isFirst: boolean;
  isLast: boolean;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function move(direction: "up" | "down") {
    setError(null);
    startTransition(async () => {
      const res = await moveHeroSlide(id, direction);
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <span className="inline-flex items-center gap-1.5">
        <button
          type="button"
          disabled={pending || isFirst}
          onClick={() => move("up")}
          aria-label="Yukarı taşı"
          className="rounded-full border border-line p-1.5 text-ink-muted transition-colors hover:border-blush-300 hover:text-rose-700 disabled:opacity-30"
        >
          <ChevronUp size={15} />
        </button>
        <button
          type="button"
          disabled={pending || isLast}
          onClick={() => move("down")}
          aria-label="Aşağı taşı"
          className="rounded-full border border-line p-1.5 text-ink-muted transition-colors hover:border-blush-300 hover:text-rose-700 disabled:opacity-30"
        >
          <ChevronDown size={15} />
        </button>
        <button
          type="button"
          disabled={pending || !canDelete}
          title={!canDelete ? "En az bir slayt kalmalı" : undefined}
          onClick={() => {
            if (!window.confirm("Bu slayt silinsin mi?")) return;
            setError(null);
            startTransition(async () => {
              const res = await deleteHeroSlide(id);
              if (res.error) setError(res.error);
              else router.refresh();
            });
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm text-ink-muted transition-colors hover:border-rose-500 hover:text-rose-700 disabled:opacity-40"
        >
          {pending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
          Sil
        </button>
      </span>
      {error && (
        <span className="text-xs text-rose-700" role="alert">
          {error}
        </span>
      )}
    </span>
  );
}
