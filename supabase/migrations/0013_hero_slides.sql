-- Hero banner tek bir nesneden coklu slayt dizisine geciyor
-- ({ slides: [...] }). Var olan hero satiri (admin panelden zaten
-- duzenlenmis olabilir) kaybolmasin diye ilk slayt olarak sarmalanir.
-- Idempotent: satir zaten "slides" alanina sahipse dokunulmaz.
update public.site_content
set value = jsonb_build_object(
  'slides',
  jsonb_build_array(value || jsonb_build_object('id', 'slide-1'))
)
where key = 'hero'
  and not (value ? 'slides');
