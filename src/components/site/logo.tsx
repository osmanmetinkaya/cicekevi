import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SITE_NAME } from "@/lib/site";

/**
 * Marka logosu — her sayfada ana sayfaya dönüş linki olarak kullanılır.
 * Gerçek logo dosyası `/public/logo.svg` (orijinal viewBox: 1022.18×394,
 * oran ≈2.59:1). `height` yalnızca Image'ın intrinsic boyutunu (CLS için)
 * belirler; ekrandaki görünen boyutu `className` (ör. "h-8 sm:h-9 w-auto")
 * yönetir.
 */
export function Logo({
  height = 34,
  className = "h-auto",
}: {
  height?: number;
  className?: string;
}) {
  const width = Math.round(height * (1022.18 / 394));
  return (
    <Link
      href="/"
      aria-label={`${SITE_NAME} — ana sayfaya dön`}
      className="group inline-flex shrink-0 items-center transition-transform duration-200 hover:scale-[1.03]"
    >
      <Image
        src="/logo.svg"
        alt={SITE_NAME}
        width={width}
        height={height}
        priority
        className={className}
      />
    </Link>
  );
}
