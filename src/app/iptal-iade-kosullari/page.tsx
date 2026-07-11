import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { LEGAL_ENTITY } from "@/lib/legal-info";

export const metadata: Metadata = {
  title: "İptal ve İade Koşulları — Çiçekevi",
};

export default function CancellationPage() {
  return (
    <LegalPage title="İptal ve İade Koşulları">
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
