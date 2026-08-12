"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { HeroContent } from "@/lib/site-content";

/**
 * Site içeriği (şimdilik yalnızca ana sayfa hero banner'ı) yazma işlemi.
 * RLS zaten yalnızca admin'e izin verir; burası ikinci katman (defense in
 * depth), catalog-actions.ts'teki requireAdmin ile aynı desen.
 */

export interface HeroContentInput {
  eyebrowTr: string;
  eyebrowEn: string;
  title1Tr: string;
  title1En: string;
  title2Tr: string;
  title2En: string;
  subtitleTr: string;
  subtitleEn: string;
  ctaExploreTr: string;
  ctaExploreEn: string;
  ctaBestsellersTr: string;
  ctaBestsellersEn: string;
  imageUrl: string | null;
}

type Result = { error: string | null };

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") return null;
  return supabase;
}

export async function saveHeroContent(input: HeroContentInput): Promise<Result> {
  const supabase = await requireAdmin();
  if (!supabase) return { error: "Yetkin yok." };

  const value: HeroContent = {
    eyebrow: { tr: input.eyebrowTr.trim(), en: input.eyebrowEn.trim() },
    title1: { tr: input.title1Tr.trim(), en: input.title1En.trim() },
    title2: { tr: input.title2Tr.trim(), en: input.title2En.trim() },
    subtitle: { tr: input.subtitleTr.trim(), en: input.subtitleEn.trim() },
    ctaExplore: { tr: input.ctaExploreTr.trim(), en: input.ctaExploreEn.trim() },
    ctaBestsellers: {
      tr: input.ctaBestsellersTr.trim(),
      en: input.ctaBestsellersEn.trim(),
    },
    imageUrl: input.imageUrl?.trim() || null,
  };

  for (const field of [
    value.eyebrow,
    value.title1,
    value.title2,
    value.subtitle,
    value.ctaExplore,
    value.ctaBestsellers,
  ]) {
    if (!field.tr || !field.en) {
      return { error: "Tüm alanların Türkçe ve İngilizce karşılığı zorunlu." };
    }
  }

  const { error } = await supabase
    .from("site_content")
    .upsert({ key: "hero", value }, { onConflict: "key" });

  if (error) {
    console.error("[admin] hero content save failed", error);
    return { error: "İçerik kaydedilemedi." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/icerik");
  return { error: null };
}
