/** Desteklenen diller. lib/i18n/routing.ts ile aynı olmalı. */
export type Locale = "tr" | "en";

/** İki dilli bir metin — Türkçe kaynak, İngilizce çeviri. */
export interface Localized {
  tr: string;
  en: string;
}

/** İki dilli bir metin dizisi (ör. çiçek içerikleri). */
export interface LocalizedList {
  tr: string[];
  en: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: Localized;
  tagline: Localized;
  description: Localized;
  /** Price in kuruş (1 TRY = 100 kuruş) — integers keep money math exact. */
  priceKurus: number;
  /** Category slugs this product belongs to (see lib/categories.ts). */
  categories: string[];
  flowers: LocalizedList;
  /** Tailwind theme color key used for the placeholder artwork. */
  accent: ProductAccent;
  /**
   * Kapak fotoğrafı (imageUrls[0]) — sepet/kart/liste gibi tekil-görsel
   * bağlamlarda kullanılır. Boşsa arayüz <Artwork> placeholder'ına düşer
   * (bkz. components/product/product-image).
   */
  imageUrl?: string | null;
  /** Ürün detay sayfasındaki galeri — Supabase Storage public URL'leri. */
  imageUrls: string[];
  bestseller?: boolean;
  isNew?: boolean;
}

/** Fotoğrafı olmayan ürünlerin placeholder renk anahtarı. */
export type ProductAccent = "blush" | "leaf" | "rose" | "amber" | "teal";

export const PRODUCT_ACCENTS: ProductAccent[] = [
  "blush",
  "leaf",
  "rose",
  "amber",
  "teal",
];

/** Aktif locale'e göre iki dilli metinden doğru dizeyi seç. */
export function pick(value: Localized, locale: Locale): string {
  return value[locale] ?? value.tr;
}

/** Aktif locale'e göre iki dilli listeden doğru diziyi seç. */
export function pickList(value: LocalizedList, locale: Locale): string[] {
  return value[locale] ?? value.tr;
}

export interface CartLine {
  product: Product;
  qty: number;
}
