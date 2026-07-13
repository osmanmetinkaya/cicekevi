import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { FavoritesProvider } from "@/components/favorites/favorites-context";
import { SearchProvider } from "@/components/search/search-context";
import { SearchOverlay } from "@/components/search/search-overlay";
import { PageShell } from "@/components/site/page-shell";
import { RouteTransition } from "@/components/site/route-transition";
import { IntroSplash } from "@/components/site/intro-splash";
import { CookieNotice } from "@/components/site/cookie-notice";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

const manrope = localFont({
  src: "../fonts/Manrope-Variable.ttf",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

const cormorant = localFont({
  src: "../fonts/CormorantGaramond-Variable.ttf",
  variable: "--font-cormorant",
  weight: "300 700",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Statik render için aktif locale'i işaretle.
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <IntroSplash />
        <NextIntlClientProvider>
          <CartProvider>
            <FavoritesProvider>
              <SearchProvider>
                <PageShell>
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </PageShell>
                <SearchOverlay />
                <CartDrawer />
                <RouteTransition />
                <CookieNotice />
              </SearchProvider>
            </FavoritesProvider>
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
