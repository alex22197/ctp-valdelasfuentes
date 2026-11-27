-- =====================================================================
-- CTPA Valdelasfuentes - Jornadas aplazadas y suspendidas (#92)
-- validar_estado_confrontacion: una jornada terminada (jugada o no
-- comparecencia) ya no cambia de estado. Entre los estados «por jugar»
-- (programada, aplazada, suspendida) se puede ir y volver, y de ellos a
-- terminada; es lo que hacen guardar_resultado_partido y el scraper.
-- cambiar_estado_jornada: un gestor marca una jornada nuestra como
-- aplazada o suspendida, o la devuelve a programada. Al aplazarla o
-- suspenderla se borra su fecha, porque ya no vale: así deja de ser el
-- partido de hoy y queda «por confirmar» hasta que se ponga la nueva.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Una jornada terminada no vuelve atrás
-- ---------------------------------------------------------------------

create function public.validar_estado_confrontacion()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.estado in ('jugada', 'no_comparecencia') and new.estado <> old.estado then
    raise exception 'La jornada ya está terminada: no puede pasar de % a %',
      old.estado, new.estado;
  end if;
  return new;
end;
$$;

create trigger validar_estado_confrontacion
before update of estado on public.confrontacion
for each row execute function public.validar_estado_confrontacion();


-- ---------------------------------------------------------------------
-- 2. Marcar una jornada como aplazada, suspendida o programada
-- ---------------------------------------------------------------------

create function public.cambiar_estado_jornada(
  p_confrontacion uuid,
  p_estado        public.estado_confrontacion
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_actual public.estado_confrontacion;
begin
  -- RLS no da error al actualizar filas que no puedes tocar: se comprueba antes.
  if not public.es_gestor() then
    raise exception 'Solo los gestores pueden cambiar el estado de una jornada';
  end if;
  if p_estado not in ('programada', 'aplazada', 'suspendida') then
    raise exception 'Una jornada solo se puede marcar como programada, aplazada o suspendida';
  end if;

  select c.estado into v_actual
  from public.confrontacion c
  where c.id = p_confrontacion
  for update;

  if not found or not public.juega_nuestro_equipo(p_confrontacion) then
    raise exception 'No existe esa jornada de nuestro equipo';
  end if;
  if v_actual in ('jugada', 'no_comparecencia') then
    raise exception 'La jornada ya está terminada: no se puede aplazar ni suspender';
  end if;

  update public.confrontacion
  set estado = p_estado,
      fecha_hora = case when p_estado = 'programada' then fecha_hora end,
      fecha_prevista = case when p_estado = 'programada' then fecha_prevista end
  where id = p_confrontacion;
end;
$$;

comment on function public.cambiar_estado_jornada is
  'Marca una jornada nuestra como aplazada o suspendida (y borra su fecha) o la devuelve a '
  'programada. Solo gestores y solo jornadas sin terminar.';

revoke execute on function public.cambiar_estado_jornada(uuid, public.estado_confrontacion)
from public, anon;

grant execute on function public.cambiar_estado_jornada(uuid, public.estado_confrontacion)
to authenticated, service_role;
