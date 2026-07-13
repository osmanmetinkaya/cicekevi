"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useFavorites } from "@/components/favorites/favorites-context";

export function FavoritesButton() {
  const { count } = useFavorites();
  const t = useTranslations("header");
  return (
    <Link
      href="/favoriler"
      aria-label={t("favoritesLabel", { count })}
      className="relative rounded-full p-2 text-ink transition-colors hover:bg-blush-100"
    >
      <Heart size={20} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex size-4.5 min-w-[18px] items-center justify-center rounded-full bg-rose-700 px-1 text-[10px] font-medium text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
