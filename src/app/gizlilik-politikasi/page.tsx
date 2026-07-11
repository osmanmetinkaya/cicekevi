import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { LEGAL_ENTITY } from "@/lib/legal-info";

export const metadata: Metadata = {
  title: "Gizlilik Politikası — Çiçekevi",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Gizlilik Politikası">
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
