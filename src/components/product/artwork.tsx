import { Flower2, Leaf, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";

const ACCENTS: Record<
  Product["accent"],
  { bg: string; fg: string; Icon: typeof Flower2 }
> = {
  blush: { bg: "bg-blush-200", fg: "text-rose-700", Icon: Flower2 },
  rose: { bg: "bg-blush-300", fg: "text-rose-900", Icon: Sparkles },
  leaf: { bg: "bg-leaf-400", fg: "text-leaf-900", Icon: Leaf },
  amber: { bg: "bg-amber-200", fg: "text-amber-800", Icon: Flower2 },
  teal: { bg: "bg-emerald-200", fg: "text-emerald-800", Icon: Flower2 },
};

/**
 * Placeholder product artwork. Swap for a real <Image> once photography
 * is ready — keep the same aspect ratio wrapper.
 */
export function Artwork({
  accent,
  className = "",
  size = 48,
}: {
  accent: Product["accent"];
  className?: string;
  size?: number;
}) {
  const { bg, fg, Icon } = ACCENTS[accent];
  return (
    <div
      className={`flex items-center justify-center ${bg} ${className}`}
      aria-hidden="true"
    >
      <Icon size={size} className={fg} strokeWidth={1.4} />
    </div>
  );
}
