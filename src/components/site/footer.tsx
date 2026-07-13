import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/site/logo";
import { SITE_NAME } from "@/lib/site";

export function Footer() {
  const t = useTranslations("footer");
  const tl = useTranslations("legalLinks");

  const legalLinks = [
    { href: "/gizlilik-politikasi", label: tl("privacy") },
    { href: "/kvkk-aydinlatma-metni", label: tl("kvkk") },
    { href: "/cerez-politikasi", label: tl("cookies") },
    { href: "/mesafeli-satis-sozlesmesi", label: tl("distanceSales") },
    { href: "/iptal-iade-kosullari", label: tl("cancellation") },
    { href: "/kullanim-kosullari", label: tl("terms") },
  ];

  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <Logo size={22} className="text-lg" />
          <p className="mt-3 max-w-xs text-sm text-ink-muted">{t("tagline")}</p>
        </div>
        <FooterCol
          title={t("shop")}
          items={[
            { label: t("bouquets"), href: "/kategori/buketler" },
            { label: t("pottedPlants"), href: "/kategori/saksi-cicekleri" },
            { label: t("orchids"), href: "/kategori/orkideler" },
            { label: t("giftCard"), href: "#" },
          ]}
        />
        <FooterCol
          title={t("help")}
          items={[
            { label: t("delivery"), href: "/mesafeli-satis-sozlesmesi" },
            { label: t("returns"), href: "/iptal-iade-kosullari" },
            { label: t("faq"), href: "#" },
            { label: t("contact"), href: "#" },
          ]}
        />
        <FooterCol
          title={t("corporate")}
          items={[
            { label: t("about"), href: "#" },
            { label: t("privacy"), href: "/gizlilik-politikasi" },
            { label: t("terms"), href: "/kullanim-kosullari" },
          ]}
        />
      </div>

      <div className="border-t border-line px-4 py-4 sm:px-6">
        <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-ink-muted">
          {legalLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition-colors hover:text-rose-700">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-line py-5 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} {SITE_NAME}. {t("rights")}
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
