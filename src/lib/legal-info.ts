/**
 * Yasal metinlerde (KVKK, gizlilik, sözleşmeler) kullanılan ortak şirket
 * bilgileri. Şu an PLACEHOLDER değerler içerir — siteyi yayına almadan önce
 * gerçek ticaret unvanı, MERSİS/vergi no ve adres ile doldurulmalı, ardından
 * bir hukuk danışmanına onaylatılmalıdır. Bu dosya tek kaynak olduğu için
 * güncelleme buradan tüm sayfalara yansır.
 */
export const LEGAL_ENTITY = {
  brandName: "Çiçekevi",
  // TODO: gerçek ticaret unvanı ile değiştir (ör. "Çiçekevi Perakende Tic. Ltd. Şti.")
  legalName: "[TİCARET UNVANI GİRİLECEK]",
  mersisNo: "[MERSİS NO GİRİLECEK]",
  tradeRegistryNo: "[TİCARET SİCİL NO GİRİLECEK]",
  taxOffice: "[VERGİ DAİRESİ GİRİLECEK]",
  taxId: "[VERGİ NUMARASI GİRİLECEK]",
  address:
    "Yenişafak, 1029 Sk. No:9 D:B, 20040 Merkezefendi/Denizli, Türkiye",
  email: "kvkk@cicekevi.com",
  supportEmail: "destek@cicekevi.com",
  phone: "0545 729 01 08",
  kepAddress: "[KEP ADRESİ GİRİLECEK]",
} as const;

/**
 * İngilizce yasal sayfalarda gösterilecek placeholder karşılıkları. Türkçe
 * köşeli parantezli TODO'larla aynı bilgiyi taşır (henüz doldurulmadı), fakat
 * İngilizce metinde okunabilir dursun diye ayrı tutulur.
 */
export const LEGAL_ENTITY_EN = {
  legalName: "[LEGAL ENTITY NAME TO BE ADDED]",
  mersisNo: "[MERSIS NO TO BE ADDED]",
  tradeRegistryNo: "[TRADE REGISTRY NO TO BE ADDED]",
  taxOffice: "[TAX OFFICE TO BE ADDED]",
  taxId: "[TAX ID TO BE ADDED]",
  kepAddress: "[KEP (REGISTERED E-MAIL) ADDRESS TO BE ADDED]",
} as const;

export const LEGAL_LAST_UPDATED = "9 Temmuz 2026";
export const LEGAL_LAST_UPDATED_EN = "9 July 2026";
