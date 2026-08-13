import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Site geneli, sabit kod yerine veritabanında (public.site_content,
 * key/value) tutulan içerikler. Şimdilik yalnızca ana sayfa hero banner'ı;
 * ihtiyaç oldukça yeni "key" değerleriyle genişletilir.
 */
export interface HeroContent {
  eyebrow: { tr: string; en: string };
  title1: { tr: string; en: string };
  title2: { tr: string; en: string };
  subtitle: { tr: string; en: string };
  ctaExplore: { tr: string; en: string };
  ctaBestsellers: { tr: string; en: string };
  imageUrl: string | null;
}

/** Supabase yapılandırılmadıysa veya satır yoksa kullanılan varsayılan
 * (mevcut ana sayfa metniyle birebir) — site hiçbir zaman boş görünmesin. */
export const DEFAULT_HERO_CONTENT: HeroContent = {
  eyebrow: {
    tr: "AYNI GÜN TESLİMAT · DENİZLİ İÇİ",
    en: "SAME-DAY DELIVERY · WITHIN DENİZLİ",
  },
  title1: { tr: "Taze çiçekler,", en: "Fresh flowers," },
  title2: { tr: "bugün kapında.", en: "at your door today." },
  subtitle: {
    tr: "Mevsiminde toplanan buketler ustalarımızın elinden çıkar. Saat 15.00'e kadar verilen siparişler aynı gün ulaşır.",
    en: "Seasonal bouquets, arranged by hand by our florists. Orders placed by 3 p.m. arrive the same day.",
  },
  ctaExplore: { tr: "Buketleri keşfet", en: "Explore bouquets" },
  ctaBestsellers: { tr: "Çok satanlar", en: "Bestsellers" },
  imageUrl: null,
};

export const getHeroContent = cache(async (): Promise<HeroContent> => {
  if (!isSupabaseConfigured()) return DEFAULT_HERO_CONTENT;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", "hero")
    .maybeSingle<{ value: HeroContent }>();

  if (error || !data) return DEFAULT_HERO_CONTENT;
  return { ...DEFAULT_HERO_CONTENT, ...data.value };
});
