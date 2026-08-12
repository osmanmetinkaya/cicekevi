import { getHeroContent } from "@/lib/site-content";
import { HeroContentForm } from "@/components/admin/hero-content-form";

export default async function AdminContentPage() {
  const hero = await getHeroContent();

  return (
    <div>
      <h2 className="font-serif text-2xl text-ink">İçerik</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Ana sayfa banner'ının görseli ve metinleri. Değişiklikler siteye
        anında yansır.
      </p>

      <div className="mt-6 max-w-2xl">
        <HeroContentForm initial={hero} />
      </div>
    </div>
  );
}
