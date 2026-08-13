import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { getHeroContent } from "@/lib/site-content";
import { ProductImage } from "@/components/product/product-image";
import { HeroSlideActions } from "@/components/admin/hero-slide-actions";

export default async function AdminContentPage() {
  const { slides } = await getHeroContent();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl text-ink">İçerik</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Ana sayfa banner'ının slaytları. Birden fazla slayt varsa
            vitrinde otomatik döner. Değişiklikler siteye anında yansır.
          </p>
        </div>
        <Link
          href="/admin/icerik/yeni"
          className="inline-flex items-center gap-1.5 rounded-full bg-rose-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-900"
        >
          <Plus size={16} /> Yeni Slayt
        </Link>
      </div>

      <ul className="mt-6 space-y-4">
        {slides.map((slide, i) => (
          <li
            key={slide.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white p-5"
          >
            <ProductImage
              product={{ accent: "blush", imageUrl: slide.imageUrl }}
              size={22}
              sizes="80px"
              className="h-16 w-24 shrink-0 rounded-xl"
            />

            <div className="min-w-48 flex-1">
              <span className="font-serif text-lg text-ink">
                {slide.title1.tr} {slide.title2.tr}
              </span>
              <p className="mt-0.5 line-clamp-1 text-sm text-ink-muted">
                {slide.eyebrow.tr}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/admin/icerik/${slide.id}/duzenle`}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm text-ink transition-colors hover:border-blush-300 hover:text-rose-700"
              >
                <Pencil size={14} /> Düzenle
              </Link>
              <HeroSlideActions
                id={slide.id}
                isFirst={i === 0}
                isLast={i === slides.length - 1}
                canDelete={slides.length > 1}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
