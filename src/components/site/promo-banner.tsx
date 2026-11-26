import { ArrowRight, Gift } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** "Sevgililer Günü" -> "Sevgililer Gününe" (yönelme hâli). Özel gün
 * kategorilerinin hepsi "Günü" ile biter; olmayanlar olduğu gibi kalır. */
function trDative(label: string): string {
  return label.endsWith("Günü") ? `${label}ne` : label;
}

export function PromoBanner({
  slug,
  labelTr,
  labelEn,
}: {
  slug: string;
  labelTr: string;
  labelEn: string;
}) {
  const t = useTranslations("promoBanner");
  const locale = useLocale();
  const isEn = locale === "en";
  const label = isEn ? labelEn : labelTr;

  return (
    <section className="px-4 py-8 sm:px-6 sm:py-10">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-rose-700 via-rose-700 to-rose-900 px-6 py-10 text-center shadow-lg sm:px-12 sm:py-14">
        <div className="pointer-events-none absolute -left-16 -top-16 size-56 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 size-64 rounded-full bg-white/10" />

        <div className="relative flex flex-col items-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-white/15 text-white">
            <Gift size={30} strokeWidth={1.5} />
          </span>
          <p className="mt-4 text-xs font-medium tracking-[0.2em] text-blush-200">
            {label.toLocaleUpperCase(isEn ? "en-GB" : "tr-TR")}
          </p>
          <h2 className="mt-3 max-w-2xl text-balance font-serif text-3xl leading-tight text-white sm:text-5xl">
            {t("text", { day: isEn ? labelEn : trDative(labelTr) })}
          </h2>
          <Link
            href={`/kategori/${slug}`}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-medium text-rose-700 shadow-md transition-all hover:-translate-y-0.5 hover:bg-blush-50 hover:shadow-lg"
          >
            {t("cta")} <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
