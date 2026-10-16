-- =====================================================================
-- CTPA Valdelasfuentes - Permisos de gestor desde la web
-- - invitacion_gestor: correos invitados que aún no han entrado nunca.
-- - dar_permiso_gestor() / quitar_permiso_gestor() / listar_gestores():
--   solo el administrador.
-- - reclamar_permiso_gestor(): al entrar, quien tiene una invitación la
--   convierte en su perfil. Va aparte del inicio de sesión (sin trigger en
--   auth.users), para que un fallo aquí nunca impida entrar.
-- - Siempre queda al menos un administrador.
-- Un permiso solo se aplica a una cuenta que ha demostrado con Google que el
-- correo es suyo: correo confirmado e identidad de Google.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Invitaciones
-- ---------------------------------------------------------------------

create table public.invitacion_gestor (
  email       text primary key
              check (email = lower(btrim(email)) and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  rol         public.rol_usuario not null,
  created_at  timestamptz not null default now()
);

comment on table public.invitacion_gestor is
  'Correo de Google invitado a gestionar y su papel. Se borra al entrar esa persona por primera vez.';

-- Solo se llega a ella con las funciones de abajo: sin políticas ni permisos.
alter table public.invitacion_gestor enable row level security;
revoke all on public.invitacion_gestor from public, anon, authenticated;


-- ---------------------------------------------------------------------
-- 2. Cuenta de Google con un correo confirmado
-- ---------------------------------------------------------------------

create function public.usuario_google_con_correo(p_email text)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select u.id
  from auth.users u
  where lower(u.email) = lower(btrim(p_email))
    and u.email_confirmed_at is not null
    and exists (
      select 1 from auth.identities i where i.user_id = u.id and i.provider = 'google'
    )
  limit 1;
$$;

revoke execute on function public.usuario_google_con_correo(text) from public, anon, authenticated;


-- ---------------------------------------------------------------------
-- 3. Siempre queda al menos un administrador
-- Va en la tabla (no solo en las funciones): el administrador también puede
-- escribir en perfil directamente.
-- ---------------------------------------------------------------------

create function public.comprobar_queda_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.rol = 'admin' and (tg_op = 'DELETE' or new.rol <> 'admin') then
    if not exists (
      select 1 from public.perfil p where p.rol = 'admin' and p.user_id <> old.user_id
    ) then
      raise exception 'Tiene que quedar al menos un administrador';
    end if;
  end if;
  return coalesce(new, old);
end;
$$;

create trigger queda_un_admin
  before update or delete on public.perfil
  for each row execute function public.comprobar_queda_admin();


-- ---------------------------------------------------------------------
-- 4. Dar, quitar y listar permisos (solo el administrador)
-- ---------------------------------------------------------------------

-- Si la cuenta ya existe, le da (o cambia) el papel; si no, la deja invitada.
create function public.dar_permiso_gestor(p_email text, p_rol public.rol_usuario)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email   text := lower(btrim(p_email));
  v_usuario uuid;
begin
  if not public.es_admin() then
    raise exception 'Solo el administrador puede dar permisos';
  end if;
  if v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'Escribe un correo de Google válido';
  end if;

  v_usuario := public.usuario_google_con_correo(v_email);
  if v_usuario = auth.uid() then
    raise exception 'No puedes cambiar tu propio permiso';
  end if;

  if v_usuario is not null then
    insert into public.perfil (user_id, rol) values (v_usuario, p_rol)
    on conflict (user_id) do update set rol = excluded.rol;
    delete from public.invitacion_gestor where email = v_email;
  else
    insert into public.invitacion_gestor (email, rol) values (v_email, p_rol)
    on conflict (email) do update set rol = excluded.rol;
  end if;
end;
$$;

create function public.quitar_permiso_gestor(p_email text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email   text := lower(btrim(p_email));
  v_usuario uuid;
begin
  if not public.es_admin() then
    raise exception 'Solo el administrador puede quitar permisos';
  end if;

  select p.user_id into v_usuario
  from public.perfil p
  join auth.users u on u.id = p.user_id
  where lower(u.email) = v_email;

  if v_usuario = auth.uid() then
    raise exception 'No puedes quitarte tu propio permiso';
  end if;

  if v_usuario is not null then
    delete from public.perfil where user_id = v_usuario;
  end if;
  delete from public.invitacion_gestor where email = v_email;
end;
$$;

-- Gestores con su papel, y después las invitaciones que aún no han entrado.
create function public.listar_gestores()
returns table (
  email     text,
  nombre    text,
  rol       public.rol_usuario,
  pendiente boolean,
  es_tu     boolean
)
language plpgsql
stable
security definer
set search_path = ''
as $$
#variable_conflict use_column
begin
  if not public.es_admin() then
    raise exception 'Solo el administrador puede ver los gestores';
  end if;

  return query
    select
      u.email::text,
      (u.raw_user_meta_data ->> 'full_name')::text,
      p.rol,
      false,
      p.user_id = (select auth.uid())
    from public.perfil p
    join auth.users u on u.id = p.user_id
    union all
    select i.email, null::text, i.rol, true, false
    from public.invitacion_gestor i
    order by 4, 1;
end;
$$;


-- ---------------------------------------------------------------------
-- 5. Reclamar una invitación al entrar
-- La web la llama si la sesión no tiene papel. Devuelve el papel, o NULL.
-- ---------------------------------------------------------------------

create function public.reclamar_permiso_gestor()
returns public.rol_usuario
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_usuario uuid := auth.uid();
  v_email   text;
  v_rol     public.rol_usuario;
begin
  if v_usuario is null then
    return null;
  end if;

  select p.rol into v_rol from public.perfil p where p.user_id = v_usuario;
  if v_rol is not null then
    return v_rol;
  end if;

  select lower(u.email) into v_email
  from auth.users u
  where u.id = v_usuario
    and u.email_confirmed_at is not null
    and exists (
      select 1 from auth.identities i where i.user_id = u.id and i.provider = 'google'
    );
  if v_email is null then
    return null;
  end if;

  delete from public.invitacion_gestor i where i.email = v_email returning i.rol into v_rol;
  if v_rol is null then
    return null;
  end if;

  insert into public.perfil (user_id, rol) values (v_usuario, v_rol);
  return v_rol;
end;
$$;


-- ---------------------------------------------------------------------
-- 6. Permisos
-- ---------------------------------------------------------------------

revoke execute on function
  public.dar_permiso_gestor(text, public.rol_usuario),
  public.quitar_permiso_gestor(text),
  public.listar_gestores(),
  public.reclamar_permiso_gestor()
from public, anon;

grant execute on function
  public.dar_permiso_gestor(text, public.rol_usuario),
  public.quitar_permiso_gestor(text),
  public.listar_gestores(),
  public.reclamar_permiso_gestor()
to authenticated, service_role;
