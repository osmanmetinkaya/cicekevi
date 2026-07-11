import Link from "next/link";
import { Heart, UserRound } from "lucide-react";
import { CartButton } from "@/components/cart/cart-button";
import { SearchTrigger } from "@/components/search/search-trigger";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { BranchInfo } from "@/components/site/branch-info";
import { CategoryNav } from "@/components/site/category-nav";
import { Logo } from "@/components/site/logo";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur">
      {/* Üst satır: logo + bilgi · arama · sepet · dil */}
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Logo className="text-xl" />
            <span className="hidden h-5 w-px bg-line sm:block" />
            <BranchInfo />
          </div>

          <div className="flex items-center gap-1 text-ink">
            <SearchTrigger />
            <button
              aria-label="Favoriler"
              className="rounded-full p-2 transition-colors hover:bg-blush-100"
            >
              <Heart size={20} />
            </button>
            <Link
              href="/hesap"
              aria-label="Hesabım"
              className="rounded-full p-2 transition-colors hover:bg-blush-100"
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
