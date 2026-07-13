import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  allCategorySlugs,
  categoryLabel,
  categoryTrail,
  getGroupBySlug,
  CATEGORY_GROUPS,
} from "@/lib/categories";
import { getProductsByCategory, getProductsByGroup } from "@/lib/products";
import { pick, type Locale } from "@/lib/types";
import { CategoryListing } from "@/components/category/category-listing";
import { CategoryChips } from "@/components/category/category-chips";
import { SITE_NAME } from "@/lib/site";

export function generateStaticParams() {
  return [
    ...CATEGORY_GROUPS.map((g) => ({ slug: g.slug })),
    ...allCategorySlugs().map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const group = getGroupBySlug(slug);
  const label = group ? pick(group.label, loc) : categoryLabel(slug, loc);
  if (!label) return { title: SITE_NAME };
  const t = await getTranslations({ locale, namespace: "category" });
  return {
    title: `${label} — ${SITE_NAME}`,
    description: t("metaDescription", { label }),
  };
}

function Crumb({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="transition-colors hover:text-rose-700">
      {label}
    </Link>
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("category");
  const group = getGroupBySlug(slug);

  // Grup sayfası (ör. /kategori/cicekler)
  if (group) {
    const groupLabel = pick(group.label, loc);
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <nav
          aria-label={t("breadcrumbHome")}
          className="flex flex-wrap items-center gap-1.5 text-sm text-ink-muted"
        >
          <Crumb href="/" label={t("breadcrumbHome")} />
          <ChevronRight size={14} className="text-line" />
          <span className="text-ink">{groupLabel}</span>
        </nav>

        <header className="mt-5">
          <h1 className="font-serif text-4xl text-ink">{groupLabel}</h1>
          <p className="mt-2 max-w-xl text-ink-muted">
            {t("groupIntro", { label: groupLabel })}
          </p>
        </header>

        <CategoryChips group={group} />

        <CategoryListing products={getProductsByGroup(group)} />
      </div>
    );
  }

  // Kategori sayfası (ör. /kategori/papatyalar)
  const trail = categoryTrail(slug, loc);
  if (!trail) notFound();

  const siblingGroup = getGroupBySlug(trail.groupSlug);
  const activeChip = trail.parent?.slug ?? slug;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav
        aria-label={t("breadcrumbHome")}
        className="flex flex-wrap items-center gap-1.5 text-sm text-ink-muted"
      >
        <Crumb href="/" label={t("breadcrumbHome")} />
        <ChevronRight size={14} className="text-line" />
        <Crumb href={`/kategori/${trail.groupSlug}`} label={trail.groupLabel} />
        {trail.parent && (
          <>
            <ChevronRight size={14} className="text-line" />
            <Crumb
              href={`/kategori/${trail.parent.slug}`}
              label={trail.parent.label}
            />
          </>
        )}
        <ChevronRight size={14} className="text-line" />
        <span className="text-ink">{trail.self.label}</span>
      </nav>

      <header className="mt-5">
        <h1 className="font-serif text-4xl text-ink">{trail.self.label}</h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          {t("leafIntro", { label: trail.self.label })}
        </p>
      </header>

      {siblingGroup && (
        <CategoryChips group={siblingGroup} activeSlug={activeChip} />
      )}

      <CategoryListing products={getProductsByCategory(slug)} />
    </div>
  );
}
