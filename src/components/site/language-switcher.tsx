"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const LABELS: Record<Locale, string> = { tr: "TR", en: "EN" };

export function LanguageSwitcher() {
  const t = useTranslations("header");
  const locale = useLocale();
  const router = useRouter();
  // Locale öneki olmadan mevcut yol (next-intl döndürür); aynı yolu hedef
  // locale ile yeniden yazarız, böylece bulunduğun sayfada kalırsın.
  const pathname = usePathname();

  function switchTo(next: Locale) {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  return (
    <div
      role="group"
      aria-label={t("languageGroup")}
      className="flex items-center rounded-full border border-line bg-white/60 p-0.5 text-xs font-medium"
    >
      {routing.locales.map((lang) => {
        const isActive = lang === locale;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => switchTo(lang)}
            aria-pressed={isActive}
            className={`rounded-full px-2.5 py-1 transition-colors ${
              isActive
                ? "bg-rose-700 text-white"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {LABELS[lang]}
          </button>
        );
      })}
    </div>
  );
}
