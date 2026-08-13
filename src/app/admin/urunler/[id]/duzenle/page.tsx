import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { flattenCategoryRows, getCategoryRows } from "@/lib/categories";
import { getAllProductRowsForAdmin, getProductCategoryMap } from "@/lib/products";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = decodeURIComponent(id);

  const [rows, categoryRows, categoryMap] = await Promise.all([
    getAllProductRowsForAdmin(),
    getCategoryRows(),
    getProductCategoryMap(),
  ]);

  const row = rows.find((p) => p.id === productId);
  if (!row) notFound();

  const flat = flattenCategoryRows(categoryRows);
  const idBySlug = new Map(categoryRows.map((c) => [c.slug, c.id]));
  const selected = (categoryMap.get(row.id) ?? [])
    .map((slug) => idBySlug.get(slug))
    .filter((v) => v !== undefined);

  return (
    <div>
      <Link
        href="/admin/urunler"
        className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-rose-700"
      >
        <ChevronLeft size={15} /> Ürünler
      </Link>
      <h2 className="mt-3 mb-6 font-serif text-2xl text-ink">
        {row.name_tr} — Düzenle
      </h2>

      <ProductForm
        initial={{
          id: row.id,
          slug: row.slug,
          nameTr: row.name_tr,
          nameEn: row.name_en,
          taglineTr: row.tagline_tr,
          taglineEn: row.tagline_en,
          descriptionTr: row.description_tr,
          descriptionEn: row.description_en,
          priceKurus: row.price_kurus,
          flowersTr: row.flowers_tr ?? [],
          flowersEn: row.flowers_en ?? [],
          accent: row.accent,
          imageUrls: row.image_urls,
          isNew: row.is_new,
          isBestseller: row.is_bestseller,
          sortOrder: row.sort_order,
          categoryIds: selected,
        }}
        categories={flat.map((c) => ({
          id: c.id,
          label: c.label_tr,
          depth: c.depth,
        }))}
      />
    </div>
  );
}
