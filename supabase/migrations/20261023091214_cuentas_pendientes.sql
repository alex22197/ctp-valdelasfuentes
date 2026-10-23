-- =====================================================================
-- CTPA Valdelasfuentes - Cuentas nuevas pendientes de revisar (#68)
-- Quien entra con Google por primera vez no recibe ningún permiso (cualquiera
-- puede entrar), pero aparece al administrador en Gestores para que decida:
-- hacerlo capitán o administrador, o descartarlo.
-- - cuenta_revisada: cuentas que el administrador ya ha visto y no quiere
--   como gestores (descartadas o a las que quitó el permiso). No vuelven a
--   salir como pendientes.
-- - listar_cuentas_pendientes() / descartar_cuenta(): solo el administrador.
-- - quitar_permiso_gestor(): además, marca la cuenta como revisada.
-- Dar permiso a una cuenta pendiente es dar_permiso_gestor() con su correo.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Cuentas ya revisadas
-- ---------------------------------------------------------------------

create table public.cuenta_revisada (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now()
);

comment on table public.cuenta_revisada is
  'Cuentas que el administrador ha descartado como gestores: ya no salen como pendientes.';

-- Solo se llega a ella con las funciones de abajo: sin políticas ni permisos.
alter table public.cuenta_revisada enable row level security;
revoke all on public.cuenta_revisada from public, anon, authenticated;


-- ---------------------------------------------------------------------
-- 2. Pendientes: entraron con Google, no tienen papel y nadie las ha revisado
-- ---------------------------------------------------------------------

create function public.listar_cuentas_pendientes()
returns table (
  email          text,
  nombre         text,
  alta           timestamptz,
  ultimo_acceso  timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
#variable_conflict use_column
begin
  if not public.es_admin() then
    raise exception 'Solo el administrador puede ver las cuentas nuevas';
  end if;

  return query
    select
      u.email::text,
      coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name')::text,
      u.created_at,
      u.last_sign_in_at
    from auth.users u
    where public.usuario_google_con_correo(u.email) = u.id
      and not exists (select 1 from public.perfil p where p.user_id = u.id)
      and not exists (select 1 from public.cuenta_revisada r where r.user_id = u.id)
    order by u.created_at desc;
end;
$$;

create function public.descartar_cuenta(p_email text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_usuario uuid;
begin
  if not public.es_admin() then
    raise exception 'Solo el administrador puede descartar cuentas';
  end if;

  select u.id into v_usuario from auth.users u where lower(u.email) = lower(btrim(p_email));
  if v_usuario is null then
    raise exception 'No hay ninguna cuenta con ese correo';
  end if;
  if exists (select 1 from public.perfil p where p.user_id = v_usuario) then
    raise exception 'Esa cuenta tiene permisos: quítaselos desde la lista de gestores';
  end if;

  insert into public.cuenta_revisada (user_id) values (v_usuario)
  on conflict (user_id) do nothing;
end;
$$;


-- ---------------------------------------------------------------------
-- 3. Quitar un permiso deja la cuenta revisada, para que no vuelva a pendientes
-- ---------------------------------------------------------------------

create or replace function public.quitar_permiso_gestor(p_email text)
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
    insert into public.cuenta_revisada (user_id) values (v_usuario)
    on conflict (user_id) do nothing;
  end if;
  delete from public.invitacion_gestor where email = v_email;
end;
$$;


-- ---------------------------------------------------------------------
-- 4. Permisos
-- ---------------------------------------------------------------------

revoke execute on function public.listar_cuentas_pendientes() from public, anon;
revoke execute on function public.descartar_cuenta(text) from public, anon;
grant execute on function public.listar_cuentas_pendientes() to authenticated, service_role;
grant execute on function public.descartar_cuenta(text) to authenticated, service_role;
