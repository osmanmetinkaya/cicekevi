-- Fills TR/EN copy left blank on products added/edited from the admin panel.
-- ASCII-only file (see 0009's fix) -- non-ASCII text is \uXXXX-escaped so a
-- clipboard paste into the SQL Editor can't mangle it.
-- Idempotent: each column is only touched while it is still empty, so it
-- never overwrites anything the admin has since typed in.

update public.products set
  description_tr = E'Beyaz lilyumlar ve mevsim k\u0131r \u00e7i\u00e7eklerinden haz\u0131rlanan, do\u011fal ve zarif bir buket. Her ortama uyum sa\u011flayan sade bir hediye.',
  description_en = E'An elegant, natural bouquet of white lilies and seasonal wildflowers. A simple gift that suits any occasion.',
  flowers_en = ARRAY[E'Lily', E'Wildflowers']::text[]
where id = E'pembe-safak'
  and (description_tr = '' and description_en = '' and flowers_en = '{}');

update public.products set
  tagline_en = E'Red Roses \u00b7 Daisies',
  description_tr = E'On adet k\u0131rm\u0131z\u0131 g\u00fcl ve beyaz papatyalardan olu\u015fan s\u0131cak bir buket. Sevdiklerinize duygular\u0131n\u0131z\u0131 anlatman\u0131n samimi bir yolu.',
  description_en = E'A warm bouquet of ten red roses and white daisies. A heartfelt way to say what words can\'t.',
  flowers_en = ARRAY[E'Red rose', E'Daisy']::text[]
where id = E'10-lu-kirmizi-gul-ve-papatyalar'
  and (tagline_en = '' and description_tr = '' and description_en = '' and flowers_en = '{}');

update public.products set
  tagline_en = E'White Lilies \u00b7 Wildflowers',
  description_tr = E'Beyaz lilyumlar ve mevsim k\u0131r \u00e7i\u00e7eklerinden haz\u0131rlanan ferah bir buket. Sadeli\u011fi ve zarafetiyle \u00f6ne \u00e7\u0131kar.',
  description_en = E'A fresh bouquet of white lilies and seasonal wildflowers. Simple, elegant, and effortlessly beautiful.',
  flowers_en = ARRAY[E'White lily', E'Wildflowers']::text[]
where id = E'kirmizi-tutku'
  and (tagline_en = '' and description_tr = '' and description_en = '' and flowers_en = '{}');

update public.products set
  tagline_en = E'Red Roses \u00b7 Daisies',
  description_tr = E'Kucak dolusu k\u0131rm\u0131z\u0131 g\u00fcl ve papatyalardan olu\u015fan g\u00f6steri\u015fli bir buket. \u00d6zel g\u00fcnlerinizi unutulmaz k\u0131lar.',
  description_en = E'A generous, eye-catching bouquet of red roses and daisies. Makes any special occasion unforgettable.',
  flowers_tr = ARRAY[E'K\u0131rm\u0131z\u0131 G\u00fcl', E'Papatya']::text[],
  flowers_en = ARRAY[E'Red rose', E'Daisy']::text[]
where id = E'kucak-dolusu-kirmizi-guller-ve-papatyalar'
  and (tagline_en = '' and description_tr = '' and description_en = '' and flowers_tr = '{}' and flowers_en = '{}');

update public.products set
  tagline_en = E'Mixed Roses \u00b7 Wildflowers',
  description_tr = E'Renk renk kar\u0131\u015f\u0131k g\u00fcller ve mevsim k\u0131r \u00e7i\u00e7eklerinden haz\u0131rlanan ne\u015feli bir buket. G\u00fcn\u00fc ayd\u0131nlatan canl\u0131 bir se\u00e7im.',
  description_en = E'A cheerful bouquet of mixed colorful roses and seasonal wildflowers. A vibrant choice that brightens the day.',
  flowers_en = ARRAY[E'Mixed roses', E'Wildflowers']::text[]
where id = E'gunes-demeti'
  and (tagline_en = '' and description_tr = '' and description_en = '' and flowers_en = '{}');

update public.products set
  tagline_en = E'Seasonal Wildflowers',
  description_tr = E'Mevsimin en taze k\u0131r \u00e7i\u00e7eklerinden haz\u0131rlanan do\u011fal ve ferah bir buket. Sadeli\u011fi sevenler i\u00e7in.',
  description_en = E'A fresh, natural bouquet made from the season\'s finest wildflowers. For those who love simplicity.'
where id = E'lavanta-esintisi'
  and (tagline_en = '' and description_tr = '' and description_en = '');

update public.products set
  description_tr = E'\u00c7ift dall\u0131, k\u0131r\u00e7\u0131l pembe Phalaenopsis orkide, seramik saks\u0131s\u0131yla zarafetin simgesi. Ofis ve makam i\u00e7in ideal bir hediye.'
where id = E'beyaz-orkide'
  and (description_tr = '');

update public.products set
  description_tr = E'\u00c7ift dall\u0131, k\u0131r\u00e7\u0131l mavi Phalaenopsis orkide. Uzun \u00f6m\u00fcrl\u00fc ve zarif bir hediye arayanlar i\u00e7in ideal.'
where id = E'mor-orkide'
  and (description_tr = '');

update public.products set
  tagline_en = E'Red Roses \u00b7 Daisies',
  description_tr = E'Be\u015f k\u0131rm\u0131z\u0131 g\u00fcl ve papatyalardan olu\u015fan zarif ve samimi bir buket. K\u00fc\u00e7\u00fck ama etkileyici bir jest.',
  description_en = E'An elegant, heartfelt bouquet of five red roses and daisies. A small but meaningful gesture.',
  flowers_en = ARRAY[E'Red rose', E'Daisy']::text[]
where id = E'5-li-kirmizi-guller-ve-papatyalar'
  and (tagline_en = '' and description_tr = '' and description_en = '' and flowers_en = '{}');

update public.products set
  tagline_en = E'Red Roses',
  description_tr = E'Yirmi be\u015f adet kadife k\u0131rm\u0131z\u0131 g\u00fclden haz\u0131rlanan g\u00f6steri\u015fli bir buket. A\u015fk\u0131n\u0131z\u0131 anlatman\u0131n klasik yolu.',
  description_en = E'A striking bouquet of twenty-five velvet-red roses. The classic way to say I love you.',
  flowers_en = ARRAY[E'Red rose']::text[]
where id = E'25-li-kirmizi-gul-buketi'
  and (tagline_en = '' and description_tr = '' and description_en = '' and flowers_en = '{}');

update public.products set
  tagline_en = E'Red Roses',
  description_tr = E'K\u0131rk bir adet k\u0131rm\u0131z\u0131 g\u00fclden haz\u0131rlanan b\u00fcy\u00fcleyici bir buket. \u00d6zel g\u00fcnlerinizi unutulmaz k\u0131lar.',
  description_en = E'A stunning bouquet of forty-one red roses. Makes any special day unforgettable.',
  flowers_en = ARRAY[E'Red rose']::text[]
where id = E'41-kirmizi-gul-buketi'
  and (tagline_en = '' and description_tr = '' and description_en = '' and flowers_en = '{}');

update public.products set
  tagline_en = E'Red Roses',
  description_tr = E'Y\u00fcz bir adet k\u0131rm\u0131z\u0131 g\u00fclden haz\u0131rlanan b\u00fcy\u00fck ve etkileyici bir buket. En \u00f6zel anlar i\u00e7in tasarland\u0131.',
  description_en = E'A grand, breathtaking bouquet of one hundred and one red roses. Designed for the most special moments.',
  flowers_en = ARRAY[E'Red rose']::text[]
where id = E'101-kirmizi-gul-buketi'
  and (tagline_en = '' and description_tr = '' and description_en = '' and flowers_en = '{}');

update public.products set
  tagline_en = E'Dendrobium Bamboo Orchid',
  description_tr = E'Zarif ve uzun \u00f6m\u00fcrl\u00fc Denbrium bambu orkide. Bak\u0131m\u0131 kolay, \u015f\u0131k bir hediye arayanlar i\u00e7in.',
  description_en = E'An elegant, long-lasting Dendrobium bamboo orchid. Perfect for those looking for a low-maintenance, stylish gift.',
  flowers_en = ARRAY[E'Dendrobium orchid']::text[]
where id = E'denbrium-bambu-orkide'
  and (tagline_en = '' and description_tr = '' and description_en = '' and flowers_en = '{}');
