-- Admin panelindeki siparis bildirim sesi icin: orders tablosundaki
-- UPDATE olaylarini (odeme onaylandiginda status pending -> paid) tarayici
-- tarafina canli yayinla. Idempotent: yayinin uyesi degilse ekler.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;
end $$;
