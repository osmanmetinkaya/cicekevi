import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/site/hero";
import { FeaturesBar } from "@/components/site/features-bar";
import { ProductCard } from "@/components/product/product-card";
import { getAllProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const products = await getAllProducts();
  const bestsellers = products.filter((p) => p.bestseller);
  const rest = products.filter((p) => !p.bestseller);

  return (
    <>
      <Hero />
      <FeaturesBar />

      <ProductSection
        id="buketler"
        eyebrow={t("bestsellersEyebrow")}
        title={t("bestsellersTitle")}
        products={bestsellers}
      />
      <ProductSection
        id="saksi"
        eyebrow={t("allEyebrow")}
        title={t("allTitle")}
        products={rest}
      />
    </>
  );
}

function ProductSection({
  id,
  eyebrow,
  title,
  products,
}: {
  id: string;
  eyebrow: string;
  title: string;
  products: Product[];
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <p className="text-xs font-medium tracking-widest text-leaf-600">
          {eyebrow.toUpperCase()}
        </p>
        <h2 className="font-serif text-3xl text-ink">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
