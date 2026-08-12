import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { getProductRows, getProductCategoryMap } from "@/lib/products";
import { getCategoryRows } from "@/lib/categories";
import { formatKurus } from "@/lib/format";
import { ProductImage } from "@/components/product/product-image";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminProductsPage() {
  const [rows, categoryMap, categoryRows] = await Promise.all([
    getProductRows(),
    getProductCategoryMap(),
    getCategoryRows(),
  ]);
  const labelBySlug = new Map(categoryRows.map((c) => [c.slug, c.label_tr]));

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

      {rows.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-line bg-white p-10 text-center text-ink-muted">
          Henüz ürün yok. &quot;Yeni Ürün&quot; ile ilk ürünü ekle.
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {rows.map((row) => {
            const slugs = categoryMap.get(row.id) ?? [];
            return (
              <li
                key={row.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white p-5"
              >
                <ProductImage
                  product={{ accent: row.accent, imageUrl: row.image_url }}
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
                    {!row.image_url && (
                      <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] text-ink-muted">
                        Fotoğraf yok
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
  );
}
