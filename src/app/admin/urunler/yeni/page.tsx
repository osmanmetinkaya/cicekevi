import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { flattenCategoryRows, getCategoryRows } from "@/lib/categories";
import { getAllProductRowsForAdmin } from "@/lib/products";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const [rows, products] = await Promise.all([
    getCategoryRows(),
    getAllProductRowsForAdmin(),
  ]);
  const categories = flattenCategoryRows(rows).map((c) => ({
    id: c.id,
    label: c.label_tr,
    depth: c.depth,
  }));

  // Yeni ürün varsayılan olarak listenin sonuna eklensin.
  const nextSort =
    products.reduce((max, p) => Math.max(max, p.sort_order), -1) + 1;

  return (
    <div>
      <Link
        href="/admin/urunler"
        className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-rose-700"
      >
        <ChevronLeft size={15} /> Ürünler
      </Link>
      <h2 className="mt-3 mb-6 font-serif text-2xl text-ink">Yeni Ürün</h2>

      <ProductForm
        initial={null}
        categories={categories}
        defaultSortOrder={nextSort}
      />
    </div>
  );
}
