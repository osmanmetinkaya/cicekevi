import type { OrderStatus } from "@/lib/orders/status";

export interface AdminOrderRow {
  id: string;
  stripe_session_id: string;
  email: string;
  amount_total: number;
  items: { name: string; qty: number; amount: number }[];
  delivery_date: string | null;
  delivery_window: string | null;
  gift_note: string | null;
  status: OrderStatus;
  created_at: string;
}
