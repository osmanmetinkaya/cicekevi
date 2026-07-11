import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  allCategorySlugs,
  categoryLabel,
  categoryTrail,
  getGroupBySlug,
  CATEGORY_GROUPS,
} from "@/lib/categories";
import { getProductsByCategory, getProductsByGroup } from "@/lib/products";
import { CategoryListing } from "@/components/category/category-listing";
import { CategoryChips } from "@/components/category/category-chips";

export function generateStaticParams() {
  return [
    ...CATEGORY_GROUPS.map((g) => ({ slug: g.slug })),
    ...allCategorySlugs().map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const label = getGroupBySlug(slug)?.label ?? categoryLabel(slug);
  return {
    title: label ? `${label} — Çiçekevi` : "Çiçekevi",
    description: label
      ? `${label} kategorisindeki taze çiçekler ve aynı gün teslimat seçenekleri.`
      : undefined,
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group = getGroupBySlug(slug);

  // Grup sayfası (ör. /kategori/cicekler)
  if (group) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <nav
          aria-label="Konum"
          className="flex flex-wrap items-center gap-1.5 text-sm text-ink-muted"
        >
          <Crumb href="/" label="Ana sayfa" />
          <ChevronRight size={14} className="text-line" />
          <span className="text-ink">{group.label}</span>
        </nav>

        <header className="mt-5">
          <h1 className="font-serif text-4xl text-ink">{group.label}</h1>
          <p className="mt-2 max-w-xl text-ink-muted">
            {group.label} kapsamındaki tüm çiçekler. İstanbul içi aynı gün
            teslimat.
          </p>
        </header>

        <CategoryChips group={group} />

        <CategoryListing products={getProductsByGroup(group)} />
      </div>
    );
  }

  // Kategori sayfası (ör. /kategori/papatyalar)
  const trail = categoryTrail(slug);
  if (!trail) notFound();

  const siblingGroup = getGroupBySlug(trail.groupSlug);
  const activeChip = trail.parent?.slug ?? slug;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav
        aria-label="Konum"
        className="flex flex-wrap items-center gap-1.5 text-sm text-ink-muted"
      >
        <Crumb href="/" label="Ana sayfa" />
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
          {trail.self.label} için özenle hazırlanmış çiçekler. İstanbul içi aynı
          gün teslimat.
        </p>
      </header>

      {siblingGroup && (
        <CategoryChips group={siblingGroup} activeSlug={activeChip} />
      )}

      <CategoryListing products={getProductsByCategory(slug)} />
    </div>
  );
}
