import type { Metadata } from "next";
import { Flower2 } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AuthForm } from "@/app/[locale]/giris/auth-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("loginTitle") };
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string; hata?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");
  const { next, hata } = await searchParams;
  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//") ? next : "/hesap";

  // Zaten girişliyse hesaba yönlendir (locale-farkında).
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect({ href: safeNext, locale });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <Flower2
          size={36}
          strokeWidth={1.5}
          className="mx-auto text-leaf-600"
        />
        <h1 className="mt-3 font-serif text-3xl text-ink">{t("welcome")}</h1>
        <p className="mt-1.5 text-sm text-ink-muted">{t("welcomeSubtitle")}</p>
      </div>

      {hata === "google" && (
        <p
          className="mb-4 rounded-xl bg-blush-100 px-4 py-3 text-center text-sm text-rose-700"
          role="alert"
        >
          {t("googleError")}
        </p>
      )}

      {isSupabaseConfigured() ? (
        <AuthForm next={safeNext} />
      ) : (
        <div className="rounded-2xl border border-line bg-white p-6 text-center text-sm text-ink-muted">
          {t("notConfigured")}
        </div>
      )}
    </div>
  );
}
