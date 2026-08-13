import { getHeroContent } from "@/lib/site-content";
import { HeroCarousel } from "@/components/site/hero-carousel";
import type { Locale } from "@/lib/types";

/** Ana sayfa banner'ı. Slaytlar (metin + görsel) admin panelden
 * (/admin/icerik) yönetilir; hiç slayt yoksa varsayılana düşülür. */
export async function Hero({ locale }: { locale: Locale }) {
  const { slides } = await getHeroContent();
  return <HeroCarousel slides={slides} locale={locale} />;
}
