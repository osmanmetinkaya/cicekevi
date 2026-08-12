"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { saveCategory } from "@/app/admin/catalog-actions";
import { slugify } from "@/lib/slug";

export interface ParentOption {
  id: string;
  label: string;
  depth: number;
}

export interface CategoryFormInitial {
  id: string;
  slug: string;
  labelTr: string;
  labelEn: string;
  parentId: string | null;
  sortOrder: number;
}

const inputClass =
  "w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-ink outline-none transition-colors focus:border-rose-500";

/**
 * Kategori ekleme/düzenleme formu. Üst kategori seçilmezse yeni bir GRUP
 * (en üst seviye) oluşur; grup seçilirse kategori, kategori seçilirse alt
 * kategori olur (en fazla 3 seviye).
 */
export function CategoryForm({
  initial,
  parents,
}: {
  initial: CategoryFormInitial | null;
  parents: ParentOption[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Liste uzun olduğunda "Düzenle" formu görünür alanın altında kalıyordu;
  // düzenlemeye başlarken forma kaydır (yeni kategori formunda gerek yok,
  // zaten sayfanın altında sabit duruyor).
  useEffect(() => {
    if (initial) formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [labelTr, setLabelTr] = useState(initial?.labelTr ?? "");
  const [labelEn, setLabelEn] = useState(initial?.labelEn ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [parentId, setParentId] = useState(initial?.parentId ?? "");
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));

  const effectiveSlug = slugTouched ? slug : slugify(labelTr);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await saveCategory({
        id: initial?.id,
        slug: effectiveSlug,
        labelTr,
        labelEn,
        parentId: parentId || null,
        sortOrder: Number(sortOrder) || 0,
      });
      if (res.error) {
        setError(res.error);
        return;
      }
      if (!initial) {
        setLabelTr("");
        setLabelEn("");
        setSlug("");
        setSlugTouched(false);
        setSortOrder("0");
      }
      router.push("/admin/kategoriler");
      router.refresh();
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="scroll-mt-24 rounded-2xl border border-line bg-white p-5"
    >
      <h3 className="font-serif text-xl text-ink">
        {initial ? `${initial.labelTr} — Düzenle` : "Yeni Kategori Ekle"}
      </h3>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm text-ink-muted">
            Etiket (TR)
          </span>
          <input
            required
            value={labelTr}
            onChange={(e) => setLabelTr(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-ink-muted">
            Etiket (EN)
          </span>
          <input
            required
            value={labelEn}
            onChange={(e) => setLabelEn(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-ink-muted">
            Üst kategori
          </span>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">Yok (yeni grup)</option>
            {parents.map((p) => (
              <option key={p.id} value={p.id}>
                {"— ".repeat(p.depth)}
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-ink-muted">
            Sıra <span className="text-xs">küçük olan önce görünür</span>
          </span>
          <input
            inputMode="numeric"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm text-ink-muted">
            Slug (URL) <span className="text-xs">etiketten otomatik türer</span>
          </span>
          <input
            value={effectiveSlug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={inputClass}
          />
          <span className="mt-1 block text-xs text-ink-muted">
            Uyarı: yayında olan bir kategorinin slug&apos;ını değiştirmek
            mevcut bağlantıları (menü, paylaşılan linkler) kırar.
          </span>
        </label>
      </div>

      {error && (
        <p className="mt-3 text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-rose-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-900 disabled:opacity-60"
        >
          {pending ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}
          {initial ? "Kaydet" : "Ekle"}
        </button>
        {initial && (
          <button
            type="button"
            onClick={() => router.push("/admin/kategoriler")}
            className="rounded-full border border-line px-5 py-2.5 text-sm text-ink transition-colors hover:border-blush-300 hover:text-rose-700"
          >
            Vazgeç
          </button>
        )}
      </div>
    </form>
  );
}
