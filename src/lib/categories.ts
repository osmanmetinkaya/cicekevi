export interface CategoryLeaf {
  slug: string;
  label: string;
}

export interface CategoryNode extends CategoryLeaf {
  children?: CategoryLeaf[];
}

export interface CategoryGroup {
  slug: string;
  label: string;
  items: CategoryNode[];
}

/**
 * Kategori barı iki eksende gruplanır: "Duruma Göre" (neden alınıyor) ve
 * "Çiçekler" (ne alınıyor). Sıra önemli.
 */
export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    slug: "duruma-gore",
    label: "Duruma Göre",
    items: [
      { slug: "sevgiliye-cicek", label: "Sevgiliye Çiçek" },
      { slug: "dogum-gunu", label: "Doğum Günü" },
      { slug: "is-tebrik", label: "İş Tebrik" },
      { slug: "gecmis-olsun", label: "Geçmiş Olsun" },
      { slug: "ozur-dilerim", label: "Özür Dilerim" },
      {
        slug: "ozel-gunler",
        label: "Özel Günler",
        children: [
          { slug: "sevgililer-gunu", label: "Sevgililer Günü" },
          { slug: "anneler-gunu", label: "Anneler Günü" },
          { slug: "babalar-gunu", label: "Babalar Günü" },
          { slug: "ogretmenler-gunu", label: "Öğretmenler Günü" },
        ],
      },
    ],
  },
  {
    slug: "cicekler",
    label: "Çiçekler",
    items: [
      { slug: "buketler", label: "Buketler" },
      { slug: "papatyalar", label: "Papatyalar" },
      { slug: "orkideler", label: "Orkideler" },
      { slug: "aranjmanlar", label: "Aranjmanlar" },
      { slug: "saksi-cicekleri", label: "Saksı Çiçekleri" },
      { slug: "celenkler", label: "Çelenkler" },
      { slug: "gelin-arabasi", label: "Gelin Arabası" },
    ],
  },
];

/** slug → görünen ad (alt kategoriler dahil), kategori sayfası başlığı için. */
export function categoryLabel(slug: string): string | undefined {
  for (const group of CATEGORY_GROUPS) {
    for (const item of group.items) {
      if (item.slug === slug) return item.label;
      const child = item.children?.find((ch) => ch.slug === slug);
      if (child) return child.label;
    }
  }
  return undefined;
}

/** Breadcrumb için: kategorinin grubu (link için slug + ad), üst kategori ve kendisi. */
export function categoryTrail(slug: string):
  | {
      groupSlug: string;
      groupLabel: string;
      parent?: CategoryLeaf;
      self: CategoryLeaf;
    }
  | undefined {
  for (const group of CATEGORY_GROUPS) {
    for (const item of group.items) {
      if (item.slug === slug) {
        return {
          groupSlug: group.slug,
          groupLabel: group.label,
          self: { slug: item.slug, label: item.label },
        };
      }
      const child = item.children?.find((c) => c.slug === slug);
      if (child) {
        return {
          groupSlug: group.slug,
          groupLabel: group.label,
          parent: { slug: item.slug, label: item.label },
          self: child,
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
