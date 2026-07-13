"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearch } from "@/components/search/search-context";

export function SearchTrigger() {
  const { open, setOpen } = useSearch();
  const t = useTranslations("search");
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={t("trigger")}
      aria-expanded={open}
      className="rounded-full p-2 text-ink transition-colors hover:bg-blush-100"
    >
      <Search size={20} />
    </button>
  );
}
