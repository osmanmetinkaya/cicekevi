import Link from "next/link";
import { Logo } from "@/components/site/logo";

const LEGAL_LINKS = [
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/kvkk-aydinlatma-metni", label: "KVKK Aydınlatma Metni" },
  { href: "/cerez-politikasi", label: "Çerez Politikası" },
  { href: "/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
  { href: "/iptal-iade-kosullari", label: "İptal ve İade Koşulları" },
  { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <Logo size={22} className="text-lg" />
          <p className="mt-3 max-w-xs text-sm text-ink-muted">
            Mevsiminde, elde hazırlanan buketler. İstanbul içi aynı gün
            teslimat.
          </p>
        </div>
        <FooterCol
          title="Mağaza"
          items={[
            { label: "Buketler", href: "/kategori/buketler" },
            { label: "Saksı Çiçekleri", href: "/kategori/saksi-cicekleri" },
            { label: "Orkideler", href: "/kategori/orkideler" },
            { label: "Hediye kartı", href: "#" },
          ]}
        />
        <FooterCol
          title="Yardım"
          items={[
            { label: "Teslimat", href: "/mesafeli-satis-sozlesmesi" },
            { label: "İade ve iptal", href: "/iptal-iade-kosullari" },
            { label: "Sıkça sorulanlar", href: "#" },
            { label: "İletişim", href: "#" },
          ]}
        />
        <FooterCol
          title="Kurumsal"
          items={[
            { label: "Hakkımızda", href: "#" },
            { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
            { label: "Kullanım Koşulları", href: "/kullanim-kosullari" },
          ]}
        />
      </div>

      <div className="border-t border-line px-4 py-4 sm:px-6">
        <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-ink-muted">
          {LEGAL_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition-colors hover:text-rose-700">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-line py-5 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} Çiçekevi. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-ink">{title}</h3>
      <ul className="space-y-2 text-sm text-ink-muted">
        {items.map((i) => (
          <li key={i.label}>
            <Link href={i.href} className="transition-colors hover:text-ink">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
