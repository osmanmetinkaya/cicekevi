import { Clock4, Leaf, ShieldCheck, Truck } from "lucide-react";

const FEATURES = [
  { Icon: Truck, label: "Aynı gün teslimat" },
  { Icon: Clock4, label: "Teslimat penceresi seç" },
  { Icon: Leaf, label: "Mevsiminde ve taze" },
  { Icon: ShieldCheck, label: "Güvenli ödeme" },
];

export function FeaturesBar() {
  return (
    <section className="border-y border-line bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 py-2 sm:px-6 md:grid-cols-4">
        {FEATURES.map(({ Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 px-3 py-5 text-center"
          >
            <Icon size={22} strokeWidth={1.5} className="text-leaf-600" />
            <span className="text-sm text-ink-muted">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
