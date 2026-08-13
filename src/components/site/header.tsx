import { UserRound } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CartButton } from "@/components/cart/cart-button";
import { FavoritesButton } from "@/components/favorites/favorites-button";
import { SearchTrigger } from "@/components/search/search-trigger";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { BranchInfo } from "@/components/site/branch-info";
import { CategoryNav } from "@/components/site/category-nav";
import { MobileNav } from "@/components/site/mobile-nav";
import { Logo } from "@/components/site/logo";
import { getCategoryGroups } from "@/lib/categories";

/**
 * Kategoriler artık veritabanından geliyor; menüler istemci bileşeni olduğu
 * için ağaç burada (sunucuda) çekilip prop olarak geçilir.
 */
export async function Header() {
  const t = await getTranslations("header");
  const categoryGroups = await getCategoryGroups();
  return (
    // backdrop-blur bilerek kullanılmıyor: macOS Chrome'da, rozet sayısı
    // (favoriler/sepet) değiştiğinde arka planı yeniden birleştirirken
    // görsel bir "bulaşma" (repaint smear) hatasına yol açıyordu; tek
    // will-change ipucu bunu çözmedi. Düz yarı saydam zemin aynı hissi
    // verir ama backdrop-filter compositing'ine hiç girmez.
    <header className="sticky top-0 z-40 bg-cream/95">
      {/* Üst satır: logo + bilgi · arama · sepet · dil */}
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <MobileNav groups={categoryGroups} />
            <Logo height={38} className="h-8 w-auto sm:h-[38px]" />
            <span className="hidden h-5 w-px bg-line sm:block" />
            <BranchInfo />
          </div>

          <div className="flex items-center gap-0.5 text-ink sm:gap-1">
            <SearchTrigger />
            <span className="hidden sm:block">
              <FavoritesButton />
            </span>
            <Link
              href="/hesap"
              aria-label={t("account")}
              className="hidden rounded-full p-2 transition-colors hover:bg-blush-100 sm:block"
            >
              <UserRound size={20} />
            </Link>
            <CartButton />
            <span className="ml-1.5 hidden sm:block">
              <LanguageSwitcher />
            </span>
          </div>
        </div>
      </div>

      {/* Alt satır: kategoriler */}
      <CategoryNav groups={categoryGroups} />
    </header>
  );
}
