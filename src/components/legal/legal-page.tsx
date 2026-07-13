import { ChevronLeft, Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LEGAL_LAST_UPDATED, LEGAL_LAST_UPDATED_EN } from "@/lib/legal-info";

/**
 * `authoritativeHref` verilen İngilizce yasal sayfalarda, Türkçe sürümün
 * bağlayıcı/asıl metin olduğunu belirten görünür bir not ve o sürüme link
 * gösterilir. Türkçe (varsayılan) sayfalarda not gösterilmez.
 */
export function LegalPage({
  title,
  authoritativeHref,
  children,
}: {
  title: string;
  authoritativeHref?: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("legal");
  const locale = useLocale();
  const showAuthoritativeNote = locale === "en" && authoritativeHref;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-rose-700"
      >
        <ChevronLeft size={15} /> {t("home")}
      </Link>

      <h1 className="mt-4 font-serif text-3xl text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-1 text-sm text-ink-muted">
        {t("lastUpdated")}:{" "}
        {locale === "en" ? LEGAL_LAST_UPDATED_EN : LEGAL_LAST_UPDATED}
      </p>

      {showAuthoritativeNote && (
        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-blush-300 bg-blush-50 px-4 py-3 text-sm text-ink-muted">
          <Info size={17} className="mt-0.5 shrink-0 text-rose-700" />
          <p>
            {t("authoritativeNote")}{" "}
            <Link
              href={authoritativeHref}
              locale="tr"
              className="text-rose-700 underline underline-offset-2"
            >
              {t("authoritativeLink")}
            </Link>
            .
          </p>
        </div>
      )}

      <div className="prose-legal mt-8 space-y-5 text-[15px] leading-relaxed text-ink">
        {children}
      </div>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 font-serif text-xl text-ink">{title}</h2>
      <div className="space-y-3 text-ink-muted">{children}</div>
    </section>
  );
}
