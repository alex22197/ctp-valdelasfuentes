-- =====================================================================
-- CTPA Valdelasfuentes - Partidos a favor y en contra en la clasificación (#71)
-- La liga publica, para cada equipo, los partidos ganados (P. Favor) y
-- perdidos (P. Contra) sumando todas sus confrontaciones. Sirven para los
-- desempates. Se copian como el resto de la clasificación: NULL si no se saben.
-- =====================================================================

alter table public.fase_equipo
  add column partidos_favor  integer check (partidos_favor >= 0),
  add column partidos_contra integer check (partidos_contra >= 0);

comment on column public.fase_equipo.partidos_favor is
  'Partidos ganados en todas las confrontaciones de la fase (P. Favor en la web de la liga).';
comment on column public.fase_equipo.partidos_contra is
  'Partidos perdidos en todas las confrontaciones de la fase (P. Contra en la web de la liga).';
