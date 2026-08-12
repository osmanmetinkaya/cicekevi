-- 0007'de kurulan tablolara MEVCUT katalog verisini birebir aktarır.
--
-- Kaynak: src/lib/categories.ts (CATEGORY_GROUPS) ve src/lib/products.ts
-- (PRODUCTS). id ve slug değerleri AYNEN korunur — canlıdaki localStorage
-- sepet/favori kayıtları ürün id'lerine, header mega-menü ve footer linkleri
-- kategori slug'larına referans veriyor.
--
-- Tekrar çalıştırılabilir (on conflict do nothing): var olan satırlar
-- ezilmez, böylece admin panelinden yapılmış düzenlemeler kaybolmaz.

-- ---------------------------------------------------------------------------
-- 1) Gruplar (parent_id null)
-- ---------------------------------------------------------------------------
insert into public.categories (slug, label_tr, label_en, parent_id, sort_order)
values
  ('duruma-gore', 'Duruma Göre', 'By Occasion', null, 0),
  ('cicekler',    'Çiçekler',    'Flowers',     null, 1)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- 2) Item'lar (grupların çocukları)
-- ---------------------------------------------------------------------------
insert into public.categories (slug, label_tr, label_en, parent_id, sort_order)
select v.slug, v.label_tr, v.label_en, g.id, v.sort_order
from (values
  ('sevgiliye-cicek', 'Sevgiliye Çiçek', 'Flowers for Your Love',     'duruma-gore', 0),
  ('dogum-gunu',      'Doğum Günü',      'Birthday',                  'duruma-gore', 1),
  ('is-tebrik',       'İş Tebrik',       'Business Congratulations',  'duruma-gore', 2),
  ('gecmis-olsun',    'Geçmiş Olsun',    'Get Well Soon',             'duruma-gore', 3),
  ('ozur-dilerim',    'Özür Dilerim',    'I''m Sorry',                'duruma-gore', 4),
  ('ozel-gunler',     'Özel Günler',     'Special Days',              'duruma-gore', 5),
  ('buketler',        'Buketler',        'Bouquets',                  'cicekler',    0),
  ('papatyalar',      'Papatyalar',      'Daisies',                   'cicekler',    1),
  ('orkideler',       'Orkideler',       'Orchids',                   'cicekler',    2),
  ('aranjmanlar',     'Aranjmanlar',     'Arrangements',              'cicekler',    3),
  ('saksi-cicekleri', 'Saksı Çiçekleri', 'Potted Plants',             'cicekler',    4),
  ('celenkler',       'Çelenkler',       'Wreaths',                   'cicekler',    5),
  ('gelin-arabasi',   'Gelin Arabası',   'Wedding Car',               'cicekler',    6)
) as v(slug, label_tr, label_en, parent_slug, sort_order)
join public.categories g on g.slug = v.parent_slug
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- 3) Alt-item'lar ("Özel Günler" altındaki 4 kategori)
-- ---------------------------------------------------------------------------
insert into public.categories (slug, label_tr, label_en, parent_id, sort_order)
select v.slug, v.label_tr, v.label_en, p.id, v.sort_order
from (values
  ('sevgililer-gunu',  'Sevgililer Günü',  'Valentine''s Day', 'ozel-gunler', 0),
  ('anneler-gunu',     'Anneler Günü',     'Mother''s Day',    'ozel-gunler', 1),
  ('babalar-gunu',     'Babalar Günü',     'Father''s Day',    'ozel-gunler', 2),
  ('ogretmenler-gunu', 'Öğretmenler Günü', 'Teachers'' Day',   'ozel-gunler', 3)
) as v(slug, label_tr, label_en, parent_slug, sort_order)
join public.categories p on p.slug = v.parent_slug
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- 4) Ürünler — 19 adet, src/lib/products.ts sırasıyla.
--    image_url null: fotoğraf yüklenene kadar arayüz Artwork placeholder'ı
--    gösterir. Fotoğraflar admin panelinden yüklenecek.
-- ---------------------------------------------------------------------------
insert into public.products (
  id, slug, name_tr, name_en, tagline_tr, tagline_en,
  description_tr, description_en, price_kurus,
  flowers_tr, flowers_en, accent, image_url,
  is_new, is_bestseller, sort_order
) values
  (
    'pembe-safak', 'pembe-safak', 'Pembe Şafak', 'Pink Dawn',
    'Güller · şakayık', 'Roses · peonies',
    'Sabahın ilk ışığını anımsatan toz pembe güller ve şakayıklardan oluşan zarif bir buket. Romantik anlar için tasarlandı.',
    'An elegant bouquet of dusty-pink roses and peonies that echoes the first light of morning. Designed for romantic moments.',
    54900,
    array['Toz pembe gül', 'Şakayık', 'Okaliptus'],
    array['Dusty-pink rose', 'Peony', 'Eucalyptus'],
    'blush', null, true, true, 0
  ),
  (
    'kirmizi-tutku', 'kirmizi-tutku', 'Kırmızı Tutku', 'Red Passion',
    '21 kırmızı gül', '21 red roses',
    'Yirmi bir adet kadife kırmızı gülden hazırlanan klasik aşk buketi. Sözü çiçekler söylesin.',
    'A classic love bouquet of twenty-one velvet-red roses. Let the flowers say it for you.',
    69900,
    array['Kırmızı gül', 'Cipso', 'Yeşillik'],
    array['Red rose', 'Baby''s breath', 'Greenery'],
    'rose', null, false, true, 1
  ),
  (
    'gunes-demeti', 'gunes-demeti', 'Güneş Demeti', 'Sunshine Bunch',
    'Ayçiçeği · gerbera', 'Sunflowers · gerberas',
    'Günü aydınlatan sarı ayçiçekleri ve turuncu gerberalar. Neşeyi kapıya taşıyan canlı bir demet.',
    'Bright yellow sunflowers and orange gerberas that light up the day. A vivid bunch that delivers joy to the door.',
    45900,
    array['Ayçiçeği', 'Gerbera', 'Yeşillik'],
    array['Sunflower', 'Gerbera', 'Greenery'],
    'amber', null, false, true, 2
  ),
  (
    'lavanta-esintisi', 'lavanta-esintisi', 'Lavanta Esintisi', 'Lavender Breeze',
    'Lavanta · ortanca', 'Lavender · hydrangea',
    'Mor tonlarında lavanta ve ortancalardan oluşan ferah bir buket. Kuruduğunda da güzel.',
    'A fresh bouquet of lavender and hydrangea in soft purple tones. Just as lovely once dried.',
    49900,
    array['Lavanta', 'Ortanca', 'Cipso'],
    array['Lavender', 'Hydrangea', 'Baby''s breath'],
    'blush', null, true, false, 3
  ),
  (
    'papatya-bahcesi', 'papatya-bahcesi', 'Papatya Bahçesi', 'Daisy Garden',
    'Papatya · krizantem', 'Daisies · chrysanthemums',
    'Sade ve içten beyaz papatyalar ile krizantemlerden oluşan neşeli bir buket. Her mesaj için uygun.',
    'A cheerful bouquet of simple, heartfelt white daisies and chrysanthemums. Right for any message.',
    34900,
    array['Papatya', 'Krizantem', 'Yeşillik'],
    array['Daisy', 'Chrysanthemum', 'Greenery'],
    'amber', null, false, false, 4
  ),
  (
    'tarla-papatyalari', 'tarla-papatyalari', 'Tarla Papatyaları', 'Field Daisies',
    'Bol papatya demeti', 'A generous daisy bunch',
    'Bahar sabahını andıran gür bir papatya demeti. Kır çiçeklerinin doğallığını sevenler için.',
    'A lush bunch of daisies reminiscent of a spring morning. For those who love the natural feel of wildflowers.',
    29900,
    array['Papatya', 'Cipso', 'Yeşillik'],
    array['Daisy', 'Baby''s breath', 'Greenery'],
    'leaf', null, false, false, 5
  ),
  (
    'beyaz-orkide', 'beyaz-orkide', 'Beyaz Orkide', 'White Orchid',
    'Çift dallı phalaenopsis', 'Twin-stem phalaenopsis',
    'Zarafetin simgesi çift dallı beyaz orkide, seramik saksısıyla. Ofis ve makam için ideal.',
    'A twin-stem white orchid, the very symbol of elegance, in a ceramic pot. Ideal for the office or an executive desk.',
    89900,
    array['Phalaenopsis orkide', 'Seramik saksı'],
    array['Phalaenopsis orchid', 'Ceramic pot'],
    'teal', null, false, true, 6
  ),
  (
    'mor-orkide', 'mor-orkide', 'Mor Orkide', 'Purple Orchid',
    'Tek dallı orkide', 'Single-stem orchid',
    'Canlı mor tonlarıyla tek dallı orkide. Zarif ve uzun ömürlü bir hediye.',
    'A single-stem orchid in vivid purple tones. An elegant, long-lasting gift.',
    64900,
    array['Mor orkide', 'Seramik saksı'],
    array['Purple orchid', 'Ceramic pot'],
    'rose', null, false, false, 7
  ),
  (
    'luks-kutu', 'luks-kutu', 'Lüks Kutu', 'Luxury Box',
    'Güller · çikolata', 'Roses · chocolate',
    'Kadife kutuda dizilmiş kırmızı güller ve butik çikolatalar. Etkilemek isteyenler için.',
    'Red roses arranged in a velvet box alongside artisan chocolates. For those who want to impress.',
    79900,
    array['Kırmızı gül', 'Belçika çikolatası', 'Kadife kutu'],
    array['Red rose', 'Belgian chocolate', 'Velvet box'],
    'rose', null, false, true, 8
  ),
  (
    'tesekkur-aranjmani', 'tesekkur-aranjmani', 'Teşekkür Aranjmanı', 'Thank-You Arrangement',
    'Mevsim çiçekleri · kutu', 'Seasonal flowers · box',
    'Mevsimin en taze çiçeklerinden hazırlanan kutu aranjman. Teşekkür ve tebrik için şık bir seçim.',
    'A boxed arrangement made from the season''s freshest flowers. A stylish choice to say thank you or congratulations.',
    57900,
    array['Mevsim çiçekleri', 'Yeşillik', 'Şapka kutu'],
    array['Seasonal flowers', 'Greenery', 'Hat box'],
    'blush', null, false, false, 9
  ),
  (
    'beyaz-huzur', 'beyaz-huzur', 'Beyaz Huzur', 'White Serenity',
    'Lilyum · lisyantus', 'Lilies · lisianthus',
    'Sade ve saygılı beyaz lilyum ile lisyantus aranjmanı. Zor günlerde içten bir mesaj.',
    'A simple, respectful arrangement of white lilies and lisianthus. A heartfelt message in difficult times.',
    62900,
    array['Beyaz lilyum', 'Lisyantus', 'Okaliptus'],
    array['White lily', 'Lisianthus', 'Eucalyptus'],
    'teal', null, false, false, 10
  ),
  (
    'yesil-vaha', 'yesil-vaha', 'Yeşil Vaha', 'Green Oasis',
    'Saksı · monstera', 'Potted · monstera',
    'Mekânına huzur katan, bakımı kolay monstera. Doğal seramik saksısıyla birlikte gelir.',
    'An easy-care monstera that brings calm to any space. Comes with a natural ceramic pot.',
    38900,
    array['Monstera deliciosa', 'Seramik saksı'],
    array['Monstera deliciosa', 'Ceramic pot'],
    'leaf', null, false, false, 11
  ),
  (
    'baris-cicegi', 'baris-cicegi', 'Barış Çiçeği', 'Peace Lily',
    'Saksı · spatifilyum', 'Potted · spathiphyllum',
    'Havayı temizleyen, zarif beyaz çiçekli spatifilyum. Yeni ofis ve tebrikler için sevilen bir seçim.',
    'An air-purifying spathiphyllum with elegant white blooms. A favourite for new offices and congratulations.',
    42900,
    array['Spatifilyum', 'Seramik saksı'],
    array['Spathiphyllum', 'Ceramic pot'],
    'leaf', null, false, false, 12
  ),
  (
    'ayakta-celenk', 'ayakta-celenk', 'Ayakta Çelenk', 'Standing Wreath',
    'Beyaz çiçek çelengi', 'White flower wreath',
    'Beyaz glayöl ve krizantemlerden hazırlanan ayaklı çelenk. Taziye ve tören için saygıyla sunulur.',
    'A standing wreath of white gladioli and chrysanthemums. Offered with respect for funerals and ceremonies.',
    129900,
    array['Beyaz glayöl', 'Krizantem', 'Ayaklı stant'],
    array['White gladiolus', 'Chrysanthemum', 'Standing frame'],
    'teal', null, false, false, 13
  ),
  (
    'tebrik-celengi', 'tebrik-celengi', 'Tebrik Çelengi', 'Congratulations Wreath',
    'Açılış çelengi', 'Grand-opening wreath',
    'Yeni iş yeri açılışları için canlı renklerde ferforje çelenk. Bereketli başlangıçlar dileğiyle.',
    'A wrought-iron wreath in vivid colours for grand openings. Wishing a prosperous new beginning.',
    139900,
    array['Gerbera', 'Lilyum', 'Ferforje stant'],
    array['Gerbera', 'Lily', 'Wrought-iron stand'],
    'amber', null, false, false, 14
  ),
  (
    'gelin-arabasi-suslemesi', 'gelin-arabasi-suslemesi', 'Gelin Arabası Süslemesi', 'Wedding Car Decoration',
    'Beyaz gül · tül', 'White roses · tulle',
    'Beyaz güller ve tül ile hazırlanan zarif gelin arabası süslemesi. En özel güne yakışan bir dokunuş.',
    'An elegant wedding-car decoration of white roses and tulle. A finishing touch worthy of the most special day.',
    189900,
    array['Beyaz gül', 'Tül', 'Yeşillik'],
    array['White rose', 'Tulle', 'Greenery'],
    'blush', null, false, false, 15
  ),
  (
    'ozur-beyaz-buket', 'ozur-beyaz-buket', 'Beyaz Özür Buketi', 'White Apology Bouquet',
    'Beyaz gül · lisyantus', 'White roses · lisianthus',
    'Sözcüklerin yetmediği anlar için beyaz güllerden içten bir buket. Barışı çiçekler getirsin.',
    'A heartfelt bouquet of white roses for when words fall short. Let flowers make peace.',
    47900,
    array['Beyaz gül', 'Lisyantus', 'Cipso'],
    array['White rose', 'Lisianthus', 'Baby''s breath'],
    'teal', null, false, false, 16
  ),
  (
    'ogretmenime-demet', 'ogretmenime-demet', 'Öğretmenime', 'For My Teacher',
    'Karışık mevsim demeti', 'Mixed seasonal bunch',
    'Emeğe teşekkür için renkli mevsim çiçeklerinden hazırlanmış sıcak bir demet.',
    'A warm bunch of colourful seasonal flowers to thank someone for their dedication.',
    39900,
    array['Mevsim çiçekleri', 'Gerbera', 'Yeşillik'],
    array['Seasonal flowers', 'Gerbera', 'Greenery'],
    'amber', null, false, false, 17
  ),
  (
    'babama-sukulent', 'babama-sukulent', 'Babama Sukulent', 'Succulents for Dad',
    'Sukulent · teraryum', 'Succulents · terrarium',
    'Bakımı kolay sukulentlerden oluşan şık teraryum. Babalar Günü için uzun ömürlü bir hediye.',
    'A stylish terrarium of easy-care succulents. A long-lasting gift for Father''s Day.',
    44900,
    array['Sukulent', 'Cam teraryum'],
    array['Succulent', 'Glass terrarium'],
    'leaf', null, false, false, 18
  )
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 5) Ürün ↔ kategori ilişkileri (products.ts'teki `categories` alanları).
-- ---------------------------------------------------------------------------
insert into public.product_categories (product_id, category_id)
select v.product_id, c.id
from (values
  ('pembe-safak', 'buketler'),
  ('pembe-safak', 'sevgiliye-cicek'),
  ('pembe-safak', 'sevgililer-gunu'),
  ('pembe-safak', 'dogum-gunu'),

  ('kirmizi-tutku', 'buketler'),
  ('kirmizi-tutku', 'sevgiliye-cicek'),
  ('kirmizi-tutku', 'sevgililer-gunu'),

  ('gunes-demeti', 'buketler'),
  ('gunes-demeti', 'dogum-gunu'),
  ('gunes-demeti', 'gecmis-olsun'),
  ('gunes-demeti', 'ogretmenler-gunu'),

  ('lavanta-esintisi', 'buketler'),
  ('lavanta-esintisi', 'anneler-gunu'),
  ('lavanta-esintisi', 'dogum-gunu'),

  ('papatya-bahcesi', 'papatyalar'),
  ('papatya-bahcesi', 'dogum-gunu'),
  ('papatya-bahcesi', 'gecmis-olsun'),
  ('papatya-bahcesi', 'anneler-gunu'),

  ('tarla-papatyalari', 'papatyalar'),
  ('tarla-papatyalari', 'gecmis-olsun'),
  ('tarla-papatyalari', 'ozur-dilerim'),

  ('beyaz-orkide', 'orkideler'),
  ('beyaz-orkide', 'is-tebrik'),
  ('beyaz-orkide', 'ozur-dilerim'),

  ('mor-orkide', 'orkideler'),
  ('mor-orkide', 'sevgiliye-cicek'),
  ('mor-orkide', 'dogum-gunu'),

  ('luks-kutu', 'aranjmanlar'),
  ('luks-kutu', 'sevgiliye-cicek'),
  ('luks-kutu', 'sevgililer-gunu'),

  ('tesekkur-aranjmani', 'aranjmanlar'),
  ('tesekkur-aranjmani', 'is-tebrik'),
  ('tesekkur-aranjmani', 'ozur-dilerim'),

  ('beyaz-huzur', 'aranjmanlar'),
  ('beyaz-huzur', 'gecmis-olsun'),

  ('yesil-vaha', 'saksi-cicekleri'),
  ('yesil-vaha', 'is-tebrik'),

  ('baris-cicegi', 'saksi-cicekleri'),
  ('baris-cicegi', 'is-tebrik'),
  ('baris-cicegi', 'babalar-gunu'),

  ('ayakta-celenk', 'celenkler'),
  ('ayakta-celenk', 'gecmis-olsun'),

  ('tebrik-celengi', 'celenkler'),
  ('tebrik-celengi', 'is-tebrik'),

  ('gelin-arabasi-suslemesi', 'gelin-arabasi'),
  ('gelin-arabasi-suslemesi', 'ozel-gunler'),

  ('ozur-beyaz-buket', 'buketler'),
  ('ozur-beyaz-buket', 'ozur-dilerim'),

  ('ogretmenime-demet', 'buketler'),
  ('ogretmenime-demet', 'ogretmenler-gunu'),
  ('ogretmenime-demet', 'is-tebrik'),

  ('babama-sukulent', 'saksi-cicekleri'),
  ('babama-sukulent', 'babalar-gunu'),
  ('babama-sukulent', 'dogum-gunu')
) as v(product_id, category_slug)
join public.categories c on c.slug = v.category_slug
on conflict do nothing;
