-- Site content (hero banner etc.) -- admin-editable key/value store.
-- ASCII-only file: non-ASCII text is stored as JSON \uXXXX escapes so a
-- clipboard paste into the SQL Editor can't mangle it (see 0009's fix).

create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "public read site_content" on public.site_content;
create policy "public read site_content" on public.site_content
  for select using (true);

drop policy if exists "admins write site_content" on public.site_content;
create policy "admins write site_content" on public.site_content
  for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
  before update on public.site_content
  for each row execute function public.touch_updated_at();

-- Storage bucket for site images (hero banner, future sections).
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists "public read site images" on storage.objects;
create policy "public read site images" on storage.objects
  for select
  using (bucket_id = 'site-images');

drop policy if exists "admins upload site images" on storage.objects;
create policy "admins upload site images" on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'site-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "admins update site images" on storage.objects;
create policy "admins update site images" on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'site-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "admins delete site images" on storage.objects;
create policy "admins delete site images" on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'site-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Seed: hero banner defaults (matches current homepage copy, so nothing
-- changes visually until the admin edits it from /admin/icerik).
insert into public.site_content (key, value)
values ('hero', '{"eyebrow":{"tr":"AYNI G\u00dcN TESL\u0130MAT \u00b7 DEN\u0130ZL\u0130 \u0130\u00c7\u0130","en":"SAME-DAY DELIVERY \u00b7 WITHIN DEN\u0130ZL\u0130"},"title1":{"tr":"Taze \u00e7i\u00e7ekler,","en":"Fresh flowers,"},"title2":{"tr":"bug\u00fcn kap\u0131nda.","en":"at your door today."},"subtitle":{"tr":"Mevsiminde toplanan buketler ustalar\u0131m\u0131z\u0131n elinden \u00e7\u0131kar. Saat 16.00''ya kadar verilen sipari\u015fler ayn\u0131 g\u00fcn ula\u015f\u0131r.","en":"Seasonal bouquets, arranged by hand by our florists. Orders placed by 4 p.m. arrive the same day."},"ctaExplore":{"tr":"Buketleri ke\u015ffet","en":"Explore bouquets"},"ctaBestsellers":{"tr":"\u00c7ok satanlar","en":"Bestsellers"},"imageUrl":null}'::jsonb)
on conflict (key) do nothing;
