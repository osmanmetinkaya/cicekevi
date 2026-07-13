import { createNavigation } from "next-intl/navigation";
import { routing } from "@/i18n/routing";

/**
 * Locale-farkında gezinme yardımcıları. `Link`, `useRouter`, `usePathname`
 * ve `redirect`, aktif locale'e göre doğru öneki (/ veya /en) otomatik ekler.
 * Bileşenler bunları next/link ve next/navigation yerine kullanmalı.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
