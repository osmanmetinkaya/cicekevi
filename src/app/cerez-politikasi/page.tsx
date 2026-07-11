import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { LEGAL_ENTITY } from "@/lib/legal-info";

export const metadata: Metadata = {
  title: "Çerez Politikası — Çiçekevi",
};

const COOKIES = [
  {
    name: "sb-access-token / sb-refresh-token",
    type: "Zorunlu (oturum)",
    purpose: "Üyelik girişinizin sürdürülmesi ve hesabınızın güvenliği.",
    duration: "Oturum süresi / 7 gün",
  },
  {
    name: "cicekco-cart-v1",
    type: "Zorunlu (fonksiyonel — localStorage)",
    purpose: "Sepetinizdeki ürünlerin tarayıcınızda hatırlanması.",
    duration: "Siz temizleyene kadar",
  },
  {
    name: "cicekevi-cerez-bildirimi",
    type: "Zorunlu (tercih — localStorage)",
    purpose: "Çerez bildirimini kapattığınızın hatırlanması.",
    duration: "1 yıl",
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Çerez Politikası">
      <p className="text-ink-muted">
        {LEGAL_ENTITY.brandName}, sitemizi ziyaretinizde deneyiminizi
        iyileştirmek amacıyla çerezler ve benzer teknolojiler (localStorage)
        kullanır. Bu sayfada hangi çerezleri, hangi amaçla kullandığımızı
        açıklıyoruz.
      </p>

      <LegalSection title="1. Çerez Nedir?">
        <p>
          Çerezler, ziyaret ettiğiniz internet siteleri tarafından
          tarayıcınıza kaydedilen küçük metin dosyalarıdır. Sitemiz şu an
          yalnızca sitenin çalışması için gerekli olan zorunlu/fonksiyonel
          çerezleri ve tarayıcı depolamasını (localStorage) kullanmaktadır;
          reklam veya üçüncü taraf analitik/izleme çerezi kullanılmamaktadır.
        </p>
      </LegalSection>

      <LegalSection title="2. Kullandığımız Çerezler">
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-ink">
              <tr>
                <th className="px-3 py-2 font-medium">Ad</th>
                <th className="px-3 py-2 font-medium">Tür</th>
                <th className="px-3 py-2 font-medium">Amaç</th>
                <th className="px-3 py-2 font-medium">Süre</th>
              </tr>
            </thead>
            <tbody>
              {COOKIES.map((c) => (
                <tr key={c.name} className="border-t border-line align-top">
                  <td className="px-3 py-2 font-mono text-xs text-ink">
                    {c.name}
                  </td>
                  <td className="px-3 py-2">{c.type}</td>
                  <td className="px-3 py-2">{c.purpose}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{c.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection title="3. Zorunlu Çerezleri Nasıl Yönetebilirsiniz?">
        <p>
          Zorunlu çerezler, sitenin temel işlevleri (giriş, sepet) için
          gereklidir ve kapatılmaları hâlinde site düzgün çalışmayabilir.
          Tarayıcı ayarlarınızdan tüm çerezleri silebilir veya
          engelleyebilirsiniz; bu durumda oturumunuz ve sepetiniz
          korunamayabilir.
        </p>
      </LegalSection>

      <LegalSection title="4. İleride Eklenebilecek Çerezler">
        <p>
          İlerleyen dönemde site performansını ölçmek amacıyla analitik
          çerezler eklememiz hâlinde, bu sayfa güncellenecek ve gerekli
          hâllerde açık rızanız istenecektir.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
