import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllProductRowsForAdmin, getProductCategoryMap } from "@/lib/products";
import {
  flattenCategoryRows,
  getCategoryRows,
  type CategoryRow,
} from "@/lib/categories";
import { ProductsBrowser } from "./products-browser";

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

export default async function AdminProductsPage() {
  const [rows, categoryMap, categoryRows] = await Promise.all([
    getAllProductRowsForAdmin(),
    getProductCategoryMap(),
    getCategoryRows(),
  ]);
  const labelBySlug = new Map(categoryRows.map((c) => [c.slug, c.label_tr]));
  const flat = flattenCategoryRows(categoryRows);
  const descendantSlugs = buildDescendantSlugs(categoryRows);

  const uncategorizedCount = rows.filter(
    (r) => (categoryMap.get(r.id) ?? []).length === 0,
  ).length;

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

      <ProductsBrowser
        rows={rows}
        categoryMap={Object.fromEntries(categoryMap)}
        labelBySlug={Object.fromEntries(labelBySlug)}
        categories={flat.map((c) => ({
          id: c.id,
          label: c.label_tr,
          depth: c.depth,
          descendantSlugs: [...(descendantSlugs.get(c.id) ?? [])],
        }))}
        uncategorizedCount={uncategorizedCount}
      />
    </div>
  );
}
