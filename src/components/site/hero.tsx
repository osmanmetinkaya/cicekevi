import { Flower2 } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getHeroContent } from "@/lib/site-content";
import { pick, type Locale } from "@/lib/types";

/** Ana sayfa banner'ı. Metinler ve görsel admin panelden (/admin/icerik)
 * yönetilir; görsel yüklenmemişse mevcut çiçek ikonuna düşer. */
export async function Hero({ locale }: { locale: Locale }) {
  const hero = await getHeroContent();

  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <div className="grid overflow-hidden rounded-3xl border border-line bg-blush-100 md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center gap-4 px-7 py-12 sm:px-12">
          <p className="text-xs font-medium tracking-widest text-rose-700">
            {pick(hero.eyebrow, locale)}
          </p>
          <h1 className="font-serif text-4xl leading-tight text-rose-900 sm:text-5xl">
            {pick(hero.title1, locale)}
            <br />
            {pick(hero.title2, locale)}
          </h1>
          <p className="max-w-md text-rose-700/90">
            {pick(hero.subtitle, locale)}
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              href="/#buketler"
              className="rounded-full bg-rose-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-900"
            >
              {pick(hero.ctaExplore, locale)}
            </Link>
            <Link
              href="/#buketler"
              className="rounded-full border border-rose-500 px-6 py-3 text-sm font-medium text-rose-700 transition-colors hover:bg-blush-50"
            >
              {pick(hero.ctaBestsellers, locale)}
            </Link>
          </div>
        </div>
        <div className="relative flex min-h-56 items-center justify-center overflow-hidden bg-blush-300">
          {hero.imageUrl ? (
            <Image
              src={hero.imageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          ) : (
            <Flower2 size={96} strokeWidth={1.1} className="text-rose-900/80" />
          )}
        </div>
      </div>
    </section>
  );
}
