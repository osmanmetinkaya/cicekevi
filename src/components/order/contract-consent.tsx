"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function ContractConsent({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const t = useTranslations("contractConsent");
  return (
    <label className="flex items-start gap-2.5 text-sm text-ink-muted">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
        className="mt-0.5 size-4 shrink-0 rounded border-line text-rose-700 focus:ring-rose-500"
      />
      <span>
        <Link
          href="/mesafeli-satis-sozlesmesi"
          target="_blank"
          className="text-rose-700 underline underline-offset-2"
        >
          {t("distanceSales")}
        </Link>
        {t("readAccept")}{" "}
        <Link
          href="/kvkk-aydinlatma-metni"
          target="_blank"
          className="text-rose-700 underline underline-offset-2"
        >
          {t("kvkk")}
        </Link>
        {t("readAcceptEnd")}{" "}
        <Link
          href="/iptal-iade-kosullari"
          target="_blank"
          className="text-rose-700 underline underline-offset-2"
        >
          {t("withdrawalException")}
        </Link>{" "}
        {t("withdrawalEnd")}
      </span>
    </label>
  );
}
