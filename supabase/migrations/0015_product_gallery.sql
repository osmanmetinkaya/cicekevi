-- Urun basina tek fotograf yerine coklu galeri. Mevcut image_url degerleri
-- kaybolmasin diye once image_urls dizisine tasinir, sonra eski sutun
-- kaldirilir. Idempotent: image_url sutunu zaten yoksa (ikinci calistirmada)
-- guvenle atlanir.
alter table public.products
  add column if not exists image_urls text[] not null default '{}';

update public.products
set image_urls = array[image_url]
where image_url is not null
  and image_urls = '{}';

alter table public.products drop column if exists image_url;
