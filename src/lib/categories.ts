import { cache } from "react";
import type { Locale, Localized } from "@/lib/types";
import { pick } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Kategoriler artık Supabase'te (public.categories) — mağaza sahibi admin
 * panelinden ekleyip düzenleyebilsin diye. Tablo kendine referans veren
 * 3 seviyeli bir ağaç:
 *
 *   parent_id null → grup   (ör. "Duruma Göre")
 *   grubun çocuğu  → item   (ör. "Doğum Günü")
 *   item'ın çocuğu → alt-item (ör. "Sevgililer Günü")
 *
 * Okuma fonksiyonları async'e döndü; ağaç kurulumu ve türetmeler bellekte
 * yapılıyor (~20 satır, tek sorgu yeterli). React `cache()` sayesinde aynı
 * istek içindeki tüm çağrılar tek sorguya iner.
 */

/** public.categories satırı. */
export interface CategoryRow {
  id: string;
  slug: string;
  label_tr: string;
  label_en: string;
  parent_id: string | null;
  sort_order: number;
}

export interface CategoryLeaf {
  id: string;
  slug: string;
  label: Localized;
}

export interface CategoryNode extends CategoryLeaf {
  children?: CategoryLeaf[];
}

export interface CategoryGroup extends CategoryLeaf {
  items: CategoryNode[];
}

/** Locale'e göre çözülmüş kategori (görünen ad string olarak). */
export interface ResolvedLeaf {
  slug: string;
  label: string;
}

const SELECT = "id, slug, label_tr, label_en, parent_id, sort_order";

/** Tüm kategori satırları, sıra ile. Admin ekranları da bunu kullanır. */
export const getCategoryRows = cache(async (): Promise<CategoryRow[]> => {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(SELECT)
    .order("sort_order", { ascending: true })
    .order("label_tr", { ascending: true })
    .returns<CategoryRow[]>();

  if (error) {
    console.error("[categories] fetch failed", error.message);
    return [];
  }
  return data ?? [];
});

function toLeaf(row: CategoryRow): CategoryLeaf {
  return {
    id: row.id,
    slug: row.slug,
    label: { tr: row.label_tr, en: row.label_en },
  };
}

/** Düz satır listesini grup → item → alt-item ağacına çevirir. */
export function buildCategoryTree(rows: CategoryRow[]): CategoryGroup[] {
  const byParent = new Map<string | null, CategoryRow[]>();
  for (const row of rows) {
    const key = row.parent_id;
    const list = byParent.get(key);
    if (list) list.push(row);
    else byParent.set(key, [row]);
  }
  const childrenOf = (id: string | null) => byParent.get(id) ?? [];

  return childrenOf(null).map((group) => ({
    ...toLeaf(group),
    items: childrenOf(group.id).map((item) => {
      const kids = childrenOf(item.id);
      return kids.length > 0
        ? { ...toLeaf(item), children: kids.map(toLeaf) }
        : toLeaf(item);
    }),
  }));
}

/**
 * Kategori ağacı. Vitrinde iki eksende gruplanır: "Duruma Göre" (neden
 * alınıyor) ve "Çiçekler" (ne alınıyor). Sıra `sort_order` ile yönetilir.
 */
export const getCategoryGroups = cache(async (): Promise<CategoryGroup[]> => {
  return buildCategoryTree(await getCategoryRows());
});

export interface FlatCategory extends CategoryRow {
  /** 0 = grup, 1 = kategori, 2 = alt kategori. */
  depth: number;
}

/**
 * Ağacı, ekrandaki sırayla girintili düz bir listeye açar (admin panelindeki
 * kategori ağacı ve ürün formundaki kategori seçimi için).
 */
export function flattenCategoryRows(rows: CategoryRow[]): FlatCategory[] {
  const byParent = new Map<string | null, CategoryRow[]>();
  for (const row of rows) {
    const list = byParent.get(row.parent_id);
    if (list) list.push(row);
    else byParent.set(row.parent_id, [row]);
  }

  const out: FlatCategory[] = [];
  const walk = (parentId: string | null, depth: number) => {
    for (const row of byParent.get(parentId) ?? []) {
      out.push({ ...row, depth });
      walk(row.id, depth + 1);
    }
  };
  walk(null, 0);
  return out;
}

/** slug → görünen ad (alt kategoriler dahil), kategori sayfası başlığı için. */
export async function categoryLabel(
  slug: string,
  locale: Locale,
): Promise<string | undefined> {
  const rows = await getCategoryRows();
  const row = rows.find((r) => r.slug === slug);
  if (!row) return undefined;
  return pick({ tr: row.label_tr, en: row.label_en }, locale);
}

/** Breadcrumb için: kategorinin grubu (link için slug + ad), üst kategori ve kendisi. */
export async function categoryTrail(
  slug: string,
  locale: Locale,
): Promise<
  | {
      groupSlug: string;
      groupLabel: string;
      parent?: ResolvedLeaf;
      self: ResolvedLeaf;
    }
  | undefined
> {
  const groups = await getCategoryGroups();
  for (const group of groups) {
    for (const item of group.items) {
      if (item.slug === slug) {
        return {
          groupSlug: group.slug,
          groupLabel: pick(group.label, locale),
          self: { slug: item.slug, label: pick(item.label, locale) },
        };
      }
      const child = item.children?.find((c) => c.slug === slug);
      if (child) {
        return {
          groupSlug: group.slug,
          groupLabel: pick(group.label, locale),
          parent: { slug: item.slug, label: pick(item.label, locale) },
          self: { slug: child.slug, label: pick(child.label, locale) },
        };
      }
    }
  }
  return undefined;
}

export async function getGroupBySlug(
  slug: string,
): Promise<CategoryGroup | undefined> {
  const groups = await getCategoryGroups();
  return groups.find((g) => g.slug === slug);
}

/** Bir grubun tüm kategori slug'ları (alt kategoriler dahil). */
export function groupCategorySlugs(group: CategoryGroup): string[] {
  const slugs: string[] = [];
  for (const item of group.items) {
    slugs.push(item.slug);
    item.children?.forEach((ch) => slugs.push(ch.slug));
  }
  return slugs;
}

export async function allCategorySlugs(): Promise<string[]> {
  const rows = await getCategoryRows();
  const topLevel = new Set(
    rows.filter((r) => r.parent_id === null).map((r) => r.slug),
  );
  return rows.map((r) => r.slug).filter((s) => !topLevel.has(s));
}
