"use client";

import { useEffect, useState } from "react";
import { Flower2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { pick, type Locale } from "@/lib/types";
import type { HeroSlide } from "@/lib/site-content";

const AUTOPLAY_MS = 6000;

/**
 * Tam genişlik (full-bleed) ana sayfa banner'ı. Birden fazla slayt varsa
 * otomatik döner (hover'da durur) + ok/nokta kontrolleriyle gezilebilir.
 * Yalnızca aktif slayt DOM'da tutulur (crossfade yerine basit fade-in) —
 * bu sayede yükseklik her slaytın kendi içeriğine göre doğal oturur,
 * sabit bir min-height'a bağlı kalmaz.
 */
export function HeroCarousel({
  slides,
  locale,
}: {
  slides: HeroSlide[];
  locale: Locale;
}) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (count <= 1 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count, paused]);

  if (count === 0) return null;
  const slide = slides[index];

  function go(next: number) {
    setIndex(((next % count) + count) % count);
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-blush-100"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        key={slide.id}
        className="hero-slide grid md:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="flex flex-col justify-center gap-4 px-6 py-12 sm:px-12 lg:px-20">
          <p className="text-xs font-medium tracking-widest text-rose-700">
            {pick(slide.eyebrow, locale)}
          </p>
          <h1 className="font-serif text-4xl leading-tight text-rose-900 sm:text-5xl lg:text-6xl">
            {pick(slide.title1, locale)}
            <br />
            {pick(slide.title2, locale)}
          </h1>
          <p className="max-w-md text-rose-700/90">
            {pick(slide.subtitle, locale)}
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              href="/#buketler"
              className="rounded-full bg-rose-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-900"
            >
              {pick(slide.ctaExplore, locale)}
            </Link>
            <Link
              href="/#buketler"
              className="rounded-full border border-rose-500 px-6 py-3 text-sm font-medium text-rose-700 transition-colors hover:bg-blush-50"
            >
              {pick(slide.ctaBestsellers, locale)}
            </Link>
          </div>
        </div>
        <div className="relative flex min-h-56 items-center justify-center overflow-hidden bg-blush-300">
          {slide.imageUrl ? (
            <Image
              src={slide.imageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index === 0}
              className="object-cover"
            />
          ) : (
            <Flower2 size={96} strokeWidth={1.1} className="text-rose-900/80" />
          )}
        </div>
      </div>

      {count > 1 && (
        <>
          {/* Mobilde metin + görsel dikey yığılıp bölüm çok uzadığı için
              "ortada" konumlanan oklar CTA butonlarının üzerine biniyordu;
              sm ve üzeri (yan yana düzen) yeterli, mobilde noktalar kalır. */}
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Önceki slayt"
            className="absolute top-1/2 left-3 z-10 hidden -translate-y-1/2 rounded-full bg-white/85 p-2 text-ink shadow-sm transition-colors hover:bg-white sm:block"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Sonraki slayt"
            className="absolute top-1/2 right-3 z-10 hidden -translate-y-1/2 rounded-full bg-white/85 p-2 text-ink shadow-sm transition-colors hover:bg-white sm:block"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`${i + 1}. slayt`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-rose-700" : "w-2 bg-rose-700/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
