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
  address: "[AÇIK ADRES GİRİLECEK], İstanbul, Türkiye",
  email: "kvkk@cicekevi.com",
  supportEmail: "destek@cicekevi.com",
  phone: "[MÜŞTERİ HİZMETLERİ TELEFONU GİRİLECEK]",
  kepAddress: "[KEP ADRESİ GİRİLECEK]",
} as const;

export const LEGAL_LAST_UPDATED = "9 Temmuz 2026";
