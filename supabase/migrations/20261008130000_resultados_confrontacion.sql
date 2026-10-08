-- =====================================================================
-- CTPA Valdelasfuentes - Resultados de una confrontación
-- - validar_marcador(): reglas de un marcador de pádel según la normativa.
-- - guardar_resultado_partido(): guarda el resultado y los sets de un partido
--   en una sola operación, para que nunca queden a medias.
-- - confrontacion_marcador: partidos ganados y perdidos de cada confrontación
--   nuestra, calculados a partir de los partidos (ADR 0008).
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Marcador calculado de nuestras confrontaciones
-- ---------------------------------------------------------------------

create view public.confrontacion_marcador
with (security_invoker = true)
as
select
  c.id as confrontacion_id,
  (count(*) filter (where pr.ganado))::integer     as partidos_ganados,
  (count(*) filter (where not pr.ganado))::integer as partidos_perdidos,
  -- Partidos del formato que todavía no tienen ganador: por jugar, suspendidos
  -- o sin fila en `partido`.
  (
    (co.formato ->> 'masculino')::integer
    + (co.formato ->> 'femenino')::integer
    + (co.formato ->> 'mixto')::integer
    - count(*) filter (where pr.ganado is not null)
  )::integer as partidos_pendientes
from public.confrontacion c
join public.fase f on f.id = c.fase_id
join public.competicion co on co.id = f.competicion_id
left join public.partido_resultado pr on pr.confrontacion_id = c.id
where exists (
  select 1 from public.equipo e
  where e.id in (c.local_id, c.visitante_id) and e.es_nuestro
)
group by c.id, co.formato;


-- ---------------------------------------------------------------------
-- 2. Validación del marcador
-- Normativa: mejor de 3 sets con tie-break en todos (a 7 puntos, con 2 de
-- diferencia). Un set termina 6-0 a 6-4, 7-5 o 7-6. Los partidos abandonados
-- o suspendidos pueden tener el último set a medias.
-- La web repite estas reglas en `validar-marcador.ts`, con los mismos mensajes
-- (sin el prefijo «Set N:», porque allí se muestran junto al set).
-- ---------------------------------------------------------------------

create function public.validar_marcador(
  p_resultado public.resultado_partido,
  p_ganado    boolean,
  p_sets      jsonb
)
returns void
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_set           jsonb;
  v_total         integer;
  v_numero        integer := 0;
  v_jn            integer;
  v_jr            integer;
  v_tn            integer;
  v_tr            integer;
  v_terminado     boolean;
  v_sets_nuestros integer := 0;
  v_sets_rival    integer := 0;
begin
  if p_sets is null or jsonb_typeof(p_sets) <> 'array' then
    raise exception 'Los sets tienen que llegar como una lista';
  end if;
  v_total := jsonb_array_length(p_sets);

  if p_resultado = 'abandono' and p_ganado is null then
    raise exception 'Indica qué pareja ganó el partido abandonado';
  end if;
  if p_resultado is distinct from 'abandono' and p_ganado is not null then
    raise exception 'Solo se indica quién ganó en los abandonos; en el resto lo deciden los sets';
  end if;

  if p_resultado is null and v_total > 0 then
    raise exception 'Un partido por jugar no tiene sets';
  end if;
  if p_resultado in ('wo_favor', 'wo_contra') and v_total > 0 then
    raise exception 'Un partido con WO no tiene sets';
  end if;
  if v_total > 3 then
    raise exception 'Un partido tiene como máximo 3 sets';
  end if;

  for v_set in select value from jsonb_array_elements(p_sets) loop
    v_numero := v_numero + 1;

    if v_sets_nuestros = 2 or v_sets_rival = 2 then
      raise exception 'Set %: el partido ya estaba decidido; sobra este set', v_numero;
    end if;

    v_jn := (v_set ->> 'juegos_nuestros')::integer;
    v_jr := (v_set ->> 'juegos_rival')::integer;
    v_tn := (v_set ->> 'tiebreak_nuestros')::integer;
    v_tr := (v_set ->> 'tiebreak_rival')::integer;

    if v_jn is null or v_jr is null then
      raise exception 'Set %: faltan los juegos de alguna pareja', v_numero;
    end if;
    if v_jn not between 0 and 7 or v_jr not between 0 and 7 then
      raise exception 'Set %: los juegos van de 0 a 7', v_numero;
    end if;
    if greatest(v_jn, v_jr) = 7 and least(v_jn, v_jr) not in (5, 6) then
      raise exception 'Set %: %-% no es posible; a 7 juegos solo se llega con 7-5 o 7-6',
        v_numero, v_jn, v_jr;
    end if;

    if (v_tn is null) <> (v_tr is null) then
      raise exception 'Set %: indica los puntos del tie-break de las dos parejas', v_numero;
    end if;
    if v_tn is not null then
      if not (greatest(v_jn, v_jr) = 7 and least(v_jn, v_jr) = 6) then
        raise exception 'Set %: solo hay tie-break cuando el set acaba 7-6', v_numero;
      end if;
      if v_tn < 0 or v_tr < 0
         or not (
           (greatest(v_tn, v_tr) = 7 and least(v_tn, v_tr) <= 5)
           or (greatest(v_tn, v_tr) > 7 and abs(v_tn - v_tr) = 2)
         ) then
        raise exception 'Set %: el tie-break se gana a 7 puntos con 2 de diferencia', v_numero;
      end if;
      if (v_tn > v_tr) <> (v_jn > v_jr) then
        raise exception 'Set %: el tie-break lo gana la pareja que gana el set', v_numero;
      end if;
    end if;

    v_terminado :=
      (greatest(v_jn, v_jr) = 6 and least(v_jn, v_jr) <= 4)
      or greatest(v_jn, v_jr) = 7;

    if v_terminado then
      if v_jn > v_jr then
        v_sets_nuestros := v_sets_nuestros + 1;
      else
        v_sets_rival := v_sets_rival + 1;
      end if;
    elsif p_resultado = 'normal' then
      raise exception 'Set %: con %-% el set no ha terminado', v_numero, v_jn, v_jr;
    elsif v_numero < v_total then
      raise exception 'Set %: solo el último set puede quedar a medias', v_numero;
    end if;
  end loop;

  if p_resultado = 'normal' and greatest(v_sets_nuestros, v_sets_rival) < 2 then
    raise exception 'Faltan sets: el partido lo gana la primera pareja que gana dos';
  end if;
  if p_resultado in ('abandono', 'suspendido') and greatest(v_sets_nuestros, v_sets_rival) = 2 then
    raise exception 'Una pareja ya ha ganado dos sets: el partido terminó con resultado normal';
  end if;
end;
$$;


-- ---------------------------------------------------------------------
-- 3. Guardar el resultado de un partido
-- Crea el partido si aún no existe (por ejemplo, sin alineación), sustituye
-- sus sets y, en un WO en contra, quita a la pareja porque no jugó nadie.
-- Cuando los partidos de la confrontación tienen todos ganador, la marca como
-- jugada. Se ejecuta con los permisos de quien llama: RLS sigue mandando.
-- ---------------------------------------------------------------------

create function public.guardar_resultado_partido(
  p_confrontacion uuid,
  p_tipo          public.tipo_partido,
  p_numero        integer,
  p_sets          jsonb,
  -- NULL: el partido vuelve a estar por jugar.
  p_resultado     public.resultado_partido default null,
  -- Solo en abandonos: si lo ganamos nosotros.
  p_ganado        boolean default null
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_partido    uuid;
  v_pendientes integer;
begin
  -- RLS no da error al actualizar filas que no puedes tocar: se comprueba antes.
  if not public.es_gestor() then
    raise exception 'Solo los gestores pueden guardar resultados';
  end if;

  perform public.validar_marcador(p_resultado, p_ganado, p_sets);

  insert into public.partido (confrontacion_id, tipo, numero)
  values (p_confrontacion, p_tipo, p_numero)
  on conflict (confrontacion_id, tipo, numero) do nothing;

  select p.id into v_partido
  from public.partido p
  where p.confrontacion_id = p_confrontacion and p.tipo = p_tipo and p.numero = p_numero;

  -- Primero se quita lo que impediría cambiar el resultado (los triggers lo exigen).
  delete from public.set_partido where partido_id = v_partido;
  if p_resultado = 'wo_contra' then
    delete from public.participacion where partido_id = v_partido;
  end if;

  update public.partido
  set resultado = p_resultado,
      ganado = p_ganado
  where id = v_partido;

  insert into public.set_partido
    (partido_id, numero, juegos_nuestros, juegos_rival, tiebreak_nuestros, tiebreak_rival)
  select
    v_partido,
    s.orden::integer,
    (s.valor ->> 'juegos_nuestros')::integer,
    (s.valor ->> 'juegos_rival')::integer,
    (s.valor ->> 'tiebreak_nuestros')::integer,
    (s.valor ->> 'tiebreak_rival')::integer
  from jsonb_array_elements(p_sets) with ordinality as s (valor, orden);

  -- Solo se avanza el estado: si la liga o un gestor ya la marcaron como jugada,
  -- borrar un resultado no la devuelve a programada.
  select cm.partidos_pendientes into v_pendientes
  from public.confrontacion_marcador cm
  where cm.confrontacion_id = p_confrontacion;

  if v_pendientes = 0 then
    update public.confrontacion
    set estado = 'jugada'
    where id = p_confrontacion
      and estado in ('programada', 'aplazada', 'suspendida');
  end if;

  return v_partido;
end;
$$;


-- ---------------------------------------------------------------------
-- 4. Permisos
-- Las funciones nuevas se pueden ejecutar por defecto desde cualquier rol:
-- se retira y se concede solo a quien la necesita.
-- ---------------------------------------------------------------------

grant select on public.confrontacion_marcador to anon, authenticated;

revoke execute on function
  public.validar_marcador(public.resultado_partido, boolean, jsonb),
  public.guardar_resultado_partido(uuid, public.tipo_partido, integer, jsonb, public.resultado_partido, boolean)
from public, anon;

grant execute on function
  public.validar_marcador(public.resultado_partido, boolean, jsonb),
  public.guardar_resultado_partido(uuid, public.tipo_partido, integer, jsonb, public.resultado_partido, boolean)
to authenticated, service_role;
