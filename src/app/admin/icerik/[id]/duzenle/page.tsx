import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getHeroContent } from "@/lib/site-content";
import { HeroSlideForm } from "@/components/admin/hero-slide-form";

export default async function EditHeroSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { slides } = await getHeroContent();
  const slide = slides.find((s) => s.id === id);
  if (!slide) notFound();

  return (
    <div>
      <Link
        href="/admin/icerik"
        className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-rose-700"
      >
        <ChevronLeft size={15} /> İçerik
      </Link>
      <h2 className="mt-3 mb-6 font-serif text-2xl text-ink">
        Slayt — Düzenle
      </h2>

      <div className="max-w-2xl">
        <HeroSlideForm initial={slide} />
      </div>
    </div>
  );
}
