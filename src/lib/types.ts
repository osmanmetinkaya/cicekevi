export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Price in kuruş (1 TRY = 100 kuruş) — integers keep money math exact. */
  priceKurus: number;
  /** Category slugs this product belongs to (see lib/categories.ts). */
  categories: string[];
  flowers: string[];
  /** Tailwind theme color key used for the placeholder artwork. */
  accent: "blush" | "leaf" | "rose" | "amber" | "teal";
  bestseller?: boolean;
  isNew?: boolean;
}

export interface CartLine {
  product: Product;
  qty: number;
}
