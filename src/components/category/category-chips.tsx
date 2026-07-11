import Link from "next/link";
import type { CategoryGroup } from "@/lib/categories";
import {
  CATEGORY_ICONS,
  FALLBACK_CATEGORY_ICON,
} from "@/components/category/category-icons";

/**
 * Bir gruptaki kategorileri buton (chip) olarak listeler; her biri kendi
 * kategori sayfasına gider. `activeSlug` verilirse o kategori vurgulanır.
 */
export function CategoryChips({
  group,
  activeSlug,
}: {
  group: CategoryGroup;
  activeSlug?: string;
}) {
  return (
    <nav aria-label={`${group.label} kategorileri`} className="mt-6">
      <ul className="flex flex-wrap gap-2">
        {group.items.map((item) => {
          const Icon = CATEGORY_ICONS[item.slug] ?? FALLBACK_CATEGORY_ICON;
          const active = item.slug === activeSlug;
          return (
            <li key={item.slug}>
              <Link
                href={`/kategori/${item.slug}`}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors duration-200 ${
                  active
                    ? "border-rose-500 bg-blush-100 text-rose-700"
                    : "border-line bg-white text-ink hover:border-blush-300 hover:text-rose-700"
                }`}
              >
                <Icon size={16} strokeWidth={1.7} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
