-- Stripe -> PayTR geçişi.
--
-- Artık sipariş satırı ödeme BAŞLAMADAN ÖNCE status='pending' olarak yazılır
-- (PayTR callback'te custom metadata geri yansıtmıyor), callback geldiğinde
-- 'paid' ya da 'cancelled' yapılır.

-- Eski Stripe siparişleri için sütun kalsın ama yeni siparişler doldurmuyor.
alter table public.orders
  alter column stripe_session_id drop not null;

alter table public.orders
  add column if not exists payment_provider text not null default 'paytr';

-- PayTR'e giden / callback'te dönen sipariş kimliği. Okunabilir ve SIRALI
-- order_number (DC-1042) ile bilerek AYNI DEĞİL: bu değer ödeme sonrası durum
-- sayfasında siparişi sorgulamak için kullanılıyor, tahmin edilemez olmalı.
alter table public.orders
  add column if not exists paytr_merchant_oid text unique;

-- 'pending' durumu status check'ine eklenir.
alter table public.orders
  drop constraint if exists orders_status_check;

alter table public.orders
  add constraint orders_status_check
  check (status in ('pending', 'paid', 'preparing', 'on_delivery', 'delivered', 'cancelled'));

-- Callback ve durum sayfası bu sütun üzerinden tekil satır arar.
create index if not exists orders_paytr_merchant_oid_idx
  on public.orders (paytr_merchant_oid);
