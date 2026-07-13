import { Flower2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Hero() {
  const t = useTranslations("hero");
  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <div className="grid overflow-hidden rounded-3xl border border-line bg-blush-100 md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center gap-4 px-7 py-12 sm:px-12">
          <p className="text-xs font-medium tracking-widest text-rose-700">
            {t("eyebrow")}
          </p>
          <h1 className="font-serif text-4xl leading-tight text-rose-900 sm:text-5xl">
            {t("titleLine1")}
            <br />
            {t("titleLine2")}
          </h1>
          <p className="max-w-md text-rose-700/90">{t("subtitle")}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              href="/#buketler"
              className="rounded-full bg-rose-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-900"
            >
              {t("ctaExplore")}
            </Link>
            <Link
              href="/#buketler"
              className="rounded-full border border-rose-500 px-6 py-3 text-sm font-medium text-rose-700 transition-colors hover:bg-blush-50"
            >
              {t("ctaBestsellers")}
            </Link>
          </div>
        </div>
        <div className="flex min-h-56 items-center justify-center bg-blush-300">
          <Flower2 size={96} strokeWidth={1.1} className="text-rose-900/80" />
        </div>
      </div>
    </section>
  );
}
