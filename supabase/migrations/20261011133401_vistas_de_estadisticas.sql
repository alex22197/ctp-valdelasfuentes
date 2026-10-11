-- =====================================================================
-- CTPA Valdelasfuentes - Vistas de estadísticas (#13)
-- Todos los cálculos se hacen aquí, nunca en el navegador: la web solo lee.
--
-- - estadistica_partido_jugador: un partido decidido de un jugador, con su
--   compañero, el rival y los sets y juegos. Base del resto.
-- - estadistica_jugador / _lado / _puesto, estadistica_pareja: estadísticas
--   individuales. Los WO no cuentan (ADR 0006); los WO a favor se cuentan
--   aparte en estadistica_jugador.
-- - estadistica_puesto, estadistica_jornada: estadísticas del equipo, donde
--   los WO sí cuentan, como en la normativa.
-- - estadistica_participacion: cuántas jornadas jugó cada uno y por qué no
--   jugó el resto. Usa la encuesta, así que solo la ven los gestores.
--
-- Reglas comunes:
-- - Las vistas agrupadas tienen una fila por fase y otra con toda la
--   competición (`toda_la_competicion` = true y `fase_id` nulo). Nunca se
--   mezclan competiciones.
-- - Porcentaje = round(100 * ganados / partidos), entero; nulo si no hay
--   partidos.
-- - Los comodines llevan `comodin` = true: la web decide si los separa.
-- - Los datos de jugadores salen solo de lo que meten los gestores, nunca de
--   la web de la liga (ADR 0011).
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Base: un partido decidido de un jugador
-- Entran los partidos normales, abandonados y WO a favor que ya tienen
-- ganador. Quedan fuera los suspendidos, los que están por jugar y los WO en
-- contra, que no tienen jugadores (guardar_resultado_partido los quita).
-- Sets: solo cuentan los terminados (6-0 a 6-4, 7-5, 7-6), para que un
-- abandono a mitad de set no sume un set a nadie. Juegos: cuentan todos.
-- ---------------------------------------------------------------------

create view public.estadistica_partido_jugador
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
    sum(s.juegos_rival)::integer    as juegos_perdidos
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
  case when el.es_nuestro then 'local' else 'visitante' end as condicion
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
-- 2. Estadísticas de cada jugador
-- `partidos`, sets y juegos sin WO; `wo_a_favor` aparte. `jornadas`:
-- confrontaciones en las que jugó algún partido (sin contar WO).
-- ---------------------------------------------------------------------

create view public.estadistica_jugador
with (security_invoker = true)
as
with totales as (
  select
    b.competicion_id,
    b.fase_id,
    grouping(b.fase_id) = 1 as toda_la_competicion,
    b.jugador_id,
    b.nombre_mostrar,
    bool_or(b.comodin) as comodin,
    count(*) filter (where not b.es_wo)::integer                 as partidos,
    count(*) filter (where not b.es_wo and b.ganado)::integer     as ganados,
    count(*) filter (where not b.es_wo and not b.ganado)::integer as perdidos,
    coalesce(sum(b.sets_ganados) filter (where not b.es_wo), 0)::integer    as sets_ganados,
    coalesce(sum(b.sets_perdidos) filter (where not b.es_wo), 0)::integer   as sets_perdidos,
    coalesce(sum(b.juegos_ganados) filter (where not b.es_wo), 0)::integer  as juegos_ganados,
    coalesce(sum(b.juegos_perdidos) filter (where not b.es_wo), 0)::integer as juegos_perdidos,
    count(distinct b.confrontacion_id) filter (where not b.es_wo)::integer  as jornadas,
    count(*) filter (where b.es_wo)::integer                              as wo_a_favor
  from public.estadistica_partido_jugador b
  group by b.competicion_id, b.jugador_id, b.nombre_mostrar, grouping sets ((b.fase_id), ())
)
select
  t.*,
  round(100.0 * t.ganados / nullif(t.partidos, 0))::integer as porcentaje_victorias
from totales t;


-- ---------------------------------------------------------------------
-- 3. Por lado (drive o revés), sin WO
-- ---------------------------------------------------------------------

create view public.estadistica_jugador_lado
with (security_invoker = true)
as
with totales as (
  select
    b.competicion_id,
    b.fase_id,
    grouping(b.fase_id) = 1 as toda_la_competicion,
    b.jugador_id,
    b.nombre_mostrar,
    bool_or(b.comodin) as comodin,
    b.lado,
    count(*)::integer                         as partidos,
    count(*) filter (where b.ganado)::integer as ganados,
    count(*) filter (where not b.ganado)::integer as perdidos
  from public.estadistica_partido_jugador b
  where not b.es_wo
  group by b.competicion_id, b.jugador_id, b.nombre_mostrar, b.lado,
    grouping sets ((b.fase_id), ())
)
select
  t.*,
  round(100.0 * t.ganados / nullif(t.partidos, 0))::integer as porcentaje_victorias
from totales t;


-- ---------------------------------------------------------------------
-- 4. Por puesto (Masculino 1, Femenino 2…), sin WO
-- ---------------------------------------------------------------------

create view public.estadistica_jugador_puesto
with (security_invoker = true)
as
with totales as (
  select
    b.competicion_id,
    b.fase_id,
    grouping(b.fase_id) = 1 as toda_la_competicion,
    b.jugador_id,
    b.nombre_mostrar,
    bool_or(b.comodin) as comodin,
    b.tipo,
    b.numero,
    count(*)::integer                         as partidos,
    count(*) filter (where b.ganado)::integer as ganados,
    count(*) filter (where not b.ganado)::integer as perdidos
  from public.estadistica_partido_jugador b
  where not b.es_wo
  group by b.competicion_id, b.jugador_id, b.nombre_mostrar, b.tipo, b.numero,
    grouping sets ((b.fase_id), ())
)
select
  t.*,
  round(100.0 * t.ganados / nullif(t.partidos, 0))::integer as porcentaje_victorias
from totales t;


-- ---------------------------------------------------------------------
-- 5. Parejas, sin WO
-- Cada pareja sale una sola vez: jugador_a es el de id menor.
-- ---------------------------------------------------------------------

create view public.estadistica_pareja
with (security_invoker = true)
as
with totales as (
  select
    b.competicion_id,
    b.fase_id,
    grouping(b.fase_id) = 1 as toda_la_competicion,
    b.tipo,
    b.jugador_id         as jugador_a_id,
    b.nombre_mostrar     as jugador_a_nombre,
    bool_or(b.comodin)   as jugador_a_comodin,
    b.companero_id       as jugador_b_id,
    b.companero_nombre   as jugador_b_nombre,
    bool_or(b.companero_comodin) as jugador_b_comodin,
    count(*)::integer                         as partidos,
    count(*) filter (where b.ganado)::integer as ganados,
    count(*) filter (where not b.ganado)::integer as perdidos
  from public.estadistica_partido_jugador b
  where not b.es_wo
    and b.jugador_id < b.companero_id
  group by b.competicion_id, b.tipo, b.jugador_id, b.nombre_mostrar,
    b.companero_id, b.companero_nombre, grouping sets ((b.fase_id), ())
)
select
  t.*,
  round(100.0 * t.ganados / nullif(t.partidos, 0))::integer as porcentaje_victorias
from totales t;


-- ---------------------------------------------------------------------
-- 6. Rendimiento del equipo por puesto, con WO
-- Aquí sí cuentan los WO, porque suman o restan partidos al equipo. Salen
-- también aparte (`wo_a_favor`, `wo_en_contra`).
-- ---------------------------------------------------------------------

create view public.estadistica_puesto
with (security_invoker = true)
as
with totales as (
  select
    f.competicion_id,
    c.fase_id,
    grouping(c.fase_id) = 1 as toda_la_competicion,
    pr.tipo,
    pr.numero,
    count(*)::integer                                       as partidos,
    count(*) filter (where pr.ganado)::integer              as ganados,
    count(*) filter (where not pr.ganado)::integer          as perdidos,
    count(*) filter (where pr.resultado = 'wo_favor')::integer  as wo_a_favor,
    count(*) filter (where pr.resultado = 'wo_contra')::integer as wo_en_contra
  from public.partido_resultado pr
  join public.confrontacion c on c.id = pr.confrontacion_id
  join public.fase f          on f.id = c.fase_id
  where pr.ganado is not null
  group by f.competicion_id, pr.tipo, pr.numero, grouping sets ((c.fase_id), ())
)
select
  t.*,
  round(100.0 * t.ganados / nullif(t.partidos, 0))::integer as porcentaje_victorias
from totales t;


-- ---------------------------------------------------------------------
-- 7. Cada confrontación nuestra que se ha jugado, con WO
-- `puntos`: 2 si se gana, 1 si se empata y 0 si se pierde, solo cuando no
-- queda ningún partido pendiente. No es la clasificación: allí se restan
-- además las sanciones (fase_equipo.puntos).
-- ---------------------------------------------------------------------

create view public.estadistica_jornada
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
  end as puntos
from public.confrontacion_marcador m
join public.confrontacion c on c.id = m.confrontacion_id
join public.fase f          on f.id = c.fase_id
join public.equipo el       on el.id = c.local_id
join public.equipo r
  on r.id = case when el.es_nuestro then c.visitante_id else c.local_id end
where c.estado = 'jugada';


-- ---------------------------------------------------------------------
-- 8. Participación: cuántas jornadas jugó cada uno (solo gestores)
-- Una fila por jugador de la plantilla, sin comodines, sobre nuestras
-- confrontaciones jugadas mientras estaba en el equipo (entre alta y baja).
-- Cada jornada cae en una sola categoría, en este orden:
--   jugadas: estaba en la alineación (también si el partido fue WO a favor o
--     se suspendió, porque se presentó);
--   disponible_sin_jugar: dijo que sí en la encuesta y no jugó;
--   no_disponible: dijo que no;
--   sin_responder: no hay respuesta guardada.
-- Usa la encuesta (disponibilidad), privada: para quien no es gestor la vista
-- sale vacía en lugar de mostrar a todos «sin responder».
-- ---------------------------------------------------------------------

create view public.estadistica_participacion
with (security_invoker = true)
as
with jornadas as (
  select
    f.competicion_id,
    c.fase_id,
    pl.jugador_id,
    j.nombre_mostrar,
    case
      when exists (
        select 1
        from public.participacion pa
        join public.partido p on p.id = pa.partido_id
        where p.confrontacion_id = c.id and pa.jugador_id = pl.jugador_id
      ) then 'jugada'
      when d.respuesta = 'si' then 'disponible_sin_jugar'
      when d.respuesta = 'no' then 'no_disponible'
      else 'sin_responder'
    end as categoria
  from public.confrontacion c
  join public.fase f      on f.id = c.fase_id
  join public.plantilla pl on pl.competicion_id = f.competicion_id
  join public.jugador j   on j.id = pl.jugador_id
  left join public.disponibilidad d
    on d.confrontacion_id = c.id and d.jugador_id = pl.jugador_id
  where public.es_gestor()
    and c.estado = 'jugada'
    and public.juega_nuestro_equipo(c.id)
    and not pl.comodin
    and (pl.alta is null or c.fecha_prevista is null or c.fecha_prevista >= pl.alta)
    and (pl.baja is null or c.fecha_prevista is null or c.fecha_prevista <= pl.baja)
),
totales as (
  select
    jo.competicion_id,
    jo.fase_id,
    grouping(jo.fase_id) = 1 as toda_la_competicion,
    jo.jugador_id,
    jo.nombre_mostrar,
    count(*)::integer as confrontaciones,
    count(*) filter (where jo.categoria = 'jugada')::integer               as jugadas,
    count(*) filter (where jo.categoria = 'disponible_sin_jugar')::integer as disponible_sin_jugar,
    count(*) filter (where jo.categoria = 'no_disponible')::integer        as no_disponible,
    count(*) filter (where jo.categoria = 'sin_responder')::integer        as sin_responder
  from jornadas jo
  group by jo.competicion_id, jo.jugador_id, jo.nombre_mostrar, grouping sets ((jo.fase_id), ())
)
select
  t.*,
  round(100.0 * t.jugadas / nullif(t.confrontaciones, 0))::integer as porcentaje_jugadas
from totales t;


-- ---------------------------------------------------------------------
-- 9. Permisos
-- ---------------------------------------------------------------------

grant select on
  public.estadistica_partido_jugador, public.estadistica_jugador,
  public.estadistica_jugador_lado, public.estadistica_jugador_puesto,
  public.estadistica_pareja, public.estadistica_puesto, public.estadistica_jornada
to anon, authenticated, service_role;

revoke all on public.estadistica_participacion from public, anon;
grant select on public.estadistica_participacion to authenticated, service_role;
