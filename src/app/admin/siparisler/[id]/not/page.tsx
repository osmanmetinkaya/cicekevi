import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PrintButton } from "@/components/admin/print-button";

interface NoteRow {
  order_number: string;
  gift_note: string | null;
  sender_name: string | null;
  recipient_name: string | null;
}

export default async function GiftNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("order_number, gift_note, sender_name, recipient_name")
    .eq("id", id)
    .maybeSingle<NoteRow>();

  if (!data || !data.gift_note) notFound();

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/admin/siparisler"
          className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-rose-700"
        >
          <ChevronLeft size={15} /> Siparişler
        </Link>
        <PrintButton label="Notu yazdır" />
      </div>

      <div className="flex aspect-[3/2] flex-col items-center justify-center rounded-2xl border border-line bg-white p-10 text-center print:aspect-auto print:min-h-[60vh] print:rounded-none print:border-0">
        <p className="font-serif text-2xl leading-relaxed text-ink italic">
          “{data.gift_note}”
        </p>
        {data.recipient_name && (
          <p className="mt-6 text-sm text-ink-muted">
            Kime: {data.recipient_name}
          </p>
        )}
        {data.sender_name && (
          <p className="mt-1 text-sm text-ink-muted">
            Kimden: {data.sender_name}
          </p>
        )}
        <p className="mt-6 text-xs text-ink-muted">#{data.order_number}</p>
      </div>
    </div>
  );
}
