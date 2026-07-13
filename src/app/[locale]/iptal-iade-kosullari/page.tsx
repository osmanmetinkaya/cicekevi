import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { LEGAL_ENTITY } from "@/lib/legal-info";

const TITLE = {
  tr: "İptal ve İade Koşulları",
  en: "Cancellation & Refund Terms",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "en" ? TITLE.en : TITLE.tr;
  return { title: `${title} — Çiçekevi` };
}

export default async function CancellationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return locale === "en" ? <CancellationEn /> : <CancellationTr />;
}

function CancellationTr() {
  return (
    <LegalPage title={TITLE.tr}>
      <p className="text-ink-muted">
        Bu sayfa,{" "}
        <Link
          href="/mesafeli-satis-sozlesmesi"
          className="text-rose-700 underline underline-offset-2"
        >
          Mesafeli Satış Sözleşmesi
        </Link>
        &rsquo;nde yer alan cayma hakkı ve ayıplı ürün hükümlerinin
        müşteri-dostu bir özetidir; çelişki hâlinde sözleşme metni esas
        alınır.
      </p>

      <LegalSection title="Sipariş İptali">
        <p>
          Siparişiniz henüz hazırlanmaya başlanmadıysa,{" "}
          {LEGAL_ENTITY.supportEmail} adresinden veya {LEGAL_ENTITY.phone}{" "}
          numarasından bize ulaşarak siparişinizin iptalini talep
          edebilirsiniz. Hazırlığı başlamış (buket dizilmiş, kuryeye
          verilmiş) siparişlerde iptal mümkün olmayabilir.
        </p>
      </LegalSection>

      <LegalSection title="Cayma Hakkı Neden Uygulanmıyor?">
        <p>
          Taze kesme çiçek ve canlı bitkiler, mevzuatta &ldquo;çabuk
          bozulabilen mal&rdquo; kategorisinde değerlendirildiğinden
          (Mesafeli Sözleşmeler Yönetmeliği m. 15/1-ç), teslim alınan
          ürünlerde cayma hakkı (14 gün içinde sebepsiz iade) yasal olarak
          uygulanmaz. Bu, sektör genelinde geçerli standart bir
          uygulamadır.
        </p>
      </LegalSection>

      <LegalSection title="Hasarlı veya Hatalı Ürün Geldiyse">
        <p>Ürününüz siparişinizden farklıysa veya hasarlı ulaştıysa:</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            Teslimat anında mümkünse kurye eşliğinde fotoğraf/kısa video
            çekin.
          </li>
          <li>
            En geç 24 saat içinde {LEGAL_ENTITY.supportEmail} adresine
            sipariş numaranız ve fotoğraflarla birlikte bildirin.
          </li>
          <li>
            Talebiniz incelendikten sonra ürün yenilenir veya bedeli iade
            edilir.
          </li>
        </ol>
      </LegalSection>

      <LegalSection title="İade Süresi">
        <p>
          Onaylanan iadelerde tutar, ödeme yönteminize bağlı olarak 5-10 iş
          günü içinde hesabınıza yansır.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

function CancellationEn() {
  return (
    <LegalPage title={TITLE.en} authoritativeHref="/iptal-iade-kosullari">
      <p className="text-ink-muted">
        This page is a customer-friendly summary of the right-of-withdrawal and
        defective-product provisions in the{" "}
        <Link
          href="/mesafeli-satis-sozlesmesi"
          className="text-rose-700 underline underline-offset-2"
        >
          Distance Sales Agreement
        </Link>
        ; in case of any conflict, the agreement text prevails.
      </p>

      <LegalSection title="Order Cancellation">
        <p>
          If preparation of your order has not yet started, you can request
          cancellation by contacting us at {LEGAL_ENTITY.supportEmail} or on{" "}
          {LEGAL_ENTITY.phone}. Cancellation may not be possible for orders whose
          preparation has begun (bouquet arranged, handed to the courier).
        </p>
      </LegalSection>

      <LegalSection title="Why Doesn't the Right of Withdrawal Apply?">
        <p>
          Because fresh cut flowers and live plants are treated as
          &ldquo;perishable goods&rdquo; under the legislation (Regulation on
          Distance Contracts, Art. 15/1-ç), the right of withdrawal (returning
          without reason within 14 days) does not legally apply to products that
          have been received. This is a standard practice across the industry.
        </p>
      </LegalSection>

      <LegalSection title="If a Damaged or Incorrect Product Arrives">
        <p>If your product differs from your order or arrives damaged:</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            If possible, take a photo/short video at the time of delivery in the
            presence of the courier.
          </li>
          <li>
            Notify us within 24 hours at the latest at {LEGAL_ENTITY.supportEmail}{" "}
            with your order number and photos.
          </li>
          <li>
            After your request is reviewed, the product will be replaced or
            refunded.
          </li>
        </ol>
      </LegalSection>

      <LegalSection title="Refund Timing">
        <p>
          For approved refunds, the amount is credited to your account within
          5-10 business days, depending on your payment method.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
