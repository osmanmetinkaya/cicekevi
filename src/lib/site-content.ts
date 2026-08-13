import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Site geneli, sabit kod yerine veritabanında (public.site_content,
 * key/value) tutulan içerikler. Şimdilik yalnızca ana sayfa hero
 * slider'ı; ihtiyaç oldukça yeni "key" değerleriyle genişletilir.
 */
export interface HeroSlide {
  /** Admin panelinde düzenleme/silme/sıralama için sabit anahtar. */
  id: string;
  eyebrow: { tr: string; en: string };
  title1: { tr: string; en: string };
  title2: { tr: string; en: string };
  subtitle: { tr: string; en: string };
  ctaExplore: { tr: string; en: string };
  ctaBestsellers: { tr: string; en: string };
  imageUrl: string | null;
}

export interface HeroContent {
  slides: HeroSlide[];
}

/** Supabase yapılandırılmadıysa veya satır yoksa kullanılan varsayılan
 * (mevcut ana sayfa metniyle birebir) — site hiçbir zaman boş görünmesin. */
export const DEFAULT_HERO_SLIDE: HeroSlide = {
  id: "default",
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

export const DEFAULT_HERO_CONTENT: HeroContent = {
  slides: [DEFAULT_HERO_SLIDE],
};

/** Eski (tekli obje) satırları da anlayabilsin diye savunma amaçlı normalize. */
function normalize(value: unknown): HeroContent {
  if (
    value &&
    typeof value === "object" &&
    Array.isArray((value as { slides?: unknown }).slides)
  ) {
    const slides = (value as HeroContent).slides;
    return slides.length > 0 ? { slides } : DEFAULT_HERO_CONTENT;
  }
  // Eski şema: doğrudan tek slayt alanları — bir dizi olarak sarmala.
  if (value && typeof value === "object" && "eyebrow" in value) {
    return { slides: [{ id: "legacy", ...(value as Omit<HeroSlide, "id">) }] };
  }
  return DEFAULT_HERO_CONTENT;
}

export const getHeroContent = cache(async (): Promise<HeroContent> => {
  if (!isSupabaseConfigured()) return DEFAULT_HERO_CONTENT;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", "hero")
    .maybeSingle<{ value: unknown }>();

  if (error || !data) return DEFAULT_HERO_CONTENT;
  return normalize(data.value);
});
