"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

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
      <svg
        className="route-splash__flower"
        viewBox="0 0 100 100"
        width="104"
        height="104"
        aria-hidden="true"
      >
        {/* Petals — drawn one after another */}
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 60} 50 44)`}>
            <ellipse
              className="s-petal"
              data-draw
              pathLength={1}
              cx="50"
              cy="24"
              rx="8"
              ry="15"
              style={{ animationDelay: `${i * 45}ms` }}
            />
          </g>
        ))}
        {/* Center */}
        <circle
          className="s-center"
          data-draw
          pathLength={1}
          cx="50"
          cy="44"
          r="7"
          style={{ animationDelay: "300ms" }}
        />
        {/* Stem */}
        <line
          className="s-stem"
          data-draw
          pathLength={1}
          x1="50"
          y1="51"
          x2="50"
          y2="88"
          style={{ animationDelay: "400ms" }}
        />
        {/* Leaves */}
        <g transform="rotate(-34 44 66)">
          <ellipse
            className="s-leaf"
            data-draw
            pathLength={1}
            cx="44"
            cy="66"
            rx="9"
            ry="4.2"
            style={{ animationDelay: "500ms" }}
          />
        </g>
        <g transform="rotate(34 57 77)">
          <ellipse
            className="s-leaf"
            data-draw
            pathLength={1}
            cx="57"
            cy="77"
            rx="9"
            ry="4.2"
            style={{ animationDelay: "560ms" }}
          />
        </g>
      </svg>
      <span className="route-splash__word">Çiçekevi</span>
    </div>
  );
}
