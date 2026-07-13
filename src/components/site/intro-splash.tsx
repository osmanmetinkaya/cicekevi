"use client";

import { useEffect, useState } from "react";
import { SITE_NAME } from "@/lib/site";

/**
 * Sitenin ilk (sert) yüklenişinde bir kez oynayan logo animasyonu.
 * RouteTransition ile aynı çizim tekniğini paylaşır, fakat ayrı bir
 * bileşendir: RouteTransition kasıtlı olarak ilk render'da hiçbir şey
 * göstermez (yalnızca bölümler arası geçişlere özeldir).
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
      <div className="intro-splash__lines" aria-hidden="true">
        <span className="i-line i-line-1" />
        <span className="i-line i-line-2" />
        <span className="i-line i-line-3" />
      </div>
      <svg
        className="intro-splash__flower"
        viewBox="0 0 100 100"
        width="132"
        height="132"
        aria-hidden="true"
      >
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
              style={{ animationDelay: `${i * 55}ms` }}
            />
          </g>
        ))}
        <circle
          className="s-center"
          data-draw
          pathLength={1}
          cx="50"
          cy="44"
          r="7"
          style={{ animationDelay: "360ms" }}
        />
        <line
          className="s-stem"
          data-draw
          pathLength={1}
          x1="50"
          y1="51"
          x2="50"
          y2="88"
          style={{ animationDelay: "480ms" }}
        />
        <g transform="rotate(-34 44 66)">
          <ellipse
            className="s-leaf"
            data-draw
            pathLength={1}
            cx="44"
            cy="66"
            rx="9"
            ry="4.2"
            style={{ animationDelay: "600ms" }}
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
            style={{ animationDelay: "660ms" }}
          />
        </g>
      </svg>
      <span className="intro-splash__word">{SITE_NAME}</span>
    </div>
  );
}
