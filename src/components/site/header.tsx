import { UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CartButton } from "@/components/cart/cart-button";
import { FavoritesButton } from "@/components/favorites/favorites-button";
import { SearchTrigger } from "@/components/search/search-trigger";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { BranchInfo } from "@/components/site/branch-info";
import { CategoryNav } from "@/components/site/category-nav";
import { MobileNav } from "@/components/site/mobile-nav";
import { Logo } from "@/components/site/logo";

export function Header() {
  const t = useTranslations("header");
  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur">
      {/* Üst satır: logo + bilgi · arama · sepet · dil */}
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <MobileNav />
            <Logo className="text-lg sm:text-xl" />
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
      <CategoryNav />
    </header>
  );
}
