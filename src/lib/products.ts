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
    name: { tr: "Pembe Şafak", en: "Pink Dawn" },
    tagline: { tr: "Güller · şakayık", en: "Roses · peonies" },
    description: {
      tr: "Sabahın ilk ışığını anımsatan toz pembe güller ve şakayıklardan oluşan zarif bir buket. Romantik anlar için tasarlandı.",
      en: "An elegant bouquet of dusty-pink roses and peonies that echoes the first light of morning. Designed for romantic moments.",
    },
    priceKurus: 54900,
    categories: ["buketler", "sevgiliye-cicek", "sevgililer-gunu", "dogum-gunu"],
    flowers: {
      tr: ["Toz pembe gül", "Şakayık", "Okaliptus"],
      en: ["Dusty-pink rose", "Peony", "Eucalyptus"],
    },
    accent: "blush",
    isNew: true,
    bestseller: true,
  },
  {
    id: "kirmizi-tutku",
    slug: "kirmizi-tutku",
    name: { tr: "Kırmızı Tutku", en: "Red Passion" },
    tagline: { tr: "21 kırmızı gül", en: "21 red roses" },
    description: {
      tr: "Yirmi bir adet kadife kırmızı gülden hazırlanan klasik aşk buketi. Sözü çiçekler söylesin.",
      en: "A classic love bouquet of twenty-one velvet-red roses. Let the flowers say it for you.",
    },
    priceKurus: 69900,
    categories: ["buketler", "sevgiliye-cicek", "sevgililer-gunu"],
    flowers: {
      tr: ["Kırmızı gül", "Cipso", "Yeşillik"],
      en: ["Red rose", "Baby's breath", "Greenery"],
    },
    accent: "rose",
    bestseller: true,
  },
  {
    id: "gunes-demeti",
    slug: "gunes-demeti",
    name: { tr: "Güneş Demeti", en: "Sunshine Bunch" },
    tagline: { tr: "Ayçiçeği · gerbera", en: "Sunflowers · gerberas" },
    description: {
      tr: "Günü aydınlatan sarı ayçiçekleri ve turuncu gerberalar. Neşeyi kapıya taşıyan canlı bir demet.",
      en: "Bright yellow sunflowers and orange gerberas that light up the day. A vivid bunch that delivers joy to the door.",
    },
    priceKurus: 45900,
    categories: ["buketler", "dogum-gunu", "gecmis-olsun", "ogretmenler-gunu"],
    flowers: {
      tr: ["Ayçiçeği", "Gerbera", "Yeşillik"],
      en: ["Sunflower", "Gerbera", "Greenery"],
    },
    accent: "amber",
    bestseller: true,
  },
  {
    id: "lavanta-esintisi",
    slug: "lavanta-esintisi",
    name: { tr: "Lavanta Esintisi", en: "Lavender Breeze" },
    tagline: { tr: "Lavanta · ortanca", en: "Lavender · hydrangea" },
    description: {
      tr: "Mor tonlarında lavanta ve ortancalardan oluşan ferah bir buket. Kuruduğunda da güzel.",
      en: "A fresh bouquet of lavender and hydrangea in soft purple tones. Just as lovely once dried.",
    },
    priceKurus: 49900,
    categories: ["buketler", "anneler-gunu", "dogum-gunu"],
    flowers: {
      tr: ["Lavanta", "Ortanca", "Cipso"],
      en: ["Lavender", "Hydrangea", "Baby's breath"],
    },
    accent: "blush",
    isNew: true,
  },
  {
    id: "papatya-bahcesi",
    slug: "papatya-bahcesi",
    name: { tr: "Papatya Bahçesi", en: "Daisy Garden" },
    tagline: { tr: "Papatya · krizantem", en: "Daisies · chrysanthemums" },
    description: {
      tr: "Sade ve içten beyaz papatyalar ile krizantemlerden oluşan neşeli bir buket. Her mesaj için uygun.",
      en: "A cheerful bouquet of simple, heartfelt white daisies and chrysanthemums. Right for any message.",
    },
    priceKurus: 34900,
    categories: ["papatyalar", "dogum-gunu", "gecmis-olsun", "anneler-gunu"],
    flowers: {
      tr: ["Papatya", "Krizantem", "Yeşillik"],
      en: ["Daisy", "Chrysanthemum", "Greenery"],
    },
    accent: "amber",
  },
  {
    id: "tarla-papatyalari",
    slug: "tarla-papatyalari",
    name: { tr: "Tarla Papatyaları", en: "Field Daisies" },
    tagline: { tr: "Bol papatya demeti", en: "A generous daisy bunch" },
    description: {
      tr: "Bahar sabahını andıran gür bir papatya demeti. Kır çiçeklerinin doğallığını sevenler için.",
      en: "A lush bunch of daisies reminiscent of a spring morning. For those who love the natural feel of wildflowers.",
    },
    priceKurus: 29900,
    categories: ["papatyalar", "gecmis-olsun", "ozur-dilerim"],
    flowers: {
      tr: ["Papatya", "Cipso", "Yeşillik"],
      en: ["Daisy", "Baby's breath", "Greenery"],
    },
    accent: "leaf",
  },
  {
    id: "beyaz-orkide",
    slug: "beyaz-orkide",
    name: { tr: "Beyaz Orkide", en: "White Orchid" },
    tagline: { tr: "Çift dallı phalaenopsis", en: "Twin-stem phalaenopsis" },
    description: {
      tr: "Zarafetin simgesi çift dallı beyaz orkide, seramik saksısıyla. Ofis ve makam için ideal.",
      en: "A twin-stem white orchid, the very symbol of elegance, in a ceramic pot. Ideal for the office or an executive desk.",
    },
    priceKurus: 89900,
    categories: ["orkideler", "is-tebrik", "ozur-dilerim"],
    flowers: {
      tr: ["Phalaenopsis orkide", "Seramik saksı"],
      en: ["Phalaenopsis orchid", "Ceramic pot"],
    },
    accent: "teal",
    bestseller: true,
  },
  {
    id: "mor-orkide",
    slug: "mor-orkide",
    name: { tr: "Mor Orkide", en: "Purple Orchid" },
    tagline: { tr: "Tek dallı orkide", en: "Single-stem orchid" },
    description: {
      tr: "Canlı mor tonlarıyla tek dallı orkide. Zarif ve uzun ömürlü bir hediye.",
      en: "A single-stem orchid in vivid purple tones. An elegant, long-lasting gift.",
    },
    priceKurus: 64900,
    categories: ["orkideler", "sevgiliye-cicek", "dogum-gunu"],
    flowers: {
      tr: ["Mor orkide", "Seramik saksı"],
      en: ["Purple orchid", "Ceramic pot"],
    },
    accent: "rose",
  },
  {
    id: "luks-kutu",
    slug: "luks-kutu",
    name: { tr: "Lüks Kutu", en: "Luxury Box" },
    tagline: { tr: "Güller · çikolata", en: "Roses · chocolate" },
    description: {
      tr: "Kadife kutuda dizilmiş kırmızı güller ve butik çikolatalar. Etkilemek isteyenler için.",
      en: "Red roses arranged in a velvet box alongside artisan chocolates. For those who want to impress.",
    },
    priceKurus: 79900,
    categories: ["aranjmanlar", "sevgiliye-cicek", "sevgililer-gunu"],
    flowers: {
      tr: ["Kırmızı gül", "Belçika çikolatası", "Kadife kutu"],
      en: ["Red rose", "Belgian chocolate", "Velvet box"],
    },
    accent: "rose",
    bestseller: true,
  },
  {
    id: "tesekkur-aranjmani",
    slug: "tesekkur-aranjmani",
    name: { tr: "Teşekkür Aranjmanı", en: "Thank-You Arrangement" },
    tagline: { tr: "Mevsim çiçekleri · kutu", en: "Seasonal flowers · box" },
    description: {
      tr: "Mevsimin en taze çiçeklerinden hazırlanan kutu aranjman. Teşekkür ve tebrik için şık bir seçim.",
      en: "A boxed arrangement made from the season's freshest flowers. A stylish choice to say thank you or congratulations.",
    },
    priceKurus: 57900,
    categories: ["aranjmanlar", "is-tebrik", "ozur-dilerim"],
    flowers: {
      tr: ["Mevsim çiçekleri", "Yeşillik", "Şapka kutu"],
      en: ["Seasonal flowers", "Greenery", "Hat box"],
    },
    accent: "blush",
  },
  {
    id: "beyaz-huzur",
    slug: "beyaz-huzur",
    name: { tr: "Beyaz Huzur", en: "White Serenity" },
    tagline: { tr: "Lilyum · lisyantus", en: "Lilies · lisianthus" },
    description: {
      tr: "Sade ve saygılı beyaz lilyum ile lisyantus aranjmanı. Zor günlerde içten bir mesaj.",
      en: "A simple, respectful arrangement of white lilies and lisianthus. A heartfelt message in difficult times.",
    },
    priceKurus: 62900,
    categories: ["aranjmanlar", "gecmis-olsun"],
    flowers: {
      tr: ["Beyaz lilyum", "Lisyantus", "Okaliptus"],
      en: ["White lily", "Lisianthus", "Eucalyptus"],
    },
    accent: "teal",
  },
  {
    id: "yesil-vaha",
    slug: "yesil-vaha",
    name: { tr: "Yeşil Vaha", en: "Green Oasis" },
    tagline: { tr: "Saksı · monstera", en: "Potted · monstera" },
    description: {
      tr: "Mekânına huzur katan, bakımı kolay monstera. Doğal seramik saksısıyla birlikte gelir.",
      en: "An easy-care monstera that brings calm to any space. Comes with a natural ceramic pot.",
    },
    priceKurus: 38900,
    categories: ["saksi-cicekleri", "is-tebrik"],
    flowers: {
      tr: ["Monstera deliciosa", "Seramik saksı"],
      en: ["Monstera deliciosa", "Ceramic pot"],
    },
    accent: "leaf",
  },
  {
    id: "baris-cicegi",
    slug: "baris-cicegi",
    name: { tr: "Barış Çiçeği", en: "Peace Lily" },
    tagline: { tr: "Saksı · spatifilyum", en: "Potted · spathiphyllum" },
    description: {
      tr: "Havayı temizleyen, zarif beyaz çiçekli spatifilyum. Yeni ofis ve tebrikler için sevilen bir seçim.",
      en: "An air-purifying spathiphyllum with elegant white blooms. A favourite for new offices and congratulations.",
    },
    priceKurus: 42900,
    categories: ["saksi-cicekleri", "is-tebrik", "babalar-gunu"],
    flowers: {
      tr: ["Spatifilyum", "Seramik saksı"],
      en: ["Spathiphyllum", "Ceramic pot"],
    },
    accent: "leaf",
  },
  {
    id: "ayakta-celenk",
    slug: "ayakta-celenk",
    name: { tr: "Ayakta Çelenk", en: "Standing Wreath" },
    tagline: { tr: "Beyaz çiçek çelengi", en: "White flower wreath" },
    description: {
      tr: "Beyaz glayöl ve krizantemlerden hazırlanan ayaklı çelenk. Taziye ve tören için saygıyla sunulur.",
      en: "A standing wreath of white gladioli and chrysanthemums. Offered with respect for funerals and ceremonies.",
    },
    priceKurus: 129900,
    categories: ["celenkler", "gecmis-olsun"],
    flowers: {
      tr: ["Beyaz glayöl", "Krizantem", "Ayaklı stant"],
      en: ["White gladiolus", "Chrysanthemum", "Standing frame"],
    },
    accent: "teal",
  },
  {
    id: "tebrik-celengi",
    slug: "tebrik-celengi",
    name: { tr: "Tebrik Çelengi", en: "Congratulations Wreath" },
    tagline: { tr: "Açılış çelengi", en: "Grand-opening wreath" },
    description: {
      tr: "Yeni iş yeri açılışları için canlı renklerde ferforje çelenk. Bereketli başlangıçlar dileğiyle.",
      en: "A wrought-iron wreath in vivid colours for grand openings. Wishing a prosperous new beginning.",
    },
    priceKurus: 139900,
    categories: ["celenkler", "is-tebrik"],
    flowers: {
      tr: ["Gerbera", "Lilyum", "Ferforje stant"],
      en: ["Gerbera", "Lily", "Wrought-iron stand"],
    },
    accent: "amber",
  },
  {
    id: "gelin-arabasi-suslemesi",
    slug: "gelin-arabasi-suslemesi",
    name: { tr: "Gelin Arabası Süslemesi", en: "Wedding Car Decoration" },
    tagline: { tr: "Beyaz gül · tül", en: "White roses · tulle" },
    description: {
      tr: "Beyaz güller ve tül ile hazırlanan zarif gelin arabası süslemesi. En özel güne yakışan bir dokunuş.",
      en: "An elegant wedding-car decoration of white roses and tulle. A finishing touch worthy of the most special day.",
    },
    priceKurus: 189900,
    categories: ["gelin-arabasi", "ozel-gunler"],
    flowers: {
      tr: ["Beyaz gül", "Tül", "Yeşillik"],
      en: ["White rose", "Tulle", "Greenery"],
    },
    accent: "blush",
  },
  {
    id: "ozur-beyaz-buket",
    slug: "ozur-beyaz-buket",
    name: { tr: "Beyaz Özür Buketi", en: "White Apology Bouquet" },
    tagline: { tr: "Beyaz gül · lisyantus", en: "White roses · lisianthus" },
    description: {
      tr: "Sözcüklerin yetmediği anlar için beyaz güllerden içten bir buket. Barışı çiçekler getirsin.",
      en: "A heartfelt bouquet of white roses for when words fall short. Let flowers make peace.",
    },
    priceKurus: 47900,
    categories: ["buketler", "ozur-dilerim"],
    flowers: {
      tr: ["Beyaz gül", "Lisyantus", "Cipso"],
      en: ["White rose", "Lisianthus", "Baby's breath"],
    },
    accent: "teal",
  },
  {
    id: "ogretmenime-demet",
    slug: "ogretmenime-demet",
    name: { tr: "Öğretmenime", en: "For My Teacher" },
    tagline: { tr: "Karışık mevsim demeti", en: "Mixed seasonal bunch" },
    description: {
      tr: "Emeğe teşekkür için renkli mevsim çiçeklerinden hazırlanmış sıcak bir demet.",
      en: "A warm bunch of colourful seasonal flowers to thank someone for their dedication.",
    },
    priceKurus: 39900,
    categories: ["buketler", "ogretmenler-gunu", "is-tebrik"],
    flowers: {
      tr: ["Mevsim çiçekleri", "Gerbera", "Yeşillik"],
      en: ["Seasonal flowers", "Gerbera", "Greenery"],
    },
    accent: "amber",
  },
  {
    id: "babama-sukulent",
    slug: "babama-sukulent",
    name: { tr: "Babama Sukulent", en: "Succulents for Dad" },
    tagline: { tr: "Sukulent · teraryum", en: "Succulents · terrarium" },
    description: {
      tr: "Bakımı kolay sukulentlerden oluşan şık teraryum. Babalar Günü için uzun ömürlü bir hediye.",
      en: "A stylish terrarium of easy-care succulents. A long-lasting gift for Father's Day.",
    },
    priceKurus: 44900,
    categories: ["saksi-cicekleri", "babalar-gunu", "dogum-gunu"],
    flowers: {
      tr: ["Sukulent", "Cam teraryum"],
      en: ["Succulent", "Glass terrarium"],
    },
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
