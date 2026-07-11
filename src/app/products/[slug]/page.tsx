import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ChevronRight, Clock4, Leaf, ShieldCheck, Truck } from "lucide-react";
import {
  PRODUCTS,
  getProduct,
  getRelatedProducts,
  primaryCategorySlug,
} from "@/lib/products";
import { categoryLabel } from "@/lib/categories";
import { formatKurus } from "@/lib/format";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchase } from "@/components/product/product-purchase";
import { ProductCard } from "@/components/product/product-card";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return {
    title: product ? `${product.name} — Çiçekevi` : "Çiçekevi",
    description: product?.description,
  };
}

const DELIVERY = [
  { Icon: Truck, text: "İstanbul içi aynı gün teslimat" },
  { Icon: Clock4, text: "Saat 16.00'ya kadar verilen siparişler bugün ulaşır" },
  { Icon: Leaf, text: "Mevsiminde toplanan taze çiçekler" },
  { Icon: ShieldCheck, text: "256-bit SSL ile güvenli ödeme" },
];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const catSlug = primaryCategorySlug(product);
  const catLabel = categoryLabel(catSlug);
  const related = getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav
        aria-label="Konum"
        className="flex flex-wrap items-center gap-1.5 text-sm text-ink-muted"
      >
        <Link href="/" className="transition-colors hover:text-rose-700">
          Ana sayfa
        </Link>
        {catLabel && (
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
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <ProductGallery product={product} />

        <div className="flex flex-col">
          {(product.isNew || product.bestseller) && (
            <span className="mb-2 w-fit rounded-full bg-blush-100 px-3 py-1 text-xs font-medium text-rose-700">
              {product.isNew ? "Yeni gelenler" : "Çok satan"}
            </span>
          )}
          <h1 className="font-serif text-4xl text-ink">{product.name}</h1>
          <p className="mt-1 text-ink-muted">{product.tagline}</p>

          <p className="mt-5 font-serif text-3xl text-leaf-600">
            {formatKurus(product.priceKurus)}
          </p>

          <p className="mt-5 leading-relaxed text-ink">{product.description}</p>

          <div className="mt-7">
            <ProductPurchase product={product} />
          </div>

          <ul className="mt-7 space-y-2.5 rounded-2xl bg-white p-4 ring-1 ring-line">
            {DELIVERY.map(({ Icon, text }) => (
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
            <h2 className="text-sm font-medium text-ink">İçindekiler</h2>
            <ul className="mt-2 space-y-2">
              {product.flowers.map((f) => (
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
          <h2 className="mb-6 font-serif text-3xl text-ink">Benzer çiçekler</h2>
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
