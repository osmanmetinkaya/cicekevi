-- Okunabilir sipariş numaraları (ör. DC-1042). Sayaç, ödeme oturumu
-- oluşturulurken (checkout API) rezerve edilir ki müşteri numarayı
-- ödeme tamamlanmadan önce (success sayfasında) görebilsin; webhook aynı
-- numarayı Stripe metadata'sından okuyup orders tablosuna yazar.
create sequence if not exists public.order_number_seq start 1001;

-- SECURITY DEFINER: anon/authenticated rollerine sequence'e doğrudan
-- erişim vermeden, yalnızca bu fonksiyon üzerinden numara aldırır.
create or replace function public.next_order_number()
returns text
language sql
security definer
set search_path = public
as $$
  select 'DC-' || nextval('public.order_number_seq')::text;
$$;

grant execute on function public.next_order_number() to anon, authenticated;

alter table public.orders
  add column if not exists order_number text;

-- Bu migration'dan önce oluşmuş olabilecek satırları da doldur.
update public.orders
  set order_number = 'DC-' || nextval('public.order_number_seq')::text
  where order_number is null;

alter table public.orders
  alter column order_number set not null;

alter table public.orders
  add constraint orders_order_number_key unique (order_number);
