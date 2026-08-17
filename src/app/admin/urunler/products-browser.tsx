"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import type { ProductRow } from "@/lib/products";
import { formatKurus } from "@/lib/format";
import { ProductImage } from "@/components/product/product-image";
import { DeleteButton } from "@/components/admin/delete-button";
import { ActiveToggle } from "@/components/admin/active-toggle";

interface CategoryItem {
  id: string;
  label: string;
  depth: number;
  /** Kendisi + tüm alt kategorilerinin slug'ları. */
  descendantSlugs: string[];
}

interface ProductsBrowserProps {
  rows: ProductRow[];
  /** product id -> kategori slug listesi. */
  categoryMap: Record<string, string[]>;
  /** kategori slug -> etiket (ürün kartlarındaki rozetler için). */
  labelBySlug: Record<string, string>;
  categories: CategoryItem[];
  uncategorizedCount: number;
}

/**
 * Kategori filtresi tamamen istemci tarafında çalışır — tüm ürün ve
 * kategori verisi sayfa ilk yüklendiğinde tek seferde gelir, sonraki
 * tıklamalar sunucuya gitmeden anında filtreler ("soldaki kategoriler ...
 * geç atıyor" şikayetinin kaynağıydı: her tıklama tam bir sayfa geçişiydi).
 */
export function ProductsBrowser({
  rows,
  categoryMap,
  labelBySlug,
  categories,
  uncategorizedCount,
}: ProductsBrowserProps) {
  const [selected, setSelected] = useState<string | null>(null); // null = tümü, "kategorisiz" özel

  const activeSlugs = useMemo(() => {
    if (!selected || selected === "kategorisiz") return null;
    return new Set(categories.find((c) => c.id === selected)?.descendantSlugs ?? []);
  }, [selected, categories]);

  const visibleRows = useMemo(() => {
    if (selected === "kategorisiz") {
      return rows.filter((r) => (categoryMap[r.id] ?? []).length === 0);
    }
    if (activeSlugs) {
      return rows.filter((r) => (categoryMap[r.id] ?? []).some((s) => activeSlugs.has(s)));
    }
    return rows;
  }, [rows, categoryMap, selected, activeSlugs]);

  const countFor = (slugs: string[]) => {
    const set = new Set(slugs);
    return rows.filter((r) => (categoryMap[r.id] ?? []).some((s) => set.has(s))).length;
  };

  const activeLabel =
    selected === "kategorisiz"
      ? "Kategorisiz"
      : (categories.find((c) => c.id === selected)?.label ?? null);

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
      {/* Kategori filtresi */}
      <nav
        aria-label="Kategoriye göre filtrele"
        className="flex gap-1.5 overflow-x-auto pb-1 lg:block lg:h-fit lg:shrink-0 lg:space-y-0.5 lg:overflow-visible lg:rounded-2xl lg:border lg:border-line lg:bg-white lg:p-2"
      >
        <button
          type="button"
          onClick={() => setSelected(null)}
          className={`block shrink-0 rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors lg:rounded-xl ${
            !selected ? "bg-rose-700 text-white" : "text-ink hover:bg-blush-50"
          }`}
        >
          Tümü <span className="opacity-70">({rows.length})</span>
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelected(c.id)}
            style={{ paddingLeft: `${12 + c.depth * 14}px` }}
            className={`block shrink-0 rounded-full py-1.5 pr-3 text-sm whitespace-nowrap transition-colors lg:rounded-xl ${
              selected === c.id
                ? "bg-rose-700 text-white"
                : c.depth === 0
                  ? "font-medium text-ink hover:bg-blush-50"
                  : "text-ink-muted hover:bg-blush-50"
            }`}
          >
            {c.label} <span className="opacity-70">({countFor(c.descendantSlugs)})</span>
          </button>
        ))}
        {uncategorizedCount > 0 && (
          <button
            type="button"
            onClick={() => setSelected("kategorisiz")}
            className={`block shrink-0 rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors lg:rounded-xl ${
              selected === "kategorisiz"
                ? "bg-rose-700 text-white"
                : "text-ink-muted hover:bg-blush-50"
            }`}
          >
            Kategorisiz <span className="opacity-70">({uncategorizedCount})</span>
          </button>
        )}
      </nav>

      {/* Ürün listesi */}
      <div>
        {activeLabel && (
          <p className="mb-3 text-sm text-ink-muted">
            <strong className="text-ink">{activeLabel}</strong> kategorisinde {visibleRows.length}{" "}
            ürün.
          </p>
        )}

        {visibleRows.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white p-10 text-center text-ink-muted">
            {rows.length === 0
              ? 'Henüz ürün yok. "Yeni Ürün" ile ilk ürünü ekle.'
              : "Bu kategoride ürün yok."}
          </div>
        ) : (
          <ul className="space-y-4">
            {visibleRows.map((row) => {
              const slugs = categoryMap[row.id] ?? [];
              return (
                <li
                  key={row.id}
                  className={`flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white p-5 ${
                    row.is_active ? "" : "opacity-60"
                  }`}
                >
                  <ProductImage
                    product={{
                      accent: row.accent,
                      imageUrl: row.image_urls[0] ?? null,
                    }}
                    size={22}
                    sizes="64px"
                    className="size-16 shrink-0 rounded-xl"
                  />

                  <div className="min-w-48 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-lg text-ink">{row.name_tr}</span>
                      {row.is_new && (
                        <span className="rounded-full bg-blush-100 px-2 py-0.5 text-[11px] text-rose-700">
                          Yeni
                        </span>
                      )}
                      {row.is_bestseller && (
                        <span className="rounded-full bg-blush-100 px-2 py-0.5 text-[11px] text-rose-700">
                          Çok satan
                        </span>
                      )}
                      {row.image_urls.length === 0 && (
                        <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] text-ink-muted">
                          Fotoğraf yok
                        </span>
                      )}
                      {!row.is_active && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-800">
                          Yayın dışı
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-ink-muted">/{row.slug}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {slugs.map((slug) => (
                        <span
                          key={slug}
                          className="rounded-full border border-line px-2.5 py-0.5 text-xs text-ink-muted"
                        >
                          {labelBySlug[slug] ?? slug}
                        </span>
                      ))}
                    </div>
                  </div>

                  <span className="font-medium text-leaf-600">{formatKurus(row.price_kurus)}</span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/urunler/${encodeURIComponent(row.id)}/duzenle`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm text-ink transition-colors hover:border-blush-300 hover:text-rose-700"
                    >
                      <Pencil size={14} /> Düzenle
                    </Link>
                    <ActiveToggle id={row.id} active={row.is_active} />
                    <DeleteButton
                      kind="product"
                      id={row.id}
                      confirmText={`"${row.name_tr}" ürünü silinsin mi? Bu işlem geri alınamaz.`}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
