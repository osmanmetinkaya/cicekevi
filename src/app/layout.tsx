import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SearchProvider } from "@/components/search/search-context";
import { SearchOverlay } from "@/components/search/search-overlay";
import { PageShell } from "@/components/site/page-shell";
import { RouteTransition } from "@/components/site/route-transition";
import { CookieNotice } from "@/components/site/cookie-notice";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

const manrope = localFont({
  src: "./fonts/Manrope-Variable.ttf",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

const cormorant = localFont({
  src: "./fonts/CormorantGaramond-Variable.ttf",
  variable: "--font-cormorant",
  weight: "300 700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Çiçekevi — Taze çiçekler, aynı gün teslimat",
  description:
    "Mevsiminde toplanan, elde hazırlanan buketler. İstanbul içi aynı gün çiçek teslimatı.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CartProvider>
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
        </CartProvider>
      </body>
    </html>
  );
}
