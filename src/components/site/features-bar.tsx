import { Clock4, Leaf, ShieldCheck, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

export function FeaturesBar() {
  const t = useTranslations("features");
  const features = [
    { Icon: Truck, label: t("sameDay") },
    { Icon: Clock4, label: t("window") },
    { Icon: Leaf, label: t("fresh") },
    { Icon: ShieldCheck, label: t("securePayment") },
  ];

  return (
    <section className="border-y border-line bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 py-2 sm:px-6 md:grid-cols-4">
        {features.map(({ Icon, label }) => (
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
