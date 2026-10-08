-- =====================================================================
-- CTPA Valdelasfuentes - Datos iniciales
-- Competición, grupo, equipos, plantilla, calendario de la apertura
-- y la convocatoria de la jornada 1.
-- =====================================================================

do $$
declare
  v_comp      uuid;
  v_fase      uuid;
  v_ctpa      uuid;
  v_attr      uuid;
  v_padelgon  uuid;
  v_soto      uuid;
  v_j1        uuid;
begin
  -- Competición y fase ------------------------------------------------
  insert into public.competicion (nombre, temporada)
  values ('Liga MasterPadel', '2026-27')
  returning id into v_comp;

  insert into public.fase (competicion_id, tipo, nombre, orden, url_grupo, inicio)
  values (
    v_comp, 'apertura', 'Apertura, 4ª División, zona 1', 1,
    'https://ligamasterpadel.lansoft.es/php/area_grupo.php?id=4', '2026-10-10'
  )
  returning id into v_fase;

  -- Equipos del grupo -------------------------------------------------
  insert into public.equipo (nombre, nombre_web, es_nuestro)
  values ('CTPA Valdelasfuentes', 'CTPA Valdelasfuentes', true)
  returning id into v_ctpa;

  insert into public.equipo (nombre, nombre_web)
  values ('Padel Attraction B', 'Padel Attraction B')
  returning id into v_attr;

  insert into public.equipo (nombre, nombre_web)
  values ('Padelgon "C"', 'Padelgon "C"')
  returning id into v_padelgon;

  insert into public.equipo (nombre, nombre_web)
  values ('Soto Torrejón', 'Soto Torrejón')
  returning id into v_soto;

  insert into public.fase_equipo (fase_id, equipo_id, posicion)
  values (v_fase, v_ctpa, 1), (v_fase, v_attr, 2), (v_fase, v_padelgon, 3), (v_fase, v_soto, 4);

  -- Jugadores ---------------------------------------------------------
  insert into public.jugador (nombre_mostrar, sexo) values
    ('Diego', 'masculino'), ('Sergio', 'masculino'), ('Alex', 'masculino'),
    ('Juan', 'masculino'), ('Álvaro', 'masculino'), ('Miguel', 'masculino'),
    ('Jorge', 'masculino'), ('Carlos', 'masculino'), ('Walter', 'masculino'),
    ('Ivan', 'masculino'), ('Ivan G', 'masculino'), ('Joel', 'masculino'),
    ('Pablo', 'masculino'),
    ('Rocio', 'femenino'), ('Marta Morales', 'femenino'), ('Marta Muro', 'femenino'),
    ('Vir', 'femenino'), ('Marta Prieto', 'femenino'), ('Andrea', 'femenino'),
    ('Raquel', 'femenino'), ('Sofia', 'femenino'),
    ('Jess', 'femenino');

  insert into public.jugador_privado (jugador_id, nombre_completo)
  select j.id, d.nombre_completo
  from (values
    ('Pablo', 'Pablo Cristini'),
    ('Ivan G', 'Iván Guadalix'),
    ('Vir', 'Virginia'),
    ('Marta Morales', 'Marta Morales'),
    ('Marta Muro', 'Marta Muro'),
    ('Marta Prieto', 'Marta Prieto')
  ) as d (nombre_mostrar, nombre_completo)
  join public.jugador j on j.nombre_mostrar = d.nombre_mostrar;

  insert into public.plantilla (competicion_id, jugador_id, comodin)
  select v_comp, j.id, j.nombre_mostrar = 'Jess'
  from public.jugador j;

  -- Calendario de la apertura ----------------------------------------
  insert into public.confrontacion
    (fase_id, jornada, local_id, visitante_id, fecha_prevista, fecha_hora, num_pistas)
  values
    (v_fase, 1, v_soto, v_ctpa, '2026-10-10', '2026-10-10 12:00:00 Europe/Madrid', 6)
  returning id into v_j1;

  insert into public.confrontacion (fase_id, jornada, local_id, visitante_id)
  values
    (v_fase, 2, v_attr, v_ctpa),
    (v_fase, 3, v_ctpa, v_padelgon);

  -- Convocatoria y alineación de la jornada 1 ------------------------
  insert into public.partido (confrontacion_id, tipo, numero) values
    (v_j1, 'masculino', 1), (v_j1, 'masculino', 2), (v_j1, 'masculino', 3),
    (v_j1, 'femenino', 1), (v_j1, 'femenino', 2),
    (v_j1, 'mixto', 1);

  insert into public.participacion (partido_id, jugador_id, lado)
  select p.id, j.id, a.lado::public.lado
  from (values
    ('masculino', 1, 'Sergio',        'reves'), ('masculino', 1, 'Jorge',  'drive'),
    ('masculino', 2, 'Alex',          'reves'), ('masculino', 2, 'Pablo',  'drive'),
    ('masculino', 3, 'Álvaro',        'reves'), ('masculino', 3, 'Joel',   'drive'),
    ('femenino',  1, 'Marta Prieto',  'reves'), ('femenino',  1, 'Vir',    'drive'),
    ('femenino',  2, 'Marta Morales', 'reves'), ('femenino',  2, 'Jess',   'drive'),
    ('mixto',     1, 'Rocio',         'reves'), ('mixto',     1, 'Ivan G', 'drive')
  ) as a (tipo, numero, jugador, lado)
  join public.partido p
    on p.confrontacion_id = v_j1 and p.tipo = a.tipo::public.tipo_partido and p.numero = a.numero
  join public.jugador j on j.nombre_mostrar = a.jugador;

  -- Los convocados habituales dijeron que sí; Jess es comodín y no estaba en la encuesta.
  insert into public.disponibilidad (confrontacion_id, jugador_id, respuesta, convocado)
  select v_j1, j.id,
         case when j.nombre_mostrar = 'Jess' then null else 'si'::public.respuesta_encuesta end,
         true
  from public.jugador j
  where j.nombre_mostrar in (
    'Sergio', 'Jorge', 'Alex', 'Pablo', 'Álvaro', 'Joel',
    'Marta Prieto', 'Vir', 'Marta Morales', 'Jess', 'Rocio', 'Ivan G'
  );
end;
$$;
