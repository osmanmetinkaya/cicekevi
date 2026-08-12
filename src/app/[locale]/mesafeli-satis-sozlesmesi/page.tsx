import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { LEGAL_ENTITY, LEGAL_ENTITY_EN } from "@/lib/legal-info";
import { SITE_NAME } from "@/lib/site";

const TITLE = {
  tr: "Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu",
  en: "Distance Sales Agreement and Pre-Contract Information Form",
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

export default async function DistanceSalesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return locale === "en" ? <DistanceSalesEn /> : <DistanceSalesTr />;
}

function DistanceSalesTr() {
  return (
    <LegalPage title={TITLE.tr}>
      <p className="text-ink-muted">
        Bu metin, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve
        Mesafeli Sözleşmeler Yönetmeliği uyarınca, {LEGAL_ENTITY.brandName}{" "}
        üzerinden verdiğiniz her siparişte taraflar arasında kurulan
        sözleşmenin genel hüküm ve koşullarını içerir. Siparişinizi
        onaylayarak bu sözleşmenin ve ön bilgilendirme formunun içeriğini
        okuduğunuzu ve kabul ettiğinizi beyan etmiş olursunuz. Sözleşmenin
        bir örneği, sipariş onayınızla birlikte kalıcı veri saklayıcısı
        olarak e-posta adresinize gönderilir.
      </p>

      <LegalSection title="1. Taraflar">
        <p>
          <span className="text-ink">Satıcı:</span> {LEGAL_ENTITY.legalName}
          <br />
          Vergi Dairesi / Vergi No: {LEGAL_ENTITY.taxOffice} /{" "}
          {LEGAL_ENTITY.taxId}
          <br />
          Adres: {LEGAL_ENTITY.address}
          <br />
          E-posta: {LEGAL_ENTITY.supportEmail} · Telefon: {LEGAL_ENTITY.phone}
        </p>
        <p>
          <span className="text-ink">Alıcı:</span> Sipariş sırasında
          verdiğiniz ad, soyad, teslimat adresi ve iletişim bilgileriyle
          tanımlanan tüketici.
        </p>
      </LegalSection>

      <LegalSection title="2. Sözleşmenin Konusu">
        <p>
          İşbu sözleşmenin konusu, Alıcı&rsquo;nın {LEGAL_ENTITY.brandName}{" "}
          internet sitesi üzerinden elektronik ortamda siparişini verdiği,
          sepet ve sipariş özetinde nitelikleri, satış fiyatı ve ödeme
          şekli belirtilen ürün(ler)in satışı ve teslimine ilişkin olarak,
          6502 sayılı Kanun ve ilgili mevzuat hükümleri gereğince tarafların
          hak ve yükümlülüklerinin belirlenmesidir.
        </p>
      </LegalSection>

      <LegalSection title="3. Ürün ve Fiyat Bilgisi">
        <p>
          Sipariş konusu ürünün türü, adedi, marka/modeli, satış bedeli
          (KDV dâhil) ve ödeme şekli, sipariş onayından önce sepet ve
          sipariş özeti ekranında Alıcı&rsquo;ya açıkça gösterilir; bu
          bilgiler işbu sözleşmenin ayrılmaz parçasıdır. Teslimat ücreti
          (varsa) ödeme adımında ayrıca belirtilir.
        </p>
      </LegalSection>

      <LegalSection title="4. Teslimat">
        <p>
          Siparişler, Alıcı tarafından seçilen teslimat tarihi ve saat
          aralığında, sipariş özetinde belirtilen adrese teslim edilir.
          Alıcı&rsquo;nın adreste bulunmaması veya adresin hatalı/eksik
          verilmesi hâlinde doğacak gecikme ve zararlardan Satıcı sorumlu
          tutulamaz. Çiçekler canlı ve çabuk bozulabilir ürünler
          olduğundan, teslim alma sırasında ürünün kontrol edilmesi ve
          varsa hasarın kurye/teslimat anında bildirilmesi önemle rica
          olunur.
        </p>
      </LegalSection>

      <LegalSection title="5. Ödeme">
        <p>
          Ödeme, sipariş sırasında seçtiğiniz yöntemle, güvenli ödeme
          altyapısı üzerinden kredi/banka kartınızdan tahsil edilir. Kart
          bilgileriniz Satıcı sunucularında saklanmaz.
        </p>
      </LegalSection>

      <LegalSection title="6. Cayma Hakkı ve İstisnası">
        <p>
          Mesafeli Sözleşmeler Yönetmeliği&rsquo;nin 15. maddesinin birinci
          fıkrasının (ç) bendi uyarınca,{" "}
          <span className="text-ink">
            çabuk bozulabilen veya son kullanma tarihi geçebilecek malların
            (taze kesme çiçek, canlı bitki ve benzeri ürünler dâhil)
            teslimine ilişkin sözleşmelerde tüketicinin cayma hakkı
            bulunmamaktadır.
          </span>{" "}
          Bu nedenle, {LEGAL_ENTITY.brandName} üzerinden satın alınan taze
          çiçek ve bitki ürünlerinde, ürün teslim alındıktan sonra cayma
          hakkı kullanılamaz.
        </p>
        <p>
          Buna karşılık, ürünün ayıplı (bozuk, hasarlı, siparişten farklı)
          teslim edilmesi hâlinde, 6502 sayılı Kanun&rsquo;un ayıplı mal
          hükümleri saklıdır; teslimat anında veya en geç 24 saat içinde{" "}
          {LEGAL_ENTITY.supportEmail} adresine fotoğraflı bildirimde
          bulunmanız hâlinde ürün yenilenir veya bedeli iade edilir. Ayrıntılar
          için İptal ve İade Koşulları sayfamızı inceleyebilirsiniz.
        </p>
      </LegalSection>

      <LegalSection title="7. Mücbir Sebep">
        <p>
          Doğal afet, hava koşulları, salgın hastalık, resmi makam
          müdahalesi gibi tarafların kontrolü dışında gelişen ve önceden
          öngörülemeyen hâllerde, etkilenen taraf edimini ifa edemez veya
          geç ifa ederse sorumlu tutulamaz.
        </p>
      </LegalSection>

      <LegalSection title="8. Uyuşmazlıkların Çözümü">
        <p>
          İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığı
          tarafından her yıl ilan edilen parasal sınırlar dâhilinde
          Alıcı&rsquo;nın yerleşim yerindeki İl/İlçe Tüketici Hakem Heyetleri,
          bu sınırları aşan uyuşmazlıklarda ise Tüketici Mahkemeleri
          yetkilidir.
        </p>
      </LegalSection>

      <LegalSection title="9. Yürürlük">
        <p>
          Alıcı, sipariş onayı adımında ilgili onay kutusunu işaretleyerek
          işbu Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu&rsquo;nun
          tüm koşullarını okuduğunu ve kabul ettiğini beyan eder; sözleşme bu
          onayla birlikte elektronik ortamda kurulmuş sayılır.
        </p>
      </LegalSection>

      <p className="text-xs text-ink-muted">
        Bu metin genel bir şablon niteliğindedir; yayına almadan önce bir
        hukuk danışmanı tarafından gözden geçirilmesi ve şirket bilgilerinin
        tamamlanması önerilir.
      </p>
    </LegalPage>
  );
}

function DistanceSalesEn() {
  return (
    <LegalPage title={TITLE.en} authoritativeHref="/mesafeli-satis-sozlesmesi">
      <p className="text-ink-muted">
        This text sets out the general terms and conditions of the agreement
        formed between the parties for every order you place through{" "}
        {LEGAL_ENTITY.brandName}, under Turkish Law No. 6502 on the Protection of
        Consumers and the Regulation on Distance Contracts. By confirming your
        order, you declare that you have read and accepted the content of this
        agreement and the pre-contract information form. A copy of the agreement
        is sent to your email address as a durable medium together with your
        order confirmation.
      </p>

      <LegalSection title="1. Parties">
        <p>
          <span className="text-ink">Seller:</span> {LEGAL_ENTITY_EN.legalName}
          <br />
          Tax Office / Tax ID: {LEGAL_ENTITY_EN.taxOffice} /{" "}
          {LEGAL_ENTITY_EN.taxId}
          <br />
          Address: {LEGAL_ENTITY.address}
          <br />
          Email: {LEGAL_ENTITY.supportEmail} · Phone: {LEGAL_ENTITY.phone}
        </p>
        <p>
          <span className="text-ink">Buyer:</span> The consumer identified by
          the name, surname, delivery address and contact details provided
          during the order.
        </p>
      </LegalSection>

      <LegalSection title="2. Subject of the Agreement">
        <p>
          The subject of this agreement is the determination of the parties&rsquo;
          rights and obligations, in accordance with Law No. 6502 and the
          relevant legislation, regarding the sale and delivery of the
          product(s) whose characteristics, sale price and payment method are
          stated in the cart and order summary, ordered electronically by the
          Buyer through the {LEGAL_ENTITY.brandName} website.
        </p>
      </LegalSection>

      <LegalSection title="3. Product and Price Information">
        <p>
          The type, quantity, brand/model, sale price (VAT included) and payment
          method of the ordered product are shown clearly to the Buyer on the
          cart and order summary screens before order confirmation; this
          information is an integral part of this agreement. The delivery fee (if
          any) is stated separately at the payment step.
        </p>
      </LegalSection>

      <LegalSection title="4. Delivery">
        <p>
          Orders are delivered to the address stated in the order summary, within
          the delivery date and time window selected by the Buyer. The Seller
          cannot be held responsible for delays and damages arising from the
          Buyer&rsquo;s absence at the address or from an incorrect/incomplete
          address. As flowers are live and perishable products, we kindly ask
          that the product be inspected on receipt and any damage reported to the
          courier at the time of delivery.
        </p>
      </LegalSection>

      <LegalSection title="5. Payment">
        <p>
          Payment is collected from your credit/debit card via the secure
          payment infrastructure, using the method you select during the order.
          Your card details are not stored on the Seller&rsquo;s servers.
        </p>
      </LegalSection>

      <LegalSection title="6. Right of Withdrawal and Its Exception">
        <p>
          Under Article 15, paragraph 1, subparagraph (ç) of the Regulation on
          Distance Contracts,{" "}
          <span className="text-ink">
            the consumer has no right of withdrawal in contracts for the delivery
            of goods that are perishable or may expire (including fresh cut
            flowers, live plants and similar products).
          </span>{" "}
          For this reason, the right of withdrawal cannot be exercised after
          receipt for the fresh flower and plant products purchased through{" "}
          {LEGAL_ENTITY.brandName}.
        </p>
        <p>
          However, if the product is delivered defective (spoiled, damaged, or
          different from the order), the defective-goods provisions of Law No.
          6502 are reserved; if you notify us with photos at{" "}
          {LEGAL_ENTITY.supportEmail} at the time of delivery or within 24 hours
          at the latest, the product will be replaced or refunded. For details,
          please see our Cancellation & Refund Terms page.
        </p>
      </LegalSection>

      <LegalSection title="7. Force Majeure">
        <p>
          In cases that develop beyond the parties&rsquo; control and could not
          be foreseen in advance — such as natural disasters, weather conditions,
          epidemics, or intervention by official authorities — the affected party
          cannot be held responsible if it fails to perform or performs late.
        </p>
      </LegalSection>

      <LegalSection title="8. Resolution of Disputes">
        <p>
          For disputes arising from this agreement, the Provincial/District
          Consumer Arbitration Committees at the Buyer&rsquo;s place of residence
          have jurisdiction within the monetary limits announced each year by the
          Ministry of Trade, and the Consumer Courts have jurisdiction for
          disputes exceeding those limits.
        </p>
      </LegalSection>

      <LegalSection title="9. Entry into Force">
        <p>
          By ticking the relevant confirmation box at the order confirmation
          step, the Buyer declares that they have read and accepted all the terms
          of this Distance Sales Agreement and Pre-Contract Information Form; the
          agreement is deemed to have been formed electronically upon this
          confirmation.
        </p>
      </LegalSection>

      <p className="text-xs text-ink-muted">
        This text is a general template; it is recommended that it be reviewed by
        a legal advisor and that the company details be completed before going
        live.
      </p>
    </LegalPage>
  );
}
