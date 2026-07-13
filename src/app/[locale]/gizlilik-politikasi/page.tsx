import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { LEGAL_ENTITY } from "@/lib/legal-info";
import { SITE_NAME } from "@/lib/site";

const TITLE = { tr: "Gizlilik Politikası", en: "Privacy Policy" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "en" ? TITLE.en : TITLE.tr;
  return { title: `${title} — ${SITE_NAME}` };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return locale === "en" ? <PrivacyEn /> : <PrivacyTr />;
}

function PrivacyTr() {
  return (
    <LegalPage title={TITLE.tr}>
      <p className="text-ink-muted">
        {LEGAL_ENTITY.brandName} olarak kişisel verilerinizin güvenliğine
        önem veriyoruz. Bu Gizlilik Politikası, sitemizi kullanırken hangi
        verilerin toplandığını, nasıl korunduğunu ve haklarınızı özetler.
        Kişisel verilerin işlenmesine ilişkin ayrıntılı bilgi için{" "}
        <Link
          href="/kvkk-aydinlatma-metni"
          className="text-rose-700 underline underline-offset-2"
        >
          KVKK Aydınlatma Metni&rsquo;ni
        </Link>{" "}
        inceleyebilirsiniz.
      </p>

      <LegalSection title="1. Hangi Verileri Topluyoruz">
        <p>
          Üyelik oluştururken ad, soyad, e-posta ve telefon numaranızı;
          sipariş verirken teslimat adresi ve teslimat tercihlerinizi;
          siteyi kullanırken çerezler aracılığıyla tarayıcı ve cihaz
          bilgilerinizi topluyoruz.
        </p>
      </LegalSection>

      <LegalSection title="2. Verilerinizi Nasıl Koruyoruz">
        <ul className="list-disc space-y-1 pl-5">
          <li>Tüm veri iletimi 256-bit SSL/TLS ile şifrelenir.</li>
          <li>
            Kart bilgileriniz sunucularımızda hiçbir zaman saklanmaz; ödeme
            işlemi PCI-DSS uyumlu ödeme kuruluşu (Stripe) üzerinden
            gerçekleştirilir.
          </li>
          <li>
            Hesap ve veritabanı altyapımız, satır düzeyi güvenlik (RLS)
            politikalarıyla korunan bir bulut sağlayıcısında (Supabase)
            barındırılır.
          </li>
          <li>Şifreniz tarafımızca okunamayacak şekilde saklanır (hash&rsquo;lenir).</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Üçüncü Taraf Hizmet Sağlayıcılar">
        <p>
          Sitemizin çalışması için sınırlı sayıda güvenilir hizmet
          sağlayıcıyla çalışıyoruz: ödeme altyapısı (Stripe), üyelik ve
          veritabanı (Supabase). Bu sağlayıcılar yalnızca hizmetin ifası
          için gerekli verilere erişebilir ve kendi gizlilik/güvenlik
          standartlarına tabidir.
        </p>
      </LegalSection>

      <LegalSection title="4. Çerezler">
        <p>
          Sitemizde zorunlu (oturum, sepet) ve tercihe bağlı çerezler
          kullanılmaktadır. Ayrıntılar için{" "}
          <Link
            href="/cerez-politikasi"
            className="text-rose-700 underline underline-offset-2"
          >
            Çerez Politikası
          </Link>{" "}
          sayfamızı inceleyebilirsiniz.
        </p>
      </LegalSection>

      <LegalSection title="5. Çocukların Gizliliği">
        <p>
          Hizmetlerimiz 18 yaş altı bireylere yönelik değildir; bu
          kullanıcılardan bilerek veri toplamayız.
        </p>
      </LegalSection>

      <LegalSection title="6. Politikada Değişiklikler">
        <p>
          Bu politika zaman zaman güncellenebilir; güncel sürüm her zaman bu
          sayfada yayınlanır.
        </p>
      </LegalSection>

      <LegalSection title="7. İletişim">
        <p>
          Sorularınız için {LEGAL_ENTITY.supportEmail} adresinden bize
          ulaşabilirsiniz.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

function PrivacyEn() {
  return (
    <LegalPage title={TITLE.en} authoritativeHref="/gizlilik-politikasi">
      <p className="text-ink-muted">
        At {LEGAL_ENTITY.brandName}, we care about the security of your personal
        data. This Privacy Policy summarises what data we collect when you use
        our site, how it is protected, and your rights. For detailed information
        on the processing of personal data, please see our{" "}
        <Link
          href="/kvkk-aydinlatma-metni"
          className="text-rose-700 underline underline-offset-2"
        >
          GDPR/KVKK Privacy Notice
        </Link>
        .
      </p>

      <LegalSection title="1. What Data We Collect">
        <p>
          When you create an account we collect your first name, last name,
          email and phone number; when you place an order we collect your
          delivery address and delivery preferences; and as you use the site we
          collect browser and device information via cookies.
        </p>
      </LegalSection>

      <LegalSection title="2. How We Protect Your Data">
        <ul className="list-disc space-y-1 pl-5">
          <li>All data transmission is encrypted with 256-bit SSL/TLS.</li>
          <li>
            Your card details are never stored on our servers; payment is
            processed through a PCI-DSS compliant payment institution (Stripe).
          </li>
          <li>
            Our account and database infrastructure is hosted with a cloud
            provider (Supabase) protected by row-level security (RLS) policies.
          </li>
          <li>Your password is stored in a form we cannot read (it is hashed).</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Third-Party Service Providers">
        <p>
          We work with a limited number of trusted service providers to run our
          site: payment infrastructure (Stripe) and membership and database
          (Supabase). These providers can access only the data necessary to
          perform the service and are subject to their own privacy/security
          standards.
        </p>
      </LegalSection>

      <LegalSection title="4. Cookies">
        <p>
          Our site uses strictly necessary (session, cart) and preference
          cookies. For details, please see our{" "}
          <Link
            href="/cerez-politikasi"
            className="text-rose-700 underline underline-offset-2"
          >
            Cookie Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="5. Children's Privacy">
        <p>
          Our services are not directed at individuals under 18; we do not
          knowingly collect data from such users.
        </p>
      </LegalSection>

      <LegalSection title="6. Changes to This Policy">
        <p>
          This policy may be updated from time to time; the current version is
          always published on this page.
        </p>
      </LegalSection>

      <LegalSection title="7. Contact">
        <p>
          For your questions, you can reach us at {LEGAL_ENTITY.supportEmail}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
