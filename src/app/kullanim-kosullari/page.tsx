import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { LEGAL_ENTITY } from "@/lib/legal-info";

export const metadata: Metadata = {
  title: "Kullanım Koşulları — Çiçekevi",
};

export default function TermsPage() {
  return (
    <LegalPage title="Kullanım Koşulları">
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
