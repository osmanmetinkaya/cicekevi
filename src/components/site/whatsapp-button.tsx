import { LEGAL_ENTITY } from "@/lib/legal-info";

/** Türkiye numarasını wa.me formatına çevirir: "0545 729 01 08" -> "905457290108". */
function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? `90${digits.slice(1)}` : digits;
}

const WHATSAPP_URL = `https://wa.me/${toWhatsAppNumber(LEGAL_ENTITY.phone)}`;

/**
 * Sitede her sayfada sabit duran WhatsApp butonu — doğrudan mağazanın
 * WhatsApp sohbetini açar. Çerez bildirimi (z-50, alt bar) görünürken
 * çakışmaması için biraz yukarıda durur.
 */
export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp'tan bize yazın"
      className="fixed right-5 bottom-24 z-[60] flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-105 sm:right-6"
    >
      <svg
        viewBox="0 0 24 24"
        width="30"
        height="30"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35M12 2C6.48 2 2 6.48 2 12c0 1.94.55 3.75 1.5 5.29L2.5 21.5l4.34-1.14A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2m5.83 15.79A8.28 8.28 0 0 1 12 20.29a8.27 8.27 0 0 1-4.24-1.16l-.3-.18-2.9.76.78-2.84-.2-.3A8.26 8.26 0 0 1 3.71 12c0-4.57 3.72-8.29 8.29-8.29 2.21 0 4.29.86 5.86 2.43A8.24 8.24 0 0 1 20.29 12c0 4.57-3.72 8.29-8.29 8.29z" />
      </svg>
    </a>
  );
}
