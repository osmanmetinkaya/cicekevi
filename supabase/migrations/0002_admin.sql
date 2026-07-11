-- Sipariş durumu değerlerini sınırla.
alter table public.orders
  add constraint orders_status_check
  check (status in ('paid', 'preparing', 'on_delivery', 'delivered', 'cancelled'));

-- Admin erişimi: JWT app_metadata.role = 'admin' olan kullanıcılar
-- tüm siparişleri okuyabilir ve durumlarını güncelleyebilir.
create policy "admins read all orders"
  on public.orders
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admins update orders"
  on public.orders
  for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Bir kullanıcıyı admin yapmak için (e-postayı değiştirerek çalıştır):
-- update auth.users
--   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'
--   where email = 'admin@ornek.com';
