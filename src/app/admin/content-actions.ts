"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { HeroSlide } from "@/lib/site-content";

/**
 * Site içeriği (ana sayfa hero slider'ı) yazma işlemleri. Slaytlar
 * public.site_content'te key='hero' satırının value.slides dizisinde
 * tutulur — ayrı bir tablo yerine oku/değiştir/yaz yeterli (az sayıda
 * satır, yüksek yazma sıklığı yok). RLS zaten yalnızca admin'e izin
 * verir; buradaki kontrol ikinci katman (defense in depth).
 */

export interface HeroSlideInput {
  /** Boşsa yeni slayt. */
  id?: string;
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

async function readSlides(
  supabase: NonNullable<Awaited<ReturnType<typeof requireAdmin>>>,
): Promise<HeroSlide[]> {
  const { data } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", "hero")
    .maybeSingle<{ value: { slides?: HeroSlide[] } }>();
  return Array.isArray(data?.value?.slides) ? data.value.slides : [];
}

async function writeSlides(
  supabase: NonNullable<Awaited<ReturnType<typeof requireAdmin>>>,
  slides: HeroSlide[],
) {
  return supabase
    .from("site_content")
    .upsert({ key: "hero", value: { slides } }, { onConflict: "key" });
}

function revalidateStorefront() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/icerik");
}

export async function saveHeroSlide(input: HeroSlideInput): Promise<Result> {
  const supabase = await requireAdmin();
  if (!supabase) return { error: "Yetkin yok." };

  const slide: HeroSlide = {
    id: input.id || randomUUID(),
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
    slide.eyebrow,
    slide.title1,
    slide.title2,
    slide.subtitle,
    slide.ctaExplore,
    slide.ctaBestsellers,
  ]) {
    if (!field.tr || !field.en) {
      return { error: "Tüm alanların Türkçe ve İngilizce karşılığı zorunlu." };
    }
  }

  const slides = await readSlides(supabase);
  const idx = slides.findIndex((s) => s.id === slide.id);
  if (idx >= 0) slides[idx] = slide;
  else slides.push(slide);

  const { error } = await writeSlides(supabase, slides);
  if (error) {
    console.error("[admin] hero slide save failed", error);
    return { error: "Slayt kaydedilemedi." };
  }

  revalidateStorefront();
  return { error: null };
}

export async function deleteHeroSlide(id: string): Promise<Result> {
  const supabase = await requireAdmin();
  if (!supabase) return { error: "Yetkin yok." };

  const slides = await readSlides(supabase);
  if (slides.length <= 1) {
    return { error: "En az bir slayt kalmalı." };
  }

  const { error } = await writeSlides(
    supabase,
    slides.filter((s) => s.id !== id),
  );
  if (error) {
    console.error("[admin] hero slide delete failed", error);
    return { error: "Slayt silinemedi." };
  }

  revalidateStorefront();
  return { error: null };
}

/** Slaytı listede bir yukarı ("up") veya bir aşağı taşır. */
export async function moveHeroSlide(
  id: string,
  direction: "up" | "down",
): Promise<Result> {
  const supabase = await requireAdmin();
  if (!supabase) return { error: "Yetkin yok." };

  const slides = await readSlides(supabase);
  const idx = slides.findIndex((s) => s.id === id);
  const target = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || target < 0 || target >= slides.length) {
    return { error: null };
  }
  [slides[idx], slides[target]] = [slides[target], slides[idx]];

  const { error } = await writeSlides(supabase, slides);
  if (error) {
    console.error("[admin] hero slide reorder failed", error);
    return { error: "Sıra güncellenemedi." };
  }

  revalidateStorefront();
  return { error: null };
}
