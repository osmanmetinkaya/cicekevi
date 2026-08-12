"use client";

import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/components/cart/cart-context";
import { Artwork } from "@/components/product/artwork";
import { ProductImage } from "@/components/product/product-image";
import { formatKurus } from "@/lib/format";
import { pick, type Locale } from "@/lib/types";

export function CartDrawer() {
  const { lines, isOpen, close, setQty, remove, totalKurus, count } = useCart();
  const t = useTranslations("cart");
  const locale = useLocale() as Locale;

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink/30 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label={t("drawerLabel")}
        aria-modal="true"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="flex items-center gap-2 font-serif text-xl text-ink">
            <ShoppingBag size={20} /> {t("yourCart")}
            {count > 0 && (
              <span className="text-sm text-ink-muted">({count})</span>
            )}
          </h2>
          <button
            onClick={close}
            aria-label={t("closeCart")}
            className="rounded-full p-1 text-ink-muted hover:bg-blush-100 hover:text-ink"
          >
            <X size={22} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <Artwork accent="blush" size={40} className="size-20 rounded-full" />
            <p className="font-serif text-lg text-ink">
              {t("emptyDrawerTitle")}
            </p>
            <p className="text-sm text-ink-muted">{t("emptyDrawerText")}</p>
            <button
              onClick={close}
              className="mt-2 rounded-full bg-rose-700 px-5 py-2.5 text-sm text-white hover:bg-rose-900"
            >
              {t("startShopping")}
            </button>
          </div>
        ) : (
          <>
            <ul className="scroll-soft flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {lines.map((l) => (
                <li key={l.product.id} className="flex gap-3">
                  <ProductImage
                    product={l.product}
                    size={26}
                    sizes="80px"
                    className="size-20 shrink-0 rounded-xl"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <span className="font-serif text-ink">
                        {pick(l.product.name, locale)}
                      </span>
                      <button
                        onClick={() => remove(l.product.id)}
                        aria-label={t("remove", {
                          name: pick(l.product.name, locale),
                        })}
                        className="text-ink-muted hover:text-rose-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <span className="text-xs text-ink-muted">
                      {pick(l.product.tagline, locale)}
                    </span>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 rounded-full border border-line bg-white px-1">
                        <button
                          onClick={() => setQty(l.product.id, l.qty - 1)}
                          aria-label={t("decrease")}
                          className="rounded-full p-1 text-ink hover:bg-blush-100"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-5 text-center text-sm">{l.qty}</span>
                        <button
                          onClick={() => setQty(l.product.id, l.qty + 1)}
                          aria-label={t("increase")}
                          className="rounded-full p-1 text-ink hover:bg-blush-100"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-leaf-600">
                        {formatKurus(l.product.priceKurus * l.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-line px-5 py-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-ink-muted">{t("subtotal")}</span>
                <span className="font-serif text-xl text-ink">
                  {formatKurus(totalKurus)}
                </span>
              </div>
              <p className="mb-3 text-xs text-ink-muted">{t("drawerNote")}</p>
              <Link
                href="/sepet"
                onClick={close}
                className="block w-full rounded-full bg-rose-700 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-rose-900"
              >
                {t("goToCart")}
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
