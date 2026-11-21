import { ArrowRight, GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function TeachersDayBanner() {
  const t = useTranslations("teachersDay");

  return (
    <section className="px-4 py-8 sm:px-6 sm:py-10">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-rose-700 via-rose-700 to-rose-900 px-6 py-10 text-center shadow-lg sm:px-12 sm:py-14">
        <div className="pointer-events-none absolute -left-16 -top-16 size-56 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 size-64 rounded-full bg-white/10" />

        <div className="relative flex flex-col items-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-white/15 text-white">
            <GraduationCap size={30} strokeWidth={1.5} />
          </span>
          <p className="mt-4 text-xs font-medium tracking-[0.2em] text-blush-200">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 max-w-2xl text-balance font-serif text-3xl leading-tight text-white sm:text-5xl">
            {t("text")}
          </h2>
          <Link
            href="/kategori/ogretmenler-gunu"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-medium text-rose-700 shadow-md transition-all hover:-translate-y-0.5 hover:bg-blush-50 hover:shadow-lg"
          >
            {t("cta")} <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
