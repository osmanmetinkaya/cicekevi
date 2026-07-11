import Link from "next/link";
import { Flower2 } from "lucide-react";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <div className="grid overflow-hidden rounded-3xl border border-line bg-blush-100 md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center gap-4 px-7 py-12 sm:px-12">
          <p className="text-xs font-medium tracking-widest text-rose-700">
            AYNI GÜN TESLİMAT · İSTANBUL İÇİ
          </p>
          <h1 className="font-serif text-4xl leading-tight text-rose-900 sm:text-5xl">
            Taze çiçekler,
            <br />
            bugün kapında.
          </h1>
          <p className="max-w-md text-rose-700/90">
            Mevsiminde toplanan buketler ustalarımızın elinden çıkar. Saat
            16.00&apos;ya kadar verilen siparişler aynı gün ulaşır.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              href="#buketler"
              className="rounded-full bg-rose-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-900"
            >
              Buketleri keşfet
            </Link>
            <Link
              href="#buketler"
              className="rounded-full border border-rose-500 px-6 py-3 text-sm font-medium text-rose-700 transition-colors hover:bg-blush-50"
            >
              Çok satanlar
            </Link>
          </div>
        </div>
        <div className="flex min-h-56 items-center justify-center bg-blush-300">
          <Flower2 size={96} strokeWidth={1.1} className="text-rose-900/80" />
        </div>
      </div>
    </section>
  );
}
