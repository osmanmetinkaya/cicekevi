"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFavorites } from "@/components/favorites/favorites-context";

/**
 * Kalp ikonlu favori aç/kapat butonu. Ürün kartlarında görsel üzerine bindirme
 * (`variant="overlay"`) veya ürün detayında düz buton (`variant="solid"`)
 * olarak kullanılır.
 */
export function FavoriteButton({
  productId,
  name,
  variant = "overlay",
}: {
  productId: string;
  name: string;
  variant?: "overlay" | "solid";
}) {
  const { has, toggle } = useFavorites();
  const t = useTranslations("product");
  const active = has(productId);

  const label = active
    ? t("removeFromFavoritesLabel", { name })
    : t("addToFavoritesLabel", { name });

  if (variant === "solid") {
    return (
      <button
        type="button"
        onClick={() => toggle(productId)}
        aria-label={label}
        aria-pressed={active}
        className={`inline-flex items-center justify-center rounded-full border p-3 transition-colors ${
          active
            ? "border-rose-500 bg-blush-100 text-rose-700"
            : "border-line bg-white text-ink-muted hover:border-blush-300 hover:text-rose-700"
        }`}
      >
        <Heart size={19} fill={active ? "currentColor" : "none"} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        // Kart bir <Link> içinde; tıklama sayfaya gitmesin.
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      aria-label={label}
      aria-pressed={active}
      className={`absolute right-3 top-3 z-10 inline-flex size-8 items-center justify-center rounded-full backdrop-blur transition-colors ${
        active
          ? "bg-rose-700 text-white"
          : "bg-white/80 text-ink-muted hover:text-rose-700"
      }`}
    >
      <Heart size={16} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
