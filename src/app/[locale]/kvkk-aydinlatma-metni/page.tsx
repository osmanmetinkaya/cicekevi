import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { LEGAL_ENTITY, LEGAL_ENTITY_EN } from "@/lib/legal-info";
import { SITE_NAME } from "@/lib/site";

const TITLE = {
  tr: "KVKK Aydınlatma Metni",
  en: "GDPR/KVKK Privacy Notice",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "en" ? TITLE.en : TITLE.tr;
  return { title: `${title} — ${SITE_NAME}` };
}

export default async function KvkkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return locale === "en" ? <KvkkEn /> : <KvkkTr />;
}

function KvkkTr() {
  return (
    <LegalPage title={TITLE.tr}>
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
          (PayTR), üyelik ve veritabanı altyapısının sağlanması için bulut
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

function KvkkEn() {
  return (
    <LegalPage title={TITLE.en} authoritativeHref="/kvkk-aydinlatma-metni">
      <p className="text-ink-muted">
        This Privacy Notice has been prepared under Turkish Law No. 6698 on the
        Protection of Personal Data (&ldquo;KVKK&rdquo;) to inform you about the
        personal data processed by {LEGAL_ENTITY_EN.legalName}
        (&ldquo;{LEGAL_ENTITY.brandName}&rdquo; or the &ldquo;Company&rdquo;),
        acting as data controller, through the {LEGAL_ENTITY.brandName} website
        and mobile channels.
      </p>

      <LegalSection title="1. Data Controller">
        <p>
          Your personal data is processed by {LEGAL_ENTITY_EN.legalName}, acting
          as data controller, within the scope described below.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Address: {LEGAL_ENTITY.address}</li>
          <li>MERSIS No: {LEGAL_ENTITY_EN.mersisNo}</li>
          <li>Trade Registry No: {LEGAL_ENTITY_EN.tradeRegistryNo}</li>
          <li>Email: {LEGAL_ENTITY.email}</li>
          <li>KEP: {LEGAL_ENTITY_EN.kepAddress}</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Categories of Personal Data Processed">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <span className="text-ink">Identity data:</span> first name, last
            name
          </li>
          <li>
            <span className="text-ink">Contact data:</span> email address, phone
            number, delivery address
          </li>
          <li>
            <span className="text-ink">Customer transaction data:</span> order
            history, cart contents, delivery date/time, gift note
          </li>
          <li>
            <span className="text-ink">Transaction security data:</span> account
            credentials (encrypted), session/cookie data, IP address
          </li>
          <li>
            <span className="text-ink">Financial data:</span> limited data
            relating to the payment transaction (your card details are not
            stored by us; payment is processed through a PCI-DSS compliant
            payment institution)
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Purposes of Processing">
        <ul className="list-disc space-y-1 pl-5">
          <li>Creating your membership and managing your account</li>
          <li>Carrying out order, payment and delivery processes</li>
          <li>
            Fulfilling distance sales agreement and pre-contract information
            obligations
          </li>
          <li>Responding to customer support requests</li>
          <li>
            Sending commercial electronic messages about campaigns and offers,
            where you have given explicit consent
          </li>
          <li>
            Meeting legal obligations (tax, consumer legislation, etc.)
          </li>
          <li>Preventing fraud and ensuring account/transaction security</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Transfer of Personal Data">
        <p>
          Limited to the purposes stated above, your personal data may be
          transferred to the payment institution (PayTR) for processing
          payments, to the cloud service provider (Supabase) for membership and
          database infrastructure, to contracted courier/logistics firms for
          delivery, and, where legally required, to authorised public
          institutions, within the framework of Articles 8 and 9 of the KVKK.
        </p>
      </LegalSection>

      <LegalSection title="5. Method of Collection and Legal Grounds">
        <p>
          Your personal data is collected electronically through our website,
          membership/order forms and cookies. It is processed on the legal
          grounds of being directly related to the conclusion or performance of
          a contract, the fulfilment of a legal obligation, legitimate interest,
          and, for certain activities (such as marketing communications), your
          explicit consent (KVKK Art. 5).
        </p>
      </LegalSection>

      <LegalSection title="6. Retention Period">
        <p>
          Your personal data is retained for the periods stipulated in the
          relevant legislation (e.g. 10 years for invoice/order records under
          the Turkish Tax Procedure Law and the Turkish Commercial Code) or for
          as long as the purpose of processing requires; at the end of the
          period it is deleted, destroyed or anonymised.
        </p>
      </LegalSection>

      <LegalSection title="7. Your Rights (KVKK Art. 11)">
        <p>
          Under Article 11 of the KVKK, everyone has the right to apply to the
          data controller to:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Learn whether their personal data is being processed,</li>
          <li>Request information if it has been processed,</li>
          <li>
            Learn the purpose of processing and whether it is used in accordance
            with that purpose,
          </li>
          <li>
            Know the third parties to whom it is transferred domestically or
            abroad,
          </li>
          <li>
            Request correction if it has been processed incompletely or
            incorrectly,
          </li>
          <li>
            Request its deletion/destruction under the conditions of KVKK Art. 7,
          </li>
          <li>
            Request that these actions be notified to third parties to whom the
            data was transferred,
          </li>
          <li>
            Object to an outcome against them arising from analysis solely by
            automated systems,
          </li>
          <li>
            Request compensation if they suffer damage due to unlawful
            processing.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="8. How to Apply">
        <p>
          You may submit requests regarding the rights listed above in writing
          to {LEGAL_ENTITY.email}, together with information verifying your
          identity, or via our KEP address ({LEGAL_ENTITY_EN.kepAddress}). Your
          requests will be concluded free of charge within a maximum of 30
          (thirty) days, depending on their nature.
        </p>
      </LegalSection>

      <p className="text-xs text-ink-muted">
        This text is a general template; it is recommended that it be reviewed
        by a legal advisor in line with your company&rsquo;s specific data
        processing activities and that the company details (trade name, MERSIS,
        address, etc.) be completed.
      </p>
    </LegalPage>
  );
}
