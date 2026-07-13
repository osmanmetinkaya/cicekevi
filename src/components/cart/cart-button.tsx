"use client";

import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCart } from "@/components/cart/cart-context";

export function CartButton() {
  const { count, open } = useCart();
  const t = useTranslations("cart");
  return (
    <button
      onClick={open}
      aria-label={t("openLabel", { count })}
      className="relative rounded-full p-2 text-ink transition-colors hover:bg-blush-100"
    >
      <ShoppingBag size={20} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex size-4.5 min-w-[18px] items-center justify-center rounded-full bg-rose-700 px-1 text-[10px] font-medium text-white">
          {count}
        </span>
      )}
    </button>
  );
}
