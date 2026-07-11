"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isOrderStatus } from "@/lib/orders/status";

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

  revalidatePath("/admin");
  revalidatePath("/admin/siparisler");
  return { error: null };
}
