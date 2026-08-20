"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isOrderStatus, type OrderStatus } from "@/lib/orders/status";
import { sendOrderStatusEmail, type OrderStatusStep } from "@/lib/email";

/** Bu durumlara geçişte müşteriye bilgilendirme maili gider (bkz. src/lib/email.ts). */
const NOTIFY_STEPS: ReadonlySet<OrderStatus> = new Set<OrderStatus>([
  "preparing",
  "on_delivery",
  "delivered",
]);

export async function updateOrderStatus(
  orderId: string,
  status: string,
): Promise<{ error: string | null }> {
  if (!isOrderStatus(status)) {
    return { error: "Geçersiz durum." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") {
    return { error: "Yetkin yok." };
  }

  // RLS "admins update orders" politikası da ayrıca zorunlu kılar.
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error("[admin] status update failed", error);
    return { error: "Durum güncellenemedi." };
  }

  if (NOTIFY_STEPS.has(status)) {
    // Mail ayrı bir sorguyla çekilir (update .select() Postgres'te ek bir
    // round-trip zaten gerektirir); hata durumunda durum güncellemesi geri
    // alınmaz, yalnızca loglanır — bkz. sendOrderStatusEmail.
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("order_number, email, sender_email, recipient_name, delivery_date, delivery_window")
      .eq("id", orderId)
      .maybeSingle();

    if (fetchError) {
      console.error("[admin] status email lookup failed", fetchError);
    } else if (order) {
      try {
        await sendOrderStatusEmail(
          {
            orderNumber: order.order_number,
            email: order.email,
            senderEmail: order.sender_email,
            recipientName: order.recipient_name,
            deliveryDate: order.delivery_date,
            deliveryWindow: order.delivery_window,
          },
          status as OrderStatusStep,
        );
      } catch (err) {
        console.error("[admin] status email send failed", err);
      }
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/siparisler");
  return { error: null };
}
