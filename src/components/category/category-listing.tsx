"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";
import { Artwork } from "@/components/product/artwork";

type Sort = "onerilen" | "fiyat-artan" | "fiyat-azalan" | "yeni";

export function CategoryListing({ products }: { products: Product[] }) {
  const t = useTranslations("category");
  const [sort, setSort] = useState<Sort>("onerilen");

  const sortOptions: { value: Sort; label: string }[] = [
    { value: "onerilen", label: t("sortRecommended") },
    { value: "fiyat-artan", label: t("sortPriceAsc") },
    { value: "fiyat-azalan", label: t("sortPriceDesc") },
    { value: "yeni", label: t("sortNewest") },
  ];

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
        <p className="font-serif text-xl text-ink">{t("emptyTitle")}</p>
        <p className="max-w-xs text-sm text-ink-muted">{t("emptyText")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 flex items-center justify-between border-b border-line pb-3">
        <span className="text-sm text-ink-muted">
          {t("productCount", { count: products.length })}
        </span>
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <ArrowUpDown size={15} />
          <span className="sr-only">{t("sort")}</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="cursor-pointer rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink outline-none transition-colors hover:border-blush-300 focus:border-rose-500"
          >
            {sortOptions.map((s) => (
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
