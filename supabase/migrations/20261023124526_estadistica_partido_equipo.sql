-- =====================================================================
-- CTPA Valdelasfuentes - Cada partido del equipo con sus sets (#73)
-- Una fila por partido decidido de nuestras confrontaciones, con lo que
-- hace falta para las estadísticas del equipo: si fue en casa o fuera, la
-- categoría, cuántos sets se jugaron y cuántos se decidieron en tie-break.
-- A diferencia de estadistica_partido_jugador, aquí los WO sí están
-- (es_wo), porque cuentan para el equipo; sin sets.
-- =====================================================================

create view public.estadistica_partido_equipo
with (security_invoker = true)
as
with sets as (
  select
    s.partido_id,
    count(*)::integer as sets_jugados,
    count(*) filter (
      where s.juegos_nuestros = 7 or (s.juegos_nuestros = 6 and s.juegos_rival <= 4)
    )::integer as sets_ganados,
    count(*) filter (
      where s.juegos_rival = 7 or (s.juegos_rival = 6 and s.juegos_nuestros <= 4)
    )::integer as sets_perdidos,
    count(*) filter (
      where (s.juegos_nuestros = 7 and s.juegos_rival = 6)
         or (s.juegos_rival = 7 and s.juegos_nuestros = 6)
    )::integer as tiebreaks_jugados,
    count(*) filter (
      where s.juegos_nuestros = 7 and s.juegos_rival = 6
    )::integer as tiebreaks_ganados,
    sum(s.juegos_nuestros)::integer as juegos_ganados,
    sum(s.juegos_rival)::integer    as juegos_perdidos
  from public.set_partido s
  group by s.partido_id
)
select
  f.competicion_id,
  c.fase_id,
  c.id as confrontacion_id,
  c.jornada,
  c.fecha_prevista,
  case when el.es_nuestro then 'local' else 'visitante' end as condicion,
  r.nombre as rival_nombre,
  p.id as partido_id,
  p.tipo,
  p.numero,
  p.resultado,
  pr.ganado,
  p.resultado in ('wo_favor', 'wo_contra') as es_wo,
  coalesce(s.sets_jugados, 0)      as sets_jugados,
  coalesce(s.sets_ganados, 0)      as sets_ganados,
  coalesce(s.sets_perdidos, 0)     as sets_perdidos,
  coalesce(s.tiebreaks_jugados, 0) as tiebreaks_jugados,
  coalesce(s.tiebreaks_ganados, 0) as tiebreaks_ganados,
  coalesce(s.juegos_ganados, 0)    as juegos_ganados,
  coalesce(s.juegos_perdidos, 0)   as juegos_perdidos
from public.partido p
join public.partido_resultado pr on pr.partido_id = p.id
join public.confrontacion c      on c.id = p.confrontacion_id
join public.fase f               on f.id = c.fase_id
join public.equipo el            on el.id = c.local_id
join public.equipo r
  on r.id = case when el.es_nuestro then c.visitante_id else c.local_id end
left join sets s                 on s.partido_id = p.id
-- Sin juega_nuestro_equipo(): esa función no la pueden llamar los visitantes y la vista es
-- pública.
where (
    el.es_nuestro
    or exists (select 1 from public.equipo ev where ev.id = c.visitante_id and ev.es_nuestro)
  )
  and pr.ganado is not null;

grant select on public.estadistica_partido_equipo to anon, authenticated, service_role;
