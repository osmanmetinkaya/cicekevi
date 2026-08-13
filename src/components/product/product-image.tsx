import Image from "next/image";
import type { Product } from "@/lib/types";
import { Artwork } from "@/components/product/artwork";

/**
 * Ürün kapak görseli. Fotoğraf yüklendiyse (products.image_urls[0] —
 * Supabase Storage `product-images` bucket'ı) gerçek <Image>, yüklenmediyse
 * mevcut <Artwork> placeholder'ı gösterilir. `className` her iki durumda da
 * aynı oran/köşe çerçevesini taşır, böylece yerleşim değişmez.
 */
export function ProductImage({
  product,
  className = "",
  size = 48,
  sizes = "(max-width: 768px) 50vw, 25vw",
  priority = false,
  alt = "",
}: {
  product: Pick<Product, "accent" | "imageUrl">;
  className?: string;
  /** Placeholder ikon boyutu (fotoğraf yoksa). */
  size?: number;
  sizes?: string;
  priority?: boolean;
  alt?: string;
}) {
  if (!product.imageUrl) {
    return (
      <Artwork accent={product.accent} size={size} className={className} />
    );
  }

  return (
    <div className={`relative overflow-hidden bg-blush-100 ${className}`}>
      <Image
        src={product.imageUrl}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
