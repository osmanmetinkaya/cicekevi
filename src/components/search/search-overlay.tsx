"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearch } from "@/components/search/search-context";

export function SearchOverlay() {
  const { open, setOpen } = useSearch();
  const t = useTranslations("search");
  const popular = t.raw("popularTerms") as string[];
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Odaklan, Esc ile kapan, açıkken sayfa kaydırmayı kilitle.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      {/* İnce örtü — asıl bulanıklık sayfa gövdesine uygulanır (PageShell). */}
      <button
        type="button"
        aria-label={t("close")}
        onClick={() => setOpen(false)}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/10"
      />

      {/* Ortada beliren, aşağı süzülen arama paneli (net kalır). */}
      <div className="relative flex min-h-full items-start justify-center px-4 pt-[16vh]">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("dialogLabel")}
          className={`w-full max-w-xl rounded-3xl border border-line bg-cream p-2 shadow-2xl shadow-rose-900/10 transition-all duration-300 ${
            open
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-4 scale-95 opacity-0"
          }`}
        >
          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
            <Search size={22} className="shrink-0 text-rose-700" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              enterKeyHint="search"
              placeholder={t("placeholder")}
              className="w-full bg-transparent text-lg text-ink outline-none placeholder:text-ink-muted"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("closeShort")}
              className="rounded-full p-1 text-ink-muted transition-colors hover:bg-blush-100 hover:text-ink"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-4 py-4">
            <p className="mb-2 text-xs font-medium tracking-widest text-ink-muted">
              {t("popular")}
            </p>
            <div className="flex flex-wrap gap-2">
              {popular.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="rounded-full bg-blush-100 px-3.5 py-1.5 text-sm text-rose-700 transition-colors hover:bg-blush-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
