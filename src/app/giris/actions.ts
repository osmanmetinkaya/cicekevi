"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface AuthState {
  error: string | null;
  notice?: string | null;
}

function fields(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/hesap");
  // Open-redirect koruması: yalnızca site içi yollar.
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/hesap";
  return { email, password, next: safeNext };
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured()) {
    return { error: "Üyelik altyapısı henüz yapılandırılmadı." };
  }
  const { email, password, next } = fields(formData);
  if (!email || !password) {
    return { error: "E-posta ve şifre gerekli." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "E-posta veya şifre hatalı." };
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured()) {
    return { error: "Üyelik altyapısı henüz yapılandırılmadı." };
  }
  const { email, password, next } = fields(formData);
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();

  if (!email || !password) {
    return { error: "E-posta ve şifre gerekli." };
  }
  if (!firstName || !lastName) {
    return { error: "Ad ve soyad gerekli." };
  }
  const phoneDigits = phoneRaw.replace(/\D/g, "");
  if (phoneDigits.length < 10 || phoneDigits.length > 12) {
    return { error: "Geçerli bir telefon numarası gir (örn. 0555 123 45 67)." };
  }
  if (password.length < 8) {
    return { error: "Şifre en az 8 karakter olmalı." };
  }

  const marketingConsent = formData.get("marketingConsent") === "on";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        phone: phoneDigits,
        marketing_consent: marketingConsent,
        marketing_consent_at: marketingConsent
          ? new Date().toISOString()
          : null,
      },
    },
  });
  if (error) {
    return { error: "Kayıt oluşturulamadı. Bu e-posta kullanımda olabilir." };
  }

  // E-posta doğrulaması açıksa oturum dönmez; kullanıcıyı bilgilendir.
  if (!data.session) {
    return {
      error: null,
      notice: "Kayıt alındı. E-postana gelen doğrulama bağlantısına tıkla.",
    };
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/");
}
