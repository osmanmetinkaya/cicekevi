-- Telefonla giriş: kayıt sırasında telefon numarası auth.users'ta bir
-- kimlik (identity) değil, yalnızca user_metadata alanı olarak tutuluyor
-- (bkz. src/app/[locale]/giris/actions.ts signUp). Bu yüzden e-postayla
-- girişte olduğu gibi doğrudan signInWithPassword({ phone }) çalışmaz.
--
-- Bu fonksiyon, girilen telefon numarasına (yalnızca rakamlar) sahip
-- kullanıcının e-postasını bulur; sign-in action'ı bu e-postayla normal
-- şifre girişini dener. SECURITY DEFINER: anon rolüne auth.users'a
-- doğrudan erişim vermeden, yalnızca tek bir e-posta değeri döndürür.
create or replace function public.email_by_phone(phone_digits text)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select email::text from auth.users
  where raw_user_meta_data->>'phone' = phone_digits
  limit 1;
$$;

grant execute on function public.email_by_phone(text) to anon, authenticated;
