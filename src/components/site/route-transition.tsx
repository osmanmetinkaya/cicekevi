"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "@/i18n/navigation";
import { SITE_NAME } from "@/lib/site";

/**
 * Sayfanın ait olduğu üst bölüm. Animasyon yalnızca bölümler arasında geçerken
 * çalışır; bir bölümün kendi içinde (ör. kategoriler arası chip/breadcrumb)
 * gezinirken çalışmaz.
 */
function section(path: string): string {
  if (path === "/") return "home";
  if (path.startsWith("/products/")) return "product";
  if (path.startsWith("/kategori/")) return "category";
  return "other";
}

/**
 * Sayfalar arası geçişte kısa, kreatif bir logo animasyonu gösterir.
 * Performans notları:
 *  - Kütüphane yok; animasyon tamamen CSS keyframe (transform + opacity → GPU).
 *  - Yalnızca `show` true iken DOM'a girer; bitince `onAnimationEnd` ile çıkar.
 *  - İlk yüklemede gösterilmez (LCP'yi geciktirmez), sadece gezinmede.
 *  - `prefers-reduced-motion: reduce` altında CSS ile tamamen gizlenir.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const prevSection = useRef<string>("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const current = section(pathname);
    if (firstRender.current) {
      firstRender.current = false;
      prevSection.current = current;
      return;
    }
    // Sadece bir içerik bölümüne (ana sayfa/ürün/kategori) geçerken göster;
    // /sepet, /checkout gibi işlevsel ("other") sayfalarda gösterme.
    if (current !== prevSection.current && current !== "other") setShow(true);
    prevSection.current = current;
  }, [pathname]);

  if (!show) return null;

  return (
    <div
      className="route-splash"
      aria-hidden="true"
      onAnimationEnd={(e) => {
        if (e.animationName === "splash-fade") setShow(false);
      }}
    >
      <Image
        src="/rose-icon.svg"
        alt=""
        width={72}
        height={70}
        className="route-splash__flower"
      />
      <span className="route-splash__word">{SITE_NAME}</span>
    </div>
  );
}
