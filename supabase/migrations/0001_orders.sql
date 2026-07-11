-- Siparişler: Stripe webhook'u (service role) yazar, kullanıcı yalnızca
-- kendi siparişlerini okur (RLS).
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text not null,
  stripe_session_id text not null unique,
  amount_total integer not null, -- kuruş
  currency text not null default 'try',
  items jsonb not null, -- [{ name, qty, amount }]
  delivery_date date,
  delivery_window text,
  gift_note text,
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

-- Kullanıcının sipariş listesi sorgusu için indeks.
create index if not exists orders_user_id_created_at_idx
  on public.orders (user_id, created_at desc);

-- Misafir siparişlerini sonradan hesaba bağlamak için e-posta indeksi.
create index if not exists orders_email_idx on public.orders (email);

alter table public.orders enable row level security;

-- Kullanıcı yalnızca kendi siparişlerini görür. Yazma politikası yok:
-- INSERT yalnızca service role (webhook) üzerinden yapılır ve RLS'i atlar.
create policy "users read own orders"
  on public.orders
  for select
  to authenticated
  using ((select auth.uid()) = user_id);
