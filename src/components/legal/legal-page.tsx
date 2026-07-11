import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { LEGAL_LAST_UPDATED } from "@/lib/legal-info";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-rose-700"
      >
        <ChevronLeft size={15} /> Ana sayfa
      </Link>

      <h1 className="mt-4 font-serif text-3xl text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-1 text-sm text-ink-muted">
        Son güncelleme: {LEGAL_LAST_UPDATED}
      </p>

      <div className="prose-legal mt-8 space-y-5 text-[15px] leading-relaxed text-ink">
        {children}
      </div>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 font-serif text-xl text-ink">{title}</h2>
      <div className="space-y-3 text-ink-muted">{children}</div>
    </section>
  );
}
