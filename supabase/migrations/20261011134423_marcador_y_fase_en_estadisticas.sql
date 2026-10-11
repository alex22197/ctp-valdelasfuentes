-- =====================================================================
-- CTPA Valdelasfuentes - Marcador y fase en las estadísticas (#15)
-- La ficha de jugador enseña los sets de cada partido y ordena su temporada
-- por fase y jornada (el número de jornada se repite en cada fase).
-- Solo se añaden columnas al final; las existentes no cambian.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. estadistica_partido_jugador + marcador
-- `marcador`: juegos de cada set desde nuestro lado, en orden: «6-3 4-6 7-6».
-- Incluye el set a medias de un abandono («6-3 3-2»). Nulo en los WO.
-- ---------------------------------------------------------------------

create or replace view public.estadistica_partido_jugador
with (security_invoker = true)
as
with sets as (
  select
    s.partido_id,
    count(*) filter (
      where s.juegos_nuestros = 7 or (s.juegos_nuestros = 6 and s.juegos_rival <= 4)
    )::integer as sets_ganados,
    count(*) filter (
      where s.juegos_rival = 7 or (s.juegos_rival = 6 and s.juegos_nuestros <= 4)
    )::integer as sets_perdidos,
    sum(s.juegos_nuestros)::integer as juegos_ganados,
    sum(s.juegos_rival)::integer    as juegos_perdidos,
    string_agg(s.juegos_nuestros || '-' || s.juegos_rival, ' ' order by s.numero) as marcador
  from public.set_partido s
  group by s.partido_id
)
select
  pa.jugador_id,
  j.nombre_mostrar,
  coalesce(pl.comodin, false)  as comodin,
  pa.lado,
  pa2.jugador_id               as companero_id,
  jc.nombre_mostrar            as companero_nombre,
  coalesce(plc.comodin, false) as companero_comodin,
  p.id as partido_id,
  p.tipo,
  p.numero,
  p.resultado,
  pr.ganado,
  p.resultado = 'wo_favor'     as es_wo,
  coalesce(s.sets_ganados, 0)    as sets_ganados,
  coalesce(s.sets_perdidos, 0)   as sets_perdidos,
  coalesce(s.juegos_ganados, 0)  as juegos_ganados,
  coalesce(s.juegos_perdidos, 0) as juegos_perdidos,
  c.id as confrontacion_id,
  c.jornada,
  c.fecha_prevista,
  c.fecha_hora,
  c.fase_id,
  f.competicion_id,
  r.id     as rival_id,
  r.nombre as rival_nombre,
  case when el.es_nuestro then 'local' else 'visitante' end as condicion,
  s.marcador
from public.participacion pa
join public.partido p           on p.id = pa.partido_id
join public.partido_resultado pr on pr.partido_id = p.id
join public.confrontacion c     on c.id = p.confrontacion_id
join public.fase f              on f.id = c.fase_id
join public.equipo el           on el.id = c.local_id
join public.equipo r
  on r.id = case when el.es_nuestro then c.visitante_id else c.local_id end
join public.jugador j           on j.id = pa.jugador_id
left join public.plantilla pl
  on pl.competicion_id = f.competicion_id and pl.jugador_id = pa.jugador_id
left join public.participacion pa2
  on pa2.partido_id = pa.partido_id and pa2.jugador_id <> pa.jugador_id
left join public.jugador jc     on jc.id = pa2.jugador_id
left join public.plantilla plc
  on plc.competicion_id = f.competicion_id and plc.jugador_id = pa2.jugador_id
left join sets s                on s.partido_id = p.id
where p.resultado in ('normal', 'abandono', 'wo_favor')
  and pr.ganado is not null;


-- ---------------------------------------------------------------------
-- 2. estadistica_jornada + nombre y orden de la fase
-- ---------------------------------------------------------------------

create or replace view public.estadistica_jornada
with (security_invoker = true)
as
select
  c.id as confrontacion_id,
  f.competicion_id,
  c.fase_id,
  c.jornada,
  c.fecha_prevista,
  c.fecha_hora,
  r.id     as rival_id,
  r.nombre as rival_nombre,
  case when el.es_nuestro then 'local' else 'visitante' end as condicion,
  m.partidos_ganados,
  m.partidos_perdidos,
  m.partidos_pendientes,
  case
    when m.partidos_pendientes > 0 then null
    when m.partidos_ganados > m.partidos_perdidos then 2
    when m.partidos_ganados = m.partidos_perdidos then 1
    else 0
  end as puntos,
  f.nombre as fase_nombre,
  f.orden  as fase_orden
from public.confrontacion_marcador m
join public.confrontacion c on c.id = m.confrontacion_id
join public.fase f          on f.id = c.fase_id
join public.equipo el       on el.id = c.local_id
join public.equipo r
  on r.id = case when el.es_nuestro then c.visitante_id else c.local_id end
where c.estado = 'jugada';
