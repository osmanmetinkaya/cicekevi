"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/lib/types";
import { useFavorites } from "@/components/favorites/favorites-context";
import { ProductCard } from "@/components/product/product-card";
import { Artwork } from "@/components/product/artwork";

/**
 * Favori listesi. Favori id'leri yalnızca tarayıcıda (localStorage) durduğu
 * için eşleştirme istemcide yapılır; katalog veritabanından sunucuda çekilip
 * prop olarak geçilir.
 */
export function FavoritesListing({ products }: { products: Product[] }) {
  const { ids } = useFavorites();
  const t = useTranslations("favorites");

  const byId = new Map(products.map((p) => [p.id, p]));
  const favorites = ids
    .map((id) => byId.get(id))
    .filter((p) => p !== undefined);

  if (favorites.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <Artwork accent="blush" size={40} className="size-20 rounded-full" />
        <h1 className="mt-5 font-serif text-3xl text-ink">{t("title")}</h1>
        <p className="mt-2 text-ink-muted">{t("empty")}</p>
        <Link
          href="/#buketler"
          className="mt-6 rounded-full bg-rose-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-900"
        >
          {t("emptyCta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-2.5">
        <Heart size={22} className="text-rose-700" />
        <h1 className="font-serif text-3xl text-ink">{t("title")}</h1>
        <span className="text-sm text-ink-muted">
          {t("count", { count: favorites.length })}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {favorites.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
