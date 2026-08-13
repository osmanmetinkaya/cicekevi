"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { Artwork } from "@/components/product/artwork";

/**
 * Ürün görselleri. Birden fazla fotoğraf yüklenmişse (products.image_urls)
 * altta küçük bir şerit üzerinden seçilebilen bir galeri gösterilir;
 * hiç fotoğraf yoksa <Artwork> placeholder'ına düşer.
 */
export function ProductGallery({ product }: { product: Product }) {
  const images = product.imageUrls ?? [];
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <Artwork
        accent={product.accent}
        size={128}
        className="aspect-square w-full rounded-3xl"
      />
    );
  }

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-blush-100">
        <Image
          src={images[active]}
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${i + 1}. fotoğraf`}
              aria-current={i === active}
              className={`relative aspect-square w-full overflow-hidden rounded-xl transition-opacity ${
                i === active
                  ? "ring-2 ring-rose-500"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={url} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
