import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { LEGAL_ENTITY } from "@/lib/legal-info";
import { SITE_NAME } from "@/lib/site";

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
    purpose: "Çerez bildirimindeki tercihinizin (kabul/reddet) hatırlanması.",
    duration: "1 yıl",
  },
  {
    name: "_ga, _ga_*",
    type: "Onaya bağlı (analiz — Google Analytics)",
    purpose:
      "Site trafiğinin ve kullanımının ölçülmesi. Yalnızca çerez bildiriminde \"Kabul et\" dediyseniz yüklenir.",
    duration: "Google tarafından belirlenir (yaklaşık 13 ay/2 yıl)",
  },
  {
    name: "_gcl_au ve benzeri Google Ads çerezleri",
    type: "Onaya bağlı (reklam — Google Ads)",
    purpose:
      "Reklam performansının ve dönüşümlerin ölçülmesi. Yalnızca çerez bildiriminde \"Kabul et\" dediyseniz yüklenir.",
    duration: "Google tarafından belirlenir (yaklaşık 90 gün)",
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
    purpose: "Remembering your cookie notice choice (accept/decline).",
    duration: "1 year",
  },
  {
    name: "_ga, _ga_*",
    type: "Consent-based (analytics — Google Analytics)",
    purpose:
      "Measuring site traffic and usage. Only loaded if you chose \"Accept\" in the cookie notice.",
    duration: "Set by Google (approx. 13 months/2 years)",
  },
  {
    name: "_gcl_au and similar Google Ads cookies",
    type: "Consent-based (advertising — Google Ads)",
    purpose:
      "Measuring ad performance and conversions. Only loaded if you chose \"Accept\" in the cookie notice.",
    duration: "Set by Google (approx. 90 days)",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "en" ? TITLE.en : TITLE.tr;
  return { title: `${title} — ${SITE_NAME}` };
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
          tarayıcınıza kaydedilen küçük metin dosyalarıdır. Sitemiz, çalışması
          için gerekli olan zorunlu/fonksiyonel çerezlerin yanı sıra;
          yalnızca çerez bildiriminde açık rızanızı verdiğiniz takdirde Google
          Analytics ve Google Ads tarafından sağlanan analiz/reklam çerezlerini
          kullanır. Rıza vermediğiniz sürece bu çerezler hiç yüklenmez.
        </p>
      </LegalSection>

      <LegalSection title="2. Kullandığımız Çerezler">
        <CookieTable
          rows={COOKIES_TR}
          headers={["Ad", "Tür", "Amaç", "Süre"]}
        />
      </LegalSection>

      <LegalSection title="3. Çerez Tercihinizi Nasıl Yönetebilirsiniz?">
        <p>
          Zorunlu çerezler sitenin temel işlevleri (giriş, sepet) için
          gereklidir ve kapatılmaları hâlinde site düzgün çalışmayabilir.
          Analiz/reklam çerezleri ise tamamen tercihinize bağlıdır: çerez
          bildiriminde &quot;Reddet&quot;i seçerek bunların hiç yüklenmemesini
          sağlayabilir, tarayıcı ayarlarınızdan istediğiniz zaman mevcut
          çerezleri silebilir veya engelleyebilirsiniz.
        </p>
      </LegalSection>

      <LegalSection title="4. Google Analytics ve Google Ads">
        <p>
          Onay vermeniz hâlinde site kullanımınız ve reklam performansımız
          Google Analytics ve Google Ads aracılığıyla ölçülür; bu kapsamda
          IP adresiniz gibi bazı veriler Google&rsquo;ın (Google Ireland
          Limited / Google LLC) sunucularına, yurt dışına aktarılabilir.
          Google&rsquo;ın bu verileri nasıl işlediği hakkında bilgi için{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-700 underline underline-offset-2"
          >
            Google Gizlilik Politikası
          </a>
          &rsquo;nı inceleyebilirsiniz.
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
          Cookies are small text files saved to your browser by the websites
          you visit. Alongside the strictly necessary/functional cookies
          required for the site to work, we use analytics/advertising cookies
          provided by Google Analytics and Google Ads — but only if you give
          explicit consent in the cookie notice. These cookies are never
          loaded unless you consent.
        </p>
      </LegalSection>

      <LegalSection title="2. Cookies We Use">
        <CookieTable
          rows={COOKIES_EN}
          headers={["Name", "Type", "Purpose", "Duration"]}
        />
      </LegalSection>

      <LegalSection title="3. How Can You Manage Your Cookie Preferences?">
        <p>
          Strictly necessary cookies are required for the site&rsquo;s core
          functions (sign-in, cart) and the site may not work properly if they
          are disabled. Analytics/advertising cookies are entirely optional:
          choose &quot;Decline&quot; in the cookie notice to prevent them from
          loading at all, or delete/block existing cookies at any time from
          your browser settings.
        </p>
      </LegalSection>

      <LegalSection title="4. Google Analytics and Google Ads">
        <p>
          If you consent, your site usage and our advertising performance are
          measured via Google Analytics and Google Ads; as part of this, some
          data such as your IP address may be transferred to Google&rsquo;s
          (Google Ireland Limited / Google LLC) servers abroad. See the{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-700 underline underline-offset-2"
          >
            Google Privacy Policy
          </a>{" "}
          for details on how Google processes this data.
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
