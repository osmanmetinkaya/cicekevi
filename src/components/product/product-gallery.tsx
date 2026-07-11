import type { Product } from "@/lib/types";
import { Artwork } from "@/components/product/artwork";

/**
 * Ürün görselleri. Şimdilik placeholder; gerçek fotoğraflar gelince
 * <Artwork> yerine <Image> koyup aynı oran/çerçeveyi koru.
 */
export function ProductGallery({ product }: { product: Product }) {
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
