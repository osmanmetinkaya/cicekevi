import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import localFont from "next/font/local";
import { FolderTree, Image, LayoutDashboard, Package, Sprout } from "lucide-react";
import "../globals.css";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SITE_NAME } from "@/lib/site";
import { OrderNotifier } from "@/components/admin/order-notifier";

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

export const metadata: Metadata = {
  title: `Yönetim — ${SITE_NAME}`,
};

// Yönetim paneli locale dışıdır ve kendi kök layout'unu (html/body) taşır;
// müşteri sitesinden ayrı bir ağaç olduğu için ayrı bir root layout'tur.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Yetki kontrolü middleware'de yapılıyor (her /admin isteğinde Supabase'e
  // sorup rolü doğruluyor) — burada aynı kontrolü tekrarlamak yalnızca her
  // sayfa/geçişte ekstra bir ağ isteği eklerdi, ek bir koruma sağlamazdı.
  if (!isSupabaseConfigured()) redirect("/");

  return (
    <html
      lang="tr"
      className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 print:max-w-none print:p-0">
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <h1 className="font-serif text-3xl text-ink">Yönetim</h1>
        <nav aria-label="Yönetim menüsü" className="flex gap-2 text-sm">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-ink transition-colors hover:border-blush-300 hover:text-rose-700"
          >
            <LayoutDashboard size={15} /> Genel bakış
          </Link>
          <Link
            href="/admin/siparisler"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-ink transition-colors hover:border-blush-300 hover:text-rose-700"
          >
            <Package size={15} /> Siparişler
          </Link>
          <Link
            href="/admin/urunler"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-ink transition-colors hover:border-blush-300 hover:text-rose-700"
          >
            <Sprout size={15} /> Ürünler
          </Link>
          <Link
            href="/admin/kategoriler"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-ink transition-colors hover:border-blush-300 hover:text-rose-700"
          >
            <FolderTree size={15} /> Kategoriler
          </Link>
          <Link
            href="/admin/icerik"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-ink transition-colors hover:border-blush-300 hover:text-rose-700"
          >
            <Image size={15} /> İçerik
          </Link>
        </nav>
      </div>
          <div className="mt-8 print:mt-0">{children}</div>
        </div>
        <OrderNotifier />
      </body>
    </html>
  );
}
