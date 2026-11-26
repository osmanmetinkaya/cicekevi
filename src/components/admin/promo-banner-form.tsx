"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { savePromoBanner } from "@/app/admin/content-actions";

interface SpecialDay {
  slug: string;
  label: string;
}

/** Ana sayfa hero'sunun altındaki özel gün promosyon alanı: aç/kapat +
 * hangi özel gün için gösterileceği. Kaydedince siteye anında yansır. */
export function PromoBannerForm({
  days,
  initialActive,
  initialSlug,
}: {
  days: SpecialDay[];
  initialActive: boolean;
  initialSlug: string;
}) {
  const router = useRouter();
  const [active, setActive] = useState(initialActive);
  const [slug, setSlug] = useState(
    days.some((d) => d.slug === initialSlug) ? initialSlug : (days[0]?.slug ?? ""),
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const dirty = active !== initialActive || slug !== initialSlug;

  function save() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const res = await savePromoBanner({ active, categorySlug: slug });
      if (res.error) setError(res.error);
      else {
        setSaved(true);
        router.refresh();
      }
    });
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="min-w-48 flex-1">
          <h3 className="font-serif text-lg text-ink">Özel gün alanı</h3>
          <p className="mt-0.5 text-sm text-ink-muted">
            Ana sayfada banner'ın altında, seçtiğin özel günün ürünlerine
            yönlendiren büyük bir alan gösterir.
          </p>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs text-ink-muted">Özel gün</span>
          <select
            id="promo-day"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSaved(false);
            }}
            className="rounded-xl border border-line bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-rose-500"
          >
            {days.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.label}
              </option>
            ))}
          </select>
        </label>

        <button
          id="promo-active"
          type="button"
          role="switch"
          aria-checked={active}
          onClick={() => {
            setActive(!active);
            setSaved(false);
          }}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
            active
              ? "border-leaf-500 bg-leaf-400/20 text-leaf-600"
              : "border-line text-ink-muted hover:border-blush-300"
          }`}
        >
          <span
            className={`size-2.5 rounded-full ${active ? "bg-leaf-500" : "bg-ink-muted/40"}`}
          />
          {active ? "Aktif" : "Pasif"}
        </button>

        <button
          type="button"
          onClick={save}
          disabled={pending || !dirty || !slug}
          className="inline-flex items-center gap-1.5 rounded-full bg-rose-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-900 disabled:opacity-50"
        >
          {pending && <Loader2 size={14} className="animate-spin" />}
          {saved && !dirty && !pending && <Check size={14} />}
          {saved && !dirty ? "Kaydedildi" : "Kaydet"}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
