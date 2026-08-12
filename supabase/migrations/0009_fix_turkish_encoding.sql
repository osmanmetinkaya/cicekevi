-- Fix Turkish/special-character encoding corruption introduced when 0008's
-- seed data was pasted through the clipboard into the SQL Editor. This file
-- is pure ASCII (non-ASCII chars written as Postgres \uXXXX escapes inside
-- E'' strings) so no copy/paste round-trip can mangle it again.

-- Categories
update public.categories set label_tr = E'Duruma G\u00f6re' where slug = E'duruma-gore';
update public.categories set label_tr = E'Sevgiliye \u00c7i\u00e7ek' where slug = E'sevgiliye-cicek';
update public.categories set label_tr = E'Do\u011fum G\u00fcn\u00fc' where slug = E'dogum-gunu';
update public.categories set label_tr = E'\u0130\u015f Tebrik' where slug = E'is-tebrik';
update public.categories set label_tr = E'Ge\u00e7mi\u015f Olsun' where slug = E'gecmis-olsun';
update public.categories set label_tr = E'\u00d6z\u00fcr Dilerim' where slug = E'ozur-dilerim';
update public.categories set label_tr = E'\u00d6zel G\u00fcnler' where slug = E'ozel-gunler';
update public.categories set label_tr = E'Sevgililer G\u00fcn\u00fc' where slug = E'sevgililer-gunu';
update public.categories set label_tr = E'Anneler G\u00fcn\u00fc' where slug = E'anneler-gunu';
update public.categories set label_tr = E'Babalar G\u00fcn\u00fc' where slug = E'babalar-gunu';
update public.categories set label_tr = E'\u00d6\u011fretmenler G\u00fcn\u00fc' where slug = E'ogretmenler-gunu';
update public.categories set label_tr = E'\u00c7i\u00e7ekler' where slug = E'cicekler';
update public.categories set label_tr = E'Buketler' where slug = E'buketler';
update public.categories set label_tr = E'Papatyalar' where slug = E'papatyalar';
update public.categories set label_tr = E'Orkideler' where slug = E'orkideler';
update public.categories set label_tr = E'Aranjmanlar' where slug = E'aranjmanlar';
update public.categories set label_tr = E'Saks\u0131 \u00c7i\u00e7ekleri' where slug = E'saksi-cicekleri';
update public.categories set label_tr = E'\u00c7elenkler' where slug = E'celenkler';
update public.categories set label_tr = E'Gelin Arabas\u0131' where slug = E'gelin-arabasi';

-- Products
update public.products set
  name_tr = E'Pembe \u015eafak',
  tagline_tr = E'G\u00fcller \u00b7 \u015fakay\u0131k',
  tagline_en = E'Roses \u00b7 peonies',
  description_tr = E'Sabah\u0131n ilk \u0131\u015f\u0131\u011f\u0131n\u0131 an\u0131msatan toz pembe g\u00fcller ve \u015fakay\u0131klardan olu\u015fan zarif bir buket. Romantik anlar i\u00e7in tasarland\u0131.',
  flowers_tr = ARRAY[E'Toz pembe g\u00fcl', E'\u015eakay\u0131k', E'Okaliptus']::text[]
where id = E'pembe-safak';
update public.products set
  name_tr = E'K\u0131rm\u0131z\u0131 Tutku',
  tagline_tr = E'21 k\u0131rm\u0131z\u0131 g\u00fcl',
  tagline_en = E'21 red roses',
  description_tr = E'Yirmi bir adet kadife k\u0131rm\u0131z\u0131 g\u00fclden haz\u0131rlanan klasik a\u015fk buketi. S\u00f6z\u00fc \u00e7i\u00e7ekler s\u00f6ylesin.',
  flowers_tr = ARRAY[E'K\u0131rm\u0131z\u0131 g\u00fcl', E'Cipso', E'Ye\u015fillik']::text[]
where id = E'kirmizi-tutku';
update public.products set
  name_tr = E'G\u00fcne\u015f Demeti',
  tagline_tr = E'Ay\u00e7i\u00e7e\u011fi \u00b7 gerbera',
  tagline_en = E'Sunflowers \u00b7 gerberas',
  description_tr = E'G\u00fcn\u00fc ayd\u0131nlatan sar\u0131 ay\u00e7i\u00e7ekleri ve turuncu gerberalar. Ne\u015feyi kap\u0131ya ta\u015f\u0131yan canl\u0131 bir demet.',
  flowers_tr = ARRAY[E'Ay\u00e7i\u00e7e\u011fi', E'Gerbera', E'Ye\u015fillik']::text[]
where id = E'gunes-demeti';
update public.products set
  name_tr = E'Lavanta Esintisi',
  tagline_tr = E'Lavanta \u00b7 ortanca',
  tagline_en = E'Lavender \u00b7 hydrangea',
  description_tr = E'Mor tonlar\u0131nda lavanta ve ortancalardan olu\u015fan ferah bir buket. Kurudu\u011funda da g\u00fczel.',
  flowers_tr = ARRAY[E'Lavanta', E'Ortanca', E'Cipso']::text[]
where id = E'lavanta-esintisi';
update public.products set
  name_tr = E'Papatya Bah\u00e7esi',
  tagline_tr = E'Papatya \u00b7 krizantem',
  tagline_en = E'Daisies \u00b7 chrysanthemums',
  description_tr = E'Sade ve i\u00e7ten beyaz papatyalar ile krizantemlerden olu\u015fan ne\u015feli bir buket. Her mesaj i\u00e7in uygun.',
  flowers_tr = ARRAY[E'Papatya', E'Krizantem', E'Ye\u015fillik']::text[]
where id = E'papatya-bahcesi';
update public.products set
  name_tr = E'Tarla Papatyalar\u0131',
  tagline_tr = E'Bol papatya demeti',
  tagline_en = E'A generous daisy bunch',
  description_tr = E'Bahar sabah\u0131n\u0131 and\u0131ran g\u00fcr bir papatya demeti. K\u0131r \u00e7i\u00e7eklerinin do\u011fall\u0131\u011f\u0131n\u0131 sevenler i\u00e7in.',
  flowers_tr = ARRAY[E'Papatya', E'Cipso', E'Ye\u015fillik']::text[]
where id = E'tarla-papatyalari';
update public.products set
  name_tr = E'Beyaz Orkide',
  tagline_tr = E'\u00c7ift dall\u0131 phalaenopsis',
  tagline_en = E'Twin-stem phalaenopsis',
  description_tr = E'Zarafetin simgesi \u00e7ift dall\u0131 beyaz orkide, seramik saks\u0131s\u0131yla. Ofis ve makam i\u00e7in ideal.',
  flowers_tr = ARRAY[E'Phalaenopsis orkide', E'Seramik saks\u0131']::text[]
where id = E'beyaz-orkide';
update public.products set
  name_tr = E'Mor Orkide',
  tagline_tr = E'Tek dall\u0131 orkide',
  tagline_en = E'Single-stem orchid',
  description_tr = E'Canl\u0131 mor tonlar\u0131yla tek dall\u0131 orkide. Zarif ve uzun \u00f6m\u00fcrl\u00fc bir hediye.',
  flowers_tr = ARRAY[E'Mor orkide', E'Seramik saks\u0131']::text[]
where id = E'mor-orkide';
update public.products set
  name_tr = E'L\u00fcks Kutu',
  tagline_tr = E'G\u00fcller \u00b7 \u00e7ikolata',
  tagline_en = E'Roses \u00b7 chocolate',
  description_tr = E'Kadife kutuda dizilmi\u015f k\u0131rm\u0131z\u0131 g\u00fcller ve butik \u00e7ikolatalar. Etkilemek isteyenler i\u00e7in.',
  flowers_tr = ARRAY[E'K\u0131rm\u0131z\u0131 g\u00fcl', E'Bel\u00e7ika \u00e7ikolatas\u0131', E'Kadife kutu']::text[]
where id = E'luks-kutu';
update public.products set
  name_tr = E'Te\u015fekk\u00fcr Aranjman\u0131',
  tagline_tr = E'Mevsim \u00e7i\u00e7ekleri \u00b7 kutu',
  tagline_en = E'Seasonal flowers \u00b7 box',
  description_tr = E'Mevsimin en taze \u00e7i\u00e7eklerinden haz\u0131rlanan kutu aranjman. Te\u015fekk\u00fcr ve tebrik i\u00e7in \u015f\u0131k bir se\u00e7im.',
  flowers_tr = ARRAY[E'Mevsim \u00e7i\u00e7ekleri', E'Ye\u015fillik', E'\u015eapka kutu']::text[]
where id = E'tesekkur-aranjmani';
update public.products set
  name_tr = E'Beyaz Huzur',
  tagline_tr = E'Lilyum \u00b7 lisyantus',
  tagline_en = E'Lilies \u00b7 lisianthus',
  description_tr = E'Sade ve sayg\u0131l\u0131 beyaz lilyum ile lisyantus aranjman\u0131. Zor g\u00fcnlerde i\u00e7ten bir mesaj.',
  flowers_tr = ARRAY[E'Beyaz lilyum', E'Lisyantus', E'Okaliptus']::text[]
where id = E'beyaz-huzur';
update public.products set
  name_tr = E'Ye\u015fil Vaha',
  tagline_tr = E'Saks\u0131 \u00b7 monstera',
  tagline_en = E'Potted \u00b7 monstera',
  description_tr = E'Mek\u00e2n\u0131na huzur katan, bak\u0131m\u0131 kolay monstera. Do\u011fal seramik saks\u0131s\u0131yla birlikte gelir.',
  flowers_tr = ARRAY[E'Monstera deliciosa', E'Seramik saks\u0131']::text[]
where id = E'yesil-vaha';
update public.products set
  name_tr = E'Bar\u0131\u015f \u00c7i\u00e7e\u011fi',
  tagline_tr = E'Saks\u0131 \u00b7 spatifilyum',
  tagline_en = E'Potted \u00b7 spathiphyllum',
  description_tr = E'Havay\u0131 temizleyen, zarif beyaz \u00e7i\u00e7ekli spatifilyum. Yeni ofis ve tebrikler i\u00e7in sevilen bir se\u00e7im.',
  flowers_tr = ARRAY[E'Spatifilyum', E'Seramik saks\u0131']::text[]
where id = E'baris-cicegi';
update public.products set
  name_tr = E'Ayakta \u00c7elenk',
  tagline_tr = E'Beyaz \u00e7i\u00e7ek \u00e7elengi',
  tagline_en = E'White flower wreath',
  description_tr = E'Beyaz glay\u00f6l ve krizantemlerden haz\u0131rlanan ayakl\u0131 \u00e7elenk. Taziye ve t\u00f6ren i\u00e7in sayg\u0131yla sunulur.',
  flowers_tr = ARRAY[E'Beyaz glay\u00f6l', E'Krizantem', E'Ayakl\u0131 stant']::text[]
where id = E'ayakta-celenk';
update public.products set
  name_tr = E'Tebrik \u00c7elengi',
  tagline_tr = E'A\u00e7\u0131l\u0131\u015f \u00e7elengi',
  tagline_en = E'Grand-opening wreath',
  description_tr = E'Yeni i\u015f yeri a\u00e7\u0131l\u0131\u015flar\u0131 i\u00e7in canl\u0131 renklerde ferforje \u00e7elenk. Bereketli ba\u015flang\u0131\u00e7lar dile\u011fiyle.',
  flowers_tr = ARRAY[E'Gerbera', E'Lilyum', E'Ferforje stant']::text[]
where id = E'tebrik-celengi';
update public.products set
  name_tr = E'Gelin Arabas\u0131 S\u00fcslemesi',
  tagline_tr = E'Beyaz g\u00fcl \u00b7 t\u00fcl',
  tagline_en = E'White roses \u00b7 tulle',
  description_tr = E'Beyaz g\u00fcller ve t\u00fcl ile haz\u0131rlanan zarif gelin arabas\u0131 s\u00fcslemesi. En \u00f6zel g\u00fcne yak\u0131\u015fan bir dokunu\u015f.',
  flowers_tr = ARRAY[E'Beyaz g\u00fcl', E'T\u00fcl', E'Ye\u015fillik']::text[]
where id = E'gelin-arabasi-suslemesi';
update public.products set
  name_tr = E'Beyaz \u00d6z\u00fcr Buketi',
  tagline_tr = E'Beyaz g\u00fcl \u00b7 lisyantus',
  tagline_en = E'White roses \u00b7 lisianthus',
  description_tr = E'S\u00f6zc\u00fcklerin yetmedi\u011fi anlar i\u00e7in beyaz g\u00fcllerden i\u00e7ten bir buket. Bar\u0131\u015f\u0131 \u00e7i\u00e7ekler getirsin.',
  flowers_tr = ARRAY[E'Beyaz g\u00fcl', E'Lisyantus', E'Cipso']::text[]
where id = E'ozur-beyaz-buket';
update public.products set
  name_tr = E'\u00d6\u011fretmenime',
  tagline_tr = E'Kar\u0131\u015f\u0131k mevsim demeti',
  tagline_en = E'Mixed seasonal bunch',
  description_tr = E'Eme\u011fe te\u015fekk\u00fcr i\u00e7in renkli mevsim \u00e7i\u00e7eklerinden haz\u0131rlanm\u0131\u015f s\u0131cak bir demet.',
  flowers_tr = ARRAY[E'Mevsim \u00e7i\u00e7ekleri', E'Gerbera', E'Ye\u015fillik']::text[]
where id = E'ogretmenime-demet';
update public.products set
  name_tr = E'Babama Sukulent',
  tagline_tr = E'Sukulent \u00b7 teraryum',
  tagline_en = E'Succulents \u00b7 terrarium',
  description_tr = E'Bak\u0131m\u0131 kolay sukulentlerden olu\u015fan \u015f\u0131k teraryum. Babalar G\u00fcn\u00fc i\u00e7in uzun \u00f6m\u00fcrl\u00fc bir hediye.',
  flowers_tr = ARRAY[E'Sukulent', E'Cam teraryum']::text[]
where id = E'babama-sukulent';
