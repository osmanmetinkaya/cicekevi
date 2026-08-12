import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import localFont from "next/font/local";
import { FolderTree, LayoutDashboard, Package, Sprout } from "lucide-react";
import "../globals.css";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SITE_NAME } from "@/lib/site";

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
  // Middleware zaten koruyor; bu ikinci katman (defense in depth).
  if (!isSupabaseConfigured()) redirect("/");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/giris?next=/admin");
  if (user.app_metadata?.role !== "admin") redirect("/");

  return (
    <html
      lang="tr"
      className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
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
        </nav>
      </div>
          <div className="mt-8">{children}</div>
        </div>
      </body>
    </html>
  );
}
