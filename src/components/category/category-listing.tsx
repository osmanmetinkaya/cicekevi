"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";
import { Artwork } from "@/components/product/artwork";

type Sort = "onerilen" | "fiyat-artan" | "fiyat-azalan" | "yeni";

const SORTS: { value: Sort; label: string }[] = [
  { value: "onerilen", label: "Önerilen" },
  { value: "fiyat-artan", label: "Fiyat: artan" },
  { value: "fiyat-azalan", label: "Fiyat: azalan" },
  { value: "yeni", label: "Yeniler önce" },
];

export function CategoryListing({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<Sort>("onerilen");

  const sorted = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case "fiyat-artan":
        return list.sort((a, b) => a.priceKurus - b.priceKurus);
      case "fiyat-azalan":
        return list.sort((a, b) => b.priceKurus - a.priceKurus);
      case "yeni":
        return list.sort(
          (a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)),
        );
      default:
        return list;
    }
  }, [products, sort]);

  if (products.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-line bg-white py-16 text-center">
        <Artwork accent="blush" size={36} className="size-16 rounded-full" />
        <p className="font-serif text-xl text-ink">Bu kategori yakında dolacak</p>
        <p className="max-w-xs text-sm text-ink-muted">
          Şu an burada gösterilecek ürün yok. Çok yakında özenle seçilmiş
          çiçeklerle karşında olacağız.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 flex items-center justify-between border-b border-line pb-3">
        <span className="text-sm text-ink-muted">
          {products.length} ürün
        </span>
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <ArrowUpDown size={15} />
          <span className="sr-only">Sırala</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="cursor-pointer rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink outline-none transition-colors hover:border-blush-300 focus:border-rose-500"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {sorted.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
