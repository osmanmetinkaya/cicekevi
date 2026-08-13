-- Urunu tamamen silmeden vitrinden gizleyebilmek icin (admin panelinden
-- "Yayin disi" butonu). Varsayilan true: mevcut urunler gorunur kalir.
alter table public.products
  add column if not exists is_active boolean not null default true;

-- Herkese acik okuma artik yalnizca yayindaki urunleri kapsar. Admin zaten
-- ayri "admins write products" politikasindan (FOR ALL) tumunu gorebiliyor;
-- RLS izinli politikalari OR ile birlestirdigi icin bu degisiklik admin
-- erisimini kisitlamaz, yalnizca anonim/musteri okumasini daraltir.
drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products
  for select
  using (is_active);
