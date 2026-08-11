import type { OrderStatus } from "@/lib/orders/status";

export interface AdminOrderRow {
  id: string;
  order_number: string;
  /** Eski Stripe siparişlerinde dolu; PayTR siparişlerinde null. */
  stripe_session_id: string | null;
  paytr_merchant_oid: string | null;
  payment_provider: string | null;
  email: string;
  amount_total: number;
  items: { name: string; qty: number; amount: number }[];
  delivery_date: string | null;
  delivery_window: string | null;
  gift_note: string | null;
  sender_name: string | null;
  sender_phone: string | null;
  sender_email: string | null;
  recipient_name: string | null;
  recipient_phone: string | null;
  recipient_address: string | null;
  status: OrderStatus;
  created_at: string;
}
