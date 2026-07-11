"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, MapPin, Phone } from "lucide-react";

const BRANCHES = [
  { name: "Nişantaşı", address: "Teşvikiye Cd. No:12", phone: "0212 000 00 01" },
  { name: "Kadıköy", address: "Moda Cd. No:45", phone: "0216 000 00 02" },
  { name: "Beşiktaş", address: "Barbaros Blv. No:7", phone: "0212 000 00 03" },
];

export function BranchInfo() {
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
        İstanbul · 3 şube
        <ChevronDown
          size={13}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-line bg-white p-2 shadow-xl shadow-rose-900/5">
          <ul className="space-y-1">
            {BRANCHES.map((b) => (
              <li key={b.name}>
                <a
                  href="#"
                  className="block rounded-xl px-3 py-2 transition-colors hover:bg-blush-50"
                >
                  <span className="text-sm font-medium text-ink">{b.name}</span>
                  <span className="mt-0.5 block text-xs text-ink-muted">
                    {b.address}
                  </span>
                  <span className="mt-1 flex items-center gap-1 text-xs text-leaf-600">
                    <Phone size={11} /> {b.phone}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
