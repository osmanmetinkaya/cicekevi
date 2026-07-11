"use client";

import { useSearch } from "@/components/search/search-context";

/**
 * Sayfa gövdesini sarar ve arama açıkken tüm sayfayı bulanıklaştırır.
 * Arama paneli bu sarmalayıcının dışında kaldığı için net görünür.
 * Bulanıklık miktarı ~%30 hissi için 4px'e ayarlandı (blur-[4px]).
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  const { open } = useSearch();
  return (
    <div
      className={`flex min-h-full flex-1 flex-col transition-[filter] duration-300 ${
        open ? "blur-[4px]" : ""
      }`}
    >
      {children}
    </div>
  );
}
