"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SITE_NAME } from "@/lib/site";

/**
 * Sitenin ilk (sert) yüklenişinde bir kez oynayan logo animasyonu.
 * Gerçek marka varlıkları kullanılır: önce rose-icon.svg (logodaki gül
 * motifi) belirip büyür, sonra tam logo (gül + "çiçekevi" yazısı) onun
 * yerini alır. Kasıtlı olarak sade: krem zemin, tek bir geçiş — premium
 * markaların tercih ettiği "az hareket, çok his" dili.
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
      <div className="intro-splash__mark">
        <Image
          src="/rose-icon.svg"
          alt=""
          width={92}
          height={89}
          priority
          className="intro-splash__rose"
        />
        <Image
          src="/logo.svg"
          alt={SITE_NAME}
          width={252}
          height={97}
          priority
          className="intro-splash__logo"
        />
      </div>
    </div>
  );
}
