import type { Product } from "@/lib/types";
import { Artwork } from "@/components/product/artwork";
import { ProductImage } from "@/components/product/product-image";

/**
 * Ürün görselleri. Fotoğraf yüklenmişse (products.image_url) gerçek görsel,
 * yüklenmemişse <Artwork> placeholder'ı gösterilir. Ürün başına tek fotoğraf
 * tutulduğu için küçük görsel şeridi yalnızca placeholder modunda çizilir.
 */
export function ProductGallery({ product }: { product: Product }) {
  if (product.imageUrl) {
    return (
      <ProductImage
        product={product}
        alt=""
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
        className="aspect-square w-full rounded-3xl"
      />
    );
  }

  return (
    <div>
      <Artwork
        accent={product.accent}
        size={128}
        className="aspect-square w-full rounded-3xl"
      />
      <div className="mt-3 grid grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <Artwork
            key={i}
            accent={product.accent}
            size={26}
            className={`aspect-square w-full rounded-xl ${
              i === 0 ? "ring-2 ring-rose-500" : "opacity-70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
