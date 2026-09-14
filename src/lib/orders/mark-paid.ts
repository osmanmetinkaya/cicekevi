import { after } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendOrderEmails, type OrderEmailItem } from "@/lib/email";

export interface OrderForPaid {
  id: string;
  order_number: string;
  email: string;
  amount_total: number;
  items: OrderEmailItem[];
  delivery_date: string | null;
  delivery_window: string | null;
  gift_note: string | null;
  sender_name: string | null;
  sender_phone: string | null;
  sender_email: string | null;
  recipient_name: string | null;
  recipient_phone: string | null;
  recipient_address: string | null;
}

/**
 * Siparişi "paid" işaretler ve müşteri/mağaza e-postalarını arka planda
 * (after()) gönderir. İki bağımsız yol siparişi ödendi olarak işaretleyebilir
 * — PayTR'nin bildirim webhook'u (api/paytr/callback) VE webhook gecikirse
 * devreye giren aktif durum sorgusu (checkout/success sayfası) — ikisi de bu
 * tek yolu kullanır ki "ödendi" mantığı ve mail gönderimi birbirinden sapmasın.
 */
export async function markOrderPaid(
  admin: SupabaseClient,
  order: OrderForPaid,
): Promise<{ error: string | null }> {
  const { error } = await admin
    .from("orders")
    .update({ status: "paid" })
    .eq("id", order.id);

  if (error) return { error: error.message };

  after(async () => {
    try {
      await sendOrderEmails({
        orderNumber: order.order_number,
        email: order.email,
        items: order.items,
        amountTotal: order.amount_total,
        deliveryDate: order.delivery_date,
        deliveryWindow: order.delivery_window,
        giftNote: order.gift_note,
        senderName: order.sender_name,
        senderPhone: order.sender_phone,
        senderEmail: order.sender_email,
        recipientName: order.recipient_name,
        recipientPhone: order.recipient_phone,
        recipientAddress: order.recipient_address,
      });
    } catch (err) {
      console.error("[orders] order emails failed", err);
    }
  });

  return { error: null };
}
