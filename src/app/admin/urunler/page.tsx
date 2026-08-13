import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { getAllProductRowsForAdmin, getProductCategoryMap } from "@/lib/products";
import {
  flattenCategoryRows,
  getCategoryRows,
  type CategoryRow,
} from "@/lib/categories";
import { formatKurus } from "@/lib/format";
import { ProductImage } from "@/components/product/product-image";
import { DeleteButton } from "@/components/admin/delete-button";
import { ActiveToggle } from "@/components/admin/active-toggle";

/** id -> kendisi + tüm alt kategorilerinin slug'ları (grup/kategori seçince alt kırılımlar da dahil olsun diye). */
function buildDescendantSlugs(rows: CategoryRow[]): Map<string, Set<string>> {
  const bySlugId = new Map(rows.map((r) => [r.id, r.slug]));
  const childrenOf = new Map<string, CategoryRow[]>();
  for (const row of rows) {
    if (!row.parent_id) continue;
    const list = childrenOf.get(row.parent_id);
    if (list) list.push(row);
    else childrenOf.set(row.parent_id, [row]);
  }
  const result = new Map<string, Set<string>>();
  function collect(id: string): Set<string> {
    const cached = result.get(id);
    if (cached) return cached;
    const set = new Set<string>([bySlugId.get(id)!]);
    for (const child of childrenOf.get(id) ?? []) {
      for (const slug of collect(child.id)) set.add(slug);
    }
    result.set(id, set);
    return set;
  }
  for (const row of rows) collect(row.id);
  return result;
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;
  const [rows, categoryMap, categoryRows] = await Promise.all([
    getAllProductRowsForAdmin(),
    getProductCategoryMap(),
    getCategoryRows(),
  ]);
  const labelBySlug = new Map(categoryRows.map((c) => [c.slug, c.label_tr]));
  const flat = flattenCategoryRows(categoryRows);
  const descendantSlugs = buildDescendantSlugs(categoryRows);

  // Sayaçlar: her kategori (ve alt ağacı) için kaç ürün var, "Kategorisiz" için de ayrı.
  const countFor = (slugs: Set<string>) =>
    rows.filter((r) =>
      (categoryMap.get(r.id) ?? []).some((s) => slugs.has(s)),
    ).length;
  const uncategorizedCount = rows.filter(
    (r) => (categoryMap.get(r.id) ?? []).length === 0,
  ).length;

  const activeSlugs =
    kategori === "kategorisiz"
      ? null
      : kategori
        ? (descendantSlugs.get(kategori) ?? null)
        : undefined; // undefined = filtre yok (tümü)

  const visibleRows =
    kategori === "kategorisiz"
      ? rows.filter((r) => (categoryMap.get(r.id) ?? []).length === 0)
      : activeSlugs
        ? rows.filter((r) =>
            (categoryMap.get(r.id) ?? []).some((s) => activeSlugs.has(s)),
          )
        : rows;

  const activeLabel =
    kategori === "kategorisiz"
      ? "Kategorisiz"
      : (flat.find((c) => c.id === kategori)?.label_tr ?? null);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl text-ink">Ürünler</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {rows.length} ürün. Değişiklikler siteye anında yansır, yeniden
            yayına alma gerekmez.
          </p>
        </div>
        <Link
          href="/admin/urunler/yeni"
          className="inline-flex items-center gap-1.5 rounded-full bg-rose-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-900"
        >
          <Plus size={16} /> Yeni Ürün
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Kategori filtresi */}
        <nav
          aria-label="Kategoriye göre filtrele"
          className="flex gap-1.5 overflow-x-auto pb-1 lg:block lg:h-fit lg:shrink-0 lg:space-y-0.5 lg:overflow-visible lg:rounded-2xl lg:border lg:border-line lg:bg-white lg:p-2"
        >
          <Link
            href="/admin/urunler"
            className={`block shrink-0 rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors lg:rounded-xl ${
              !kategori
                ? "bg-rose-700 text-white"
                : "text-ink hover:bg-blush-50"
            }`}
          >
            Tümü <span className="opacity-70">({rows.length})</span>
          </Link>
          {flat.map((c) => (
            <Link
              key={c.id}
              href={`/admin/urunler?kategori=${c.id}`}
              style={{ paddingLeft: `${12 + c.depth * 14}px` }}
              className={`block shrink-0 rounded-full py-1.5 pr-3 text-sm whitespace-nowrap transition-colors lg:rounded-xl ${
                kategori === c.id
                  ? "bg-rose-700 text-white"
                  : c.depth === 0
                    ? "font-medium text-ink hover:bg-blush-50"
                    : "text-ink-muted hover:bg-blush-50"
              }`}
            >
              {c.label_tr}{" "}
              <span className="opacity-70">
                ({countFor(descendantSlugs.get(c.id) ?? new Set())})
              </span>
            </Link>
          ))}
          {uncategorizedCount > 0 && (
            <Link
              href="/admin/urunler?kategori=kategorisiz"
              className={`block shrink-0 rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors lg:rounded-xl ${
                kategori === "kategorisiz"
                  ? "bg-rose-700 text-white"
                  : "text-ink-muted hover:bg-blush-50"
              }`}
            >
              Kategorisiz <span className="opacity-70">({uncategorizedCount})</span>
            </Link>
          )}
        </nav>

        {/* Ürün listesi */}
        <div>
          {activeLabel && (
            <p className="mb-3 text-sm text-ink-muted">
              <strong className="text-ink">{activeLabel}</strong> kategorisinde{" "}
              {visibleRows.length} ürün.
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
                const slugs = categoryMap.get(row.id) ?? [];
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
                        <span className="font-serif text-lg text-ink">
                          {row.name_tr}
                        </span>
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
                      <p className="mt-0.5 text-sm text-ink-muted">
                        /{row.slug}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {slugs.map((slug) => (
                          <span
                            key={slug}
                            className="rounded-full border border-line px-2.5 py-0.5 text-xs text-ink-muted"
                          >
                            {labelBySlug.get(slug) ?? slug}
                          </span>
                        ))}
                      </div>
                    </div>

                    <span className="font-medium text-leaf-600">
                      {formatKurus(row.price_kurus)}
                    </span>

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
    </div>
  );
}
