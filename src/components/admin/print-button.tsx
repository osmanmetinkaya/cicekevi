"use client";

import { Printer } from "lucide-react";

/** Tarayıcının yazdırma diyaloğunu açar; sayfa @media print kurallarıyla kendini biçimlendirir. */
export function PrintButton({ label = "Yazdır" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden inline-flex items-center gap-1.5 rounded-full bg-rose-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-900"
    >
      <Printer size={16} /> {label}
    </button>
  );
}
