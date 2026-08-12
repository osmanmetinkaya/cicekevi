"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { signIn, signUp, type AuthState } from "@/app/[locale]/giris/actions";
import { GoogleButton } from "@/components/auth/google-button";

const INITIAL: AuthState = { error: null };

export function AuthForm({ next }: { next: string }) {
  const t = useTranslations("auth");
  const [mode, setMode] = useState<"giris" | "kayit">("giris");
  const [showPassword, setShowPassword] = useState(false);
  const [inState, signInAction, inPending] = useActionState(signIn, INITIAL);
  const [upState, signUpAction, upPending] = useActionState(signUp, INITIAL);

  const state = mode === "giris" ? inState : upState;
  const pending = mode === "giris" ? inPending : upPending;

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      {/* Mod seçici */}
      <div
        role="tablist"
        aria-label={t("tabsLabel")}
        className="mb-6 grid grid-cols-2 rounded-full border border-line p-1 text-sm"
      >
        {(
          [
            { key: "giris", label: t("signIn") },
            { key: "kayit", label: t("signUp") },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={mode === tab.key}
            onClick={() => setMode(tab.key)}
            className={`rounded-full py-2 transition-colors ${
              mode === tab.key
                ? "bg-rose-700 text-white"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form action={mode === "giris" ? signInAction : signUpAction}>
        <input type="hidden" name="next" value={next} />

        {mode === "kayit" && (
          <>
            <div className="mb-4 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-sm text-ink-muted">
                  {t("firstName")}
                </span>
                <input
                  type="text"
                  name="firstName"
                  required
                  autoComplete="given-name"
                  placeholder={t("firstNamePlaceholder")}
                  className="w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-ink outline-none transition-colors focus:border-rose-500"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm text-ink-muted">
                  {t("lastName")}
                </span>
                <input
                  type="text"
                  name="lastName"
                  required
                  autoComplete="family-name"
                  placeholder={t("lastNamePlaceholder")}
                  className="w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-ink outline-none transition-colors focus:border-rose-500"
                />
              </label>
            </div>
            <label className="mb-4 block">
              <span className="mb-1.5 block text-sm text-ink-muted">
                {t("phone")}
              </span>
              <input
                type="tel"
                name="phone"
                required
                autoComplete="tel"
                inputMode="tel"
                placeholder={t("phonePlaceholder")}
                className="w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-ink outline-none transition-colors focus:border-rose-500"
              />
            </label>
          </>
        )}

        <label className="block">
          <span className="mb-1.5 block text-sm text-ink-muted">
            {mode === "giris" ? t("emailOrPhone") : t("email")}
          </span>
          {mode === "giris" ? (
            <input
              type="text"
              name="identifier"
              required
              autoComplete="username"
              placeholder={t("emailOrPhonePlaceholder")}
              className="w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-ink outline-none transition-colors focus:border-rose-500"
            />
          ) : (
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              className="w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-ink outline-none transition-colors focus:border-rose-500"
            />
          )}
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm text-ink-muted">
            {t("password")}
          </span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              minLength={mode === "kayit" ? 8 : undefined}
              autoComplete={mode === "giris" ? "current-password" : "new-password"}
              placeholder={mode === "kayit" ? t("passwordHintSignup") : "••••••••"}
              className="w-full rounded-xl border border-line bg-cream px-3 py-2.5 pr-11 text-ink outline-none transition-colors focus:border-rose-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-muted transition-colors hover:text-rose-700"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </label>

        {mode === "kayit" && (
          <label className="mt-4 flex items-start gap-2.5 text-sm text-ink-muted">
            <input
              type="checkbox"
              name="marketingConsent"
              className="mt-0.5 size-4 shrink-0 rounded border-line text-rose-700 focus:ring-rose-500"
            />
            <span>
              {t("marketingConsent")}{" "}
              <span className="text-xs">{t("marketingOptional")}</span>
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
            ? t("waiting")
            : mode === "giris"
              ? t("signIn")
              : t("signUp")}
        </button>

        {mode === "kayit" && (
          <p className="mt-3 text-center text-xs text-ink-muted">
            {t("kvkkConsentPre")}{" "}
            <Link
              href="/kvkk-aydinlatma-metni"
              target="_blank"
              className="text-rose-700 underline underline-offset-2"
            >
              {t("kvkkConsentLink")}
            </Link>
            {t("kvkkConsentPost")}
          </p>
        )}
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs text-ink-muted">{t("or")}</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <GoogleButton next={next} />
    </div>
  );
}
