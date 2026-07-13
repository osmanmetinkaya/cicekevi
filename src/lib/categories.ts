import type { Locale, Localized } from "@/lib/types";
import { pick } from "@/lib/types";

export interface CategoryLeaf {
  slug: string;
  label: Localized;
}

export interface CategoryNode extends CategoryLeaf {
  children?: CategoryLeaf[];
}

export interface CategoryGroup {
  slug: string;
  label: Localized;
  items: CategoryNode[];
}

/** Locale'e göre çözülmüş kategori (görünen ad string olarak). */
export interface ResolvedLeaf {
  slug: string;
  label: string;
}

/**
 * Kategori barı iki eksende gruplanır: "Duruma Göre" (neden alınıyor) ve
 * "Çiçekler" (ne alınıyor). Sıra önemli.
 */
export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    slug: "duruma-gore",
    label: { tr: "Duruma Göre", en: "By Occasion" },
    items: [
      {
        slug: "sevgiliye-cicek",
        label: { tr: "Sevgiliye Çiçek", en: "Flowers for Your Love" },
      },
      { slug: "dogum-gunu", label: { tr: "Doğum Günü", en: "Birthday" } },
      {
        slug: "is-tebrik",
        label: { tr: "İş Tebrik", en: "Business Congratulations" },
      },
      { slug: "gecmis-olsun", label: { tr: "Geçmiş Olsun", en: "Get Well Soon" } },
      { slug: "ozur-dilerim", label: { tr: "Özür Dilerim", en: "I'm Sorry" } },
      {
        slug: "ozel-gunler",
        label: { tr: "Özel Günler", en: "Special Days" },
        children: [
          {
            slug: "sevgililer-gunu",
            label: { tr: "Sevgililer Günü", en: "Valentine's Day" },
          },
          {
            slug: "anneler-gunu",
            label: { tr: "Anneler Günü", en: "Mother's Day" },
          },
          {
            slug: "babalar-gunu",
            label: { tr: "Babalar Günü", en: "Father's Day" },
          },
          {
            slug: "ogretmenler-gunu",
            label: { tr: "Öğretmenler Günü", en: "Teachers' Day" },
          },
        ],
      },
    ],
  },
  {
    slug: "cicekler",
    label: { tr: "Çiçekler", en: "Flowers" },
    items: [
      { slug: "buketler", label: { tr: "Buketler", en: "Bouquets" } },
      { slug: "papatyalar", label: { tr: "Papatyalar", en: "Daisies" } },
      { slug: "orkideler", label: { tr: "Orkideler", en: "Orchids" } },
      { slug: "aranjmanlar", label: { tr: "Aranjmanlar", en: "Arrangements" } },
      {
        slug: "saksi-cicekleri",
        label: { tr: "Saksı Çiçekleri", en: "Potted Plants" },
      },
      { slug: "celenkler", label: { tr: "Çelenkler", en: "Wreaths" } },
      { slug: "gelin-arabasi", label: { tr: "Gelin Arabası", en: "Wedding Car" } },
    ],
  },
];

/** slug → görünen ad (alt kategoriler dahil), kategori sayfası başlığı için. */
export function categoryLabel(slug: string, locale: Locale): string | undefined {
  for (const group of CATEGORY_GROUPS) {
    for (const item of group.items) {
      if (item.slug === slug) return pick(item.label, locale);
      const child = item.children?.find((ch) => ch.slug === slug);
      if (child) return pick(child.label, locale);
    }
  }
  return undefined;
}

/** Breadcrumb için: kategorinin grubu (link için slug + ad), üst kategori ve kendisi. */
export function categoryTrail(
  slug: string,
  locale: Locale,
):
  | {
      groupSlug: string;
      groupLabel: string;
      parent?: ResolvedLeaf;
      self: ResolvedLeaf;
    }
  | undefined {
  for (const group of CATEGORY_GROUPS) {
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

export function getGroupBySlug(slug: string): CategoryGroup | undefined {
  return CATEGORY_GROUPS.find((g) => g.slug === slug);
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

export function allCategorySlugs(): string[] {
  const slugs: string[] = [];
  for (const group of CATEGORY_GROUPS) {
    for (const item of group.items) {
      slugs.push(item.slug);
      item.children?.forEach((ch) => slugs.push(ch.slug));
    }
  }
  return slugs;
}
