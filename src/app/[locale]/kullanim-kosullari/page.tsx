import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { LEGAL_ENTITY, LEGAL_ENTITY_EN } from "@/lib/legal-info";
import { SITE_NAME } from "@/lib/site";

const TITLE = { tr: "Kullanım Koşulları", en: "Terms of Use" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "en" ? TITLE.en : TITLE.tr;
  return { title: `${title} — ${SITE_NAME}` };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return locale === "en" ? <TermsEn /> : <TermsTr />;
}

function TermsTr() {
  return (
    <LegalPage title={TITLE.tr}>
      <p className="text-ink-muted">
        {LEGAL_ENTITY.brandName} internet sitesini kullanarak aşağıdaki
        koşulları kabul etmiş sayılırsınız. Lütfen siteyi kullanmadan önce
        bu koşulları dikkatlice okuyun.
      </p>

      <LegalSection title="1. Hesap Sorumluluğu">
        <p>
          Hesabınıza ait şifre ve giriş bilgilerinin gizliliğinden siz
          sorumlusunuz. Hesabınız üzerinden gerçekleştirilen işlemlerden
          Şirket sorumlu tutulamaz; şüpheli bir durum fark ettiğinizde
          derhal bize bildirin.
        </p>
      </LegalSection>

      <LegalSection title="2. Fikri Mülkiyet">
        <p>
          Sitedeki tüm marka, logo, metin, görsel ve tasarım öğeleri{" "}
          {LEGAL_ENTITY.legalName}&rsquo;ye aittir veya Şirket tarafından
          lisanslı olarak kullanılmaktadır; önceden yazılı izin olmaksızın
          kopyalanamaz, çoğaltılamaz veya ticari amaçla kullanılamaz.
        </p>
      </LegalSection>

      <LegalSection title="3. Yasak Kullanımlar">
        <ul className="list-disc space-y-1 pl-5">
          <li>Siteye zarar verecek veya erişimini engelleyecek eylemlerde bulunmak</li>
          <li>Başkasına ait ödeme bilgilerini izinsiz kullanmak</li>
          <li>Yanlış veya yanıltıcı sipariş/teslimat bilgisi vermek</li>
          <li>Siteyi yürürlükteki mevzuata aykırı herhangi bir amaçla kullanmak</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Sorumluluğun Sınırlandırılması">
        <p>
          Şirket, sitenin kesintisiz veya hatasız çalışacağını garanti
          etmez. Mücbir sebepler veya Şirket&rsquo;in makul kontrolü
          dışındaki teknik aksaklıklardan doğan gecikme veya zararlardan
          Şirket sorumlu tutulamaz.
        </p>
      </LegalSection>

      <LegalSection title="5. Değişiklikler">
        <p>
          Şirket, bu koşulları dilediği zaman güncelleyebilir; güncel
          sürüm bu sayfada yayınlandığı andan itibaren geçerli olur.
        </p>
      </LegalSection>

      <LegalSection title="6. Uygulanacak Hukuk">
        <p>
          İşbu koşullar Türkiye Cumhuriyeti kanunlarına tabidir; ihtilaf
          hâlinde Türkiye mahkemeleri ve icra daireleri yetkilidir.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

function TermsEn() {
  return (
    <LegalPage title={TITLE.en} authoritativeHref="/kullanim-kosullari">
      <p className="text-ink-muted">
        By using the {LEGAL_ENTITY.brandName} website, you are deemed to have
        accepted the following terms. Please read these terms carefully before
        using the site.
      </p>

      <LegalSection title="1. Account Responsibility">
        <p>
          You are responsible for keeping your account password and login
          details confidential. The Company cannot be held responsible for
          transactions carried out through your account; please notify us
          immediately if you notice anything suspicious.
        </p>
      </LegalSection>

      <LegalSection title="2. Intellectual Property">
        <p>
          All brands, logos, text, images and design elements on the site belong
          to {LEGAL_ENTITY_EN.legalName} or are used under licence by the
          Company; they may not be copied, reproduced or used for commercial
          purposes without prior written permission.
        </p>
      </LegalSection>

      <LegalSection title="3. Prohibited Uses">
        <ul className="list-disc space-y-1 pl-5">
          <li>Taking actions that would harm the site or block access to it</li>
          <li>Using someone else&rsquo;s payment details without authorisation</li>
          <li>Providing false or misleading order/delivery information</li>
          <li>
            Using the site for any purpose contrary to applicable legislation
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Limitation of Liability">
        <p>
          The Company does not guarantee that the site will operate
          uninterrupted or error-free. The Company cannot be held responsible for
          delays or damages arising from force majeure or technical failures
          beyond the Company&rsquo;s reasonable control.
        </p>
      </LegalSection>

      <LegalSection title="5. Changes">
        <p>
          The Company may update these terms at any time; the current version
          takes effect the moment it is published on this page.
        </p>
      </LegalSection>

      <LegalSection title="6. Governing Law">
        <p>
          These terms are governed by the laws of the Republic of Türkiye; in
          case of dispute, the courts and enforcement offices of Türkiye have
          jurisdiction.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
