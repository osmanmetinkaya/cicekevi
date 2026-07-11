"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";
import { signIn, signUp, type AuthState } from "@/app/giris/actions";
import { GoogleButton } from "@/components/auth/google-button";

const INITIAL: AuthState = { error: null };

export function AuthForm({ next }: { next: string }) {
  const [mode, setMode] = useState<"giris" | "kayit">("giris");
  const [inState, signInAction, inPending] = useActionState(signIn, INITIAL);
  const [upState, signUpAction, upPending] = useActionState(signUp, INITIAL);

  const state = mode === "giris" ? inState : upState;
  const pending = mode === "giris" ? inPending : upPending;

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      {/* Mod seçici */}
      <div
        role="tablist"
        aria-label="Giriş veya kayıt"
        className="mb-6 grid grid-cols-2 rounded-full border border-line p-1 text-sm"
      >
        {(
          [
            { key: "giris", label: "Giriş yap" },
            { key: "kayit", label: "Üye ol" },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={mode === t.key}
            onClick={() => setMode(t.key)}
            className={`rounded-full py-2 transition-colors ${
              mode === t.key
                ? "bg-rose-700 text-white"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form action={mode === "giris" ? signInAction : signUpAction}>
        <input type="hidden" name="next" value={next} />

        {mode === "kayit" && (
          <>
            <div className="mb-4 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-sm text-ink-muted">Ad</span>
                <input
                  type="text"
                  name="firstName"
                  required
                  autoComplete="given-name"
                  placeholder="Ayşe"
                  className="w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-ink outline-none transition-colors focus:border-rose-500"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm text-ink-muted">
                  Soyad
                </span>
                <input
                  type="text"
                  name="lastName"
                  required
                  autoComplete="family-name"
                  placeholder="Yılmaz"
                  className="w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-ink outline-none transition-colors focus:border-rose-500"
                />
              </label>
            </div>
            <label className="mb-4 block">
              <span className="mb-1.5 block text-sm text-ink-muted">
                Telefon
              </span>
              <input
                type="tel"
                name="phone"
                required
                autoComplete="tel"
                inputMode="tel"
                placeholder="0555 123 45 67"
                className="w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-ink outline-none transition-colors focus:border-rose-500"
              />
            </label>
          </>
        )}

        <label className="block">
          <span className="mb-1.5 block text-sm text-ink-muted">E-posta</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="ornek@eposta.com"
            className="w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-ink outline-none transition-colors focus:border-rose-500"
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm text-ink-muted">Şifre</span>
          <input
            type="password"
            name="password"
            required
            minLength={mode === "kayit" ? 8 : undefined}
            autoComplete={mode === "giris" ? "current-password" : "new-password"}
            placeholder={mode === "kayit" ? "En az 8 karakter" : "••••••••"}
            className="w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-ink outline-none transition-colors focus:border-rose-500"
          />
        </label>

        {mode === "kayit" && (
          <label className="mt-4 flex items-start gap-2.5 text-sm text-ink-muted">
            <input
              type="checkbox"
              name="marketingConsent"
              className="mt-0.5 size-4 shrink-0 rounded border-line text-rose-700 focus:ring-rose-500"
            />
            <span>
              Kampanya ve fırsatlardan e-posta/SMS ile haberdar olmak
              istiyorum. <span className="text-xs">(isteğe bağlı)</span>
            </span>
          </label>
        )}

        {state.error && (
          <p className="mt-3 text-sm text-rose-700" role="alert">
            {state.error}
          </p>
        )}
        {state.notice && (
          <p className="mt-3 text-sm text-leaf-600" role="status">
            {state.notice}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-rose-700 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-900 disabled:opacity-60"
        >
          {mode === "giris" ? <LogIn size={16} /> : <UserPlus size={16} />}
          {pending
            ? "Bekleniyor…"
            : mode === "giris"
              ? "Giriş yap"
              : "Üye ol"}
        </button>

        {mode === "kayit" && (
          <p className="mt-3 text-center text-xs text-ink-muted">
            Üye olarak{" "}
            <Link
              href="/kvkk-aydinlatma-metni"
              target="_blank"
              className="text-rose-700 underline underline-offset-2"
            >
              KVKK Aydınlatma Metni
            </Link>
            &rsquo;ni kabul etmiş olursun.
          </p>
        )}
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs text-ink-muted">veya</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <GoogleButton next={next} />
    </div>
  );
}
