-- =====================================================================
-- CTPA Valdelasfuentes - Esquema inicial
-- Tablas, reglas de integridad, validaciones de normativa y seguridad.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Tipos
-- ---------------------------------------------------------------------

create type public.sexo as enum ('masculino', 'femenino');
create type public.lado as enum ('reves', 'drive');
create type public.tipo_partido as enum ('masculino', 'femenino', 'mixto');
create type public.tipo_fase as enum ('apertura', 'retos', 'clausura', 'previa_playoff', 'playoff', 'masters');
create type public.estado_confrontacion as enum ('programada', 'aplazada', 'suspendida', 'jugada', 'no_comparecencia');
-- Resultado de un partido. NULL = todavía por jugar.
create type public.resultado_partido as enum ('normal', 'wo_favor', 'wo_contra', 'abandono', 'suspendido');
-- Respuesta a la encuesta. Sin fila en disponibilidad = sin responder.
create type public.respuesta_encuesta as enum ('si', 'no');
create type public.rol_usuario as enum ('admin', 'capitan');


-- ---------------------------------------------------------------------
-- 2. Utilidades
-- ---------------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;


-- ---------------------------------------------------------------------
-- 3. Tablas
-- ---------------------------------------------------------------------

create table public.competicion (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  temporada   text not null,
  -- Número de partidos de cada tipo por confrontación.
  formato     jsonb not null default '{"masculino": 3, "femenino": 2, "mixto": 1}',
  activa      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (nombre, temporada),
  constraint formato_valido check (
    jsonb_typeof(formato) = 'object'
    and formato ? 'masculino' and formato ? 'femenino' and formato ? 'mixto'
  )
);

create table public.fase (
  id             uuid primary key default gen_random_uuid(),
  competicion_id uuid not null references public.competicion (id) on delete restrict,
  tipo           public.tipo_fase not null,
  nombre         text not null,
  orden          integer not null check (orden > 0),
  -- Página de la liga de la que el scraper lee calendario y clasificación.
  url_grupo      text check (url_grupo is null or url_grupo ~ '^https?://'),
  inicio         date,
  fin            date,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (competicion_id, orden),
  check (inicio is null or fin is null or fin >= inicio)
);

create table public.equipo (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null unique,
  -- Texto exacto con el que aparece en la web de la liga (para el scraper).
  nombre_web  text unique,
  sede        text,
  es_nuestro  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Clasificación oficial de cada grupo, tal como la publica la liga.
create table public.fase_equipo (
  fase_id        uuid not null references public.fase (id) on delete cascade,
  equipo_id      uuid not null references public.equipo (id) on delete restrict,
  posicion       integer check (posicion > 0),
  puntos         integer not null default 0,  -- puede ser negativo por sanciones
  ganados        integer not null default 0 check (ganados >= 0),
  empatados      integer not null default 0 check (empatados >= 0),
  perdidos       integer not null default 0 check (perdidos >= 0),
  actualizado_en timestamptz,
  primary key (fase_id, equipo_id)
);

create table public.jugador (
  id              uuid primary key default gen_random_uuid(),
  nombre_mostrar  text not null unique,
  sexo            public.sexo not null,
  lado_preferido  public.lado,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Datos personales: solo los ven los gestores (admin y capitán).
create table public.jugador_privado (
  jugador_id       uuid primary key references public.jugador (id) on delete cascade,
  nombre_completo  text,
  updated_at       timestamptz not null default now()
);

create table public.plantilla (
  competicion_id    uuid not null references public.competicion (id) on delete restrict,
  jugador_id        uuid not null references public.jugador (id) on delete cascade,
  comodin           boolean not null default false,
  -- NULL = sin comprobar en la lista oficial de la liga.
  inscrito_oficial  boolean,
  alta              date,
  baja              date,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  primary key (competicion_id, jugador_id),
  check (alta is null or baja is null or baja >= alta)
);

create table public.confrontacion (
  id                  uuid primary key default gen_random_uuid(),
  fase_id             uuid not null references public.fase (id) on delete restrict,
  jornada             integer check (jornada > 0),  -- NULL en eliminatorias
  local_id            uuid not null references public.equipo (id) on delete restrict,
  visitante_id        uuid not null references public.equipo (id) on delete restrict,
  fecha_prevista      date,         -- fin de semana del calendario oficial
  fecha_hora          timestamptz,  -- cuándo se juega realmente
  sede                text,
  num_pistas          integer check (num_pistas > 0),
  estado              public.estado_confrontacion not null default 'programada',
  partidos_local      integer check (partidos_local >= 0),
  partidos_visitante  integer check (partidos_visitante >= 0),
  acta_enviada        boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  check (local_id <> visitante_id),
  unique nulls not distinct (fase_id, jornada, local_id, visitante_id)
);

-- Respuestas a la encuesta de WhatsApp y convocatoria. Privado.
create table public.disponibilidad (
  confrontacion_id  uuid not null references public.confrontacion (id) on delete cascade,
  jugador_id        uuid not null references public.jugador (id) on delete cascade,
  respuesta         public.respuesta_encuesta,  -- NULL: no se le preguntó (p. ej. comodín)
  convocado         boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  primary key (confrontacion_id, jugador_id),
  check (respuesta is not null or convocado)
);

-- Solo existen para confrontaciones de nuestro equipo.
create table public.partido (
  id                uuid primary key default gen_random_uuid(),
  confrontacion_id  uuid not null references public.confrontacion (id) on delete cascade,
  tipo              public.tipo_partido not null,
  numero            integer not null check (numero > 0),
  resultado         public.resultado_partido,  -- NULL = por jugar
  -- Solo se indica en abandonos. En el resto se deduce de los sets o del tipo de WO
  -- (ver vista partido_resultado), así nunca puede contradecir a los sets.
  ganado            boolean,
  pareja_rival      text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (confrontacion_id, tipo, numero),
  constraint ganado_solo_en_abandono check (
    case when resultado = 'abandono' then ganado is not null else ganado is null end
  )
);

create table public.set_partido (
  partido_id         uuid not null references public.partido (id) on delete cascade,
  numero             integer not null check (numero between 1 and 3),
  juegos_nuestros    integer not null check (juegos_nuestros between 0 and 7),
  juegos_rival       integer not null check (juegos_rival between 0 and 7),
  tiebreak_nuestros  integer check (tiebreak_nuestros >= 0),
  tiebreak_rival     integer check (tiebreak_rival >= 0),
  primary key (partido_id, numero),
  constraint tiebreak_completo check ((tiebreak_nuestros is null) = (tiebreak_rival is null)),
  constraint tiebreak_solo_en_7_6 check (
    tiebreak_nuestros is null
    or (juegos_nuestros = 7 and juegos_rival = 6)
    or (juegos_nuestros = 6 and juegos_rival = 7)
  )
);

create table public.participacion (
  partido_id  uuid not null references public.partido (id) on delete cascade,
  jugador_id  uuid not null references public.jugador (id) on delete restrict,
  lado        public.lado not null,
  primary key (partido_id, jugador_id),
  -- Un revés y un drive: como máximo dos jugadores por partido.
  unique (partido_id, lado)
);

create table public.perfil (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  rol         public.rol_usuario not null,
  jugador_id  uuid unique references public.jugador (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.ejecucion_scraper (
  id       uuid primary key default gen_random_uuid(),
  fecha    timestamptz not null default now(),
  ok       boolean not null,
  mensaje  text
);

-- Índices para las claves ajenas que no encabezan ya una clave primaria o única.
create index on public.fase (competicion_id);
create index on public.fase_equipo (equipo_id);
create index on public.plantilla (jugador_id);
create index on public.confrontacion (local_id);
create index on public.confrontacion (visitante_id);
create index on public.disponibilidad (jugador_id);
create index on public.participacion (jugador_id);


-- ---------------------------------------------------------------------
-- 4. updated_at automático
-- ---------------------------------------------------------------------

create trigger set_updated_at before update on public.competicion     for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.fase            for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.equipo          for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.jugador         for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.jugador_privado for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.plantilla       for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.confrontacion   for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.disponibilidad  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.partido         for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.perfil          for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------
-- 5. Validaciones de normativa
-- ---------------------------------------------------------------------

create function public.juega_nuestro_equipo(p_confrontacion uuid)
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.confrontacion c
    join public.equipo e on e.id in (c.local_id, c.visitante_id)
    where c.id = p_confrontacion and e.es_nuestro
  );
$$;

create function public.competicion_de_confrontacion(p_confrontacion uuid)
returns uuid
language sql
stable
set search_path = ''
as $$
  select f.competicion_id
  from public.confrontacion c
  join public.fase f on f.id = c.fase_id
  where c.id = p_confrontacion;
$$;

-- Partido: número dentro del formato, solo en confrontaciones nuestras,
-- y un WO no puede tener sets ni (si es en contra) jugadores.
create function public.validar_partido()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_max integer;
begin
  if not public.juega_nuestro_equipo(new.confrontacion_id) then
    raise exception 'Solo se registran partidos de confrontaciones de nuestro equipo';
  end if;

  select coalesce((c.formato ->> new.tipo::text)::integer, 0)
    into v_max
  from public.competicion c
  where c.id = public.competicion_de_confrontacion(new.confrontacion_id);

  if new.numero > v_max then
    raise exception 'Esta competición tiene % partido(s) de tipo %; no existe el número %',
      v_max, new.tipo, new.numero;
  end if;

  if tg_op = 'UPDATE' then
    if new.resultado in ('wo_favor', 'wo_contra')
       and exists (select 1 from public.set_partido s where s.partido_id = new.id) then
      raise exception 'Un partido con WO no tiene sets; bórralos antes de marcar el WO';
    end if;
    if new.resultado = 'wo_contra'
       and exists (select 1 from public.participacion p where p.partido_id = new.id) then
      raise exception 'En un WO en contra no juega nadie; quita a los jugadores antes';
    end if;
  end if;

  return new;
end;
$$;

create trigger validar_partido
before insert or update on public.partido
for each row execute function public.validar_partido();

create function public.validar_set()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (
    select 1 from public.partido p
    where p.id = new.partido_id and p.resultado in ('wo_favor', 'wo_contra')
  ) then
    raise exception 'Un partido con WO no tiene sets';
  end if;
  return new;
end;
$$;

create trigger validar_set
before insert or update on public.set_partido
for each row execute function public.validar_set();

-- Participación: plantilla, sexo según el tipo, un partido por confrontación.
create function public.validar_participacion()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_tipo          public.tipo_partido;
  v_resultado     public.resultado_partido;
  v_confrontacion uuid;
  v_sexo          public.sexo;
  v_nombre        text;
  v_otro_sexo     public.sexo;
begin
  select p.tipo, p.resultado, p.confrontacion_id
    into v_tipo, v_resultado, v_confrontacion
  from public.partido p
  where p.id = new.partido_id;

  select j.sexo, j.nombre_mostrar into v_sexo, v_nombre
  from public.jugador j
  where j.id = new.jugador_id;

  if v_resultado = 'wo_contra' then
    raise exception 'En un WO en contra no juega nadie';
  end if;

  if not exists (
    select 1 from public.plantilla pl
    where pl.competicion_id = public.competicion_de_confrontacion(v_confrontacion)
      and pl.jugador_id = new.jugador_id
  ) then
    raise exception '% no está en la plantilla de esta competición', v_nombre;
  end if;

  if v_tipo = 'masculino' and v_sexo <> 'masculino' then
    raise exception '% no puede jugar un partido masculino', v_nombre;
  elsif v_tipo = 'femenino' and v_sexo <> 'femenino' then
    raise exception '% no puede jugar un partido femenino', v_nombre;
  elsif v_tipo = 'mixto' then
    select j.sexo into v_otro_sexo
    from public.participacion pa
    join public.jugador j on j.id = pa.jugador_id
    where pa.partido_id = new.partido_id
      and pa.jugador_id <> new.jugador_id
    limit 1;
    if v_otro_sexo = v_sexo then
      raise exception 'El mixto lo juegan un chico y una chica';
    end if;
  end if;

  -- Normativa: nadie juega dos partidos en la misma confrontación
  -- (incluye no jugar el mixto y otro partido).
  if exists (
    select 1
    from public.participacion pa
    join public.partido p on p.id = pa.partido_id
    where p.confrontacion_id = v_confrontacion
      and pa.jugador_id = new.jugador_id
      and pa.partido_id <> new.partido_id
  ) then
    raise exception '% ya juega otro partido en esta confrontación', v_nombre;
  end if;

  return new;
end;
$$;

create trigger validar_participacion
before insert or update on public.participacion
for each row execute function public.validar_participacion();

create function public.validar_disponibilidad()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not public.juega_nuestro_equipo(new.confrontacion_id) then
    raise exception 'La disponibilidad solo se registra en confrontaciones de nuestro equipo';
  end if;
  if not exists (
    select 1 from public.plantilla pl
    where pl.competicion_id = public.competicion_de_confrontacion(new.confrontacion_id)
      and pl.jugador_id = new.jugador_id
  ) then
    raise exception 'El jugador no está en la plantilla de esta competición';
  end if;
  return new;
end;
$$;

create trigger validar_disponibilidad
before insert or update on public.disponibilidad
for each row execute function public.validar_disponibilidad();


-- ---------------------------------------------------------------------
-- 6. Resultado efectivo de cada partido
-- ---------------------------------------------------------------------

create view public.partido_resultado
with (security_invoker = true)
as
select
  p.id as partido_id,
  p.confrontacion_id,
  p.tipo,
  p.numero,
  p.resultado,
  coalesce(s.sets_nuestros, 0) as sets_nuestros,
  coalesce(s.sets_rival, 0)    as sets_rival,
  coalesce(s.juegos_nuestros, 0) as juegos_nuestros,
  coalesce(s.juegos_rival, 0)    as juegos_rival,
  case
    when p.resultado = 'wo_favor'  then true
    when p.resultado = 'wo_contra' then false
    when p.resultado = 'abandono'  then p.ganado
    when p.resultado = 'normal' and s.sets_nuestros > s.sets_rival then true
    when p.resultado = 'normal' and s.sets_nuestros < s.sets_rival then false
    else null  -- por jugar, suspendido o sets incompletos
  end as ganado
from public.partido p
left join (
  select
    partido_id,
    count(*) filter (where juegos_nuestros > juegos_rival) as sets_nuestros,
    count(*) filter (where juegos_rival > juegos_nuestros) as sets_rival,
    sum(juegos_nuestros) as juegos_nuestros,
    sum(juegos_rival)    as juegos_rival
  from public.set_partido
  group by partido_id
) s on s.partido_id = p.id;


-- ---------------------------------------------------------------------
-- 7. Roles y seguridad (RLS)
-- ---------------------------------------------------------------------

create function public.es_gestor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.perfil where user_id = (select auth.uid()));
$$;

create function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.perfil
    where user_id = (select auth.uid()) and rol = 'admin'
  );
$$;

alter table public.competicion       enable row level security;
alter table public.fase              enable row level security;
alter table public.equipo            enable row level security;
alter table public.fase_equipo       enable row level security;
alter table public.jugador           enable row level security;
alter table public.jugador_privado   enable row level security;
alter table public.plantilla         enable row level security;
alter table public.confrontacion     enable row level security;
alter table public.disponibilidad    enable row level security;
alter table public.partido           enable row level security;
alter table public.set_partido       enable row level security;
alter table public.participacion     enable row level security;
alter table public.perfil            enable row level security;
alter table public.ejecucion_scraper enable row level security;

-- Tablas públicas: cualquiera lee, solo gestores escriben.
do $$
declare
  t text;
begin
  foreach t in array array[
    'competicion', 'fase', 'equipo', 'fase_equipo', 'jugador', 'plantilla',
    'confrontacion', 'partido', 'set_partido', 'participacion'
  ] loop
    execute format(
      'create policy "lectura publica" on public.%I for select to anon, authenticated using (true)', t);
    execute format(
      'create policy "gestores insertan" on public.%I for insert to authenticated with check ((select public.es_gestor()))', t);
    execute format(
      'create policy "gestores modifican" on public.%I for update to authenticated using ((select public.es_gestor())) with check ((select public.es_gestor()))', t);
    execute format(
      'create policy "gestores borran" on public.%I for delete to authenticated using ((select public.es_gestor()))', t);
  end loop;
end;
$$;

-- Tablas privadas: solo gestores.
create policy "solo gestores" on public.jugador_privado
  for all to authenticated
  using ((select public.es_gestor())) with check ((select public.es_gestor()));

create policy "solo gestores" on public.disponibilidad
  for all to authenticated
  using ((select public.es_gestor())) with check ((select public.es_gestor()));

-- El scraper escribe con la clave secreta (no pasa por RLS); los gestores leen.
create policy "gestores leen" on public.ejecucion_scraper
  for select to authenticated
  using ((select public.es_gestor()));

-- Perfiles: cada uno ve el suyo; el admin gestiona todos.
create policy "ver perfil propio o admin" on public.perfil
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.es_admin()));

create policy "admin inserta perfiles" on public.perfil
  for insert to authenticated with check ((select public.es_admin()));

create policy "admin modifica perfiles" on public.perfil
  for update to authenticated
  using ((select public.es_admin())) with check ((select public.es_admin()));

create policy "admin borra perfiles" on public.perfil
  for delete to authenticated using ((select public.es_admin()));


-- ---------------------------------------------------------------------
-- 8. Permisos de la API
-- El proyecto no expone tablas automáticamente: se concede solo lo necesario.
-- RLS decide después qué filas puede tocar cada uno.
-- ---------------------------------------------------------------------

grant select on
  public.competicion, public.fase, public.equipo, public.fase_equipo, public.jugador,
  public.plantilla, public.confrontacion, public.partido, public.set_partido,
  public.participacion, public.partido_resultado
to anon, authenticated;

grant insert, update, delete on
  public.competicion, public.fase, public.equipo, public.fase_equipo, public.jugador,
  public.plantilla, public.confrontacion, public.partido, public.set_partido,
  public.participacion
to authenticated;

grant select, insert, update, delete on public.jugador_privado, public.disponibilidad, public.perfil
to authenticated;

grant select on public.ejecucion_scraper to authenticated;

grant all on all tables in schema public to service_role;

revoke execute on all functions in schema public from public, anon;
grant execute on function
  public.es_gestor(), public.es_admin(),
  public.juega_nuestro_equipo(uuid), public.competicion_de_confrontacion(uuid)
to authenticated, service_role;
