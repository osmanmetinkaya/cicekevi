import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

/**
 * Aktif locale ve locale-öneksiz yolu döndürür.
 * "/en/hesap" -> { locale: "en", rest: "/hesap" }
 * "/hesap"    -> { locale: "tr", rest: "/hesap" }
 */
function splitLocale(pathname: string): { locale: string; rest: string } {
  for (const locale of routing.locales) {
    if (locale === routing.defaultLocale) continue;
    if (pathname === `/${locale}`) return { locale, rest: "/" };
    if (pathname.startsWith(`/${locale}/`)) {
      return { locale, rest: pathname.slice(locale.length + 1) };
    }
  }
  return { locale: routing.defaultLocale, rest: pathname };
}

/** Locale'e göre önekli yol üretir. tr için önek yok. */
function withLocale(locale: string, path: string): string {
  if (locale === routing.defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export async function middleware(request: NextRequest) {
  // Önce next-intl: locale tespiti + yönlendirme (ör. /tr/... -> /...).
  // Bu yanıt, doğru locale çerezini ve olası yönlendirmeyi taşır; Supabase
  // cookie güncellemelerini bunun üzerine yazacağız.
  const response = intlMiddleware(request);

  // next-intl bir yönlendirme (3xx) döndürdüyse, onu bozmadan geçir; auth
  // kontrolü bir sonraki (yönlenmiş) istekte çalışır.
  if (response.status >= 300 && response.status < 400) {
    return response;
  }

  // Supabase bağlanmadıysa auth akışı yok — next-intl yanıtını olduğu gibi geçir.
  if (!isSupabaseConfigured()) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Oturum çerezlerini next-intl yanıtının üzerine yaz; böylece hem
        // locale çerezi hem de tazelenen Supabase oturumu korunur.
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Oturumu tazele (getUser token'ı doğrular; getSession kullanma).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const { locale, rest } = splitLocale(path);

  // /hesap yalnızca giriş yapmış kullanıcıya açık (her iki locale'de).
  if (!user && rest.startsWith("/hesap")) {
    const url = request.nextUrl.clone();
    url.pathname = withLocale(locale, "/giris");
    // next hedefi de locale-öneki korunmuş orijinal yol olsun.
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // /admin yalnızca admin rolüne açık. Admin paneli locale dışıdır ama yine de
  // güvenli olması için locale-öneksiz yol üzerinden kontrol ederiz.
  if (rest.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = withLocale(locale, "/giris");
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
    if (user.app_metadata?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = withLocale(locale, "/");
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  // Statik varlıkları, API webhook'unu, checkout API'sini ve OAuth callback'i
  // middleware dışında tut (bunlar locale routing'e girmemeli). Diğer her şey
  // hem next-intl hem Supabase auth'tan geçer.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ttf|woff2?)$).*)",
  ],
};
