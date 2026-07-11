import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { LEGAL_ENTITY } from "@/lib/legal-info";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni — Çiçekevi",
};

export default function KvkkPage() {
  return (
    <LegalPage title="KVKK Aydınlatma Metni">
      <p className="text-ink-muted">
        İşbu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu
        (&ldquo;KVKK&rdquo;) uyarınca, veri sorumlusu sıfatıyla{" "}
        {LEGAL_ENTITY.legalName} (&ldquo;{LEGAL_ENTITY.brandName}&rdquo; veya
        &ldquo;Şirket&rdquo;) tarafından, {LEGAL_ENTITY.brandName} internet
        sitesi ve mobil kanalları üzerinden işlenen kişisel verileriniz
        hakkında sizleri bilgilendirmek amacıyla hazırlanmıştır.
      </p>

      <LegalSection title="1. Veri Sorumlusu">
        <p>
          Kişisel verileriniz, veri sorumlusu sıfatıyla {LEGAL_ENTITY.legalName}{" "}
          tarafından aşağıda açıklanan kapsamda işlenmektedir.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Adres: {LEGAL_ENTITY.address}</li>
          <li>MERSİS No: {LEGAL_ENTITY.mersisNo}</li>
          <li>Ticaret Sicil No: {LEGAL_ENTITY.tradeRegistryNo}</li>
          <li>E-posta: {LEGAL_ENTITY.email}</li>
          <li>KEP: {LEGAL_ENTITY.kepAddress}</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. İşlenen Kişisel Veri Kategorileri">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <span className="text-ink">Kimlik bilgileri:</span> ad, soyad
          </li>
          <li>
            <span className="text-ink">İletişim bilgileri:</span> e-posta
            adresi, telefon numarası, teslimat adresi
          </li>
          <li>
            <span className="text-ink">Müşteri işlem bilgileri:</span>{" "}
            sipariş geçmişi, sepet içeriği, teslimat tarihi/saati, hediye
            notu
          </li>
          <li>
            <span className="text-ink">İşlem güvenliği bilgileri:</span>{" "}
            hesap kimlik bilgileri (şifreli), oturum/çerez verileri, IP
            adresi
          </li>
          <li>
            <span className="text-ink">Finansal bilgiler:</span> ödeme
            işlemine ilişkin sınırlı veriler (kart bilgileriniz tarafımızca
            saklanmaz; ödeme, PCI-DSS uyumlu ödeme kuruluşu üzerinden
            işlenir)
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Kişisel Verilerin İşlenme Amaçları">
        <ul className="list-disc space-y-1 pl-5">
          <li>Üyelik oluşturulması ve hesabınızın yönetilmesi</li>
          <li>Sipariş, ödeme ve teslimat süreçlerinin yürütülmesi</li>
          <li>
            Mesafeli satış sözleşmesi ve ön bilgilendirme yükümlülüklerinin
            yerine getirilmesi
          </li>
          <li>Müşteri destek taleplerinin karşılanması</li>
          <li>
            Açık rızanız bulunması hâlinde kampanya ve fırsatlara ilişkin
            ticari elektronik iletilerin gönderilmesi
          </li>
          <li>Yasal yükümlülüklerin (vergi, tüketici mevzuatı vb.) yerine getirilmesi</li>
          <li>Dolandırıcılığın önlenmesi ve hesap/işlem güvenliğinin sağlanması</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Kişisel Verilerin Aktarılması">
        <p>
          Kişisel verileriniz, yukarıda belirtilen amaçlarla sınırlı olarak;
          ödeme işlemlerinin gerçekleştirilmesi için ödeme kuruluşuna
          (Stripe), üyelik ve veritabanı altyapısının sağlanması için bulut
          hizmet sağlayıcısına (Supabase), teslimat için anlaşmalı kurye/lojistik
          firmalarına ve yasal zorunluluk hâlinde yetkili kamu kurum ve
          kuruluşlarına, KVKK&rsquo;nın 8. ve 9. maddelerinde belirtilen
          şartlar çerçevesinde aktarılabilmektedir.
        </p>
      </LegalSection>

      <LegalSection title="5. Toplama Yöntemi ve Hukuki Sebep">
        <p>
          Kişisel verileriniz; internet sitemiz, üyelik/sipariş formları ve
          çerezler aracılığıyla elektronik ortamda toplanmaktadır. Verileriniz;
          bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması,
          hukuki yükümlülüğün yerine getirilmesi, meşru menfaat ve (kampanya
          iletişimi gibi) bazı işlemler için açık rızanızın bulunması hukuki
          sebeplerine dayanılarak işlenmektedir (KVKK m. 5).
        </p>
      </LegalSection>

      <LegalSection title="6. Saklama Süresi">
        <p>
          Kişisel verileriniz, ilgili mevzuatta öngörülen süreler (örn.
          Vergi Usul Kanunu ve Türk Ticaret Kanunu kapsamında fatura/sipariş
          kayıtları için 10 yıl) boyunca veya işlenme amacının gerektirdiği
          süre boyunca saklanır; süre sonunda silinir, yok edilir veya
          anonim hâle getirilir.
        </p>
      </LegalSection>

      <LegalSection title="7. Haklarınız (KVKK m. 11)">
        <p>KVKK&rsquo;nın 11. maddesi uyarınca herkes, veri sorumlusuna başvurarak;</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Kişisel verisinin işlenip işlenmediğini öğrenme,</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
          <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
          <li>Yurt içinde/dışında aktarıldığı üçüncü kişileri bilme,</li>
          <li>Eksik/yanlış işlenmişse düzeltilmesini isteme,</li>
          <li>KVKK m. 7&rsquo;deki şartlar çerçevesinde silinmesini/yok edilmesini isteme,</li>
          <li>Yapılan işlemlerin, verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
          <li>
            Münhasıran otomatik sistemlerle analiz edilmesi nedeniyle
            aleyhinize bir sonuç ortaya çıkmasına itiraz etme,
          </li>
          <li>
            Kanuna aykırı işlenme sebebiyle zarara uğramanız hâlinde
            zararın giderilmesini talep etme
          </li>
        </ul>
        <p>haklarına sahiptir.</p>
      </LegalSection>

      <LegalSection title="8. Başvuru Yöntemi">
        <p>
          Yukarıda sayılan haklarınıza ilişkin taleplerinizi,{" "}
          {LEGAL_ENTITY.email} adresine kimliğinizi tevsik edici bilgilerle
          birlikte yazılı olarak iletebilir veya KEP adresimiz üzerinden (
          {LEGAL_ENTITY.kepAddress}) başvurabilirsiniz. Talepleriniz, niteliğine
          göre en geç 30 (otuz) gün içinde ücretsiz olarak sonuçlandırılır.
        </p>
      </LegalSection>

      <p className="text-xs text-ink-muted">
        Bu metin genel bir şablon niteliğindedir; şirketinize özgü veri
        işleme faaliyetleri doğrultusunda bir hukuk danışmanı tarafından
        gözden geçirilmesi ve şirket bilgilerinin (unvan, MERSİS, adres vb.)
        tamamlanması önerilir.
      </p>
    </LegalPage>
  );
}
