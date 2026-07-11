import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, LogOut, Package, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signOut } from "@/app/giris/actions";
import { OrderSummary, type OrderView } from "@/components/order/order-summary";

export const metadata: Metadata = {
  title: "Hesabım — Çiçekevi",
};

interface OrderRow {
  id: string;
  stripe_session_id: string;
  amount_total: number;
  items: { name: string; qty: number; amount: number }[];
  delivery_date: string | null;
  delivery_window: string | null;
  gift_note: string | null;
  created_at: string;
}

export default async function AccountPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-ink">Hesabım</h1>
        <p className="mt-3 text-sm text-ink-muted">
          Üyelik altyapısı henüz yapılandırılmadı. Supabase anahtarları
          eklendiğinde bu sayfa aktifleşecek.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/giris?next=/hesap");

  // RLS yalnızca kullanıcının kendi siparişlerini döndürür.
  const { data: orders } = await supabase
    .from("orders")
    .select(
      "id, stripe_session_id, amount_total, items, delivery_date, delivery_window, gift_note, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(20)
    .returns<OrderRow[]>();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-blush-100 text-rose-700">
            <UserRound size={22} />
          </span>
          <div>
            <h1 className="font-serif text-2xl text-ink">
              {(user.user_metadata?.full_name as string | undefined) ??
                "Hesabım"}
            </h1>
            <p className="text-sm text-ink-muted">
              {user.email}
              {user.user_metadata?.phone && (
                <> · {user.user_metadata.phone as string}</>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user.app_metadata?.role === "admin" && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-ink-muted transition-colors hover:border-blush-300 hover:text-rose-700"
            >
              <LayoutDashboard size={15} /> Yönetim paneli
            </Link>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-ink-muted transition-colors hover:border-blush-300 hover:text-rose-700"
            >
              <LogOut size={15} /> Çıkış yap
            </button>
          </form>
        </div>
      </div>

      <h2 className="mt-10 flex items-center gap-2 font-serif text-xl text-ink">
        <Package size={19} className="text-leaf-600" /> Sipariş geçmişi
      </h2>

      {!orders || orders.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-line bg-white p-8 text-center">
          <p className="text-ink-muted">Henüz bir siparişin yok.</p>
          <Link
            href="/#buketler"
            className="mt-4 inline-block rounded-full bg-rose-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-900"
          >
            Alışverişe başla
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <OrderSummaryWithDate key={o.id} row={o} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderSummaryWithDate({ row }: { row: OrderRow }) {
  const order: OrderView = {
    ref: row.stripe_session_id.slice(-8).toUpperCase(),
    items: row.items,
    totalKurus: row.amount_total,
    deliveryDate: row.delivery_date ?? undefined,
    deliveryWindow: row.delivery_window ?? undefined,
    giftNote: row.gift_note ?? undefined,
  };
  return (
    <div>
      <OrderSummary order={order} />
      <p className="mt-1.5 text-right text-xs text-ink-muted">
        {new Intl.DateTimeFormat("tr-TR", {
          dateStyle: "long",
          timeStyle: "short",
        }).format(new Date(row.created_at))}
      </p>
    </div>
  );
}
