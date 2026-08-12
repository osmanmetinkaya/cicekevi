import type { Metadata } from "next";
import { ChevronLeft, Mail, MapPin, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LEGAL_ENTITY } from "@/lib/legal-info";
import { SITE_NAME } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return { title: `${t("title")} — ${SITE_NAME}` };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contactPage");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-rose-700"
      >
        <ChevronLeft size={15} /> {t("home")}
      </Link>

      <h1 className="mt-4 font-serif text-3xl text-ink sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-2 text-ink-muted">{t("subtitle")}</p>

      <div className="mt-8 space-y-4">
        <a
          href={`tel:${LEGAL_ENTITY.phone.replace(/\s/g, "")}`}
          className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition-colors hover:border-blush-300"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blush-100 text-rose-700">
            <Phone size={19} />
          </span>
          <div>
            <p className="text-xs text-ink-muted">{t("phoneLabel")}</p>
            <p className="text-ink">{LEGAL_ENTITY.phone}</p>
          </div>
        </a>

        <a
          href={`mailto:${LEGAL_ENTITY.supportEmail}`}
          className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition-colors hover:border-blush-300"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blush-100 text-rose-700">
            <Mail size={19} />
          </span>
          <div>
            <p className="text-xs text-ink-muted">{t("emailLabel")}</p>
            <p className="text-ink">{LEGAL_ENTITY.supportEmail}</p>
          </div>
        </a>

        <div className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blush-100 text-rose-700">
            <MapPin size={19} />
          </span>
          <div>
            <p className="text-xs text-ink-muted">{t("addressLabel")}</p>
            <p className="text-ink">{LEGAL_ENTITY.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
