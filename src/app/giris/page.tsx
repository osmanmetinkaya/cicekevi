import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Flower2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AuthForm } from "@/app/giris/auth-form";

export const metadata: Metadata = {
  title: "Giriş yap — Çiçekevi",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; hata?: string }>;
}) {
  const { next, hata } = await searchParams;
  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//") ? next : "/hesap";

  // Zaten girişliyse hesaba yönlendir.
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect(safeNext);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <Flower2
          size={36}
          strokeWidth={1.5}
          className="mx-auto text-leaf-600"
        />
        <h1 className="mt-3 font-serif text-3xl text-ink">Hoş geldin</h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          Siparişlerini görmek ve hızlı ödeme için hesabına gir.
        </p>
      </div>

      {hata === "google" && (
        <p
          className="mb-4 rounded-xl bg-blush-100 px-4 py-3 text-center text-sm text-rose-700"
          role="alert"
        >
          Google ile giriş tamamlanamadı. Lütfen tekrar dene.
        </p>
      )}

      {isSupabaseConfigured() ? (
        <AuthForm next={safeNext} />
      ) : (
        <div className="rounded-2xl border border-line bg-white p-6 text-center text-sm text-ink-muted">
          Üyelik altyapısı henüz yapılandırılmadı. Supabase anahtarları
          eklendiğinde bu sayfa aktifleşecek.
        </div>
      )}
    </div>
  );
}
