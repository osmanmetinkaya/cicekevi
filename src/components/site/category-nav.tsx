"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Truck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CategoryGroup } from "@/lib/categories";
import { pick, type Locale } from "@/lib/types";
import {
  CATEGORY_ICONS,
  FALLBACK_CATEGORY_ICON,
} from "@/components/category/category-icons";

/** İkon + metin; hover'da ikon ve yazı birlikte renk değiştirir. */
function MenuItem({
  slug,
  label,
  trailing,
}: {
  slug: string;
  label: string;
  trailing?: React.ReactNode;
}) {
  const Icon = CATEGORY_ICONS[slug] ?? FALLBACK_CATEGORY_ICON;
  return (
    <Link
      href={`/kategori/${slug}`}
      className="group flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors duration-200 hover:bg-blush-50"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-cream text-ink-muted transition-colors duration-200 group-hover:bg-blush-200 group-hover:text-rose-700">
        <Icon size={17} strokeWidth={1.7} />
      </span>
      <span className="flex-1 text-sm text-ink transition-colors duration-200 group-hover:text-rose-700">
        {label}
      </span>
      {trailing}
    </Link>
  );
}

export function CategoryNav({ groups }: { groups: CategoryGroup[] }) {
  const locale = useLocale() as Locale;
  const tHeader = useTranslations("header");
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!openGroup) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenGroup(null);
        setOpenSub(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [openGroup]);

  return (
    <nav
      ref={ref}
      aria-label={tHeader("categories")}
      className="hidden border-b border-line bg-white md:block"
    >
      <ul className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-2.5 sm:px-6">
        {groups.map((group) => {
          const isOpen = openGroup === group.slug;
          return (
            <li
              key={group.slug}
              className="relative"
              onMouseEnter={() => setOpenGroup(group.slug)}
              onMouseLeave={() => {
                setOpenGroup(null);
                setOpenSub(null);
              }}
            >
              <button
                type="button"
                onClick={() => setOpenGroup(isOpen ? null : group.slug)}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className="flex items-center gap-1 text-sm font-medium text-ink transition-colors hover:text-rose-700"
              >
                {pick(group.label, locale)}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`absolute left-0 top-full z-40 min-w-64 origin-top pt-2 transition-all duration-300 ease-out ${
                  isOpen
                    ? "visible translate-y-0 scale-100 opacity-100"
                    : "invisible -translate-y-2 scale-[0.98] opacity-0"
                }`}
              >
                <ul className="rounded-2xl border border-line bg-white p-2 shadow-xl shadow-rose-900/5">
                  {group.items.map((item) => {
                    if (!item.children) {
                      return (
                        <li key={item.slug}>
                          <MenuItem
                            slug={item.slug}
                            label={pick(item.label, locale)}
                          />
                        </li>
                      );
                    }

                    // Yan-açılan alt menü (ör. Özel Günler).
                    const subOpen = openSub === item.slug;
                    return (
                      <li
                        key={item.slug}
                        className="relative"
                        onMouseEnter={() => setOpenSub(item.slug)}
                        onMouseLeave={() => setOpenSub(null)}
                      >
                        <MenuItem
                          slug={item.slug}
                          label={pick(item.label, locale)}
                          trailing={
                            <ChevronRight
                              size={15}
                              className="text-ink-muted transition-colors duration-200 group-hover:text-rose-700"
                            />
                          }
                        />

                        <div
                          className={`absolute left-full top-0 z-50 min-w-56 pl-2 transition-all duration-300 ease-out ${
                            subOpen
                              ? "visible translate-x-0 opacity-100"
                              : "invisible -translate-x-2 opacity-0"
                          }`}
                        >
                          <ul className="rounded-2xl border border-line bg-white p-2 shadow-xl shadow-rose-900/5">
                            {item.children.map((child) => (
                              <li key={child.slug}>
                                <MenuItem
                                  slug={child.slug}
                                  label={pick(child.label, locale)}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          );
        })}

        <li className="ml-auto hidden items-center gap-1.5 text-xs text-ink-muted sm:flex">
          <Truck size={14} className="text-leaf-500" />
          {tHeader("sameDay")}
        </li>
      </ul>
    </nav>
  );
}
