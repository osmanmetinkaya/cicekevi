"use client";

import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getStoredConsent, setStoredConsent } from "@/lib/consent";

export function CookieNotice() {
  const t = useTranslations("cookieNotice");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getStoredConsent()) setVisible(true);
  }, []);

  function choose(state: "granted" | "denied") {
    setStoredConsent(state);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-4 text-center sm:flex-row sm:justify-between sm:text-left sm:px-6">
        <p className="flex items-center gap-2 text-sm text-ink-muted">
          <Cookie size={17} className="shrink-0 text-leaf-600" />
          {t("text")}{" "}
          <Link
            href="/cerez-politikasi"
            className="text-rose-700 underline underline-offset-2"
          >
            {t("policyLink")}
          </Link>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="rounded-full border border-line px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-blush-300 hover:text-rose-700"
          >
            {t("reject")}
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="rounded-full bg-rose-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-900"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
