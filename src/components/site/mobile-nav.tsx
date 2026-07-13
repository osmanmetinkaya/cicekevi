"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  Heart,
  MapPin,
  Menu,
  Phone,
  UserRound,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { pick, type Locale } from "@/lib/types";
import {
  CATEGORY_ICONS,
  FALLBACK_CATEGORY_ICON,
} from "@/components/category/category-icons";
import { LanguageSwitcher } from "@/components/site/language-switcher";

const BRANCH_PHONE = "0545 729 01 08";

/**
 * Mobil gezinme — hamburger + kayan çekmece. Masaüstünde gizli (md:hidden);
 * kategoriler akordeon olarak açılır. Arama modalıyla aynı örtü/kilit desenini
 * kullanır (body scroll kilidi + Esc ile kapanış).
 */
export function MobileNav() {
  const t = useTranslations("header");
  const tb = useTranslations("branch");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Rota değişince çekmeceyi kapat.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Açıkken sayfayı kilitle, Esc ile kapan.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("openMenu")}
        aria-expanded={open}
        className="-ml-1 flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-blush-100"
      >
        <Menu size={22} />
      </button>

      {/* Örtü + kayan panel — header'ın backdrop-filter'ı fixed konumlamayı
          kapsadığından portal ile body'ye taşınır (arama modalıyla aynı desen). */}
      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${
              open ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={!open}
          >
        <button
          type="button"
          aria-label={t("closeMenu")}
          onClick={() => setOpen(false)}
          className="absolute inset-0 h-full w-full cursor-default bg-ink/30"
        />

        <aside
          role="dialog"
          aria-modal="true"
          aria-label={t("menuTitle")}
          className={`absolute left-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-cream shadow-xl transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <header className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="font-serif text-xl text-ink">{t("menuTitle")}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("closeMenu")}
              className="flex size-11 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-blush-100 hover:text-ink"
            >
              <X size={22} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-2 py-3">
            {/* Kategoriler — akordeon */}
            {CATEGORY_GROUPS.map((group) => {
              const isOpen = openGroup === group.slug;
              return (
                <div key={group.slug} className="mb-1">
                  <button
                    type="button"
                    onClick={() => setOpenGroup(isOpen ? null : group.slug)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-base font-medium text-ink transition-colors hover:bg-blush-50"
                  >
                    {pick(group.label, locale)}
                    <ChevronDown
                      size={18}
                      className={`text-ink-muted transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <ul className="pb-1 pl-2">
                      {group.items.flatMap((item) => {
                        const rows = [
                          <MobileCatRow
                            key={item.slug}
                            slug={item.slug}
                            label={pick(item.label, locale)}
                          />,
                        ];
                        item.children?.forEach((child) =>
                          rows.push(
                            <MobileCatRow
                              key={child.slug}
                              slug={child.slug}
                              label={pick(child.label, locale)}
                              nested
                            />,
                          ),
                        );
                        return rows;
                      })}
                    </ul>
                  )}
                </div>
              );
            })}

            {/* Hesap kısayolları */}
            <div className="mt-2 border-t border-line pt-3">
              <Link
                href="/favoriler"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-base text-ink transition-colors hover:bg-blush-50"
              >
                <Heart size={19} className="text-rose-700" />
                {t("favorites")}
              </Link>
              <Link
                href="/hesap"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-base text-ink transition-colors hover:bg-blush-50"
              >
                <UserRound size={19} className="text-rose-700" />
                {t("account")}
              </Link>
            </div>

            {/* Şube bilgisi */}
            <div className="mt-2 rounded-xl border border-line bg-white p-3">
              <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
                <MapPin size={14} className="text-leaf-500" /> {tb("name")}
              </span>
              <span className="mt-1 block text-xs text-ink-muted">
                {tb("address")}
              </span>
              <a
                href={`tel:${BRANCH_PHONE.replace(/\s/g, "")}`}
                className="mt-2 flex items-center gap-1.5 text-sm text-leaf-600"
              >
                <Phone size={13} /> {BRANCH_PHONE}
              </a>
            </div>
          </div>

          <footer className="border-t border-line px-4 py-3">
            <LanguageSwitcher />
          </footer>
        </aside>
          </div>,
          document.body,
        )}
    </div>
  );
}

function MobileCatRow({
  slug,
  label,
  nested,
}: {
  slug: string;
  label: string;
  nested?: boolean;
}) {
  const Icon = CATEGORY_ICONS[slug] ?? FALLBACK_CATEGORY_ICON;
  return (
    <li>
      <Link
        href={`/kategori/${slug}`}
        className={`flex items-center gap-3 rounded-xl py-2.5 pr-3 text-sm text-ink transition-colors hover:bg-blush-50 ${
          nested ? "pl-8 text-ink-muted" : "pl-3"
        }`}
      >
        <Icon size={17} strokeWidth={1.7} className="shrink-0 text-ink-muted" />
        {label}
      </Link>
    </li>
  );
}
