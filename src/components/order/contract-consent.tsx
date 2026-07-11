"use client";

import Link from "next/link";

export function ContractConsent({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
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
          Mesafeli Satış Sözleşmesi
        </Link>
        &rsquo;ni ve{" "}
        <Link
          href="/kvkk-aydinlatma-metni"
          target="_blank"
          className="text-rose-700 underline underline-offset-2"
        >
          KVKK Aydınlatma Metni
        </Link>
        &rsquo;ni okudum, onaylıyorum. Taze çiçekler çabuk bozulabilir ürün
        olduğundan{" "}
        <Link
          href="/iptal-iade-kosullari"
          target="_blank"
          className="text-rose-700 underline underline-offset-2"
        >
          cayma hakkı istisnası
        </Link>{" "}
        kapsamındadır.
      </span>
    </label>
  );
}
