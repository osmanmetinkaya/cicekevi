-- Gönderen (sipariş veren) ve alıcı (teslim edilecek kişi) bilgileri.
-- Checkout API tarafından toplanır, Stripe metadata üzerinden webhook'a
-- taşınır. Geçmiş siparişlerde bu alanlar boş olabileceğinden nullable.
alter table public.orders
  add column if not exists sender_name text,
  add column if not exists sender_phone text,
  add column if not exists sender_email text,
  add column if not exists recipient_name text,
  add column if not exists recipient_phone text,
  add column if not exists recipient_address text;
