"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock4,
  Gift,
  LogIn,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  UserRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ContractConsent } from "@/components/order/contract-consent";
import { useCart } from "@/components/cart/cart-context";
import { Artwork } from "@/components/product/artwork";
import { formatKurus } from "@/lib/format";
import { pick, type Locale } from "@/lib/types";
import { DELIVERY_WINDOWS } from "@/lib/delivery";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

/** Girişli mi, misafir mi bilinmiyorsa "checking" — o sırada ödeme
 * kapısı gösterilmez, kontrol bitene kadar buton normal davranır. */
type AuthStatus = "checking" | "authed" | "guest";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function CartPage() {
  const { lines, setQty, remove, totalKurus } = useCart();
  const t = useTranslations("cartPage");
  const tc = useTranslations("cart");
  const locale = useLocale() as Locale;
  const [date, setDate] = useState("");
  const [win, setWin] = useState("");
  const [note, setNote] = useState("");
  const [contractAccepted, setContractAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>(
    isSupabaseConfigured() ? "checking" : "authed",
  );
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [guestConfirmed, setGuestConfirmed] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let cancelled = false;
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (!cancelled) setAuthStatus(data.user ? "authed" : "guest");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleCheckoutClick() {
    if (!date || !win) {
      setError(t("errorSelectDelivery"));
      return;
    }
    if (!contractAccepted) {
      setError(t("errorContract"));
      return;
    }
    // Üye değil ve henüz "üye olmadan devam et" demediyse, önce seçim sun.
    if (authStatus === "guest" && !guestConfirmed) {
      setError(null);
      setShowAuthGate(true);
      return;
    }
    submitOrder();
  }

  async function submitOrder() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ id: l.product.id, qty: l.qty })),
          delivery: { date, window: win },
          giftNote: note,
          contractAccepted,
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? t("errorCheckoutFailed"));
      }
      window.location.href = data.url as string;
    } catch (e) {
      setError(e instanceof Error ? e.message : t("errorGeneric"));
      setLoading(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <Artwork accent="blush" size={40} className="size-20 rounded-full" />
        <h1 className="mt-5 font-serif text-3xl text-ink">{t("emptyTitle")}</h1>
        <p className="mt-2 text-ink-muted">{t("emptyText")}</p>
        <Link
          href="/#buketler"
          className="mt-6 rounded-full bg-rose-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-900"
        >
          {t("startShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-serif text-4xl text-ink">{t("title")}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Sol: ürünler + teslimat + hediye notu */}
        <div className="space-y-8">
          <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
            {lines.map((l) => (
              <li key={l.product.id} className="flex gap-4 p-4">
                <Artwork
                  accent={l.product.accent}
                  size={30}
                  className="size-24 shrink-0 rounded-xl"
                />
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <Link
                      href={`/products/${l.product.slug}`}
                      className="font-serif text-lg text-ink transition-colors hover:text-rose-700"
                    >
                      {pick(l.product.name, locale)}
                    </Link>
                    <button
                      onClick={() => remove(l.product.id)}
                      aria-label={tc("remove", {
                        name: pick(l.product.name, locale),
                      })}
                      className="text-ink-muted transition-colors hover:text-rose-700"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                  <span className="text-sm text-ink-muted">
                    {pick(l.product.tagline, locale)}
                  </span>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-line">
                      <button
                        onClick={() => setQty(l.product.id, l.qty - 1)}
                        aria-label={tc("decrease")}
                        className="rounded-full p-2 text-ink hover:bg-blush-100"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-7 text-center text-sm">{l.qty}</span>
                      <button
                        onClick={() => setQty(l.product.id, l.qty + 1)}
                        aria-label={tc("increase")}
                        className="rounded-full p-2 text-ink hover:bg-blush-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-medium text-leaf-600">
                      {formatKurus(l.product.priceKurus * l.qty)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Teslimat */}
          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-serif text-xl text-ink">{t("delivery")}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-sm text-ink-muted">
                  <CalendarDays size={15} /> {t("deliveryDate")}
                </span>
                <input
                  type="date"
                  min={todayISO()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-ink outline-none transition-colors focus:border-rose-500"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-sm text-ink-muted">
                  <Clock4 size={15} /> {t("timeWindow")}
                </span>
                <select
                  value={win}
                  onChange={(e) => setWin(e.target.value)}
                  className="w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-ink outline-none transition-colors focus:border-rose-500"
                >
                  <option value="">{t("select")}</option>
                  {DELIVERY_WINDOWS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          {/* Hediye notu */}
          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="flex items-center gap-2 font-serif text-xl text-ink">
              <Gift size={18} className="text-rose-700" /> {t("giftNote")}
              <span className="text-sm font-normal text-ink-muted">
                {t("optional")}
              </span>
            </h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 400))}
              rows={3}
              placeholder={t("giftPlaceholder")}
              className="mt-3 w-full resize-none rounded-xl border border-line bg-cream px-3 py-2.5 text-ink outline-none transition-colors focus:border-rose-500"
            />
            <p className="mt-1 text-right text-xs text-ink-muted">
              {note.length}/400
            </p>
          </section>
        </div>

        {/* Sağ: özet */}
        <aside className="lg:sticky lg:top-28 h-fit rounded-2xl border border-line bg-white p-5">
          <h2 className="font-serif text-xl text-ink">{t("orderSummary")}</h2>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-ink-muted">{t("subtotal")}</span>
            <span className="text-ink">{formatKurus(totalKurus)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-ink-muted">{t("delivery")}</span>
            <span className="text-ink-muted">{t("deliveryAtCheckout")}</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="font-medium text-ink">{t("total")}</span>
            <span className="font-serif text-2xl text-ink">
              {formatKurus(totalKurus)}
            </span>
          </div>

          <div className="mt-4 border-t border-line pt-4">
            <ContractConsent
              checked={contractAccepted}
              onChange={setContractAccepted}
            />
          </div>

          {error && (
            <p className="mt-3 text-sm text-rose-700" role="alert">
              {error}
            </p>
          )}

          {showAuthGate ? (
            <div className="mt-4 space-y-3 rounded-2xl border border-line bg-cream p-4">
              <p className="text-sm text-ink">{t("authGateText")}</p>
              <Link
                href="/giris?next=/sepet"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-700 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-900"
              >
                <LogIn size={16} /> {t("loginCta")}
              </Link>
              <button
                onClick={() => {
                  setGuestConfirmed(true);
                  setShowAuthGate(false);
                  submitOrder();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-line py-3 text-sm font-medium text-ink transition-colors hover:border-blush-300 hover:text-rose-700"
              >
                <UserRound size={16} /> {t("guestCta")}
              </button>
              <button
                onClick={() => setShowAuthGate(false)}
                className="w-full text-center text-xs text-ink-muted transition-colors hover:text-ink"
              >
                {t("cancelGate")}
              </button>
            </div>
          ) : (
            <button
              onClick={handleCheckoutClick}
              disabled={loading || authStatus === "checking"}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-rose-700 py-3.5 text-sm font-medium text-white transition-colors hover:bg-rose-900 disabled:opacity-60"
            >
              <ShoppingBag size={17} />
              {loading ? t("redirecting") : t("secureCheckout")}
            </button>
          )}
          <p className="mt-3 text-center text-xs text-ink-muted">
            {t("sslNote")}
          </p>
        </aside>
      </div>
    </div>
  );
}
