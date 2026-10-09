-- =====================================================================
-- CTPA Valdelasfuentes - Convocatoria y alineación
-- - confrontacion.convocatoria_publicada: un borrador no se ve en la portada.
-- - guardar_alineacion(): guarda las parejas de una confrontación en una sola
--   operación y marca como convocados a los colocados (ADR 0009).
-- - publicar_convocatoria(): publica la convocatoria o la devuelve a borrador.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Convocatoria publicada
-- ---------------------------------------------------------------------

alter table public.confrontacion
  add column convocatoria_publicada boolean not null default false;

comment on column public.confrontacion.convocatoria_publicada is
  'Si la alineación ya se ha mandado al equipo. Mientras es un borrador, la portada no la muestra.';

-- La jornada 1 ya tiene la convocatoria real que mandó el capitán.
update public.confrontacion c
set convocatoria_publicada = true
where exists (
  select 1
  from public.partido p
  join public.participacion pa on pa.partido_id = p.id
  where p.confrontacion_id = c.id
);


-- ---------------------------------------------------------------------
-- 2. Guardar la alineación
-- p_parejas: [{ "tipo": "masculino", "numero": 1, "reves": uuid|null,
--               "drive": uuid|null }, …]. Un hueco vacío (null) se puede
-- guardar como borrador.
-- Los triggers de participacion aplican la normativa (sexo, plantilla, nadie
-- repite, mixto, WO en contra) con mensajes en castellano.
-- ---------------------------------------------------------------------

create function public.guardar_alineacion(
  p_confrontacion uuid,
  p_parejas       jsonb
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- RLS no da error al actualizar o borrar filas que no puedes tocar: se comprueba antes.
  if not public.es_gestor() then
    raise exception 'Solo los gestores pueden guardar la alineación';
  end if;
  if p_parejas is null or jsonb_typeof(p_parejas) <> 'array' then
    raise exception 'Las parejas tienen que llegar como una lista';
  end if;

  -- Los partidos que aún no existen (jornadas sin alineación) se crean; el trigger
  -- comprueba que el tipo y el número caben en el formato de la competición.
  insert into public.partido (confrontacion_id, tipo, numero)
  select p_confrontacion, (pareja ->> 'tipo')::public.tipo_partido, (pareja ->> 'numero')::integer
  from jsonb_array_elements(p_parejas) as pareja
  on conflict (confrontacion_id, tipo, numero) do nothing;

  -- Se sustituye la alineación entera para poder intercambiar jugadores entre pistas.
  delete from public.participacion pa
  using public.partido p
  where p.id = pa.partido_id and p.confrontacion_id = p_confrontacion;

  insert into public.participacion (partido_id, jugador_id, lado)
  select p.id, j.jugador_id, j.lado
  from jsonb_array_elements(p_parejas) as pareja
  join public.partido p
    on p.confrontacion_id = p_confrontacion
   and p.tipo = (pareja ->> 'tipo')::public.tipo_partido
   and p.numero = (pareja ->> 'numero')::integer
  cross join lateral (
    values
      ((pareja ->> 'reves')::uuid, 'reves'::public.lado),
      ((pareja ->> 'drive')::uuid, 'drive'::public.lado)
  ) as j (jugador_id, lado)
  where j.jugador_id is not null;

  -- Convocados = colocados en la alineación (ADR 0009). Se conserva lo que
  -- respondió cada uno a la encuesta.
  insert into public.disponibilidad (confrontacion_id, jugador_id, convocado)
  select distinct p_confrontacion, pa.jugador_id, true
  from public.participacion pa
  join public.partido p on p.id = pa.partido_id
  where p.confrontacion_id = p_confrontacion
  on conflict (confrontacion_id, jugador_id) do update set convocado = true;

  -- Quien ya no está colocado deja de estar convocado; si tampoco respondió a la
  -- encuesta (por ejemplo, un comodín), su fila sobra.
  update public.disponibilidad d
  set convocado = false
  where d.confrontacion_id = p_confrontacion
    and d.convocado
    and d.respuesta is not null
    and not exists (
      select 1
      from public.participacion pa
      join public.partido p on p.id = pa.partido_id
      where p.confrontacion_id = p_confrontacion and pa.jugador_id = d.jugador_id
    );

  delete from public.disponibilidad d
  where d.confrontacion_id = p_confrontacion
    and d.respuesta is null
    and not exists (
      select 1
      from public.participacion pa
      join public.partido p on p.id = pa.partido_id
      where p.confrontacion_id = p_confrontacion and pa.jugador_id = d.jugador_id
    );
end;
$$;


-- ---------------------------------------------------------------------
-- 3. Publicar la convocatoria (o devolverla a borrador)
-- ---------------------------------------------------------------------

create function public.publicar_convocatoria(
  p_confrontacion uuid,
  p_publicada     boolean default true
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not public.es_gestor() then
    raise exception 'Solo los gestores pueden publicar la convocatoria';
  end if;
  if not public.juega_nuestro_equipo(p_confrontacion) then
    raise exception 'Solo se publican convocatorias de confrontaciones de nuestro equipo';
  end if;

  update public.confrontacion
  set convocatoria_publicada = p_publicada
  where id = p_confrontacion;
end;
$$;


-- ---------------------------------------------------------------------
-- 4. Permisos
-- ---------------------------------------------------------------------

revoke execute on function
  public.guardar_alineacion(uuid, jsonb),
  public.publicar_convocatoria(uuid, boolean)
from public, anon;

grant execute on function
  public.guardar_alineacion(uuid, jsonb),
  public.publicar_convocatoria(uuid, boolean)
to authenticated, service_role;
