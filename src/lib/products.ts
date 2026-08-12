import { cache } from "react";
import type { Product, ProductAccent } from "@/lib/types";
import {
  getCategoryGroups,
  getCategoryRows,
  groupCategorySlugs,
  type CategoryGroup,
} from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Ürünler artık Supabase'te (public.products + public.product_categories).
 * Mağaza sahibi fiyat/açıklama/fotoğraf değişikliklerini admin panelinden
 * yapabilsin, yeniden deploy gerekmesin diye koddan veritabanına taşındı.
 *
 * Katalog küçük (19 ürün, ~20 kategori); tüm satırlar tek seferde çekilip
 * türetmeler (kategoriye göre filtre, benzer ürünler) bellekte yapılıyor.
 * React `cache()` aynı istek içindeki tekrar çağrıları tek sorguya indirir.
 */

/** public.products satırı. */
export interface ProductRow {
  id: string;
  slug: string;
  name_tr: string;
  name_en: string;
  tagline_tr: string;
  tagline_en: string;
  description_tr: string;
  description_en: string;
  price_kurus: number;
  flowers_tr: string[];
  flowers_en: string[];
  accent: ProductAccent;
  image_url: string | null;
  is_new: boolean;
  is_bestseller: boolean;
  sort_order: number;
}

interface ProductCategoryRow {
  product_id: string;
  category_id: string;
}

const PRODUCT_SELECT =
  "id, slug, name_tr, name_en, tagline_tr, tagline_en, description_tr, description_en, price_kurus, flowers_tr, flowers_en, accent, image_url, is_new, is_bestseller, sort_order";

/** DB satırı → uygulamanın kullandığı iki dilli `Product` tipi. */
export function mapProduct(row: ProductRow, categories: string[]): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: { tr: row.name_tr, en: row.name_en },
    tagline: { tr: row.tagline_tr, en: row.tagline_en },
    description: { tr: row.description_tr, en: row.description_en },
    priceKurus: row.price_kurus,
    categories,
    flowers: { tr: row.flowers_tr ?? [], en: row.flowers_en ?? [] },
    accent: row.accent,
    imageUrl: row.image_url,
    isNew: row.is_new,
    bestseller: row.is_bestseller,
  };
}

/** Ham ürün satırları (admin formu düzenleme ekranı için de kullanılır). */
export const getProductRows = cache(async (): Promise<ProductRow[]> => {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .returns<ProductRow[]>();

  if (error) {
    console.error("[products] fetch failed", error.message);
    return [];
  }
  return data ?? [];
});

const getProductCategoryRows = cache(
  async (): Promise<ProductCategoryRow[]> => {
    if (!isSupabaseConfigured()) return [];
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product_categories")
      .select("product_id, category_id")
      .returns<ProductCategoryRow[]>();

    if (error) {
      console.error("[products] category links fetch failed", error.message);
      return [];
    }
    return data ?? [];
  },
);

/** product_id → kategori slug listesi (kategori sırasına göre kararlı). */
export const getProductCategoryMap = cache(
  async (): Promise<Map<string, string[]>> => {
    const [links, categoryRows] = await Promise.all([
      getProductCategoryRows(),
      getCategoryRows(),
    ]);
    // getCategoryRows sıralı geldiği için indeks = kararlı sıralama anahtarı.
    const slugById = new Map<string, string>();
    const rankById = new Map<string, number>();
    categoryRows.forEach((row, i) => {
      slugById.set(row.id, row.slug);
      rankById.set(row.id, i);
    });

    const byProduct = new Map<string, { slug: string; rank: number }[]>();
    for (const link of links) {
      const slug = slugById.get(link.category_id);
      if (!slug) continue;
      const entry = { slug, rank: rankById.get(link.category_id) ?? 0 };
      const list = byProduct.get(link.product_id);
      if (list) list.push(entry);
      else byProduct.set(link.product_id, [entry]);
    }

    const result = new Map<string, string[]>();
    for (const [productId, entries] of byProduct) {
      entries.sort((a, b) => a.rank - b.rank);
      result.set(
        productId,
        entries.map((e) => e.slug),
      );
    }
    return result;
  },
);

/** Tüm ürünler (vitrin sırası: sort_order). */
export const getAllProducts = cache(async (): Promise<Product[]> => {
  const [rows, categoryMap] = await Promise.all([
    getProductRows(),
    getProductCategoryMap(),
  ]);
  return rows.map((row) => mapProduct(row, categoryMap.get(row.id) ?? []));
});

export async function getProduct(slug: string): Promise<Product | undefined> {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getAllProducts();
  return products.find((p) => p.id === id);
}

/**
 * Bir kategori slug'ına ait ürünler. Üst kategori (ör. "ozel-gunler")
 * çağrıldığında alt kategorilerine ait ürünleri de kapsar.
 */
export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const [products, groups] = await Promise.all([
    getAllProducts(),
    getCategoryGroups(),
  ]);
  const slugs = new Set<string>([slug]);
  for (const group of groups) {
    const parent = group.items.find((i) => i.slug === slug);
    parent?.children?.forEach((c) => slugs.add(c.slug));
  }
  return products.filter((p) => p.categories.some((c) => slugs.has(c)));
}

/** Bir gruptaki (ör. "Çiçekler") tüm ürünler. */
export async function getProductsByGroup(
  group: CategoryGroup,
): Promise<Product[]> {
  const products = await getAllProducts();
  const slugs = new Set(groupCategorySlugs(group));
  return products.filter((p) => p.categories.some((c) => slugs.has(c)));
}

/** Ürünün breadcrumb'ında kullanılacak birincil (ürün tipi) kategorisi. */
export async function primaryCategorySlug(
  product: Product,
): Promise<string | undefined> {
  const groups = await getCategoryGroups();
  const cicekler = groups.find((g) => g.slug === "cicekler");
  const typeSlugs = new Set(cicekler ? groupCategorySlugs(cicekler) : []);
  return (
    product.categories.find((c) => typeSlugs.has(c)) ?? product.categories[0]
  );
}

/** Aynı kategoriden benzer ürünler (kendisi hariç), yetmezse diğerleriyle tamamlar. */
export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const primary = await primaryCategorySlug(product);
  const inCategory = primary
    ? (await getProductsByCategory(primary)).filter((p) => p.id !== product.id)
    : [];
  const seen = new Set(inCategory.map((p) => p.id));
  const all = await getAllProducts();
  const filler = all.filter((p) => p.id !== product.id && !seen.has(p.id));
  return [...inCategory, ...filler].slice(0, limit);
}
