-- =====================================================================
-- CTPA Valdelasfuentes - Respuestas a la encuesta («pasar lista»)
-- guardar_respuesta_encuesta(): guarda lo que un jugador respondió a la
-- encuesta de WhatsApp de una jornada, sin tocar si está convocado.
-- =====================================================================

-- Sin fila en `disponibilidad` = sin responder. La fila solo puede quedarse
-- sin respuesta si el jugador está convocado (restricción de la tabla), así que
-- volver a «sin responder» borra la fila, salvo que ya esté convocado: en ese
-- caso se conserva la convocatoria y solo se vacía la respuesta.
create function public.guardar_respuesta_encuesta(
  p_confrontacion uuid,
  p_jugador       uuid,
  -- NULL: el jugador vuelve a estar sin responder.
  p_respuesta     public.respuesta_encuesta default null
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- RLS no da error al actualizar o borrar filas que no puedes tocar: se comprueba antes.
  if not public.es_gestor() then
    raise exception 'Solo los gestores pueden pasar lista';
  end if;

  if p_respuesta is null then
    delete from public.disponibilidad
    where confrontacion_id = p_confrontacion
      and jugador_id = p_jugador
      and not convocado;

    update public.disponibilidad
    set respuesta = null
    where confrontacion_id = p_confrontacion
      and jugador_id = p_jugador
      and convocado;
  else
    -- Los triggers comprueban que la confrontación es nuestra y que el jugador
    -- está en la plantilla.
    insert into public.disponibilidad (confrontacion_id, jugador_id, respuesta)
    values (p_confrontacion, p_jugador, p_respuesta)
    on conflict (confrontacion_id, jugador_id)
    do update set respuesta = excluded.respuesta;
  end if;
end;
$$;

revoke execute on function
  public.guardar_respuesta_encuesta(uuid, uuid, public.respuesta_encuesta)
from public, anon;

grant execute on function
  public.guardar_respuesta_encuesta(uuid, uuid, public.respuesta_encuesta)
to authenticated, service_role;
