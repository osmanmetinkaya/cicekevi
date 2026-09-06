/**
 * Teslimat saat dilimleri — hem istemci (sepet formu) hem sunucu (checkout
 * doğrulaması) bu tek kaynağı kullanır, ikisi asla birbirinden sapmaz.
 */
export const DELIVERY_WINDOWS: string[] = ["09:00 - 15:00", "15:00 - 21:00"];

export interface DeliveryZone {
  id: string;
  label: string;
  /** Ek teslimat ücreti, kuruş. */
  feeKurus: number;
}

/**
 * Ek ücretli teslimat bölgeleri — hem istemci (sepet formu) hem sunucu
 * (checkout doğrulaması) bu tek kaynağı kullanır. Merkez ilçe (Pamukkale
 * merkezi + Merkezefendi) burada YER ALMAZ: ücretsizdir, müşteri bu
 * bölgedeyse hiçbir seçenek işaretlemez.
 */
export const DELIVERY_ZONES: DeliveryZone[] = [
  { id: "akhan-pinarkent", label: "Akhan / Pınarkent", feeKurus: 20000 },
  { id: "organize", label: "Organize", feeKurus: 30000 },
  { id: "korucuk", label: "Korucuk", feeKurus: 20000 },
  { id: "pamukkale", label: "Pamukkale", feeKurus: 30000 },
  { id: "karahayit", label: "Karahayıt", feeKurus: 40000 },
];

export function getDeliveryZone(id: string | null | undefined): DeliveryZone | null {
  if (!id) return null;
  return DELIVERY_ZONES.find((z) => z.id === id) ?? null;
}
