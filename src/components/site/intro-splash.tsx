"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { SITE_NAME } from "@/lib/site";

type FlowLine = {
  top: string;
  height: number;
  tileWidth: number;
  path: string;
  strokeWidth: number;
  opacity: number;
  duration: number;
  direction: "normal" | "reverse";
  delay: number;
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/** Asimetrik, düzensiz bir dalga çizer; ilk ve son nokta aynı taban
 * çizgisinde kalır ki background-repeat ile döşendiğinde dikiş yeri
 * belli olmasın (uçları asla ekranda görünmez). */
function buildWavePath(tileWidth: number, height: number, bumps: number) {
  const baseline = height / 2;
  const segment = tileWidth / bumps;
  let d = `M0 ${baseline.toFixed(1)}`;
  for (let i = 0; i < bumps; i++) {
    const startX = i * segment;
    const midX = startX + segment / 2;
    const midY = baseline + randomBetween(-height * 0.42, height * 0.42);
    const endX = startX + segment;
    const endY = i === bumps - 1 ? baseline : baseline + randomBetween(-height * 0.3, height * 0.3);
    d += ` Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;
  }
  return d;
}

function generateLines(): FlowLine[] {
  const count = 4 + Math.floor(Math.random() * 3); // 4-6 çizgi
  return Array.from({ length: count }, () => {
    const height = 40 + Math.random() * 34;
    const tileWidth = 160 + Math.random() * 180;
    const bumps = 2 + Math.floor(Math.random() * 3);
    const duration = 6 + Math.random() * 10;
    return {
      top: `${6 + Math.random() * 84}%`,
      height,
      tileWidth,
      path: buildWavePath(tileWidth, height, bumps),
      strokeWidth: 2.5 + Math.random() * 2.5,
      opacity: 0.16 + Math.random() * 0.24,
      duration,
      direction: Math.random() > 0.5 ? "reverse" : "normal",
      // Negatif gecikme: animasyon döngüsünün rastgele bir noktasından
      // başlar, böylece her açılışta çizgiler farklı bir aşamadan gelir.
      delay: -Math.random() * duration,
    };
  });
}

function lineStyle(line: FlowLine): CSSProperties {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${line.tileWidth}' height='${line.height}' ` +
    `viewBox='0 0 ${line.tileWidth} ${line.height}'>` +
    `<path d='${line.path}' fill='none' stroke='currentColor' stroke-width='${line.strokeWidth}' stroke-linecap='round'/>` +
    `</svg>`;
  return {
    top: line.top,
    height: `${line.height}px`,
    opacity: line.opacity,
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    backgroundSize: `${line.tileWidth}px ${line.height}px`,
    animationDuration: `${line.duration}s`,
    animationDirection: line.direction,
    animationDelay: `${line.delay}s`,
    ["--tile-w" as string]: `${line.tileWidth}px`,
  } as CSSProperties;
}

/**
 * Sitenin ilk (sert) yüklenişinde bir kez oynayan logo animasyonu.
 * RouteTransition ile aynı çizim tekniğini paylaşır, fakat ayrı bir
 * bileşendir: RouteTransition kasıtlı olarak ilk render'da hiçbir şey
 * göstermez (yalnızca bölümler arası geçişlere özeldir).
 */
export function IntroSplash() {
  const [show, setShow] = useState(true);
  const [lines, setLines] = useState<FlowLine[] | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      return;
    }
    // Rastgele desen yalnızca istemcide üretilir ki sunucu/istemci
    // render'ları arasında hydration uyuşmazlığı olmasın.
    setLines(generateLines());
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
        {lines?.map((line, i) => (
          <span key={i} className="i-line" style={lineStyle(line)} />
        ))}
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
