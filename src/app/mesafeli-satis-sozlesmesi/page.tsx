import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { LEGAL_ENTITY } from "@/lib/legal-info";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu — Çiçekevi",
};

export default function DistanceSalesPage() {
  return (
    <LegalPage title="Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu">
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
