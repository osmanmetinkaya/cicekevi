import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { LEGAL_ENTITY } from "@/lib/legal-info";

const TITLE = { tr: "Çerez Politikası", en: "Cookie Policy" };

const COOKIES_TR = [
  {
    name: "sb-access-token / sb-refresh-token",
    type: "Zorunlu (oturum)",
    purpose: "Üyelik girişinizin sürdürülmesi ve hesabınızın güvenliği.",
    duration: "Oturum süresi / 7 gün",
  },
  {
    name: "cicekco-cart-v1",
    type: "Zorunlu (fonksiyonel — localStorage)",
    purpose: "Sepetinizdeki ürünlerin tarayıcınızda hatırlanması.",
    duration: "Siz temizleyene kadar",
  },
  {
    name: "cicekevi-cerez-bildirimi",
    type: "Zorunlu (tercih — localStorage)",
    purpose: "Çerez bildirimini kapattığınızın hatırlanması.",
    duration: "1 yıl",
  },
];

const COOKIES_EN = [
  {
    name: "sb-access-token / sb-refresh-token",
    type: "Strictly necessary (session)",
    purpose: "Keeping you signed in and securing your account.",
    duration: "Session / 7 days",
  },
  {
    name: "cicekco-cart-v1",
    type: "Strictly necessary (functional — localStorage)",
    purpose: "Remembering the items in your cart in your browser.",
    duration: "Until you clear it",
  },
  {
    name: "cicekevi-cerez-bildirimi",
    type: "Strictly necessary (preference — localStorage)",
    purpose: "Remembering that you dismissed the cookie notice.",
    duration: "1 year",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "en" ? TITLE.en : TITLE.tr;
  return { title: `${title} — Çiçekevi` };
}

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return locale === "en" ? <CookieEn /> : <CookieTr />;
}

function CookieTr() {
  return (
    <LegalPage title={TITLE.tr}>
      <p className="text-ink-muted">
        {LEGAL_ENTITY.brandName}, sitemizi ziyaretinizde deneyiminizi
        iyileştirmek amacıyla çerezler ve benzer teknolojiler (localStorage)
        kullanır. Bu sayfada hangi çerezleri, hangi amaçla kullandığımızı
        açıklıyoruz.
      </p>

      <LegalSection title="1. Çerez Nedir?">
        <p>
          Çerezler, ziyaret ettiğiniz internet siteleri tarafından
          tarayıcınıza kaydedilen küçük metin dosyalarıdır. Sitemiz şu an
          yalnızca sitenin çalışması için gerekli olan zorunlu/fonksiyonel
          çerezleri ve tarayıcı depolamasını (localStorage) kullanmaktadır;
          reklam veya üçüncü taraf analitik/izleme çerezi kullanılmamaktadır.
        </p>
      </LegalSection>

      <LegalSection title="2. Kullandığımız Çerezler">
        <CookieTable
          rows={COOKIES_TR}
          headers={["Ad", "Tür", "Amaç", "Süre"]}
        />
      </LegalSection>

      <LegalSection title="3. Zorunlu Çerezleri Nasıl Yönetebilirsiniz?">
        <p>
          Zorunlu çerezler, sitenin temel işlevleri (giriş, sepet) için
          gereklidir ve kapatılmaları hâlinde site düzgün çalışmayabilir.
          Tarayıcı ayarlarınızdan tüm çerezleri silebilir veya
          engelleyebilirsiniz; bu durumda oturumunuz ve sepetiniz
          korunamayabilir.
        </p>
      </LegalSection>

      <LegalSection title="4. İleride Eklenebilecek Çerezler">
        <p>
          İlerleyen dönemde site performansını ölçmek amacıyla analitik
          çerezler eklememiz hâlinde, bu sayfa güncellenecek ve gerekli
          hâllerde açık rızanız istenecektir.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

function CookieEn() {
  return (
    <LegalPage title={TITLE.en} authoritativeHref="/cerez-politikasi">
      <p className="text-ink-muted">
        {LEGAL_ENTITY.brandName} uses cookies and similar technologies
        (localStorage) to improve your experience when you visit our site. On
        this page we explain which cookies we use and for what purpose.
      </p>

      <LegalSection title="1. What Is a Cookie?">
        <p>
          Cookies are small text files saved to your browser by the websites you
          visit. Our site currently uses only the strictly necessary/functional
          cookies and browser storage (localStorage) required for the site to
          work; no advertising or third-party analytics/tracking cookies are
          used.
        </p>
      </LegalSection>

      <LegalSection title="2. Cookies We Use">
        <CookieTable
          rows={COOKIES_EN}
          headers={["Name", "Type", "Purpose", "Duration"]}
        />
      </LegalSection>

      <LegalSection title="3. How Can You Manage Strictly Necessary Cookies?">
        <p>
          Strictly necessary cookies are required for the site&rsquo;s core
          functions (sign-in, cart) and the site may not work properly if they
          are disabled. You can delete or block all cookies from your browser
          settings; in that case your session and cart may not be preserved.
        </p>
      </LegalSection>

      <LegalSection title="4. Cookies That May Be Added in Future">
        <p>
          If we add analytics cookies in the future to measure site performance,
          this page will be updated and your explicit consent will be requested
          where required.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

function CookieTable({
  rows,
  headers,
}: {
  rows: { name: string; type: string; purpose: string; duration: string }[];
  headers: [string, string, string, string];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-cream text-ink">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.name} className="border-t border-line align-top">
              <td className="px-3 py-2 font-mono text-xs text-ink">{c.name}</td>
              <td className="px-3 py-2">{c.type}</td>
              <td className="px-3 py-2">{c.purpose}</td>
              <td className="px-3 py-2 whitespace-nowrap">{c.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
