-- Ürün kataloğunu koddan veritabanına taşır.
--
-- Şimdiye kadar ürünler src/lib/products.ts, kategoriler src/lib/categories.ts
-- içinde sabit kod olarak duruyordu; her fiyat/açıklama değişikliği yeniden
-- deploy gerektiriyordu. Bu migration üç tablo kurar (categories, products,
-- product_categories) ve ürün fotoğrafları için public bir Storage bucket
-- açar. Mevcut veri 0008_seed_catalog.sql ile birebir aktarılır.

-- ---------------------------------------------------------------------------
-- Kategoriler — kendine referans veren, 3 seviyeye kadar hiyerarşi.
-- parent_id null  = en üst seviye (grup, ör. "Duruma Göre")
-- grubun çocuğu   = item (ör. "Doğum Günü")
-- item'ın çocuğu  = alt-item (ör. "Sevgililer Günü")
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label_tr text not null,
  label_en text not null,
  parent_id uuid references public.categories(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists categories_parent_id_sort_idx
  on public.categories (parent_id, sort_order);

-- ---------------------------------------------------------------------------
-- Ürünler.
--
-- id UUID DEĞİL, text: mevcut ürün id'leri ("pembe-safak" gibi) kullanıcıların
-- localStorage sepet/favori kayıtlarında referans olarak duruyor; değişirse
-- canlıdaki sepetler kırılır. Bu yüzden birebir korunur.
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  name_tr text not null,
  name_en text not null,
  tagline_tr text not null,
  tagline_en text not null,
  description_tr text not null,
  description_en text not null,
  price_kurus integer not null check (price_kurus > 0),
  flowers_tr text[] not null default '{}',
  flowers_en text[] not null default '{}',
  accent text not null default 'blush'
    check (accent in ('blush','leaf','rose','amber','teal')),
  image_url text, -- null ise arayüz <Artwork> placeholder'ına düşer
  is_new boolean not null default false,
  is_bestseller boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_sort_order_idx
  on public.products (sort_order);

-- Ürün ↔ kategori (çoka çok).
create table if not exists public.product_categories (
  product_id text not null references public.products(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);

create index if not exists product_categories_category_id_idx
  on public.product_categories (category_id);

-- ---------------------------------------------------------------------------
-- RLS — vitrin herkese açık okunur, yazma yalnızca admin.
-- 0002_admin.sql'deki "admins update orders" ile aynı desen.
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_categories enable row level security;

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories
  for select using (true);

drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products
  for select using (true);

drop policy if exists "public read product_categories" on public.product_categories;
create policy "public read product_categories" on public.product_categories
  for select using (true);

drop policy if exists "admins write categories" on public.categories;
create policy "admins write categories" on public.categories
  for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admins write products" on public.products;
create policy "admins write products" on public.products
  for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admins write product_categories" on public.product_categories;
create policy "admins write product_categories" on public.product_categories
  for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- updated_at otomatik tazelensin (admin panelinden yapılan her kayıtta).
create or replace function public.touch_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.touch_products_updated_at();

-- ---------------------------------------------------------------------------
-- Storage — ürün fotoğrafları. Public bucket: görseller girişsiz okunur,
-- yalnızca admin yükler/siler.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects
  for select
  using (bucket_id = 'product-images');

drop policy if exists "admins upload product images" on storage.objects;
create policy "admins upload product images" on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "admins update product images" on storage.objects;
create policy "admins update product images" on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'product-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "admins delete product images" on storage.objects;
create policy "admins delete product images" on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
