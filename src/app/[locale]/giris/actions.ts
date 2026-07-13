"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { rateLimit } from "@/lib/rate-limit";

/** Server Action içinden istemci IP'sini oku (Vercel/proxy: x-forwarded-for). */
async function requestIp(): Promise<string> {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return h.get("x-real-ip")?.trim() || "unknown";
}

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
  const t = await getTranslations("authErrors");
  if (!isSupabaseConfigured()) {
    return { error: t("notConfigured") };
  }
  const { email, password, next } = fields(formData);
  if (!email || !password) {
    return { error: t("emailPasswordRequired") };
  }

  // Brute-force koruması: IP+e-posta başına dakikada 5 giriş denemesi.
  const ip = await requestIp();
  const limit = rateLimit(`signin:${ip}:${email.toLowerCase()}`, 5, 60_000);
  if (!limit.ok) {
    return { error: t("tooManySignin") };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: t("invalidCredentials") };
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const t = await getTranslations("authErrors");
  if (!isSupabaseConfigured()) {
    return { error: t("notConfigured") };
  }
  const { email, password, next } = fields(formData);
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();

  if (!email || !password) {
    return { error: t("emailPasswordRequired") };
  }
  if (!firstName || !lastName) {
    return { error: t("nameRequired") };
  }
  const phoneDigits = phoneRaw.replace(/\D/g, "");
  if (phoneDigits.length < 10 || phoneDigits.length > 12) {
    return { error: t("invalidPhone") };
  }
  if (password.length < 8) {
    return { error: t("shortPassword") };
  }

  // Spam/suistimal koruması: IP başına dakikada 5 kayıt denemesi.
  const ip = await requestIp();
  const limit = rateLimit(`signup:${ip}`, 5, 60_000);
  if (!limit.ok) {
    return { error: t("tooManySignup") };
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
    return { error: t("signupFailed") };
  }

  // E-posta doğrulaması açıksa oturum dönmez; kullanıcıyı bilgilendir.
  if (!data.session) {
    return {
      error: null,
      notice: t("verifyEmail"),
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
  // Kullanıcının bulunduğu locale'in ana sayfasına dön.
  const locale = await getLocale();
  redirect(locale === routing.defaultLocale ? "/" : `/${locale}`);
}
