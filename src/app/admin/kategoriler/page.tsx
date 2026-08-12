import Link from "next/link";
import { Pencil, TriangleAlert } from "lucide-react";
import { flattenCategoryRows, getCategoryRows } from "@/lib/categories";
import { getProductCategoryMap } from "@/lib/products";
import { CategoryForm } from "@/components/admin/category-form";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ duzenle?: string }>;
}) {
  const { duzenle } = await searchParams;
  const [rows, categoryMap] = await Promise.all([
    getCategoryRows(),
    getProductCategoryMap(),
  ]);
  const flat = flattenCategoryRows(rows);

  // slug → o kategorideki ürün sayısı (silme uyarısında gösterilir).
  const productCount = new Map<string, number>();
  for (const slugs of categoryMap.values()) {
    for (const slug of slugs) {
      productCount.set(slug, (productCount.get(slug) ?? 0) + 1);
    }
  }

  const editing = duzenle
    ? (flat.find((c) => c.id === duzenle) ?? null)
    : null;

  // Üst kategori seçenekleri: en fazla 3 seviye olduğu için yalnızca grup ve
  // kategori seviyesindekiler üst olabilir. Düzenlenen kategorinin kendisi ve
  // alt ağacı, döngü oluşmasın diye listeden çıkarılır.
  const descendants = new Set<string>();
  if (editing) {
    const collect = (parentId: string) => {
      for (const row of rows.filter((r) => r.parent_id === parentId)) {
        descendants.add(row.id);
        collect(row.id);
      }
    };
    descendants.add(editing.id);
    collect(editing.id);
  }
  const parents = flat
    .filter((c) => c.depth < 2 && !descendants.has(c.id))
    .map((c) => ({ id: c.id, label: c.label_tr, depth: c.depth }));

  return (
    <div>
      <h2 className="font-serif text-2xl text-ink">Kategoriler</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Menüdeki sıralama ve isimler buradan yönetilir. En üst seviye
        &quot;grup&quot; (ör. Duruma Göre), altındakiler kategori, onların
        altındakiler alt kategoridir.
      </p>

      <div className="mt-4 flex items-start gap-2 rounded-2xl border border-line bg-blush-50 p-4 text-sm text-ink">
        <TriangleAlert size={17} className="mt-0.5 shrink-0 text-rose-700" />
        <p>
          Bir kategoriyi silmek onun alt kategorilerini de siler ve ürünlerin
          o kategoriyle bağını koparır — <strong>ürünlerin kendisi
          silinmez</strong>, sadece bu kategori sayfasında görünmez olurlar.
        </p>
      </div>

      {flat.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-line bg-white p-10 text-center text-ink-muted">
          Henüz kategori yok. Aşağıdaki formdan ilk grubu ekle.
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white">
          {flat.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
              style={{ paddingLeft: `${20 + c.depth * 24}px` }}
            >
              <div>
                <span
                  className={
                    c.depth === 0
                      ? "font-serif text-lg text-ink"
                      : "text-sm text-ink"
                  }
                >
                  {c.label_tr}
                </span>
                <span className="ml-2 text-xs text-ink-muted">
                  {c.label_en} · /{c.slug} · sıra {c.sort_order}
                  {c.depth > 0 &&
                    ` · ${productCount.get(c.slug) ?? 0} ürün`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/kategoriler?duzenle=${c.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm text-ink transition-colors hover:border-blush-300 hover:text-rose-700"
                >
                  <Pencil size={14} /> Düzenle
                </Link>
                <DeleteButton
                  kind="category"
                  id={c.id}
                  confirmText={`"${c.label_tr}" kategorisi (ve varsa alt kategorileri) silinsin mi? Ürünler silinmez, yalnızca bu kategoriden çıkar.`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <CategoryForm
          key={editing?.id ?? "new"}
          initial={
            editing
              ? {
                  id: editing.id,
                  slug: editing.slug,
                  labelTr: editing.label_tr,
                  labelEn: editing.label_en,
                  parentId: editing.parent_id,
                  sortOrder: editing.sort_order,
                }
              : null
          }
          parents={parents}
        />
      </div>
    </div>
  );
}
