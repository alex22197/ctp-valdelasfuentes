-- =====================================================================
-- CTPA Valdelasfuentes - Permiso del scraper sobre confrontacion_marcador (#97)
-- El scraper lee nuestros marcadores en esta vista antes de escribir los
-- resultados de la liga. El «grant all on all tables … to service_role»
-- del esquema inicial solo cubrió lo que existía entonces, y la vista se
-- creó en la migración siguiente dando lectura solo a anon y
-- authenticated. Desde la primera jornada del clausura el scraper fallaba
-- con «permission denied for view confrontacion_marcador».
-- =====================================================================

grant select on public.confrontacion_marcador to service_role;
