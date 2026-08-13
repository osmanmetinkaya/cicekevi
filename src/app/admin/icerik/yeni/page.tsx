import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { HeroSlideForm } from "@/components/admin/hero-slide-form";

export default function NewHeroSlidePage() {
  return (
    <div>
      <Link
        href="/admin/icerik"
        className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-rose-700"
      >
        <ChevronLeft size={15} /> İçerik
      </Link>
      <h2 className="mt-3 mb-6 font-serif text-2xl text-ink">Yeni Slayt</h2>

      <div className="max-w-2xl">
        <HeroSlideForm initial={null} />
      </div>
    </div>
  );
}
