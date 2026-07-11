import {
  Award,
  Briefcase,
  Cake,
  Car,
  Flower,
  Flower2,
  Gift,
  GraduationCap,
  Heart,
  HeartHandshake,
  HeartPulse,
  Leaf,
  Rose,
  Sparkles,
  Sprout,
  type LucideIcon,
} from "lucide-react";

/** Kategori slug'ı → uygun ikon. Menü, chip ve breadcrumb'da ortak kullanılır. */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "sevgiliye-cicek": Heart,
  "dogum-gunu": Cake,
  "is-tebrik": Briefcase,
  "gecmis-olsun": HeartPulse,
  "ozur-dilerim": HeartHandshake,
  "ozel-gunler": Sparkles,
  "sevgililer-gunu": Heart,
  "anneler-gunu": Flower2,
  "babalar-gunu": Gift,
  "ogretmenler-gunu": GraduationCap,
  buketler: Flower2,
  papatyalar: Flower,
  orkideler: Leaf,
  aranjmanlar: Rose,
  "saksi-cicekleri": Sprout,
  celenkler: Award,
  "gelin-arabasi": Car,
};

export const FALLBACK_CATEGORY_ICON = Flower;
