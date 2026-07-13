"use client";

import { PlusCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { pick, type Locale, type Product } from "@/lib/types";
import { formatKurus } from "@/lib/format";
import { useCart } from "@/components/cart/cart-context";
import { Artwork } from "@/components/product/artwork";
import { FavoriteButton } from "@/components/favorites/favorite-button";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const locale = useLocale() as Locale;
  const t = useTranslations("product");
  const name = pick(product.name, locale);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg hover:shadow-blush-100">
      <Link
        href={`/products/${product.slug}`}
        className="relative block"
        aria-label={name}
      >
        <Artwork
          accent={product.accent}
          size={56}
          className="aspect-[4/3] w-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {(product.isNew || product.bestseller) && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-700 px-2.5 py-1 text-[11px] font-medium text-white">
            {product.isNew ? t("cardBadgeNew") : t("cardBadgeBestseller")}
          </span>
        )}
      </Link>
      <FavoriteButton productId={product.id} name={name} />

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-serif text-lg text-ink">{name}</h3>
        </Link>
        <p className="mt-0.5 text-sm text-ink-muted">
          {pick(product.tagline, locale)}
        </p>

        <div className="mt-3 flex items-center justify-between pt-1">
          <span className="font-medium text-leaf-600">
            {formatKurus(product.priceKurus)}
          </span>
          <button
            type="button"
            onClick={() => add(product)}
            aria-label={t("addToCartLabel", { name })}
            className="inline-flex items-center gap-1 rounded-full px-1 py-1 text-leaf-600 transition-colors hover:text-leaf-900"
          >
            <PlusCircle size={26} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
