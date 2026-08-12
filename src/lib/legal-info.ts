import { SITE_NAME } from "@/lib/site";

/**
 * Yasal metinlerde (KVKK, gizlilik, sözleşmeler) kullanılan ortak şirket
 * bilgileri. Bu dosya tek kaynak olduğu için güncelleme buradan tüm
 * sayfalara yansır.
 *
 * Şahıs işletmesi olarak faaliyet gösterildiğinden MERSİS No, Ticaret Sicil
 * No ve KEP adresi kasıtlı olarak yok — bunlar yalnızca ticaret şirketleri
 * (A.Ş./Ltd. Şti.) için uygulanır.
 */
export const LEGAL_ENTITY = {
  brandName: SITE_NAME,
  legalName: "Denizli Çiçekevi",
  taxOffice: "Gökpınar Vergi Dairesi",
  taxId: "29729069778",
  address:
    "Yenişafak, 1029 Sk. No:9 D:B, 20040 Merkezefendi/Denizli, Türkiye",
  email: "denizlicicekevi20@gmail.com",
  supportEmail: "denizlicicekevi20@gmail.com",
  phone: "0545 729 01 08",
} as const;

/** İngilizce yasal sayfalarda gösterilecek karşılıklar. */
export const LEGAL_ENTITY_EN = {
  legalName: "Denizli Çiçekevi",
  taxOffice: "Gökpınar Tax Office",
  taxId: "29729069778",
} as const;

export const LEGAL_LAST_UPDATED = "12 Ağustos 2026";
export const LEGAL_LAST_UPDATED_EN = "12 August 2026";
