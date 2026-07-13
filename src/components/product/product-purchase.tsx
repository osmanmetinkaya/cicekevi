"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart/cart-context";

export function ProductPurchase({ product }: { product: Product }) {
  const { add } = useCart();
  const t = useTranslations("product");
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-full border border-line bg-white">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label={t("decrease")}
          className="rounded-full p-2.5 text-ink transition-colors hover:bg-blush-100 disabled:opacity-40"
          disabled={qty <= 1}
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center text-sm font-medium" aria-live="polite">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(50, q + 1))}
          aria-label={t("increase")}
          className="rounded-full p-2.5 text-ink transition-colors hover:bg-blush-100"
        >
          <Plus size={16} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => add(product, qty)}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-rose-700 px-7 py-3.5 font-medium text-white transition-colors hover:bg-rose-900"
      >
        <ShoppingBag size={18} /> {t("addToCart")}
      </button>
    </div>
  );
}
