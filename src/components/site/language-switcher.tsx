"use client";

import { useState } from "react";

const LANGS = ["TR", "EN"] as const;
type Lang = (typeof LANGS)[number];

export function LanguageSwitcher() {
  // Görsel MVP: gerçek i18n sonraki fazda (next-intl) bağlanacak.
  const [active, setActive] = useState<Lang>("TR");

  return (
    <div
      role="group"
      aria-label="Dil seçimi"
      className="flex items-center rounded-full border border-line bg-white/60 p-0.5 text-xs font-medium"
    >
      {LANGS.map((lang) => {
        const isActive = lang === active;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => setActive(lang)}
            aria-pressed={isActive}
            className={`rounded-full px-2.5 py-1 transition-colors ${
              isActive
                ? "bg-rose-700 text-white"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {lang}
          </button>
        );
      })}
    </div>
  );
}
