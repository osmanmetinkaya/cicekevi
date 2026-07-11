import { Hero } from "@/components/site/hero";
import { FeaturesBar } from "@/components/site/features-bar";
import { ProductCard } from "@/components/product/product-card";
import { PRODUCTS } from "@/lib/products";

export default function Home() {
  const bestsellers = PRODUCTS.filter((p) => p.bestseller);
  const rest = PRODUCTS.filter((p) => !p.bestseller);

  return (
    <>
      <Hero />
      <FeaturesBar />

      <ProductSection
        id="buketler"
        eyebrow="Çok satanlar"
        title="Sevilenler"
        products={bestsellers}
      />
      <ProductSection
        id="saksi"
        eyebrow="Koleksiyon"
        title="Tüm çiçekler"
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
  products: typeof PRODUCTS;
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
