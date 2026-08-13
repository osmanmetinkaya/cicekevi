"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SITE_NAME } from "@/lib/site";

/**
 * Sitenin ilk (sert) yüklenişinde bir kez oynayan logo animasyonu.
 * Tam logo (gül + "çiçekevi" yazısı) tek parça olarak, sade bir
 * büyüyüp-beliren hareketle görünür — premium markaların tercih ettiği
 * "az hareket, çok his" dili.
 */
export function IntroSplash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
    }
  }, []);

  if (!show) return null;

  return (
    <div
      className="intro-splash"
      aria-hidden="true"
      onAnimationEnd={(e) => {
        if (e.animationName === "intro-fade") setShow(false);
      }}
    >
      <Image
        src="/logo.svg"
        alt={SITE_NAME}
        width={280}
        height={108}
        priority
        className="intro-splash__logo"
      />
    </div>
  );
}
