"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const KEY = "cicekevi-cerez-bildirimi";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-4 text-center sm:flex-row sm:justify-between sm:text-left sm:px-6">
        <p className="flex items-center gap-2 text-sm text-ink-muted">
          <Cookie size={17} className="shrink-0 text-leaf-600" />
          Sitemizde yalnızca sitenin çalışması için gerekli çerezleri
          kullanıyoruz.{" "}
          <Link
            href="/cerez-politikasi"
            className="text-rose-700 underline underline-offset-2"
          >
            Çerez Politikası
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-full bg-rose-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-900"
        >
          Anladım
        </button>
      </div>
    </div>
  );
}
