import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/supabase/config";

/**
 * Service-role istemcisi — YALNIZCA sunucuda (webhook) kullanılır, RLS'i
 * atlar. Anahtar tarayıcıya asla sızmamalı; NEXT_PUBLIC_ öneki yok.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !key) return null;
  return createSupabaseClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
