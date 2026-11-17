-- =====================================================================
-- CTPA Valdelasfuentes - Gestión de la plantilla desde la web (#8)
-- guardar_jugador: crea o cambia un jugador con su nombre completo
-- (privado) y su fila en la plantilla de la competición, todo en una
-- transacción y con mensajes en castellano. cambiar_baja_jugador: lo da
-- de baja o lo reincorpora. Solo gestores. Borrar jugadores sigue siendo
-- cosa del administrador, y la base de datos lo impide si ya ha jugado.
-- =====================================================================

create function public.guardar_jugador(
  p_competicion     uuid,
  p_nombre_mostrar  text,
  p_sexo            public.sexo,
  p_jugador         uuid default null,
  p_nombre_completo text default null,
  p_lado            public.lado default null,
  p_comodin         boolean default false,
  p_inscrito        boolean default null
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_nombre   text := btrim(regexp_replace(coalesce(p_nombre_mostrar, ''), '\s+', ' ', 'g'));
  v_completo text := nullif(btrim(regexp_replace(coalesce(p_nombre_completo, ''), '\s+', ' ', 'g')), '');
  v_jugador  uuid := p_jugador;
  v_sexo_actual public.sexo;
begin
  if not public.es_gestor() then
    raise exception 'Solo los gestores pueden cambiar la plantilla';
  end if;
  if v_nombre = '' then
    raise exception 'El jugador necesita un nombre';
  end if;
  if length(v_nombre) > 30 then
    raise exception 'El nombre para mostrar es demasiado largo: 30 letras como mucho';
  end if;
  if exists (
    select 1 from public.jugador j
    where lower(j.nombre_mostrar) = lower(v_nombre) and j.id is distinct from v_jugador
  ) then
    raise exception 'Ya hay un jugador que se llama «%»: añade la inicial del apellido', v_nombre;
  end if;

  if v_jugador is null then
    insert into public.jugador (nombre_mostrar, sexo, lado_preferido)
    values (v_nombre, p_sexo, p_lado)
    returning id into v_jugador;
  else
    select sexo into v_sexo_actual from public.jugador where id = v_jugador;
    if not found then
      raise exception 'Ese jugador ya no existe';
    end if;
    -- Los partidos jugados se validaron con el sexo de entonces; cambiarlo los dejaría mal.
    if v_sexo_actual <> p_sexo and exists (
      select 1 from public.participacion pa where pa.jugador_id = v_jugador
    ) then
      raise exception 'No se puede cambiar el sexo de un jugador que ya ha jugado';
    end if;
    update public.jugador
    set nombre_mostrar = v_nombre, sexo = p_sexo, lado_preferido = p_lado
    where id = v_jugador;
  end if;

  if v_completo is null then
    delete from public.jugador_privado where jugador_id = v_jugador;
  else
    insert into public.jugador_privado (jugador_id, nombre_completo)
    values (v_jugador, v_completo)
    on conflict (jugador_id) do update
      set nombre_completo = excluded.nombre_completo, updated_at = now();
  end if;

  insert into public.plantilla (competicion_id, jugador_id, comodin, inscrito_oficial, alta)
  values (p_competicion, v_jugador, p_comodin, p_inscrito, current_date)
  on conflict (competicion_id, jugador_id) do update
    set comodin = excluded.comodin, inscrito_oficial = excluded.inscrito_oficial;

  return v_jugador;
end;
$$;

comment on function public.guardar_jugador is
  'Crea o cambia un jugador (nombre, sexo, lado), su nombre completo privado y su fila en la plantilla. Solo gestores.';

create function public.cambiar_baja_jugador(
  p_competicion uuid,
  p_jugador     uuid,
  p_baja        boolean
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not public.es_gestor() then
    raise exception 'Solo los gestores pueden cambiar la plantilla';
  end if;
  update public.plantilla
  set baja = case when p_baja then current_date else null end
  where competicion_id = p_competicion and jugador_id = p_jugador;
  if not found then
    raise exception 'Ese jugador no está en la plantilla de esta competición';
  end if;
end;
$$;

comment on function public.cambiar_baja_jugador is
  'Da de baja a un jugador de la plantilla (con la fecha de hoy) o lo reincorpora. Solo gestores.';

revoke execute on function
  public.guardar_jugador(uuid, text, public.sexo, uuid, text, public.lado, boolean, boolean),
  public.cambiar_baja_jugador(uuid, uuid, boolean)
from public, anon;

grant execute on function
  public.guardar_jugador(uuid, text, public.sexo, uuid, text, public.lado, boolean, boolean),
  public.cambiar_baja_jugador(uuid, uuid, boolean)
to authenticated, service_role;
