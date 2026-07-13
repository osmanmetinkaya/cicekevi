"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

const BRANCH_PHONE = "0545 729 01 08";

export function BranchInfo() {
  const t = useTranslations("header");
  const tb = useTranslations("branch");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Dışarı tıklayınca kapan.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-1 text-xs text-ink-muted transition-colors hover:text-ink"
      >
        <MapPin size={13} className="text-leaf-500" />
        {t("branchToggle")}
        <ChevronDown
          size={13}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-line bg-white p-2 shadow-xl shadow-rose-900/5">
          <div className="rounded-xl px-3 py-2">
            <span className="text-sm font-medium text-ink">{tb("name")}</span>
            <span className="mt-0.5 block text-xs text-ink-muted">
              {tb("address")}
            </span>
            <span className="mt-1 flex items-center gap-1 text-xs text-leaf-600">
              <Phone size={11} /> {BRANCH_PHONE}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
