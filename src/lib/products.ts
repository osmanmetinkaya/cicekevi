import type { Product } from "@/lib/types";
import {
  CATEGORY_GROUPS,
  groupCategorySlugs,
  type CategoryGroup,
} from "@/lib/categories";

export const PRODUCTS: Product[] = [
  {
    id: "pembe-safak",
    slug: "pembe-safak",
    name: "Pembe Şafak",
    tagline: "Güller · şakayık",
    description:
      "Sabahın ilk ışığını anımsatan toz pembe güller ve şakayıklardan oluşan zarif bir buket. Romantik anlar için tasarlandı.",
    priceKurus: 54900,
    categories: ["buketler", "sevgiliye-cicek", "sevgililer-gunu", "dogum-gunu"],
    flowers: ["Toz pembe gül", "Şakayık", "Okaliptus"],
    accent: "blush",
    isNew: true,
    bestseller: true,
  },
  {
    id: "kirmizi-tutku",
    slug: "kirmizi-tutku",
    name: "Kırmızı Tutku",
    tagline: "21 kırmızı gül",
    description:
      "Yirmi bir adet kadife kırmızı gülden hazırlanan klasik aşk buketi. Sözü çiçekler söylesin.",
    priceKurus: 69900,
    categories: ["buketler", "sevgiliye-cicek", "sevgililer-gunu"],
    flowers: ["Kırmızı gül", "Cipso", "Yeşillik"],
    accent: "rose",
    bestseller: true,
  },
  {
    id: "gunes-demeti",
    slug: "gunes-demeti",
    name: "Güneş Demeti",
    tagline: "Ayçiçeği · gerbera",
    description:
      "Günü aydınlatan sarı ayçiçekleri ve turuncu gerberalar. Neşeyi kapıya taşıyan canlı bir demet.",
    priceKurus: 45900,
    categories: ["buketler", "dogum-gunu", "gecmis-olsun", "ogretmenler-gunu"],
    flowers: ["Ayçiçeği", "Gerbera", "Yeşillik"],
    accent: "amber",
    bestseller: true,
  },
  {
    id: "lavanta-esintisi",
    slug: "lavanta-esintisi",
    name: "Lavanta Esintisi",
    tagline: "Lavanta · ortanca",
    description:
      "Mor tonlarında lavanta ve ortancalardan oluşan ferah bir buket. Kuruduğunda da güzel.",
    priceKurus: 49900,
    categories: ["buketler", "anneler-gunu", "dogum-gunu"],
    flowers: ["Lavanta", "Ortanca", "Cipso"],
    accent: "blush",
    isNew: true,
  },
  {
    id: "papatya-bahcesi",
    slug: "papatya-bahcesi",
    name: "Papatya Bahçesi",
    tagline: "Papatya · krizantem",
    description:
      "Sade ve içten beyaz papatyalar ile krizantemlerden oluşan neşeli bir buket. Her mesaj için uygun.",
    priceKurus: 34900,
    categories: ["papatyalar", "dogum-gunu", "gecmis-olsun", "anneler-gunu"],
    flowers: ["Papatya", "Krizantem", "Yeşillik"],
    accent: "amber",
  },
  {
    id: "tarla-papatyalari",
    slug: "tarla-papatyalari",
    name: "Tarla Papatyaları",
    tagline: "Bol papatya demeti",
    description:
      "Bahar sabahını andıran gür bir papatya demeti. Kır çiçeklerinin doğallığını sevenler için.",
    priceKurus: 29900,
    categories: ["papatyalar", "gecmis-olsun", "ozur-dilerim"],
    flowers: ["Papatya", "Cipso", "Yeşillik"],
    accent: "leaf",
  },
  {
    id: "beyaz-orkide",
    slug: "beyaz-orkide",
    name: "Beyaz Orkide",
    tagline: "Çift dallı phalaenopsis",
    description:
      "Zarafetin simgesi çift dallı beyaz orkide, seramik saksısıyla. Ofis ve makam için ideal.",
    priceKurus: 89900,
    categories: ["orkideler", "is-tebrik", "ozur-dilerim"],
    flowers: ["Phalaenopsis orkide", "Seramik saksı"],
    accent: "teal",
    bestseller: true,
  },
  {
    id: "mor-orkide",
    slug: "mor-orkide",
    name: "Mor Orkide",
    tagline: "Tek dallı orkide",
    description:
      "Canlı mor tonlarıyla tek dallı orkide. Zarif ve uzun ömürlü bir hediye.",
    priceKurus: 64900,
    categories: ["orkideler", "sevgiliye-cicek", "dogum-gunu"],
    flowers: ["Mor orkide", "Seramik saksı"],
    accent: "rose",
  },
  {
    id: "luks-kutu",
    slug: "luks-kutu",
    name: "Lüks Kutu",
    tagline: "Güller · çikolata",
    description:
      "Kadife kutuda dizilmiş kırmızı güller ve butik çikolatalar. Etkilemek isteyenler için.",
    priceKurus: 79900,
    categories: ["aranjmanlar", "sevgiliye-cicek", "sevgililer-gunu"],
    flowers: ["Kırmızı gül", "Belçika çikolatası", "Kadife kutu"],
    accent: "rose",
    bestseller: true,
  },
  {
    id: "tesekkur-aranjmani",
    slug: "tesekkur-aranjmani",
    name: "Teşekkür Aranjmanı",
    tagline: "Mevsim çiçekleri · kutu",
    description:
      "Mevsimin en taze çiçeklerinden hazırlanan kutu aranjman. Teşekkür ve tebrik için şık bir seçim.",
    priceKurus: 57900,
    categories: ["aranjmanlar", "is-tebrik", "ozur-dilerim"],
    flowers: ["Mevsim çiçekleri", "Yeşillik", "Şapka kutu"],
    accent: "blush",
  },
  {
    id: "beyaz-huzur",
    slug: "beyaz-huzur",
    name: "Beyaz Huzur",
    tagline: "Lilyum · lisyantus",
    description:
      "Sade ve saygılı beyaz lilyum ile lisyantus aranjmanı. Zor günlerde içten bir mesaj.",
    priceKurus: 62900,
    categories: ["aranjmanlar", "gecmis-olsun"],
    flowers: ["Beyaz lilyum", "Lisyantus", "Okaliptus"],
    accent: "teal",
  },
  {
    id: "yesil-vaha",
    slug: "yesil-vaha",
    name: "Yeşil Vaha",
    tagline: "Saksı · monstera",
    description:
      "Mekânına huzur katan, bakımı kolay monstera. Doğal seramik saksısıyla birlikte gelir.",
    priceKurus: 38900,
    categories: ["saksi-cicekleri", "is-tebrik"],
    flowers: ["Monstera deliciosa", "Seramik saksı"],
    accent: "leaf",
  },
  {
    id: "baris-cicegi",
    slug: "baris-cicegi",
    name: "Barış Çiçeği",
    tagline: "Saksı · spatifilyum",
    description:
      "Havayı temizleyen, zarif beyaz çiçekli spatifilyum. Yeni ofis ve tebrikler için sevilen bir seçim.",
    priceKurus: 42900,
    categories: ["saksi-cicekleri", "is-tebrik", "babalar-gunu"],
    flowers: ["Spatifilyum", "Seramik saksı"],
    accent: "leaf",
  },
  {
    id: "ayakta-celenk",
    slug: "ayakta-celenk",
    name: "Ayakta Çelenk",
    tagline: "Beyaz çiçek çelengi",
    description:
      "Beyaz glayöl ve krizantemlerden hazırlanan ayaklı çelenk. Taziye ve tören için saygıyla sunulur.",
    priceKurus: 129900,
    categories: ["celenkler", "gecmis-olsun"],
    flowers: ["Beyaz glayöl", "Krizantem", "Ayaklı stant"],
    accent: "teal",
  },
  {
    id: "tebrik-celengi",
    slug: "tebrik-celengi",
    name: "Tebrik Çelengi",
    tagline: "Açılış çelengi",
    description:
      "Yeni iş yeri açılışları için canlı renklerde ferforje çelenk. Bereketli başlangıçlar dileğiyle.",
    priceKurus: 139900,
    categories: ["celenkler", "is-tebrik"],
    flowers: ["Gerbera", "Lilyum", "Ferforje stant"],
    accent: "amber",
  },
  {
    id: "gelin-arabasi-suslemesi",
    slug: "gelin-arabasi-suslemesi",
    name: "Gelin Arabası Süslemesi",
    tagline: "Beyaz gül · tül",
    description:
      "Beyaz güller ve tül ile hazırlanan zarif gelin arabası süslemesi. En özel güne yakışan bir dokunuş.",
    priceKurus: 189900,
    categories: ["gelin-arabasi", "ozel-gunler"],
    flowers: ["Beyaz gül", "Tül", "Yeşillik"],
    accent: "blush",
  },
  {
    id: "ozur-beyaz-buket",
    slug: "ozur-beyaz-buket",
    name: "Beyaz Özür Buketi",
    tagline: "Beyaz gül · lisyantus",
    description:
      "Sözcüklerin yetmediği anlar için beyaz güllerden içten bir buket. Barışı çiçekler getirsin.",
    priceKurus: 47900,
    categories: ["buketler", "ozur-dilerim"],
    flowers: ["Beyaz gül", "Lisyantus", "Cipso"],
    accent: "teal",
  },
  {
    id: "ogretmenime-demet",
    slug: "ogretmenime-demet",
    name: "Öğretmenime",
    tagline: "Karışık mevsim demeti",
    description:
      "Emeğe teşekkür için renkli mevsim çiçeklerinden hazırlanmış sıcak bir demet.",
    priceKurus: 39900,
    categories: ["buketler", "ogretmenler-gunu", "is-tebrik"],
    flowers: ["Mevsim çiçekleri", "Gerbera", "Yeşillik"],
    accent: "amber",
  },
  {
    id: "babama-sukulent",
    slug: "babama-sukulent",
    name: "Babama Sukulent",
    tagline: "Sukulent · teraryum",
    description:
      "Bakımı kolay sukulentlerden oluşan şık teraryum. Babalar Günü için uzun ömürlü bir hediye.",
    priceKurus: 44900,
    categories: ["saksi-cicekleri", "babalar-gunu", "dogum-gunu"],
    flowers: ["Sukulent", "Cam teraryum"],
    accent: "leaf",
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/**
 * Bir kategori slug'ına ait ürünler. Üst kategori (ör. "ozel-gunler")
 * çağrıldığında alt kategorilerine ait ürünleri de kapsar.
 */
export function getProductsByCategory(slug: string): Product[] {
  const slugs = new Set<string>([slug]);
  for (const group of CATEGORY_GROUPS) {
    const parent = group.items.find((i) => i.slug === slug);
    parent?.children?.forEach((c) => slugs.add(c.slug));
  }
  return PRODUCTS.filter((p) => p.categories.some((c) => slugs.has(c)));
}

/** Bir gruptaki (ör. "Çiçekler") tüm ürünler. */
export function getProductsByGroup(group: CategoryGroup): Product[] {
  const slugs = new Set(groupCategorySlugs(group));
  return PRODUCTS.filter((p) => p.categories.some((c) => slugs.has(c)));
}

/** Ürünün breadcrumb'ında kullanılacak birincil (ürün tipi) kategorisi. */
export function primaryCategorySlug(product: Product): string {
  const cicekler = CATEGORY_GROUPS.find((g) => g.slug === "cicekler");
  const typeSlugs = new Set(cicekler ? groupCategorySlugs(cicekler) : []);
  return (
    product.categories.find((c) => typeSlugs.has(c)) ?? product.categories[0]
  );
}

/** Aynı kategoriden benzer ürünler (kendisi hariç), yetmezse diğerleriyle tamamlar. */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const inCategory = getProductsByCategory(primaryCategorySlug(product)).filter(
    (p) => p.id !== product.id,
  );
  const seen = new Set(inCategory.map((p) => p.id));
  const filler = PRODUCTS.filter((p) => p.id !== product.id && !seen.has(p.id));
  return [...inCategory, ...filler].slice(0, limit);
}
