import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, ChevronRight, Clock4, Leaf, ShieldCheck, Truck } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getProduct,
  getRelatedProducts,
  primaryCategorySlug,
} from "@/lib/products";
import { categoryLabel } from "@/lib/categories";
import { formatKurus } from "@/lib/format";
import { pick, pickList, type Locale } from "@/lib/types";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchase } from "@/components/product/product-purchase";
import { ProductCard } from "@/components/product/product-card";
import { FavoriteButton } from "@/components/favorites/favorite-button";
import { SITE_NAME } from "@/lib/site";

// Katalog artık veritabanında ve admin panelinden değişebiliyor; sayfa
// build-time'da statik üretilmez, her istekte güncel veriyle render edilir.
// (generateStaticParams kaldırıldı — yeniden deploy beklemeden yayına girsin.)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: SITE_NAME };
  const loc = locale as Locale;
  return {
    title: `${pick(product.name, loc)} — ${SITE_NAME}`,
    description: pick(product.description, loc),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const product = await getProduct(slug);
  if (!product) notFound();

  const t = await getTranslations("product");
  const name = pick(product.name, loc);

  const catSlug = await primaryCategorySlug(product);
  const catLabel = catSlug ? await categoryLabel(catSlug, loc) : undefined;
  const related = await getRelatedProducts(product);

  const delivery = [
    { Icon: Truck, text: t("delivery.sameDay") },
    { Icon: Clock4, text: t("delivery.cutoff") },
    { Icon: Leaf, text: t("delivery.fresh") },
    { Icon: ShieldCheck, text: t("delivery.ssl") },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav
        aria-label={t("breadcrumbHome")}
        className="flex flex-wrap items-center gap-1.5 text-sm text-ink-muted"
      >
        <Link href="/" className="transition-colors hover:text-rose-700">
          {t("breadcrumbHome")}
        </Link>
        {catSlug && catLabel && (
          <>
            <ChevronRight size={14} className="text-line" />
            <Link
              href={`/kategori/${catSlug}`}
              className="transition-colors hover:text-rose-700"
            >
              {catLabel}
            </Link>
          </>
        )}
        <ChevronRight size={14} className="text-line" />
        <span className="text-ink">{name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <ProductGallery product={product} />

        <div className="flex flex-col">
          {(product.isNew || product.bestseller) && (
            <span className="mb-2 w-fit rounded-full bg-blush-100 px-3 py-1 text-xs font-medium text-rose-700">
              {product.isNew ? t("badgeNew") : t("badgeBestseller")}
            </span>
          )}
          <h1 className="font-serif text-4xl text-ink">{name}</h1>
          <p className="mt-1 text-ink-muted">{pick(product.tagline, loc)}</p>

          <p className="mt-5 font-serif text-3xl text-leaf-600">
            {formatKurus(product.priceKurus)}
          </p>

          <p className="mt-5 leading-relaxed text-ink">
            {pick(product.description, loc)}
          </p>

          <div className="mt-7 flex items-center gap-3">
            <ProductPurchase product={product} />
            <FavoriteButton
              productId={product.id}
              name={name}
              variant="solid"
            />
          </div>

          <ul className="mt-7 space-y-2.5 rounded-2xl bg-white p-4 ring-1 ring-line">
            {delivery.map(({ Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-2.5 text-sm text-ink-muted"
              >
                <Icon size={17} className="shrink-0 text-leaf-500" />
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-7 border-t border-line pt-5">
            <h2 className="text-sm font-medium text-ink">{t("contents")}</h2>
            <ul className="mt-2 space-y-2">
              {pickList(product.flowers, loc).map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-ink-muted"
                >
                  <Check size={15} className="text-leaf-500" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-serif text-3xl text-ink">{t("related")}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
