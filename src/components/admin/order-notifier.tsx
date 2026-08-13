"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, BellRing } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { AdminOrderRow } from "@/lib/orders/types";

/**
 * Dükkan bilgisayarında sürekli açık kalan yönetim panelinde, yeni bir
 * sipariş ödemesi onaylandığında (status pending -> paid) zil sesi çalar
 * ve kısa bir bildirim gösterir. Supabase Realtime ile orders tablosundaki
 * UPDATE olaylarını dinler (bkz. 0014_orders_realtime.sql).
 *
 * Tarayıcılar kullanıcı etkileşimi olmadan ses çalmaya izin vermiyor;
 * bu yüzden ilk tık/tuşa kadar "sesi etkinleştir" uyarısı gösterilir —
 * sayfa açık kaldığı sürece (dükkan bilgisayarında bir kere tıklamak
 * yeterli) sorunsuz çalışır.
 */
export function OrderNotifier() {
  const router = useRouter();
  const [toastOrder, setToastOrder] = useState<string | null>(null);
  const [soundReady, setSoundReady] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    function enableAudio() {
      if (!audioCtxRef.current) {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        audioCtxRef.current = new Ctx();
      }
      audioCtxRef.current.resume().then(() => setSoundReady(true));
    }
    document.addEventListener("click", enableAudio);
    document.addEventListener("keydown", enableAudio);
    return () => {
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("keydown", enableAudio);
    };
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-orders-paid")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: "status=eq.paid",
        },
        (payload) => {
          const order = payload.new as Partial<AdminOrderRow>;
          playBell();
          setToastOrder(order.order_number ?? "—");
          window.setTimeout(() => setToastOrder(null), 10_000);
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function playBell() {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;
    // İki tonlu, yumuşak bir "ding-dong" — harici ses dosyası gerektirmez.
    for (const [freq, delay] of [
      [1046.5, 0],
      [784, 0.16],
    ] as const) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.32, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 1.1);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 1.2);
    }
  }

  return (
    <>
      {!soundReady && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs text-ink-muted shadow-sm print:hidden">
          <Bell size={14} /> Bildirim sesini açmak için sayfaya bir kez
          tıkla
        </div>
      )}
      {toastOrder && (
        <div
          role="alert"
          className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-4 shadow-lg print:hidden"
        >
          <BellRing size={20} className="shrink-0 animate-pulse text-rose-700" />
          <div>
            <p className="text-sm font-medium text-ink">Yeni sipariş alındı</p>
            <p className="text-xs text-ink-muted">#{toastOrder}</p>
          </div>
        </div>
      )}
    </>
  );
}
