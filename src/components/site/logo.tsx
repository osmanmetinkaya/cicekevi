import { Flower2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SITE_NAME } from "@/lib/site";

/**
 * Marka logosu — her sayfada ana sayfaya dönüş linki olarak kullanılır.
 * Gerçek logo görseli gelince aşağıdaki <Flower2 /> + metni bir
 * <Image src="/logo.svg" ... /> ile değiştirmek yeterli; kullanan yerler
 * (header, footer) değişmez.
 */
export function Logo({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={`${SITE_NAME} — ana sayfaya dön`}
      className={`group inline-flex items-center gap-2 font-serif text-leaf-600 transition-colors duration-200 hover:text-rose-700 ${className}`}
    >
      <Flower2
        size={size}
        strokeWidth={1.6}
        className="shrink-0 transition-transform duration-200 group-hover:rotate-6 group-hover:scale-110"
      />
      <span className="whitespace-nowrap">{SITE_NAME}</span>
    </Link>
  );
}
